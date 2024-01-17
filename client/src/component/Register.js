import React,{ Fragment,useState } from 'react'
import { useNavigate,Link } from 'react-router-dom';
import Swal from "sweetalert2";

// setAuth is props which triggers the authentication if user was valid
const Register = ({setAuth}) =>{
    const navigate = useNavigate();
  // getting registration data from user and storing them into these variable
    const [inputs,setInputs] = useState({
        name:'',
        email:'',
        password:''
    })
    
  // destructuring of login variable
    const {name,email,password} = inputs;
    const onChange = (e) =>{
        setInputs({...inputs,[e.target.name]:e.target.value});
    }

    const onSubmitForm= async(e) =>{
        e.preventDefault();

        try{
            const body = {name,email,password};
            const response = await fetch("http://localhost:5000/auth/register",{
                method: "POST",
                headers : {"Content-Type":"application/json"},
                body:JSON.stringify(body)
            })

            if (response.status === 401) {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Unauthorized! Please check your credentials!!!",
                });
                return;
              }
              else{
                Swal.fire({
                    icon: "success",
                    title: "Congrats...",
                    text: "Registration successful...",
                  });
            }

            const parseRes = await response.json();
            localStorage.setItem('token',parseRes.token);
            setAuth(true);
            navigate('/userhome');
            console.log(parseRes);
        }catch(err){
            console.error(err.message);
        }

    }

    return(
    <Fragment>
        <h1 className='text-center my-5'>Register</h1>
        <form onSubmit={onSubmitForm}>
            <input type ='name' name = 'name' placeholder ='Name' className='form-control my-3' value = {name} onChange={ e => onChange(e)}></input>
            <input type ='email' name = 'email' placeholder ='Email' className='form-control my-3' value = {email} onChange={e => onChange(e)}></input>
            <input type ='password' name = 'password' placeholder ='Password' className='form-control my-3' value = {password} onChange={e => onChange(e)}></input>   
            <button className='btn btn-success btn-block'>Submit</button>         
        </form>
        <Link to ='/auth/login'>Login</Link>
    </Fragment>
    );
};


export default Register;