import React, { useState } from 'react'
import { Facebook, Globe, Linkedin, Lock, Twitter, User } from 'react-feather'
import './style.css'
import { useNavigate } from 'react-router-dom'
import { LoginContextProvider, useLoginContext } from './context'

const LoginImpl = () => {
  const navigate = useNavigate()
  const { handleSignup, handleLogin } = useLoginContext()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')


  return (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          <form onSubmit={(e) => {
            e.preventDefault()
            handleLogin(username, password)} }
          
          className="sign-in-form">
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <User style={{ placeSelf: 'center' }} />
              <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} value={username} />
            </div>
            <div className="input-field">
              <Lock style={{ placeSelf: 'center' }} />
              <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
            </div>
            <input type="submit" value="Login" className="btn solid" />
            <p className="social-text">Or Sign in with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <Facebook />
              </a>
              <a href="#" className="social-icon">
                <Twitter />
              </a>
              <a href="#" className="social-icon">
                <Globe />
              </a>
              <a href="#" className="social-icon">
                <Linkedin />
              </a>
            </div>
          </form>
          <form onSubmit={(e) => {
            e.preventDefault()
            handleSignup(username, password)
          }}
            className="sign-up-form">
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} value={username} />
            </div>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
            </div>
            <input type="submit" className="btn" value="Sign up" />
            <p className="social-text">Or Sign up with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <Facebook />
              </a>
              <a href="#" className="social-icon">
                <Twitter />
              </a>
              <a href="#" className="social-icon">
                <Globe />
              </a>
              <a href="#" className="social-icon">
                <Linkedin />
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here ?</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
              ex ratione. Aliquid!
            </p>
            <button
              className="btn transparent"
              id="sign-up-btn"
              onClick={() => document.querySelector(".container").classList.add("sign-up-mode")}>
              Sign up
            </button>
          </div>
          <img src="img/log.svg" className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us ?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
              laboriosam ad deleniti.
            </p>
            <button
              className="btn transparent"
              id="sign-in-btn"
              onClick={() => document.querySelector(".container").classList.remove("sign-up-mode")}>
              Sign in
            </button>
          </div>
        </div>
      </div>
      <script src="event.js"></script>
    </div>
  )
}
const Login = () => <LoginContextProvider><LoginImpl /></LoginContextProvider>
export default Login
