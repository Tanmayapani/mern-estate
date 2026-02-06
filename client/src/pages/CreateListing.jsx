import React, { useState, useRef, useEffect } from 'react';

export default function CreateListing() {
  const [offer, setOffer] = useState(false);
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  
  // Ref to handle the "No file chosen" reset bug
  const fileRef = useRef(null);

  // Track the array changes in the console
  useEffect(() => {
    console.log("Current imageUrls array:", imageUrls);
  }, [imageUrls]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log("Files selected:", selectedFiles);
    setFiles(selectedFiles);
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'mern-estate');
      formData.append('cloud_name', 'dbjjjrgbf');

      fetch('https://api.cloudinary.com/v1_1/dbjjjrgbf/image/upload', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => resolve(data.secure_url))
        .catch((error) => reject(error));
    });
  };

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          console.log("Newly uploaded URLs:", urls);
          setImageUrls(imageUrls.concat(urls));
          setImageUploadError(false);
          setUploading(false);
          // Clear file input text after upload
          if (fileRef.current) fileRef.current.value = '';
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    console.log("Removing image at index:", index);
    setImageUrls(imageUrls.filter((_, i) => i !== index));
    // Clear file input text so it shows "No file chosen"
    if (fileRef.current) {
      fileRef.current.value = '';
    }
    setFiles([]);
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 text-slate-800'>
        Create Listing
      </h1>
      <form className='flex flex-col sm:flex-row gap-8'>
        
        {/* Left Column: Text Details */}
        <div className='flex flex-col gap-4 flex-1'>
          <input 
            type='text' placeholder='Name' id='name' required
            className='border-2 border-slate-400 p-3 rounded-lg bg-white outline-none focus:border-slate-600' 
          />
          <textarea 
            placeholder='Description' id='description' required 
            className='border-2 border-slate-400 p-3 rounded-lg bg-white outline-none focus:border-slate-600' 
          />
          <input 
            type='text' placeholder='Address' id='address' required 
            className='border-2 border-slate-400 p-3 rounded-lg bg-white outline-none focus:border-slate-600' 
          />

          <div className='flex gap-6 flex-wrap font-medium text-slate-700 mt-2'>
            <div className='flex gap-2 items-center'>
              <input type="checkbox" id="sale" className='w-5 h-5 accent-slate-700' />
              <span>Sell</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="checkbox" id="rent" className='w-5 h-5 accent-slate-700' />
              <span>Rent</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="checkbox" id="parking" className='w-5 h-5 accent-slate-700' />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="checkbox" id="furnished" className='w-5 h-5 accent-slate-700' />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input 
                type="checkbox" id="offer" className='w-5 h-5 accent-slate-700' 
                onChange={(e) => setOffer(e.target.checked)}
                checked={offer}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className='flex flex-wrap gap-6 mt-2'>
            <div className='flex items-center gap-2'>
              <input type="number" id='bedrooms' min='1' max='10' required className='p-3 border-2 border-slate-400 rounded-lg w-20' />
              <p className='font-semibold text-slate-700'>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type="number" id='bathrooms' min='1' max='10' required className='p-3 border-2 border-slate-400 rounded-lg w-20' />
              <p className='font-semibold text-slate-700'>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type="number" id='regularPrice' min='50' max='10000000' required className='p-3 border-2 border-slate-400 rounded-lg w-32' />
              <div className='flex flex-col items-center'>
                <p className='font-semibold text-slate-700'>Regular price</p>
                <span className='text-xs text-slate-500'>(₹ / Month)</span>
              </div>
            </div>

            {offer && (
              <div className='flex items-center gap-2'>
                <input type="number" id='discountPrice' min='0' max='10000000' required className='p-3 border-2 border-slate-400 rounded-lg w-32' />
                <div className='flex flex-col items-center'>
                  <p className='font-semibold text-slate-700'>Discounted price</p>
                  <span className='text-xs text-slate-500'>(₹ / Month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Images & Upload */}
        <div className="flex flex-col flex-1 gap-4">
          <p className='font-semibold text-slate-800'>
            Images: 
            <span className='font-normal text-slate-600 ml-2 text-sm'>The first image will be the cover (max 6)</span>
          </p>
          
          <div className="flex gap-4">
            <input 
              ref={fileRef}
              onChange={handleImageChange}
              className='p-3 border-2 border-slate-400 rounded-lg w-full bg-white
              cursor-pointer file:cursor-pointer file:bg-slate-200 
              file:border-0 file:rounded-md file:px-4 file:py-1 
              file:mr-4 file:font-semibold file:text-slate-700
              hover:file:shadow-sm transition-all' 
              type="file" id='images' accept='image/*' multiple 
            />
            <button 
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border-2 border-green-700 rounded-lg uppercase font-semibold hover:bg-green-50 hover:shadow-md disabled:opacity-80 transition-all'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {imageUploadError && <p className='text-red-700 text-sm font-semibold'>{imageUploadError}</p>}
          
          {/* Image Preview List */}
          {imageUrls.length > 0 && imageUrls.map((url, index) => (
            <div key={url} className='flex justify-between p-3 border-2 border-slate-300 items-center rounded-lg bg-white shadow-sm'>
              <img src={url} alt='listing' className='w-20 h-20 object-contain rounded-lg' />
              <button 
                type='button' 
                onClick={() => handleRemoveImage(index)} 
                className='p-3 text-red-700 font-semibold uppercase hover:bg-red-50 rounded-lg transition-colors'
              >
                Delete
              </button>
            </div>
          ))}

          <button className='p-4 bg-slate-700 text-white rounded-lg uppercase font-semibold text-md hover:bg-slate-800 transition-all shadow-md disabled:opacity-80 mt-2'>
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}