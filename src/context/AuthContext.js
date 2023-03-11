import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react"; 
import {auth} from "../firebase"

export const AuthContext = createContext();  

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({})

    useEffect( ()=>{
        const unsub = onAuthStateChanged(auth,(user)=>{
            setCurrentUser(user);
        });  
        //clean up function
        return () => {
            console.log('hello3');
            unsub(); 
        }
    }, [currentUser]);

    return (

        <AuthContext.Provider value = {{currentUser}}>
    {children}
 </AuthContext.Provider>
     );
};
