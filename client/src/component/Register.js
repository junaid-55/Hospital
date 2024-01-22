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

     //user login type
  const [user_type, setUserType] = useState("patient");
  
  //user login type selection from dropdown
  const handleUserTypeChange = (e) => {
    e.preventDefault();
    setUserType(e.target.value);
  };
    
  // destructuring of login variable
    const {name,email,password} = inputs;
    const onChange = (e) =>{
        setInputs({...inputs,[e.target.name]:e.target.value});
    }

    const onSubmitForm= async(e) =>{
        e.preventDefault();

        try{
            const body = {name,email,password,user_type};
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
              else if (response.status === 200){
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

        <div className="dark:bg-gray-800 min-h-screen">
        <h1 className="text-center text-3xl text-blue-700 font-bold pt-10">
          Register
        </h1>  
        <form
          class="max-w-sm dark:bg-slate-800 mx-auto"
          onSubmit={onSubmitForm}
        >
          <div class="mb-4 ">
            <label
              for="name"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your name
            </label>
            <input
              type="name"
              name="name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Name"
              value={name}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div class="mb-4">
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              type="email"
              name="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Email"
              value={email}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div class="mb-4">
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your password
            </label>
            <input
              type="password"
              name="password"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => onChange(e)}
            />
          </div>
          <form class="max-w-sm mx-auto">
            <label
              for="user_type"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Sign up as
            </label>
            <select
              name="user_type"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleUserTypeChange}
            >
              <option>Patient</option>
              <option>Doctor</option>
            </select>
          </form>
          <div class="flex items-start mb-4">
            <div class="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                value=""
                class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              />
            </div>
            <label
              for="remember"
              class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-2"
          >
            Submit
          </button>
          <Link
            to="/auth/login"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Already have an account? Sign in
          </Link>
        </form>
      </div>
    </Fragment>
    );
};


export default Register;