import { useState, useEffect } from 'react'; // Added useEffect
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'; // Ensure you have a 'resetError' action if possible
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // FIX: Clear the error when the component mounts
  useEffect(() => {
    dispatch(signInFailure(null)); // This clears the global error state on load
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Optional: Clear error as soon as user starts typing again
    if (error) dispatch(signInFailure(null));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 text-slate-800'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
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
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-2 mt-5 font-medium">
        <p className='text-slate-700'>Don't have an account?</p>
        <Link to="/sign-up">
          <span className='text-blue-600 hover:underline'>Sign Up</span>
        </Link>
      </div>
      {/* The error now only shows if 'error' is actually present and not null */}
      {error && <p className='text-red-700 mt-5 font-semibold text-center'>{error}</p>}
    </div>
  );
}