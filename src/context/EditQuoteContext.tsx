'use client'

import { createContext, useState } from "react";
import { handleUpdateQuotes } from "../components/comparison/utils/updateQuotes";

export const EditQuoteContext = createContext({isEditing: false, editedQuotes: [], setEditedQuotes: (quotes: any) => {}});

type EditQuoteContextProviderProps = {
    children: React.ReactNode;
    value: {isEditing: boolean, quotes: any; clientId: number};
    
}
export const EditQuoteContextProvider = ({children, value}: EditQuoteContextProviderProps) => {
    const [editedQuotes, setEditedQuotes] = useState(value.quotes);
    const {isEditing} = value;
    const [prevIsEditing, setPrevIsEditing] = useState<boolean>(isEditing);


    console.log('edit', prevIsEditing, isEditing, editedQuotes)
    if (prevIsEditing !== isEditing) {
        setPrevIsEditing(isEditing);
        if (prevIsEditing === true) {
        console.log("WOEIFJWOIEJF");
        handleUpdateQuotes(editedQuotes, value.clientId);
        }
    }



    return <EditQuoteContext.Provider value = {{editedQuotes, setEditedQuotes, ...value}}>
        {children}
    </EditQuoteContext.Provider>

}
