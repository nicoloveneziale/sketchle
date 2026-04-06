import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { PuffLoader } from "react-spinners";

export default function Profile() {
  const { username: urlUsername } = useParams();
  
  const { username: loggedInUser, token, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [drawings, setDrawings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [editUsername, setEditUsername] = useState(urlUsername);
  const [editBio, setEditBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isOwnProfile = loggedInUser === urlUsername;

   const getBadgeCounts = () => {
    if (!profile?.badges) return {};
    return profile.badges.reduce((acc, badge) => {
        const type = badge.split(' ')[0]; 
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});
  };

  const badgeCounts = getBadgeCounts();

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await api.put("/profiles/update", {
        username: editUsername,
        bio: editBio
      }, {headers: { Authorization: `Bearer ${token}` }})

      if (editUsername !== loggedInUser) {
        alert("Username changed! Please log in again for security.");
        navigate("/login");
        logout()
      } else {
        setProfile({ ...profile, bio: editBio });
        setIsEditing(false);
      }
    } catch (err) {
      alert(err.response?.data || "Update failed");
      setEditUsername(urlUsername)
      setEditBio(profile?.bio)
    }
    setIsSaving(false);
  } 

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
      <div className="glass rounded-xl p-8 mb-8 shadow-lg">
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 bg-purple-500 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {urlUsername?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  className="bg-gray-800 border border-gray-600 rounded px-3 py-2 w-full text-white focus:outline-none focus:border-purple-500"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                />
                <textarea
                  className="bg-gray-800 border border-gray-600 rounded px-3 py-2 w-full text-gray-300 focus:outline-none focus:border-purple-500 h-24"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-1.5 rounded-full text-sm font-bold transition disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-1.5 rounded-full text-sm font-bold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-white">{urlUsername}</h1>
                <p className="text-gray-400 mt-2">
                  {profile?.bio || "No bio yet..."}
                </p>
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 text-sm bg-purple-600 hover:bg-purple-700 text-white py-1.5 px-6 rounded-full font-bold transition shadow-md"
                  >
                    Edit Profile
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4 mb-8">
          {Object.entries(badgeCounts).map(([type, count]) => (
              <div key={type} className="flex items-center bg-gray-800/50 px-3 py-1 rounded-full border border-gray-600">
                  <span className={`w-3 h-3 rounded-full mr-2 ${
                      type === 'Gold' ? 'bg-yellow-400 shadow-[0_0_8px_#facc15]' : 
                      type === 'Silver' ? 'bg-gray-300 shadow-[0_0_8px_#d1d5db]' : 
                      type === 'Bronze' ? 'bg-orange-500 shadow-[0_0_8px_#f97316]' :
                      type === 'top10' ? 'bg-purple-500 shadow-[0_0_8px_#a855f7]' :
                      'bg-pink-500 shadow-[0_0_8px_#ec4899]'
                  }`}></span>
                  <span className="text-xs font-bold text-gray-200">
                      {type} <span className="text-purple-400 ml-1">x{count}</span>
                  </span>
              </div>
          ))}
      </div>

      <h2 className="text-xl font-semibold mb-4 ml-2">Previous Drawings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-5">
        {drawings.length > 0 ? (
          drawings.map((drawing) => {
            const matchingBadge = profile?.badges?.find(b => b.includes(drawing.theme.date));
            const badgeType = matchingBadge?.split(' ')[0];

            return (
              <div key={drawing.id} className="relative glass rounded-lg overflow-hidden border border-gray-700">
                  {badgeType && (
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter shadow-lg z-10 ${
                          badgeType === 'Gold' ? 'bg-yellow-500 text-black' : 
                          badgeType === 'Silver' ? 'bg-gray-300 text-black' : 
                          badgeType === 'Bronze' ? 'bg-orange-600 text-white' :
                          'bg-purple-600 text-white'
                      }`}>
                        🏆 {badgeType} Winner
                      </div>
                  )}

                  <img src={drawing.drawingUrl} className="w-full aspect-square  object-cover" />
                  <div className="p-4">
                      <h3 className="font-bold text-lg truncate">{drawing.theme.word}</h3>
                      <p className="text-xs text-gray-500">{new Date(drawing.submittedAt).toLocaleDateString()}</p>
                  </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 italic ml-2">This user hasn't posted any masterpieces yet.</p>
        )}
      </div>
    </div>
  );
}