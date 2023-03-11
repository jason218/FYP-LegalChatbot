import React, {useState,useContext} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {  signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

//import Add from "../img/addAvatar.png"

const Login = () => {   
  const [login,setLoginErr] = useState(false);
  const [pw,setPwErr] = useState(false); 
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  


 

 
  
  const handleSubmit =  async (e) =>{
    e.preventDefault() 
    
      const email = e.target[0].value    
      const password = e.target[1].value;   
      console.log(email);
      console.log(password);  
   

try{

    await signInWithEmailAndPassword(auth, email, password);
    dispatch({ type: "CHANGE_USER", payload: currentUser.uid });

    

    navigate("/home")
        }catch(err){
          console.log('error');
           setPwErr(true);
           setLoginErr(true);
        }

    

  }
  return (
    <div className='formContainer'>   
        <div className='formWrapper'>
            <span className="logo">Legal Chatbot</span>   
            <span className="title">Login</span>
         <form onSubmit={handleSubmit}>
            <input className={(login)?'input error':'input'} type="email" placeholder='email' onClick={()=>setLoginErr(false)}/>
            {(login)&&<span className='errorMessage'>Please enter correct email address.</span>}
            <input className={(pw)?'input error':'input'} type="password" placeholder='password' onClick={()=>setPwErr(false)}/>
            {(pw)&&<span className='errorMessage'>Please enter correct password.</span>}
            <button>Sign In</button> 
            {/* {err && <span>Something went wrong</span>} */}
         </form>
         <p>You don't have an account? <Link to="/register">Register</Link></p>
        </div>
    </div>
  )
}

export default Login