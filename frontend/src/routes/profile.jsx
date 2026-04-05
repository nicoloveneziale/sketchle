import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { PuffLoader } from "react-spinners";

export default function Profile() {
  const { username: urlUsername } = useParams();
  
  const { username: loggedInUser, token } = useAuth();

  const [profile, setProfile] = useState(null);
  const [drawings, setDrawings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwnProfile = loggedInUser === urlUsername;

  useEffect(() => {
    const fetchProfileData = async () => {
        setIsLoading(true);
        try {
            const profileRes = await api.get(`/profiles/${urlUsername}`);
            setProfile(profileRes.data);

            try {
                const drawingsRes = await api.get(`/drawings/user/${urlUsername}`);
                setDrawings(drawingsRes.data);
            } catch (postErr) {
                console.warn("Posts not found or endpoint incorrect:", postErr);
                setDrawings([]); 
            }

        } catch (err) {
            console.error("Error fetching profile:", err);
            setError("Could not load profile. It might not exist yet!");
        } finally {
            setIsLoading(false);
        }
    };

    if (urlUsername) {
        fetchProfileData();
    }
    }, [urlUsername]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PuffLoader color="#8b5cf6" size={60} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500 font-bold">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="glass rounded-xl p-8 mb-8 shadow-lg">
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 bg-purple-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">
            {urlUsername?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{urlUsername}</h1>
            <p className="text-gray-400 mt-2">{profile?.bio || "No bio yet..."}</p>
            {isOwnProfile && (
              <button className="mt-4 text-sm bg-purple-600 hover:bg-purple-700 text-white py-1 px-4 rounded-full transition">
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User's Previous Posts */}
      <h2 className="text-xl font-semibold mb-4 ml-2">Previous Drawings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drawings.length > 0 ? (
          drawings.map((drawing) => (
            <div key={drawing.id} className="glass rounded-lg overflow-hidden border border-gray-700 hover:scale-105 transition-transform duration-200">
              <img 
                src={drawing.drawingUrl} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg truncate">{drawing.theme.word}</h3>
                <p className="text-xs text-gray-500">{new Date(drawing.submittedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic ml-2">This user hasn't posted any masterpieces yet.</p>
        )}
      </div>
    </div>
  );
}