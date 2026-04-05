import { createContext, useContext, useEffect, useState } from "react";

// The "Global Store" for our authentication data
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // State to hold the user's login token and username.
    // We check localStorage for both so the user stays logged in and recognized after a refresh.
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [username, setUsername] = useState(localStorage.getItem("username"));

    // This runs once when the app starts to ensure our state matches the browser's storage
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUsername = localStorage.getItem("username");
        if (storedToken) {
            setToken(storedToken);
        }
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    // Function to handle login: saves the token and username to the browser and updates our app's state
    const login = (newToken, newUser) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("username", newUser);
        setToken(newToken);
        setUsername(newUser);
    };

    // Function to handle logout: clears all browser storage and resets our app's state
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setToken(null);
        setUsername(null);
    };

    // We wrap the entire app in this "Provider" so every component can access these values
    // Added 'username' to the value object so other components can use it
    return (
        <AuthContext.Provider value={{ token, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// A custom "Hook" that other components will use to grab the login/logout functions easily
export const useAuth = () => useContext(AuthContext);