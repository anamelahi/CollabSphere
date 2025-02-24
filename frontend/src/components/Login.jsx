import React ,{useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import "../App.css"
import axios from 'axios'

const Login = () => {
  const [loginForm, setLoginForm] = useState({email:"",password:""});
  const nav = useNavigate();
  const handleChange = (e)=>{
    setLoginForm({...loginForm,[e.target.name]:e.target.value})

  }
  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      let res = await axios.post('http://localhost:3000/login',loginForm,{
        withCredentials:true, //for saving the session (cookie)
      });
      if(res.data.error){
        alert(res.data.error);
      }else{
        nav('/dashboard');

      }

    } catch (error) {
      console.log("ERROR WHILE LOGIN",error);
    }

  }
  return (
    <div className='login-container'>
        <form action="" method="post" onSubmit={handleSubmit}>
        <h2>CollabSphere</h2>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder='Enter your email' value={loginForm.email} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" placeholder='Enter your password' value={loginForm.password} onChange={handleChange}/>
            </div>
            <button type="submit">Login</button>
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </form>
    </div>
  )
}

export default Login