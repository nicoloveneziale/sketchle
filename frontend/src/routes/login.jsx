import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PuffLoader } from "react-spinners";
import api from "../api/axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  // Stores the token from the backend to validate the user across the site
  const { login } = useAuth();


  // Asynchronous event handler for the submit button
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors([]);
        try {
            const response = await api.post("/auth/login", {
                username,
                password
            });
            if (response.data.token) {
                login(response.data.token);
                navigate("/")
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setErrors(Array.isArray(err.response.data) ? err.response.data : [{msg: "Login failed"}]);

            } else {
                setErrors([{ msg: "Server is unreachable"}]);
            } 
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className="bpy-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-md mx-auto glass not-odd:shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Log In
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
                placeholder="Enter your username"
                className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="blocktext-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? <PuffLoader color="#fff" size={20} /> : "Log In"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm">
              Don't have an account?
              <Link
                to="/register"
                className="text-indigo-500 hover:text-indigo-700 font-medium ml-1 transition duration-200"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}