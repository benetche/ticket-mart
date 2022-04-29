/* eslint-disable @next/next/no-img-element */
import styles from '../styles/Home.module.css'
import Header from '../components/Header'
import Head from 'next/head'
import {useRouter} from 'next/router'

export default function Home() {
  const router = useRouter()
  const number = [1, 2, 3, 4]
  const Banner = () => {
    return (

      number.map(num =>
        <div key={num} className="card" style={{ width: '18rem' }}>
          <img src="https://res.cloudinary.com/htkavmx5a/image/upload/c_scale,f_auto,h_348,q_auto/kkhuyvtrggtcje8dr9h4" className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">Nome do Evento</h5>
            <p className="card-text">Data do evento.</p>
          </div>
        </div>)
    )
  }
  return (
    <div>
      <Head>
        <title>Tik.me</title>
      </Head>
      <Header></Header>
      <div className={styles.centerDiv}>
        <div className={styles.mainBanner}>
          <i className='bi bi-caret-left-fill'></i>
          <i className='bi bi-caret-right-fill'></i>
        </div>
        <p className={styles.textExplorar}>Principais Eventos</p>
        <div className={styles.bannersDiv}>
          <Banner></Banner>
        </div>
        <button className='btn btn-success' onClick={(()=> router.push('/explore'))} 
        style={{ fontSize: '1.25em' }}>Todos os Eventos</button>
      </div>
    </div>
  )
}
