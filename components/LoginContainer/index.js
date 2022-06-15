import { useState } from "react"
import styles from './LoginContainer.module.css'
export default function LoginContainer(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const HandleSubmit = (e) => {
        e.preventDefault()
        alert("Email: " + email + "\n" + "Password: " + password)
    }

    return(
        <section className={styles.container}>
            <h3>Fazer Login</h3>
            <a href="#">Cadastrar</a>
            <form onSubmit={((e) => HandleSubmit(e))}>
                <div className="form-group" style={{margin: "20px 0px"}}>
                    <label for="input-email">Email:</label>
                    <input type="email" className="form-control" id="input-email"
                    onChange={((e) => {setEmail(e.target.value)})}/>
                </div>
                <div className="form-group" style={{margin: "20px 0px"}}>
                    <label for="input-password">Senha:</label>
                    <input type="password" className="form-control" id="input-password"
                    onChange={((e) => {setPassword(e.target.value)})}/>
                </div>
                <button type="submit" className="btn btn-primary" style={{width: "100%"}}>Entrar</button>
            </form>
        </section>
    )

}