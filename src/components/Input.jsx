import React, { useContext, useState } from "react";
import Send from "../img/send.png";
import Attach from "../img/attach.png";
import Image from "../img/img.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { Worker,Viewer } from '@react-pdf-viewer/core';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Create new plugin instance


const Input = (props) => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const uploadDoc = () => {
    console.log(props.file);
    console.log(currentUser.uid);
    let docRef =  ref(storage,currentUser.uid+'/');
    docRef = ref(docRef,Math.random().toString()+'/'+props.file.name);
    const uploadDoc = uploadBytesResumable(docRef,props.file);
    uploadDoc.on(
      (error) => {
          console.log('upload failure')
      },
      ()=>{
        
              getDownloadURL(uploadDoc.snapshot.ref).then(async (docUrl)=>{
              
              try {
                await updateDoc(doc(db, "chats", data.chatId), {
                  messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                    doc: docUrl,
                    docType: (props.mode==0)?'image':'doc',
                    fileName: props.file.name
                  }),
                });         
              } catch(err){console.log('failure');return null;}
              
            }) 
           
        });
  }
 

  const handleSend = async () => { 
    if (props.docUpload==false) {
      try{
      uploadDoc();
      
      }catch(error){console.log('failure')}
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          img: null,
        }),
      });
    }
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      ["lastMessage"]: {
        text,
      },
      ["date"]: serverTimestamp(),
    });
    console.log(currentUser.uid);

    // await updateDoc(doc(db, "userChats", data.user.uid), {
    //   [data.chatId + ".lastMessage"]: {
    //     text,
    //   },
    //   [data.chatId + ".date"]: serverTimestamp(),

    // });

    setText("");
    setImg(null);
    props.sendDoc();
  };
  return (
    <div className="input">
      <img className='upload' src={Attach} alt="" onClick={()=>props.selectButton()}/>
      <input
        type="text"
        placeholder=""
        onChange={(e) => {setText(e.target.value);console.log(e.target.value)}}
        value={text}
      />
      <div className="send">
        <img className='sendButton' src={Send} alt="" onClick={()=>handleSend()}/>
      </div>
    </div>
  );
};

export default Input;