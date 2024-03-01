import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";

type SnackBarContextProps = {
  setSnackbar: Dispatch<SetStateAction<any>> | null;
};

// Create a context
export const SnackBarContext = createContext<SnackBarContextProps>({
  setSnackbar: null,
});
