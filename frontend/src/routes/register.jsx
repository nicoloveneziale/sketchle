import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { PuffLoader } from "react-spinners";

export default function Register() {
    // Temporary storage states for the web page
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    
    // Stores the token from the backend to validate the user across the site
    const { login } = useAuth();

    // Asynchronous event handler for the submit button
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors([]);
        try {
            const response = await api.post("/auth/register", {
                username,
                password
            });
            if (response.data.token) {
                login(response.data.token, username);
                await api.post("/profiles/create", 
                    { bio: `Hello! I'm ${username}.` }, 
                    { headers: { Authorization: `Bearer ${response.data.token}` } }
                );
                navigate("/")
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setErrors(Array.isArray(err.response.data) ? err.response.data : [{msg: "Registration failed"}]);

            } else {
                setErrors([{ msg: "Server is unreachable"}]);
            } 
        } finally {
            setIsLoading(false);
        }
    }
    
    const getFieldError = (field) => {
        const error = errors.find((err) => err.path === field);
        return error?.msg;
    };

    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto shadow-md rounded-lg overflow-hidden glass">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Register
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-bold mb-2"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Choose a username"
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
              {getFieldError("username") && (
                <p className="text-sm text-red-500 mt-1">
                  {getFieldError("username")}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              {getFieldError("password") && (
                <p className="text-sm text-red-500 mt-1">
                  {getFieldError("password")}
                </p>
              )}
            </div>
            <button
              type="submit"
              className={`bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? <PuffLoader color="#fff" size={20} /> : "Register"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm">
              Already have an account?
              <Link
                to="/login"
                className="text-purple-500 hover:text-purple-700 font-medium ml-1 transition duration-200"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}