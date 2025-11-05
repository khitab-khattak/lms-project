import { createContext, useState } from "react";

export const AuthContext = createContext();


export const AuthProvider = ({children})=>{
const userInfo = localStorage.getItem('userInfolms');
const [user, setUser] = useState(userInfo);
const login = (user)=>{

    setUser(user);
}
const logout = ()=>{
    localStorage.removeItem('userInfolms')
    setUser(null);
}
return <AuthContext.Provider value={{user,login,logout}}>
    {children}
</AuthContext.Provider>

}