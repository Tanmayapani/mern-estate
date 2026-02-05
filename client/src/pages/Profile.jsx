import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { updateUserStart, updateUserSuccess, updateUserFailure, 
  deleteUserStart, deleteUserSuccess, deleteUserFailure, 
  signOutUserStart, signOutUserSuccess, signOutUserFailure } from "../redux/user/userSlice";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  
  // State for file upload and form data
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false); // To show success message after profile update  

  // Automatically start upload when a file is selected
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const cloudName = "dbjjjrgbf"; // Your Cloud Name
    const uploadPreset = "mern-estate"; // The 'Unsigned' preset you created

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    try {
      setFileUploadError(false);
      setFilePerc(10); // Show user that upload has started

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      
      const uploadedImage = await res.json();
      
      if (uploadedImage.secure_url) {
        setFilePerc(100);
        // Save the Cloudinary URL to formData so it can be sent to MongoDB
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
        headers: {
          'Content-Type': 'application/json', 
        },
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
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } 
    catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout', {
        method: 'GET',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Hidden file input */}
        <input 
          onChange={(e) => setFile(e.target.files[0])} 
          type="file" 
          ref={fileRef} 
          hidden 
          accept="image/*"
        />

        {/* Profile Image - Click to trigger file input */}
        <img 
          onClick={() => fileRef.current.click()} 
          src={formData.avatar || currentUser.avatar} 
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        {/* Upload Status Feedback */}
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>Error: Image upload failed</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%...`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image uploaded successfully!</span>
          ) : (
            ''
          )}
        </p>

        <input 
          type="text" 
          placeholder="username" 
          defaultValue={currentUser.username} 
          id="username"
          className="bg-white border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
          onChange={handleChange}
        />
        <input 
          type="email" 
          placeholder="email" 
          defaultValue={currentUser.email} 
          id="email"
          className="bg-white border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
          onChange={handleChange}
        />
        <input 
          type="password" 
          placeholder="password" 
          id="password"
          className="bg-white border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
          onChange={handleChange}
        />
        
        <button 
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Loading...' : 'update'}
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-600 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-600 cursor-pointer">Sign Out</span>
      </div>
      
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User updated successfully!' : ''}
      </p>
    </div>
  );
}