import React, {useState,useContext} from 'react'
import Add from "../img/addAvatar.png"
import Default from "../img/default.jpg"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; 
import { auth, storage, db } from "../firebase"; 
import { ref, uploadBytesResumable, getDownloadURL,uploadBytes } from "firebase/storage";
import {  signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';
import { ChatContext } from "../context/ChatContext";
   
const Register = () => {   
  const [err,setErr] = useState(false);
  const [upload,setUpload] = useState(false);
  const [file,setFile] = useState(null);
  const navigate = useNavigate();
  const defaultId = 'sJvSTb8gYdXDmH4BNv5udRzcDKt2';
  const { dispatch } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const [image,setImage] = useState();

  const uploadAvatar = (res,file,userInfo) =>{
        if (file==null) return null;
        console.log(storage);
        const imageRef =  ref(storage,'avatar/'+res.user.uid+file.name);
        console.log('-----------------');
        console.log(imageRef);
        console.log(file);
        const uploadAvatar = uploadBytesResumable(imageRef,file);
        uploadAvatar.on(
          (error) => {
              console.log('upload failure')
          },
          ()=>{
                getDownloadURL(uploadAvatar.snapshot.ref).then(async (imageUrl)=>{
                  
                  try {
                    await updateProfile(res.user,{
                      photoURL:(file==null)?null:imageUrl,
                    });
                    await setDoc(doc(db, "users", res.user.uid), {
                      uid: res.user.uid,   
                      displayName: userInfo.displayName,
                      email: userInfo.email,
                      photoURL: (file==null)?null:imageUrl,
                    });
                    setImage(imageUrl);
                  } catch(err){console.log('failure')}
                }) 
            })
          }

  const createChatRoom = async (currentUser,displayName) => {
    //check whether the group(chats in firestore) exists, if not create
    const chatRoomId = currentUser +defaultId;
    console.log(chatRoomId);
    try {
      const res = await getDoc(doc(db, "chats", chatRoomId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", chatRoomId), { messages: [] });
        await setDoc(doc(db, "userChats", currentUser), {
          ["userInfo"]: {
            uid: currentUser,
            displayName: displayName,
            photoURL: (file==null)?null:image
          },
          ["createDate"]: serverTimestamp(),
          ["lastMessage"]: null,
        });
      }
    } catch (err) {
      console.log('error');
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
          
          // console.log(file);
          
           const res = await createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password); 
           await signInWithEmailAndPassword(auth, userInfo.email, userInfo.password);
           uploadAvatar(res,file,userInfo);
          await createChatRoom(res.user.uid,userInfo.displayName);
          // await signInWithEmailAndPassword(auth, email, password);
          dispatch({ type: "CHANGE_USER", payload: res.user.uid });
          navigate("/home");


// const storageRef =  ref(storage, displayName);

// const uploadTask =  uploadBytesResumable(storageRef, file);

//console.log(uploadTask);


// uploadTask.on(
//   (error) => {
//     // Handle unsuccessful uploads
//     setErr(true);
//     console.log('error');
//   }, 
//    () => {
//     getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
//       console.log(downloadURL);
//       await updateProfile(res.user, {
//        displayName, 
//         photoURL: downloadURL
//       }); 
//       await setDoc(doc(db, "users", res.user.uid), {    
//         uid: res.user.uid,   
//         displayName: displayName,
//         email:email,
//         photoURL: downloadURL, 
//       });  

//       await setDoc(doc(db,"userChats",res.user.uid),{}); 
//       navigate("/")
//     });
//   }
// );

        }catch(err){
          console.log('fail')
           setErr(true);
        }
  }

  const selectImage = () => {
    
      let input = document.createElement('input');
      input.type = 'file';
      // input.accept = "image/*";
      input.onchange = _ => {
      // you can use this method to get file and perform respective operations
            let file =   input.files[0];
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
            {/* {err && <span>Something went wrong</span>} */}
         </form>
         <p>Do you have an account? <Link to="/">Login</Link></p>
        </div>
    </div>
  )
}

export default Register