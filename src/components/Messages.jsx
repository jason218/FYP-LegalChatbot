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
  let today = new Date();
  let currentDay = new Date(today.getFullYear(),today.getMonth(),today.getDate());
  let tomorrow = new Date(currentDay.getFullYear(),currentDay.getMonth(),currentDay.getDate()+1);
  let checkDay = new Date();
  let display = false;
  let initial = false;
  let displayCheck = false;
  const dayArray = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];


  const displayDate = (m,firstMessageDisplay) => {
    let messageDay = m.date.toDate(); // m date
        var displayDay;
        if (firstMessageDisplay) { //to show the first message
          display = true;
          displayDay = updateDisplayDate(messageDay);
          checkDay = messageDay;
        } else { // start handling the following message
          if (messageDay> new Date (checkDay.getFullYear(),checkDay.getMonth(),checkDay.getDate()+1)) {
            // check whetherthe next message is  within the same day
            display = true; //show the UI component
            displayDay = updateDisplayDate(messageDay); //update the text of UI component
          } else {
            display = false;     // the next message are within same day, so not show UI component
          }
          checkDay = messageDay; // for checking the next message whether it is within the day of this message
        }
        return {toDisplay:display,displayText:displayDay};
  }

  const updateDisplayDate = (messageDay) => {
    var displayDay;
    if (messageDay<tomorrow&&messageDay>=currentDay){
      displayDay = "Today";
    } else {
      if (Math.abs((new Date(messageDay.getFullYear(),messageDay.getMonth(),messageDay.getDate()).getTime()-new Date(currentDay.getFullYear(),currentDay.getMonth(),currentDay.getDate()).getTime())/(1000 * 60 * 60 * 24))<=6) {
        displayDay = dayArray[messageDay.getDay()]; // check whether the message is within same week starting count from today
      } else {
        displayDay =  messageDay.toString().substring(4,15);
      }
    }
    return displayDay;
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
        var result;
        if (!initial) {
          result = displayDate(m,true);
          initial = true;
        } else {
          result = displayDate(m,false);
        }
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
