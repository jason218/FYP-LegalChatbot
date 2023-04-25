import React, {useState,useContext} from 'react'
import Default from "../images/default.jpg"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; 
import { auth, storage, db } from "../firebase"; 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {  signInWithEmailAndPassword } from "firebase/auth";
import {
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';
import { ChatContext } from "../context/ChatContext";
   
const Register = () => {   
  const [err,setErr] = useState(false);
  const [upload,setUpload] = useState(false);
  const [file,setFile] = useState(null);
  const navigate = useNavigate();
  const defaultId = 'cSoQu0MDxLXA3qidA5NB87cLMFc2';
  const { dispatch } = useContext(ChatContext);

  const createrUser = async (res,userInfo,imageUrl) => {
    await setDoc(doc(db, "UserList", res.user.uid), {
      uid: res.user.uid,   
      displayName: userInfo.displayName,
      email: userInfo.email,
      avatar: imageUrl,
    });
  }


  const uploadAvatar = (res,file,userInfo) =>{
        if (file==null) return null;
        const imageRef =  ref(storage,'avatar/'+res.user.uid+file.name);
        const uploadAvatar = uploadBytesResumable(imageRef,file);
        uploadAvatar.on(
          (error) => {
              console.log(error)
          },
          ()=>{
                getDownloadURL(uploadAvatar.snapshot.ref).then(async (imageUrl)=>{
                  try {
                    await updateProfile(res.user,{
                      photoURL:(file==null)?null:imageUrl,
                    });
                    await createrUser(res,userInfo,imageUrl);
                  } catch(err){console.log('failure')}
                }) 
            })
          }

  const createChatRoom = async (currentUser,displayName) => {
    //check whether the group(chats in firestore) exists, if not create
    const chatRoomId = currentUser +defaultId;
    console.log(chatRoomId);
    try {
      const res = await getDoc(doc(db, "ChatroomList", chatRoomId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "ChatroomList", chatRoomId), { messages: [] });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit =  async (e) =>{
    e.preventDefault() ;
    const userInfo = {
      "displayName": e.target[0].value,
      "email": e.target[1].value,
      "password": e.target[2].value
    }
try{    
          const res = await createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password); 
          const userCredential = await signInWithEmailAndPassword(auth, userInfo.email, userInfo.password);
          if (file==null) {
            createrUser(res,userInfo,null);
          } else {
            uploadAvatar(res,file,userInfo);
          }
          await createChatRoom(res.user.uid,userInfo.displayName);
          // await signInWithEmailAndPassword(auth, email, password);
          dispatch({ type: "create_chatroom", payload: userCredential.user.uid });
          navigate("/home");

        }catch(err){
          console.log(err)
           setErr(true);
        }
  }

  const selectImage = () => {
      var input = document.createElement('input');
      input.type = 'file';
      input.onchange = _ => {
            var file =   input.files[0];
            setFile(file);
            setUpload(true);
        };
      input.click();
  }

  return (   
    <div className='formContainer'>   
        <div className='formWrapper'>
            <span className="logo">Legal Chatbot</span>
            <span className="title">Register</span>
         <form onSubmit={handleSubmit}>
            <input className='input' type="text" placeholder='display name'/>    
            <input className={(err)?'input error':'input'} type="email" placeholder='email' onClick={()=>setErr(false)}/>
            {(err)&&<span className='errorMessage'>Email address is already registered.</span>}
            <input className='input' type="password" placeholder='password'/>
            <input  style = {{display:"none"}} type="file" id = "file" />
            <label  onClick={()=>selectImage()}>   
                <div className='upload'>
                <img className='uploadImage' src={(upload)?URL.createObjectURL(file):Default} alt="" /> 
                <span className='uploadMessage'>Upload your avatar</span>
                </div> 
            </label>    
            <button>Sign up</button>      
         </form>
         <p>Do you have an account? <Link to="/">Login</Link></p>
        </div>
    </div>
  )
}

export default Register