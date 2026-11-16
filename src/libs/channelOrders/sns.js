import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

// Amazon SES inbound mail, delivered through an SNS topic subscribed to
// /api/inbound/order-email over HTTPS.
//
// SNS POSTs a JSON envelope (sent as text/plain) whose `Type` is either
// SubscriptionConfirmation - sent once when the subscription is created,
// and confirmed by fetching its SubscribeURL - or Notification, whose
// `Message` is SES's own JSON notification for one received email.
//
// SES only puts the raw email in that notification (`content`) for the
// "Publish to SNS topic" receipt action, which bounces anything over
// 150 KB - and Faire's order emails already run ~100 KB. So the intended
// setup is the S3 receipt action with this topic attached: SES stores
// the raw email in INBOUND_EMAIL_S3_BUCKET and the notification only
// says where (`receipt.action.bucketName/objectKey`), to be fetched here.
// Inline `content` is still accepted if present.
//
// Only envelopes from INBOUND_EMAIL_SNS_TOPIC_ARN are acted on, and only
// objects in INBOUND_EMAIL_S3_BUCKET are fetched, so the endpoint can't
// be pointed at some other topic's subscription or bucket.

// Returns {confirmed: true} for a handled subscription confirmation,
// {raw: Buffer} for an email to ingest, or {ignored: reason}. Throws
// (with `status` set) for an envelope that should be refused.
export async function readSnsEnvelope( envelope )
{
  const topicArn = process.env.INBOUND_EMAIL_SNS_TOPIC_ARN

  if( !topicArn || envelope?.TopicArn !== topicArn )
    throw httpError( 403, 'Unexpected SNS topic' )

  if( envelope.Type === 'SubscriptionConfirmation' )
  {
    const url = new URL( envelope.SubscribeURL )

    // Fetch only genuine SNS URLs - anything else would let a request
    // make this server call an arbitrary address.
    if( url.protocol !== 'https:' || !/^sns\.[a-z0-9-]+\.amazonaws\.com$/.test( url.hostname ) )
      throw httpError( 400, 'SubscribeURL is not an SNS URL' )

    const response = await fetch( url )

    if( !response.ok )
      throw httpError( 502, `SNS subscription confirmation failed: ${response.status}` )

    return {confirmed: true}
  }

  if( envelope.Type !== 'Notification' )
    return {ignored: `SNS message type ${envelope.Type}`}

  const notification = JSON.parse( envelope.Message )

  if( notification.notificationType !== 'Received' )
    return {ignored: `SES notification type ${notification.notificationType}`}

  if( notification.content )
    return {raw: Buffer.from( notification.content, notification.receipt?.action?.encoding === 'BASE64' ? 'base64' : 'utf8' )}

  const {type, bucketName, objectKey} = notification.receipt?.action ?? {}

  if( type !== 'S3' )
    return {ignored: `SES ${type} action carries no email content`}

  if( bucketName !== process.env.INBOUND_EMAIL_S3_BUCKET )
    throw httpError( 403, 'Unexpected S3 bucket' )

  const object = await new S3Client().send( new GetObjectCommand( {Bucket: bucketName, Key: objectKey} ) )

  return {raw: Buffer.from( await object.Body.transformToByteArray() )}
}

function httpError( status, message )
{
  return Object.assign( new Error( message ), {status} )
}
