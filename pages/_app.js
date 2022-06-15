import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Header from '../components/Header'

function MyApp({ Component, pageProps }) {

  return(
    <div>
      {/* Always renders this Header component */}
      {/* <Header/>  */}
        <Component {...pageProps} />
    </div>
  
  ) 
}

export default MyApp
