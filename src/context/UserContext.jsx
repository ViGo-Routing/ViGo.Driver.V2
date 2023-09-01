import React, { createContext, useState } from "react";
import { useStateCallback } from "../hooks/useStateCallbackHook";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useStateCallback(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
