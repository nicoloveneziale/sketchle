import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { PuffLoader } from "react-spinners";
import logoSecondary from "../assets/logo-secondary.svg";

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
                setErrors([err.response.data]);
            } else {
                setErrors(["Server is unreachable"]);
            } 
        } finally {
            setIsLoading(false);
        }
    }

    return (
      <div className="pt-5 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="hidden md:block mb-8">
          <img 
            src={logoSecondary} 
            alt="Sketchle Logo" 
            className="h-35 w-auto mr-5 invert drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]"
          />
        </div>

        <div className="max-w-md w-full glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="px-8 py-2 md:py-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center brutal-text text-gradient">
              Join Sketchle
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6 text-sm md:text-m">
              <div>
                <label htmlFor="username" className="block text-xs uppercase tracking-widest font-bold mb-2 text-slate-400">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-xs uppercase tracking-widest font-bold mb-2 text-slate-400">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <>
                {errors.length > 0 && 
                    errors.map((err, index) => (
                      <p key={index} className="text-xs text-red-400 mt-2 font-bold ml-1">
                      {err}
                      </p>
                    )
                    )
                }
                </>
              </div>

              <button
                type="submit"
                className={`bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl w-full transition-all shadow-lg shadow-indigo-500/25 flex justify-center items-center ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? <PuffLoader color="#fff" size={20} /> : "CREATE ACCOUNT"}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-white/5 pt-6">
              <p className="text-slate-400 text-sm">
                Already part of the community?
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold ml-2 transition-colors">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
}