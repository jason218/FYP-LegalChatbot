import React,{useContext} from 'react';
import { AuthContext } from "../../context/AuthContext";
import Default from "../../images/default.jpg"

const Message = (props) => {
  const { currentUser } = useContext(AuthContext);
  const defaultId = 'cSoQu0MDxLXA3qidA5NB87cLMFc2';


  return (
    <div className={(currentUser.uid==props.message.senderId)?'message owners':'message'}>
      <div className='messageInfo'>
        <img src={(currentUser.uid==props.message.senderId)?(currentUser.uid==defaultId)?'https://cdn-icons-png.flaticon.com/512/8649/8649605.png':(currentUser.photoURL==null)?Default:currentUser.photoURL:(currentUser.uid!=defaultId)?'https://cdn-icons-png.flaticon.com/512/8649/8649605.png':currentUser.photoURL} alt="" />    
      </div> 
      <div className="messageContent">
        <div className="messageText">
        {(props.message.doc!=null||props.message.doc!=undefined)&&((props.message.docType=="image")?
        <a target="_blank" href={props.message.doc}><img className='messageImage' alt='' src={props.message.doc}></img></a>:
        <a target="_blank" href={props.message.doc}>{props.message.fileName}</a>)}
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