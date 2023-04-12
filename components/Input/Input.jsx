import React, { useContext, useState } from "react";
import Send from "../../img/send.png";
import Attach from "../../img/attach.png";
import InputHelper from "./InputHelper";
import InputAPIHelper from "./InputAPIHelper";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// Create new plugin instance


const Input = (props) => {
  const [inputText, setInputText] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [contractString, setContractString] = useState("");
  const [contractUploaded, setContractUploaded] = useState(false);


  const sendMessage = async (userID,docURL,content) => {
    const message = {
      id: uuid(),
      text: content,
      senderId: userID,
      date: Timestamp.now(),
      doc: docURL,
      docType: (props.file!=undefined)&&((props.mode == 0) ? 'image' : 'doc'),
      fileName: (props.file!=undefined)&&props.file.name
    };
    InputHelper.updateDoc(message,data.chatId);
  }  

  const sendTopQuestions = async (content) => {   
    props.update(content);
    //InputHelper.updateDoc(message,data.chatId);
  }  

  const handleContractQA = async () => {
    //switch to chat screen
    props.sendDoc();
    //handle contract
    if (!props.docUpload) {
      try {
        //get docURL
        const docURL = await InputHelper.uploadDoc(currentUser,props);
        const userInput = inputText;
        setInputText("");
        sendMessage(currentUser.uid,docURL,inputText);
        setContractUploaded(true);
        const contractResult = await InputAPIHelper.extractContract(docURL);
        setContractString(contractResult);
        // if no input => no response received by bot
        if (inputText != "") {
          const chatResponse = await InputAPIHelper.chatbotResponse(userInput,contractString);
          sendMessage("sJvSTb8gYdXDmH4BNv5udRzcDKt2",null,chatResponse);
        } 
      } catch (error) {
        console.log(error);
      }
    }
  
  else {
    //do nth without no input
    if (inputText != "") {
      const userInput = inputText;
      sendMessage(currentUser.uid,null,inputText);
      setInputText("");
      if (contractString=="") {
        if (contractUploaded) {
          sendMessage("sJvSTb8gYdXDmH4BNv5udRzcDKt2",null,"I am still processing your contract. Please wait for a while."); //take time load
        } else {
          sendMessage("sJvSTb8gYdXDmH4BNv5udRzcDKt2",null,"Please upload the contract."); //no contract
        }
      } else {
        //answer based on contract
        const chatResponse = await InputAPIHelper.chatbotResponse(userInput,contractString);
        sendMessage("sJvSTb8gYdXDmH4BNv5udRzcDKt2",null,chatResponse);
      }
    }
  }
    //update last message of users
      if (inputText != "") {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          ["lastMessage"]: {
            text:inputText
          },
          ["date"]: serverTimestamp(),
        });
      }
  }

  const handleGeneralQA = async () => {
    //switch to chat screen
    //props.sendDoc();                             
    //handle contract

  
    //do nth without no input  
    if (inputText != "") {

      const userInput = inputText;
      sendMessage(currentUser.uid,null,inputText);
      setInputText("");  
      
      const chatResponse = await InputAPIHelper.generalQAResponse(userInput); //generalQAResponse
      sendMessage("sJvSTb8gYdXDmH4BNv5udRzcDKt2",null,chatResponse.answer);
      //sendMessage("sJvSTb8gYdXDmH4BNv5udRzcDKt2",null,chatResponse.top_n_questions[0]);
      //sendMessage("sJvSTb8gYdXDmH4BNv5udRzcDKt2",null,"Hello<br>Bye");//"•  "+"Hello\n•  "+"Hello"


      sendTopQuestions(chatResponse.top_n_questions);
      console.log("Hello\nBye")
    }
  
    //update last message of users
      if (inputText != "") {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          ["lastMessage"]: {
            text:inputText
          },
          ["date"]: serverTimestamp(),
        });
      }
  }


  
  const handleSend = async () => {

    switch (props.chatResponseMode) {
        case "0": {
            await handleGeneralQA();
        } break;
        case "1": {
            await handleContractQA();
        }
        break;
        default: {

        }
    }

  };
  return (
    <div className="input">
      <img className='upload' src={Attach} alt="" onClick={()=>props.selectButton()}/>
      <input
        type="text"
        placeholder=""
        onChange={(e) => {setInputText(e.target.value);console.log(e.target.value)}}
        value={inputText}         
      />
      <div className="send">         
        <img className='sendButton' src={Send} alt="" onClick={()=>handleSend()}/>
      </div>
    </div>
  );
};

export default Input;