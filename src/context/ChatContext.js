import {
    createContext,
    useContext,
    useReducer,
  } from "react";
  import { AuthContext } from "./AuthContext";
  
  export const ChatContext = createContext();
  
  export const ChatContextProvider = ({ children }) => {
 
    const INITIAL_STATE = {
      // chatId: "null",
      // user: {},
      chatId: null,
      // user: '',
    };
  
    const chatReducer = (state, action) => {
      switch (action.type) {
        case "CHANGE_USER":
          return {
            // user: action.payload,
            // chatId:
            //   currentUser.uid > action.payload.uid
            //     ? currentUser.uid + action.payload.uid
            //     : action.payload.uid + currentUser.uid,
            chatId: action.payload+'sJvSTb8gYdXDmH4BNv5udRzcDKt2',
            
          };
  
        default:
          return state;
      }
    };
  
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    //call dispatch function to update the state with object dispatch({type:__,payload:__})
  
    return (
      <ChatContext.Provider value={{ data:state, dispatch }}>
        {children}
      </ChatContext.Provider>
    );
  };