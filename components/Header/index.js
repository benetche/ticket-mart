/* eslint-disable @next/next/no-html-link-for-pages */
import styles from './Header.module.css'
import Image from 'next/image'
import Logo from '../../assets/logo.png'

function Header() {
    return (
        <div className={styles.header}>
            <div className={styles.logoText}>
                <a href='/'><Image src={Logo} alt='logo'
                    width={102} height={48} /></a>
                <div className={styles.textDiv} >
                    <a href='explore' className={styles.clickableText}>Explorar Eventos</a>
                    <a href='publish' className={styles.clickableText}>Publicar Evento</a>
                </div>
            </div>
            <div className={styles.headericons} >
                <a href='#' className={styles.carticon}><i className='bi bi-cart'></i></a>
                <a href='#' className={styles.menuicon}><i className='bi bi-list'></i></a>
            </div>
        </div>
    )
}

export default Header