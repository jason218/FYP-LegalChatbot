import React, { useContext,useState } from "react";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import UploadDoc from "../img/uploadDoc.png";
import UploadImage from "../img/image1.png";
import Doc from "../img/docs.png";
import Messages from "./Messages";
import Input from "./Input/Input";
import { ChatContext } from "../context/ChatContext";
import { auth } from '../firebase';
import { signOut } from 'firebase/auth'
import CloseIcon from '@mui/icons-material/Close';
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref,deleteObject, uploadBytesResumable } from "firebase/storage";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from 'react-router-dom';



const Chat = () => {
  const { data } = useContext(ChatContext);
  const navigate = useNavigate();
  const [docUrl,setDocUrl] = useState(null); 
  const [docUpload,SetDocUpload] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const [mode,setMode] = useState(-1);
  const [select,setSelection]= useState(false);
  const [doc,setDoc] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  
  const handleChange = event => {
      setSelectedValue(event.target.value);
      console.log(event.target.value);
  };


  const cancelSendDoc = ()=>{
      SetDocUpload(true); //to check whether pop up the upload screen
      setDocUrl(null);    //create url for document
      setDoc(null);       //create file for document
  }

  const updateSelection = ()=>{
    setSelection(!select);
  }

  const fileReader = (mode) => {
    let input = document.createElement('input');
    const reader = new FileReader();
    input.type = 'file';
    if (mode == 0) {
      input.accept = 'image/*';
    } else {
      input.accept = 'application/*';
    }
    setMode(mode);
    let file;
    input.onchange = _ => {
    // you can use this method to get file and perform respective operations
          file =   input.files[0]; 
          if (file==null) return;
      console.log(file);
      setDoc(file);
      setDocUrl(URL.createObjectURL(file));
      //uploadDoc(file,mode);
      console.log(URL.createObjectURL(file));
      SetDocUpload(false);
      setSelection(false);
        
      };
    input.click();
    console.log(file);
}



  return (
    <div className="chat">
      <div className="chatInfo">
      <div className='sidebarContainer'>
        <img className='sidebarAvtar' src={'https://cdn-icons-png.flaticon.com/512/8649/8649605.png'} alt="" />
        {/* <span>{data.user?.displayName}</span> */}
        <span className='sidebarName'>Legal Chatbot</span>
        </div>
        <select value={selectedValue} onChange={handleChange}>
        <option value="0">General QA</option>
        <option value="1">Contract QA</option>
        </select> 
        <button className='logOutButton' onClick={()=>{signOut(auth);navigate("/");}}>log out</button>   
        {/* <div className="chatIcons">
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div> */}
        
      </div>
      {(docUpload)?<Messages />:
      <div  className='imageContainer'>
      <CloseIcon className='closeButton' onClick={()=>cancelSendDoc()}></CloseIcon>
      {(mode==0)?<img className='sentImage' src={docUrl} alt="" />:
      <div className='docContainer'>
      <p className='docTitle'>No Preview Available</p>
      <img className='docImage' src={Doc} alt=''></img>
      </div>}
      </div>}
      {select&&<div className='button'>
      <img className='upload' src={UploadDoc} alt="" onClick={()=>fileReader(1)} />
      <img className='upload' src={UploadImage} alt="" onClick={()=>fileReader(0)}/>
      </div>}
      {/* {(imageUpload)?<Messages />:
      <div  className='imageContainer'>
      <CloseIcon className='closeButton' onClick={()=>cancelSendImage}></CloseIcon>
      <div className='docContainer'>
        <p className='docTitle'>No Preview Available</p>
        <img className='docImage' src={Doc} alt=''></img>
      </div>
      </div>} */}
      <Input selectButton={()=>updateSelection()} chatResponseMode={selectedValue} docUpload={docUpload} mode={mode} file={doc} sendDoc={()=>SetDocUpload(true)}/>
    </div>
  );
};

export default Chat;
