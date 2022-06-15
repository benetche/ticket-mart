
import Head from "next/head"
import LoginContainer from "../components/LoginContainer"
import styles from '../styles/Login.module.css'
export default function Login(){

    return(
        <div className={styles.main}>
            <Head>
                <title>Log in - tik.me</title>
            </Head>
            <div>
                <LoginContainer/>
            </div>
        </div>
    )

}