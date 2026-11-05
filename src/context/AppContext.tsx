import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
// import { useNavigate } from "react-router-dom";
type User = {
  id: string;
  email: string;
  name: string;
};

type Org = {
  id: string;
  name: string;
  slug: string;
  role: string;
};

type AppContextType = {
  user: User | null;
  token: string | null;
  org: Org | null;    
  login: (user: User, token: string) => void;
  logout: () => void;
  setOrg: (org: Org) => void;   
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    //  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    // return storedUser ? JSON.parse(storedUser) : null;

     if (storedUser && storedUser !== "undefined") {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error("Failed to parse stored user JSON:", e);
      // Optionally remove the malformed item to prevent future errors
      localStorage.removeItem("user");
      return null;
    }
  }
  return null;
});


  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    //  console.log("user",user,"Token",token)
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
// // alert("triggered")
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     // navigate('/login')
//   };

  const logout = () => {
  setUser(null);
  setToken(null);
  setOrgState(null);

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("org");
  localStorage.removeItem("orgId");
};

  const [org, setOrgState] = useState<Org | null>(() => {
  const storedOrg = localStorage.getItem("org");

  if (storedOrg && storedOrg !== "undefined") {
    try {
      return JSON.parse(storedOrg);
    } catch {
      localStorage.removeItem("org");
      return null;
    }
  }
  return null;
});

const setOrg = (org: Org) => {
  setOrgState(org);

  localStorage.setItem("org", JSON.stringify(org));
  localStorage.setItem("orgId", org.id); // for API interceptor
};

  return (
    <AppContext.Provider value={{ user, token, login, logout, org, setOrg }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
};

