import React from 'react'
import "./navbar.css"
import {Link} from "react-router-dom"
import Button from '../../UI/Button/button'

const Navbar = (props) => {
  return (
    <div className="navbar">
      <div className="title">
        {props.logo}
      </div>
      <div className="nav">
        <Link to="/connexion">
          Connexion
        </Link>
      </div>
    </div>
  )
}

export default Navbar