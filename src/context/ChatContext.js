import {
    createContext,
    useReducer,
  } from "react";
  
  export const ChatContext = createContext();
  
  export const ChatContextProvider = ({ children }) => {
 
    const INITIAL_STATE = {
      chatId: null,
    };
  
    const chatReducer = (state, action) => {
      switch (action.type) {
        case "create_chatroom":
          return {
            chatId: action.payload+'cSoQu0MDxLXA3qidA5NB87cLMFc2',    
          };
  
        default:
          return state;
      }
    };
  
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);  
    return (
      <ChatContext.Provider value={{ data:state, dispatch }}>
        {children}
      </ChatContext.Provider>
    );
  };