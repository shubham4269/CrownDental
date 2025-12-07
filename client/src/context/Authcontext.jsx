import React, { createContext, useContext, useState, useEffect } from "react";
const Authcontext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loginUser = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);

    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <Authcontext.Provider
      value={{
        user,
        token,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </Authcontext.Provider>
  );
};

export const useAuth = () => useContext(Authcontext);
