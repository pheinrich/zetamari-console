import { Provider } from 'react-redux'

import '../common/globals.css'
import store from '../app/store'

export default function MyApp( {Component, pageProps} )
{
  const getLayout = Component.getLayout || ((page) => page)
  return (getLayout(
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  ))
}
