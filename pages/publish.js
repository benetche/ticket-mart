/* eslint-disable @next/next/no-img-element */
import styles from '../styles/Publish.module.css'
import Header from '../components/Header'
import Head from 'next/head'

export default function Publish() {

  return (
    <div>
      <Head>
        <title>Publicar Evento</title>
      </Head>

      <Header></Header>
      <div className={styles.leftDiv}>
        <h3>Publicar Evento</h3>
        <p>Preencha o formulário e entraremos em contato em breve.</p>
      </div>
      <div className={styles.centerDiv}>
        <div><input type="text" className={styles.input} placeholder="Nome" /></div>
        <div><input type="email" className={styles.input} placeholder="Email" /></div>
        <div><input type="tel" className={styles.input} placeholder="Telefone" /></div>
        <div><input type="text" className={styles.input} placeholder="Empresa, agência, atlética, etc" /></div>
        <div><input type="text" className={styles.input} placeholder="Descrição Breve" /></div>
        <div><button className='btn btn-success' style={{ fontSize: '1.25em', width: 220, height: 40 }}>Enviar</button></div>
      </div>
    </div>
  )
}
