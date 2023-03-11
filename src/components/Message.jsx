import React,{useContext} from 'react';
import {
  Timestamp
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import Default from "../img/default.jpg"

const Message = (props) => {
  const { currentUser } = useContext(AuthContext);
  const defaultId = 'sJvSTb8gYdXDmH4BNv5udRzcDKt2';
  
  console.log(props.message); 
  return (
    <div className={(currentUser.uid==props.message.senderId)?'message owners':'message'}>
      <div className='messageInfo'>
        {console.log(currentUser)}
        <img src={(currentUser.uid==props.message.senderId)?(currentUser.uid==defaultId)?'https://cdn-icons-png.flaticon.com/512/8649/8649605.png':(currentUser.photoURL==null)?Default:currentUser.photoURL:(currentUser.uid!=defaultId)?'https://cdn-icons-png.flaticon.com/512/8649/8649605.png':currentUser.photoURL} alt="" />    
      </div> 
      <div className="messageContent">
        <div className="messageText">
        {(props.message.doc!=undefined)&&(props.message.docType=="image")?<a target="_blank" href={props.message.doc}><img className='messageImage' alt='' src={props.message.doc}></img></a>:<a target="_blank" href={props.message.doc}>{props.message.fileName}</a>}
        <div><p className='messageTexts'>{props.message.text}</p> </div>
        <div className='messageTimeContainer'>
        <p className="messageTime">{props.message.date.toDate().toString().substring(16,21)}</p> 
        </div>
        </div>
      </div>
      
    </div>
  )
}

export default Message