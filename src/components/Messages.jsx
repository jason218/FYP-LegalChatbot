import { doc, onSnapshot,  Timestamp} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";
import { AuthContext } from "../context/AuthContext";



const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [photoURL,setPhotoURL] = useState();
  const [startDate,setStartDate] = useState(null)
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  let current = new Date();
  let tomorrow = new Date(current.getFullYear(),current.getMonth(),current.getDate()+1);
  let today = new Date(current.getFullYear(),current.getMonth(),current.getDate());
  let checkDay = new Date();
  let display = false;
  let displayCheck = false;
  const dayArray = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];


  const displayDate = (m) => {
    let messageDay = m.date.toDate();
        let displayDay = "";
        if (!displayCheck) {
          checkDay = messageDay;
          displayCheck = true;
          display = true;
          if (messageDay<tomorrow&&messageDay>=today){
            displayDay = "Today";
          } else {
            displayDay = dayArray[messageDay.getDay()];
          }
        } else {
          if (messageDay.getDate()> checkDay.getDate()) {
            display = true;
            if (messageDay<tomorrow&&messageDay>=today){
              displayDay = "Today";
            } else {
              if ((new Date(messageDay.getFullYear(),messageDay.getMonth(),messageDay.getDate()).getTime()-new Date(checkDay.getFullYear(),checkDay.getMonth(),checkDay.getDate()).getTime())/(1000 * 60 * 60 * 24)<=6) {
                displayDay = dayArray[messageDay.getDay()];
              } else {
                displayDay =  messageDay.toString().substring(4,15);
              }
            }
          } else {
            display = false;
          }
          checkDay = messageDay;
        }
        return {toDisplay:display,displayText:displayDay};
  }

  useEffect(() => {
    console.log(data);
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if(doc.exists()) {
        setMessages(doc.data().messages);
        // setStartDate(new Date(messages[0].date.toDate().getFullYear(),messages[0].date.toDate().getMonth(),messages[0].date.toDate().getDate()+1));
      }
    });

    const user = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
      if(doc.exists()) {
        setPhotoURL(doc.data().photoURL);
        // setStartDate(new Date(messages[0].date.toDate().getFullYear(),messages[0].date.toDate().getMonth(),messages[0].date.toDate().getDate()+1));
      }
      console.log(photoURL);
    });

    return () => {
      unSub();
      user();
    };
  }, [data.chatId,photoURL]);

  //console.log(messages)

  return (
    <div className="messages">
      
      {messages.map((m) => {
        let result = displayDate(m);
        
        return <div>
          {result.toDisplay&&<div id={m.id} className='dayContainer'>
          <p id={m.id} className='day'>{result.displayText}</p>
          </div>}
          <Message message={m} photo={photoURL} key={m.id} />
        </div>
      }
      )}
    </div>
  );
};

export default Messages;