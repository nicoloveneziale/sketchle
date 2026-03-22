import { createContext, useContext, useEffect, useState } from "react";

// The "Global Store" for our authentication data
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // State to hold the user's login token. 
    // We check localStorage first so the user stays logged in after a page refresh.
    const [token, setToken] = useState(localStorage.getItem("token"));

    // This runs once when the app starts to ensure our state matches the browser's storage
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // Function to handle login: saves the token to the browser and updates our app's state
    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    // Function to handle logout: clears the browser storage and resets our app's state
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    // We wrap the entire app in this "Provider" so every component can access these values
    return (
        <AuthContext.Provider value={{ token, setToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// A custom "Hook" that other components will use to grab the login/logout functions easily
export const useAuth = () => useContext(AuthContext);