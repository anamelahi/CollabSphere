import React ,{useState} from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'


const Register = () => {
    const [form, setForm] = useState({fName:"",lName:"",email:"",password:""});
    const nav = useNavigate();

    const handleChange = (e)=>{
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    const handleSubmit = async(e)=>{
        e.preventDefault();
        console.log(form);
        try {
            await axios.post("http://localhost:3000/register",form,{
                headers: { "Content-Type": "application/json" }
            });

            alert("SUCCESSFUL")
            nav("/login");
        } catch (error) {
            console.log("ERROR IN REGISTERATION")
        }
    }

  return (
    <div className='register-container'>
        <form action="" method="post" onSubmit={handleSubmit}>
        <h2>CollabSphere</h2>
            <div className="form-group">
                <label htmlFor="fName">First Name</label>
                <input type="text" name="fName" id="fName" placeholder='Enter your first name' onChange={handleChange} />
            </div>
            <div className="form-group">
                <label htmlFor="lName">Last Name</label>
                <input type="text" name="lName" id="lName" placeholder='Enter your last name' onChange={handleChange} />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder='Enter your email' onChange={handleChange} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" placeholder='Enter your password' onChange={handleChange} />
            </div>
            <button type="submit">Register</button>
            <p>Already have an account? <Link to="/login">Log In</Link></p>
        </form>
    </div>
  )
}

export default Register