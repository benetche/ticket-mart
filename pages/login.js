
import Head from "next/head"
import LoginContainer from "../components/LoginContainer"
import styles from '../styles/Login.module.css'
import Logo from '../assets/logoAlt.png'
import Image from "next/image"
export default function Login(){

    return(
        <div style={{margin: "auto"}}>
            <Head>
                <title>Log in - tik.me</title>
            </Head>
            <div className={styles.main}>
            {/* flex container */}
                <div className={styles.imageContainer}>
                <Image src={Logo} alt='logo'
                width={300} height={100} className={styles.logo} style={{margin: "auto"}} />
                <p style={{color: "white", fontSize: "2em"}}>Enjoy your time.</p>
                </div>
                <LoginContainer/>
            </div>
        </div>
    )

}