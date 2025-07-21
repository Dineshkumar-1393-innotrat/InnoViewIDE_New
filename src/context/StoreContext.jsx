import { createContext, useState } from 'react';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <StoreContext.Provider value={{ token, setToken, url: "https://eureka.innotrat.in/api/v1/auth/signup" }}>
      {children}
    </StoreContext.Provider>
  );
};
