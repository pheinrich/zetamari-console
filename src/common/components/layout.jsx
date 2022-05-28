import Head from 'next/head'
import styles from './layout.module.css'

export default function Layout( {children} )
{
  return (
    <>
      <Head>
        <title>Zetamari Console</title>
      </Head>
      <main className={styles.main}>{children}</main>
    </>
  )
}