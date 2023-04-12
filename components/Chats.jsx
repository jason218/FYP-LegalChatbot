import { doc, onSnapshot,collection, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Default from "../img/default.jpg"


const Chats = () => {
  const [chats, setChats] = useState([]);
  const [userList,setUserList] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [init,setInit] = useState(true);
  const defaultId = 'sJvSTb8gYdXDmH4BNv5udRzcDKt2';


  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "userChats"));
    let tempList = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      
      if(doc.data().userInfo.uid!=defaultId) {
        tempList.push({user:doc.data().userInfo,lastMessage:doc.data().lastMessage});
      }
    });
    setUserList(tempList);
    setInit(false);
  };



  {(init)&&getData()}

  // useEffect(() => {
  //   const getChats = () => {
  //     const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
  //       setChats(doc.data());
  //       console.log('--------------------------------------');
  //     console.log(chats);
  //     });

      

  //     return () => {
  //       unsub();
  //     };
  //   };

  //   currentUser.uid && getChats();
  // }, [currentUser.uid]);

  // const handleSelect = (u) => {
  //   console.log('1');
  //   dispatch({ type: "CHANGE_USER", payload: u });
  // };

  return (
    <div className="chats">
      <div className='userList'>
      <p>User List</p>
      </div>
      {userList.map((chat) => {
          return <div
          className="userChat"
          onClick={() => dispatch({ type: "CHANGE_USER", payload:chat.user.uid })}
          key={Math.random()}
        >
          <img src={Default} alt="" />
          <div className="userChatInfo">
          <span >{chat.user.displayName}</span>
            <p className='lastMessage'>{(chat.lastMessage.text!=null)?chat.lastMessage.text:''}</p>
            
          </div>
        </div>
      })
      }
    </div>
  );
};

export default Chats;