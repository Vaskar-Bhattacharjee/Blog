iimport { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from '../store/authSlice';
import { Button, Input } from './index';
import service from '../appwrite/auth';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const login = async (data) => {
    try {
      setError(''); // Reset error state before each login attempt
      const session = await service.login({ ...data });
      
      if (session) {
        const userData = await service.getCurrentUser();
        if (userData) dispatch(authLogin(userData));
        navigate('/');
      }
    } catch (err) {
      console.log('Error check: Incorrect email or password. Please try again.');
      setError('Incorrect email or password. Please try again.');
    }
  };

  return (
    <section>
      <div className="flex items-center justify-center px-4 py-15 sm:px-6 sm:py-16 lg:px-8 lg:py-10 sm:mb-3">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md mt-4">
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Log In to your account
          </h2>
          <p className="mt-0 text-center text-base text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-primary transition-all duration-200 hover:underline"
            >
              Sign Up
            </Link>
          </p>
          <form onSubmit={handleSubmit(login)} className="mt-8">
            <div className="space-y-5">
              <div>
                <div className="mt-2">
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    autoComplete="new-email"
                    {...register('email', {
                      required: 'Email is required',
                      validate: {
                        matchPattern: (value) =>
                          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                          'Email address must be a valid address',
                      },
                    })}
                  />
                </div>
              </div>
              <div>
                <div className="mt-2">
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                    })}
                  />
                </div>
              </div>
              <div>
                <Button type="submit" className="w-full">
                  Log In
                </Button>
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-center mt-4">
                {error}
              </p>
            )}
            <p className="mt-2 m-3 text-center text-base text-gray-600">
              Forget Password?{' '}
              <Link to="/password-recovery" className="font-medium text-primary transition-all duration-200 hover:underline">
                Click here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
