import React from 'react'
import "./Loginform.css"
import { Link } from 'react-router-dom'

const Loginform = () => {
  return (
    <div className="form-container">
      <div className="loginform">
      <h1>Connexion</h1>
      <div className="inputbox">
        <input type="email" placeholder='Example@gmail.com' />
        <i className='fa-solid fa-lock'></i>
      </div>
      <div className="inputbox">
        <input type="password" placeholder='Saisissez votre mot de passe' />
        <i className='fa-solid fa-lock'></i>
      </div>
      <div className="forgot-password">
        <p>Mot de passe oublié ? <Link path="/Connexion/Forgotten_passwor">Cliquez ici</Link></p>
      </div>
      <div className="login">
        <button className='Loginbtn'>Se connecter</button>
        <button className='SignInbtn'><Link to="/Inscription">S'inscrire</Link></button>
      </div>
      <div className="timestamp">
        <p>{new Date().getFullYear} School OS &copy;</p>
      </div>
    </div>
    </div>
  )
}

export default Loginform