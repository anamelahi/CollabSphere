import React from 'react'
import { Link } from 'react-router-dom'
import "../App.css"

const Login = () => {
  return (
    <div className='login-container'>
        <form action="" method="post">
        <h2>CollabSphere</h2>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder='Enter your email' />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" placeholder='Enter your password' />
            </div>
            <button type="submit">Login</button>
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </form>
    </div>
  )
}

export default Login