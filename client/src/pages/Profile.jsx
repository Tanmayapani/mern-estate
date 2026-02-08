import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect, use } from "react";
import { updateUserStart, updateUserSuccess, updateUserFailure, 
  deleteUserStart, deleteUserSuccess, deleteUserFailure, 
  signOutUserStart, signOutUserSuccess, signOutUserFailure } from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const cloudName = "dbjjjrgbf";
    const uploadPreset = "mern-estate";
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    try {
      setFileUploadError(false);
      setFilePerc(10);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: data }
      );
      const uploadedImage = await res.json();
      if (uploadedImage.secure_url) {
        setFilePerc(100);
        setFormData({ ...formData, avatar: uploadedImage.secure_url });
      } else {
        setFileUploadError(true);
      }
    } catch (err) {
      setFileUploadError(true);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {                                 
    e.preventDefault();
    try {
      dispatch(updateUserStart()); 
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout', { method: 'GET' });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`, { method: 'GET' });
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);

    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success === false) {
        alert('Error deleting listing');
        return;
      }
      setUserListings((prev) => prev.filter(listing => listing._id !== listingId));
    } catch (error) {
      alert('Error deleting listing');
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto flex flex-col gap-4">
      <h1 className='text-3xl font-semibold text-center my-7 text-slate-800'>Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          onChange={(e) => setFile(e.target.files[0])} 
          type="file" ref={fileRef} hidden accept="image/*"
        />

        <img 
          onClick={() => fileRef.current.click()} 
          src={formData.avatar || currentUser.avatar} 
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 border-2 border-slate-300 shadow-sm hover:shadow-md transition-shadow"
        />

        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700 font-semibold'>Error: Image upload failed</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%...`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700 font-semibold'>Image uploaded successfully!</span>
          ) : (
            ''
          )}
        </p>

        <input 
          type="text" placeholder="username" defaultValue={currentUser.username} id="username"
          className="border-2 border-slate-400 p-3 rounded-lg bg-white outline-none focus:border-slate-600 transition-all" 
          onChange={handleChange}
        />
        <input 
          type="email" placeholder="email" defaultValue={currentUser.email} id="email"
          className="border-2 border-slate-400 p-3 rounded-lg bg-white outline-none focus:border-slate-600 transition-all" 
          onChange={handleChange}
        />
        <input 
          type="password" placeholder="password" id="password"
          className="border-2 border-slate-400 p-3 rounded-lg bg-white outline-none focus:border-slate-600 transition-all" 
          onChange={handleChange}
        />
        
        <button 
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase font-semibold hover:bg-slate-800 disabled:opacity-80 transition-colors"
        >
          {loading ? 'Loading...' : 'Update Profile'}
        </button>
      </form>

      <Link 
        className="bg-green-700 text-white p-3 rounded-lg uppercase font-semibold text-center hover:bg-green-800 transition-colors" 
        to="/create-listing"
      >
        Create Listing
      </Link>

      <div className="flex justify-between mt-5 font-semibold">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer hover:underline">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer hover:underline">Sign Out</span>
      </div>
      
      {error && <p className='text-red-700 mt-5 font-semibold'>{error}</p>}
      {updateSuccess && <p className='text-green-700 mt-5 font-semibold text-center'>User updated successfully!</p>}
      <button onClick={handleShowListings} className="text-green-700 p-3 rounded-lg w-full transition-colors">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? 'Error showing listings.': ''}
      </p>

      {userListings && userListings.length > 0 && 
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-2xl font-semibold">Your Listings</h1>
          {userListings.map((listing) => (
          <div key={listing._id} className="border rounded-lg p-3 flex
          justify-between items-center gap-4">
            <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt="listing cover" 
              className="h-16 w-16 object-contain"
              />
            </Link>
            <Link className="text-slate-700 font-semibold 
              hover:underline truncate flex-1" to={`/listing/${listing._id}`}>
            <p>{listing.name}</p>
            </Link>

            <div className="flex flex-col items-center">
              <Link to={`/update-listing/${listing._id}`} className="text-green-700 uppercase mb-2">
                <button className="text-green-700 uppercase">Edit</button>
              </Link>

              <button onClick={()=>handleListingDelete(listing._id)} 
              className="text-red-700 uppercase">Delete</button>
            </div>

          </div>
        ))}
      </div>}
     
      </div>
  );
}