import "./Profile.css";
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setDisplayName(user.displayName || "");
                setPhotoURL(user.photoURL || "https://picsum.photos/200");
                setLoading(false);
            } else {
                navigate("/"); // Redirect to login page if not signed in
            }
        });

        return () => {
            unsubscribe();
        };
    }, [auth, navigate]);

    // const handleSignOut = async () => {
    //     try {
    //         await signOut(auth);
    //         navigate("/login"); // Redirect to login page after sign out
    //     } catch (error) {
    //         console.error("Error signing out: ", error);
    //         setError("Failed to sign out. Please try again.");
    //     }
    // };

    // const handleUpdateProfile = async () => {
    //     try {
    //         await updateProfile(auth.currentUser, { displayName, photoURL });
    //         setUser({ ...auth.currentUser });
    //         setError(null);
    //     } catch (error) {
    //         console.error("Error updating profile: ", error);
    //         setError("Failed to update profile. Please try again.");
    //     }
    // };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="profile">
            <div className="profileContent">
                <h3>Profile</h3>
                {error && <p className="error">{error}</p>}
                <div className="profile-info">
                    {photoURL && <img src={photoURL} alt="Profile" className="profile-photo" />}
                    <div className="profile-field">
                        <label>Name:</label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </div>
                    <div className="profile-field">
                        <label>Email:</label>
                        <p>{user.email}</p>
                    </div>
                    {/* <div className="profile-field">
                        <label>Profile Picture URL:</label>
                        <input
                            type="text"
                            value={photoURL}
                            onChange={(e) => setPhotoURL(e.target.value)}
                        />
                    </div> */}
                    <div className="profile-field">
                        <label>Account Created:</label>
                        <p>{new Date(user.metadata.creationTime).toLocaleDateString()}</p>
                    </div>
                </div>
                {/* <button className="update-button" onClick={handleUpdateProfile}>Update Profile</button> */}
            </div>
        </div>
    );
};

export default Profile;
