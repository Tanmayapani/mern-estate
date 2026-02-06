import React, { useState } from 'react';

export default function CreateListing() {
  // 1. Create a state to track the 'Offer' checkbox
  const [offer, setOffer] = useState(false);

  const handleOfferChange = (e) => {
    setOffer(e.target.checked);
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>
      <form className='flex flex-col sm:flex-row gap-8'>
        
        {/* Left Side */}
        <div className='flex flex-col gap-4 flex-1'>
          <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength={62} minLength={10} required />
          <textarea placeholder='Description' className='border p-3 rounded-lg' id='description' required />
          <input type='text' placeholder='Address' className='border p-3 rounded-lg' id='address' required />

          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'><input type="checkbox" id="sale" className='w-5' /><span>Sell</span></div>
            <div className='flex gap-2'><input type="checkbox" id="rent" className='w-5' /><span>Rent</span></div>
            <div className='flex gap-2'><input type="checkbox" id="parking" className='w-5' /><span>Parking spot</span></div>
            <div className='flex gap-2'><input type="checkbox" id="furnished" className='w-5' /><span>Furnished</span></div>
            {/* 2. Attach the onChange handler to 'Offer' */}
            <div className='flex gap-2'>
              <input 
                type="checkbox" 
                id="offer" 
                className='w-5' 
                onChange={handleOfferChange} 
                checked={offer}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input type="number" id='bedrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type="number" id='bathrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type="number" id='regularPrice' min='50' max='1000000' required className='p-3 border border-gray-300 rounded-lg' />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                <span className='text-xs'>(₹ / Month)</span>
              </div>
            </div>

            {/* 3. Conditionally render the Discounted Price field */}
            {offer && (
              <div className='flex items-center gap-2'>
                <input type="number" id='discountPrice' min='0' max='1000000' required className='p-3 border border-gray-300 rounded-lg' />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>
                  <span className='text-xs'>(₹ / Month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col flex-1 gap-4">
          <p className='font-semibold'>Images:
            <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
          </p>
          
          <div className="flex gap-4">
            <input 
                className='p-3 border border-gray-300 rounded w-full 
                file:bg-gray-200 file:border file:border-gray-400 
                file:rounded file:px-4 file:py-1 file:mr-4 
                file:text-sm file:font-medium file:text-gray-700
                hover:file:bg-gray-300' 
                type="file" 
                id='images' 
                accept='image/*' 
                multiple 
            />
            <button 
              type='button'
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              Upload
            </button>
          </div>

          <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}