import { doc, onSnapshot} from "firebase/firestore";
import React, { useContext, useEffect, useState,useRef } from "react";
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../firebase";
import MessageContent from "./MessageContent";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "@mui/material";


const Messages = (props) => {
  const [messages, setMessages] = useState([]);
  const [photoURL,setPhotoURL] = useState();
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  let today = new Date();
  let currentDay = new Date(today.getFullYear(),today.getMonth(),today.getDate());
  let tomorrow = new Date(currentDay.getFullYear(),currentDay.getMonth(),currentDay.getDate()+1);
  let checkDay = new Date();
  let display = false;
  let initial = false;
  const dayArray = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  const scrollRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the element whenever it is updated
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  });
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
    console.log(data)
    const unSub = onSnapshot(doc(db, "ChatroomList", data.chatId), (doc) => {
      if(doc.exists()) {
        setMessages(doc.data().messages);
      }
    });

    const user = onSnapshot(doc(db, "UserList", currentUser.uid), (doc) => {
      if(doc.exists()) {
        setPhotoURL(doc.data().photoURL);
      }
  
    });
    return () => {
      unSub();
      user();
    };
  }, [data,photoURL]);

  //console.log(messages)
  
  return (
    
    <div ref={scrollRef} className="messages">
      <div>
      {messages.map((m) => {
        var result;
        if (!initial) {
          result = displayDate(m,true);
          initial = true;
        } else {
          result = displayDate(m,false);
        }
        return <div  key={Math.random()} >
          {result.toDisplay&&<div id={m.id} className='dayContainer'>
          <p id={m.id} className='day'>{result.displayText}</p>
          </div>}
          <MessageContent message={m} photo={photoURL} key={m.id} />

        </div>

      }
      )}



      {
       props.chatResponseMode == "1" ? null:
     ( props.topQuestions.length==0 ? null: 
       <div className="question-list">
       <Button onClick={(e)=>{props.updateInput(props.topQuestions[0]);props.updateTopQuestion([])}} className="trending-button1">{props.topQuestions[0]}</Button>
       <Button onClick={(e)=>{props.updateInput(props.topQuestions[1]);props.updateTopQuestion([])}}  className="trending-button1">{props.topQuestions[1]}</Button>
       <Button onClick={(e)=>{props.updateInput(props.topQuestions[2]);props.updateTopQuestion([])}}  className="trending-button1">{props.topQuestions[2]}</Button>
       <Button onClick={(e)=>{props.updateInput(props.topQuestions[3]);props.updateTopQuestion([])}}  className="trending-button1">{props.topQuestions[3]}</Button>
       <Button onClick={(e)=>{props.updateInput(props.topQuestions[4]);props.updateTopQuestion([])}}  className="trending-button1">{props.topQuestions[4]}</Button>
       </div> )


       }
      </div>
    </div>

  );
};

export default Messages;