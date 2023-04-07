import { signOut } from 'firebase/auth'
import React ,{ useContext,useState}from 'react'
import { AuthContext } from '../context/AuthContext'
import { auth } from '../firebase'
const Navbar = () => {         
  const {currentUser} =  useContext(AuthContext);
  const [selectedValue, setSelectedValue] = useState('');
  
  const handleChange = event => {
      setSelectedValue(event.target.value);
  };

  return (
    <div className='navbar'>
        <span className='logo'>Legal Chatbot</span> 
        <div className="user">   
            <img src={currentUser.photoURL} alt="" />
            <span>{currentUser.displayName}</span>
            <select value={selectedValue} onChange={handleChange}>
            <option value="">Select an option</option>
            <option value="option1">Option 1</option>
            </select> 
            <button onClick={()=>signOut(auth)}>logout</button>   
        </div>   
    </div>
  )
}   

export default Navbar