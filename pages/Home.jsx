import Chat from '../components/Chat'
import Sidebar from '../components/Sidebar'
import { AuthContext } from "../context/AuthContext";
import React, { useContext, useEffect, useState } from "react";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const defaultId = 'sJvSTb8gYdXDmH4BNv5udRzcDKt2';
  return (
    <div className='home'>
        <div className="container">
             {(currentUser.uid==defaultId)&&<Sidebar/>}
             <Chat/>
        </div>
    </div>
  )
}

export default Home