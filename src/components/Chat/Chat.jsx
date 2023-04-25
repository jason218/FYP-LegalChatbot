import React, { useState } from "react";
import UploadDoc from "../../images/uploadDoc.png";
import UploadImage from "../../images/uploadImage.png";
import Doc from "../../images/docs.png";
import Messages from "../Message/Messages";
import Input from "../Input/Input";
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth'
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';



const Chat = () => {
  const navigate = useNavigate();
  const [docUrl,setDocUrl] = useState(null); 
  const [docUpload,SetDocUpload] = useState(true);
  const [mode,setMode] = useState(-1);
  const [select,setSelection]= useState(false);
  const [doc,setDoc] = useState(null);
  const [selectedValue, setSelectedValue] = useState('0');
  const [topQuestions, setTopQuestions] = useState([]);
  const [inputTopQuestion,setInputTopQuestion] = useState("");


  
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
    input.type = 'file';
    if (mode == 0) {
      input.accept = '.png';
    } else {
      input.accept = '.txt,application/*';
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
        <span className='sidebarName'>Legal Chatbot</span>
        </div>
        <select className="selectComponent" value={selectedValue} onChange={handleChange}>
        <option value="0">General QA</option>
        <option value="1">Contract QA</option>
        </select> 
        <button className='logOutButton' onClick={()=>{signOut(auth);navigate("/");}}>log out</button>   
      </div>
      {(docUpload)?<Messages updateTopQuestion={(e)=>{setTopQuestions(e)}} updateInput={(e)=>{setInputTopQuestion(e);}} topQuestions={topQuestions} chatResponseMode={selectedValue}/>:
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
      <Input questionMode={selectedValue} inputQuestion={inputTopQuestion} updateInputQuestion={(e)=>{setInputTopQuestion(e)}}  update={(e)=>{setTopQuestions(e)}}  selectButton={()=>updateSelection()} chatResponseMode={selectedValue} docUpload={docUpload} mode={mode} file={doc} sendDoc={()=>SetDocUpload(true)}/>
    </div>
  );
};

export default Chat;