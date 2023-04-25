import React, { useContext, useState, useEffect } from "react";
import Send from "../../images/send.png";
import Attach from "../../images/attach.png";
import InputHelper from "./InputHelper";
import InputAPIHelper from "./InputAPIHelper";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import {
  Timestamp,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
// Create new plugin instance


const Input = (props) => {
  const [inputText, setInputText] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [contractString, setContractString] = useState("");
  const [contractUploaded, setContractUploaded] = useState(false);
  const chatbotID = "cSoQu0MDxLXA3qidA5NB87cLMFc2";

  useEffect(()=>{

    if (props.inputQuestion!="") {
      setInputText(props.inputQuestion);
      props.updateInputQuestion("");
    }
    
  },[props])


  const sendMessage = async (userID,docURL,content) => {
    console.log(userID);
    console.log(data.chatId);
    const message = {
      id: uuid(),
      text: content,
      senderId: userID,
      date: Timestamp.now(),
      doc: docURL,
      docType: (props.file!=undefined)&&((props.mode == 0) ? 'image' : 'doc'),
      fileName: (props.file!=undefined)&&props.file.name
    };
    console.log(data.chatId);
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
        sendMessage(chatbotID,null,"I am processing your contract. Please wait for a while.");
        setContractUploaded(true); 
        const contractResult = await InputAPIHelper.extractContract(docURL,props.file.name);
        console.log(contractResult);
        setContractString(contractResult);
        if (inputText != "") {
          const chatResponse = await InputAPIHelper.chatbotResponse(userInput,contractString);
          sendMessage(chatbotID,null,chatResponse);
        } else {
          sendMessage(chatbotID,null,"What can I help you with?");
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
        sendMessage(chatbotID,null,"Please upload the contract."); 
      } else {
        //answer based on contract
        console.log(contractString);
        console.log(userInput);
        const chatResponse = await InputAPIHelper.chatbotResponse(userInput,contractString);
        sendMessage(chatbotID,null,chatResponse);
      }
    }
    console.log(contractString);
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
      sendMessage(chatbotID,null,chatResponse.answer);
      //sendMessage("sJvSTb8gYdXDmH4BNv5udRzcDKt2",null,chatResponse.top_n_questions[0]);
      //sendMessage("sJvSTb8gYdXDmH4BNv5udRzcDKt2",null,"Hello<br>Bye");//"•  "+"Hello\n•  "+"Hello"
      sendTopQuestions(chatResponse.top_n_questions);
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
      {(props.questionMode==1)&&<img className='upload' src={Attach} alt="" onClick={()=>props.selectButton()}/>}
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