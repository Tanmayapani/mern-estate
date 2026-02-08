import React, { useState, useRef, useEffect, use } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateListing() {
  const navigate = useNavigate();
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  useEffect(() => {
    const fetchListingData = async () => {
      try {
        const listingId = params.id;
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError(data.message);
          return;
        }

        setFormData(data);

      } catch (error) {
        setError(error.message);
      }
    };

    fetchListingData();
  }, []);

  const handleImageChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'mern-estate');
      data.append('cloud_name', 'dbjjjrgbf');

      fetch('https://api.cloudinary.com/v1_1/dbjjjrgbf/image/upload', { 
        method: 'POST',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => resolve(data.secure_url))
        .catch((error) => reject(error));
    });
  };

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = files.map((file) => storeImage(file));

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setUploading(false);
          if (fileRef.current) fileRef.current.value = '';
        })
        .catch(() => {
          setImageUploadError('Image upload failed (2mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({ ...formData, type: e.target.id });
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }

    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) return setError('You must upload at least one image');
      if (formData.offer && +formData.discountPrice >= +formData.regularPrice) {
        return setError('Discount price must be lower than regular price');
      }

      setLoading(true);
      setError(false);

      const res = await fetch(`/api/listing/update/${formData._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id, // Ensure this matches your Schema
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        return;
      }
      
      // Redirect to the newly created listing
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 text-slate-800'>Update a Listing</h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-8'>
        <div className='flex flex-col gap-4 flex-1'>
          <input type='text' placeholder='Name' id='name' required onChange={handleChange} value={formData.name} className='border-2 border-slate-400 p-3 rounded-lg bg-white outline-none focus:border-slate-600' />
          <textarea placeholder='Description' id='description' required onChange={handleChange} value={formData.description} className='border-2 border-slate-400 p-3 rounded-lg bg-white outline-none focus:border-slate-600' />
          <input type='text' placeholder='Address' id='address' required onChange={handleChange} value={formData.address} className='border-2 border-slate-400 p-3 rounded-lg bg-white outline-none focus:border-slate-600' />

          <div className='flex gap-6 flex-wrap font-medium text-slate-700 mt-2'>
            <div className='flex gap-2 items-center'>
              <input type="checkbox" id="sale" className='w-5 h-5 accent-slate-700' onChange={handleChange} checked={formData.type === 'sale'} />
              <span>Sell</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="checkbox" id="rent" className='w-5 h-5 accent-slate-700' onChange={handleChange} checked={formData.type === 'rent'} />
              <span>Rent</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="checkbox" id="parking" className='w-5 h-5 accent-slate-700' onChange={handleChange} checked={formData.parking} />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="checkbox" id="furnished" className='w-5 h-5 accent-slate-700' onChange={handleChange} checked={formData.furnished} />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="checkbox" id="offer" className='w-5 h-5 accent-slate-700' onChange={handleChange} checked={formData.offer} />
              <span>Offer</span>
            </div>
          </div>

          <div className='flex flex-wrap gap-6 mt-2'>
            <div className='flex items-center gap-2'>
              <input type="number" id='bedrooms' min='1' max='10' required onChange={handleChange} value={formData.bedrooms} className='p-3 border-2 border-slate-400 rounded-lg w-20' />
              <p className='font-semibold text-slate-700'>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type="number" id='bathrooms' min='1' max='10' required onChange={handleChange} value={formData.bathrooms} className='p-3 border-2 border-slate-400 rounded-lg w-20' />
              <p className='font-semibold text-slate-700'>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type="number" id='regularPrice' min='50' max='100000000' required onChange={handleChange} value={formData.regularPrice} className='p-3 border-2 border-slate-400 rounded-lg w-32' />
              <div className='flex flex-col items-center'>
                <p className='font-semibold text-slate-700'>Regular price</p>
                <span className='text-xs text-slate-500'>(₹ / Month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input type="number" id='discountPrice' min='0' max='100000000' required onChange={handleChange} value={formData.discountPrice} className='p-3 border-2 border-slate-400 rounded-lg w-32' />
                <div className='flex flex-col items-center'>
                  <p className='font-semibold text-slate-700'>Discount price</p>
                  <span className='text-xs text-slate-500'>(₹ / Month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className='font-semibold text-slate-800'>Images: <span className='font-normal text-slate-600 ml-2 text-sm'>The first image will be the cover (max 6)</span></p>
          <div className="flex gap-4">
            <input ref={fileRef} onChange={handleImageChange} type="file" id='images' accept='image/*' multiple className='p-3 border-2 border-slate-400 rounded-lg w-full bg-white cursor-pointer file:bg-slate-200 file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:font-semibold' />
            <button type='button' disabled={uploading} onClick={handleImageSubmit} className='p-3 text-green-700 border-2 border-green-700 rounded-lg uppercase font-semibold hover:bg-green-50 disabled:opacity-80'>{uploading ? 'Uploading...' : 'Upload'}</button>
          </div>
          {imageUploadError && <p className='text-red-700 text-sm font-semibold'>{imageUploadError}</p>}
          {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
            <div key={url} className='flex justify-between p-3 border-2 border-slate-300 items-center rounded-lg bg-white shadow-sm'>
              <img src={url} alt='listing' className='w-20 h-20 object-contain rounded-lg' />
              <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 font-semibold uppercase hover:bg-red-50 rounded-lg'>Delete</button>
            </div>
          ))}
          <button disabled={loading || uploading} className='p-4 bg-slate-700 text-white rounded-lg uppercase font-semibold text-md hover:bg-slate-800 disabled:opacity-80 mt-2'>
            {loading ? 'Updating...' : 'Update Listing'}
          </button>
          {error && <p className='text-red-700 text-sm font-semibold mt-2'>{error}</p>}
        </div>
      </form>
    </main>
  );
}