import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { ChatContext } from '../context/ChatContext';


const Login = () => {
  const [loginError, setLoginError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(ChatContext);

  const handleSubmit = async (e) => {        
    e.preventDefault(); 
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      dispatch({ type: 'create_chatroom', payload: userCredential.user.uid });
      navigate('/home');
    } catch (error) {
      console.log(error);
      setPasswordError(true);
      setLoginError(true);
    }
  };

  return (
    <div className="loginSignupBackground">
      <span className="bigTitle">Legal Chatbot</span>
      <div className="loginSignupForm">
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input
            className={loginError ? 'input error' : 'input'}
            type="email"
            placeholder="Email"
            onClick={() => setLoginError(false)}
          />
          {loginError && <span className="errorMessage">Please enter a valid email address.</span>}
          <input
            className={passwordError ? 'input error' : 'input'}
            type="password"
            placeholder="Password"
            onClick={() => setPasswordError(false)}
          />
          {passwordError && <span className="errorMessage">Please enter a valid password.</span>}
          <button>Sign In</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;