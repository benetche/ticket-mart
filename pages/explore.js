/* eslint-disable @next/next/no-img-element */
import styles from '../styles/Explore.module.css'
import Header from '../components/Header'
import Head from 'next/head'

export default function Explore() {
  const number = [1, 2, 3, 4]
  const Banner = () => {
    return (

      number.map(num =>
        <div key={num} className="card" style={{ width: '18rem' }}>
          <img src="https://res.cloudinary.com/htkavmx5a/image/upload/c_scale,f_auto,h_348,q_auto/as5ctfqummb5694z3vws" className="card-img-top" alt="..." />
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
        <title>Explorar Eventos</title>
      </Head>

      <Header></Header>
      <div className={styles.leftDiv}>
        <h3>Explorar Eventos</h3>
        <input className={styles.searchInput} type='text' placeholder='Buscar Evento' />
        <i className='bi bi-search'></i>
        <button className='btn btn-success' style={{ fontSize: '1.25em', width: 120, height: 40, marginLeft: 25 }}>Filtrar</button>
      </div>
      <div className={styles.centerDiv}>

        <div className={styles.bannersDiv}>
          <Banner></Banner>
        </div>
        <div className={styles.bannersDiv}>
          <Banner></Banner>
        </div>
        <div className={styles.bannersDiv}>
          <Banner></Banner>
        </div>

      </div>
    </div>
  )
}
