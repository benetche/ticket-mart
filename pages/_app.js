import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Header from '../components/Header'
import {useRouter} from 'next/router'

function MyApp({ Component, pageProps }) {
  if(useRouter().pathname === '/login'){
    return(<Component {...pageProps} />)
  }
  return(
    <div>
      <Header/> 
        <Component {...pageProps} />
    </div>
  
  ) 
}

export default MyApp
