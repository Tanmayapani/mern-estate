import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react'; 
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null); 
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 text-slate-800'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input 
          type="text" placeholder='username' id='username' 
          className='border-2 border-slate-400 p-3 rounded-lg bg-white outline-none focus:border-slate-600 transition-all' 
          onChange={handleChange}
        />
        <input 
          type="email" placeholder='email' id='email' 
          className='border-2 border-slate-400 p-3 rounded-lg bg-white outline-none focus:border-slate-600 transition-all' 
          onChange={handleChange}
        />
        <input 
          type="password" placeholder='password' id='password' 
          className='border-2 border-slate-400 p-3 rounded-lg bg-white outline-none focus:border-slate-600 transition-all' 
          onChange={handleChange}
        />

        <button 
          disabled={loading} 
          className='bg-slate-700 text-white p-3 rounded-lg uppercase font-semibold hover:bg-slate-800 disabled:opacity-80 transition-all shadow-sm hover:shadow-md'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-2 mt-5 font-medium">
        <p className='text-slate-700'>Have an account?</p>
        <Link to="/sign-in">
          <span className='text-blue-600 hover:underline'>Sign In</span>
        </Link>
      </div>
      {error && <p className='text-red-700 mt-5 font-semibold'>{error}</p>}
    </div>
  );
}