import { useState, useEffect } from 'react'
import authService from '../appwrite/auth'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import { Button, Input } from './index.js'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const { register, handleSubmit, watch, formState: { errors } } = useForm()

    // Track validation state for password
    const [passwordValidation, setPasswordValidation] = useState({
        hasUpperCase: false,
        hasNumber: false,
        hasSpecialChar: false,
        minLength: false
    })

    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false)

    // Track whether the password field has been touched (triggered)
    const [isPasswordTouched, setIsPasswordTouched] = useState(false)

    const create = async (data) => {
        setError("")
        try {
            const userData = await authService.createAccount(data)
            if (userData) {
                const userData = authService.getCurrentUser()
                if (userData) dispatch(login(userData))
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

    // Watch the password field for real-time updates
    const password = watch('password', '')

    // Use useEffect to update the password validation state as the user types
    useEffect(() => {
        setPasswordValidation({
            hasUpperCase: /[A-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[@$!%*?&#]/.test(password),
            minLength: password.length >= 6
        })
    }, [password])

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <section>
            <div className="flex items-center justify-center px-4 py-15 sm:px-6 sm:py-16 lg:px-8 lg:py-10">
                <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
                    <h2 className="text-center text-2xl font-bold leading-tight text-black">
                        Sign up to create account
                    </h2>
                    <p className="mt-2 text-center text-base text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-primary transition-all duration-200 hover:underline">
                            Sign In
                        </Link>
                    </p>
                    <form onSubmit={handleSubmit(create)} className="mt-8">
                        <div className="space-y-5">
                            <div>
                                <Input
                                    placeholder="Enter your full name"
                                    {...register("name", { required: true })}
                                />
                            </div>
                            <div>
                                <Input
                                    placeholder="Enter your email"
                                    type="email"
                                    autoComplete="new-email"
                                    {...register("email", {
                                        required: true,
                                        pattern: {
                                            value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                            message: "Email address must be a valid address"
                                        }
                                    })}
                                />
                                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                            </div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    autoComplete="new-password"
                                    {...register("password", {
                                        required: true,
                                    })}
                                    // Set isPasswordTouched to true when the user focuses on the password field
                                    onFocus={() => setIsPasswordTouched(true)}
                                    onBlur={() => setIsPasswordTouched(false)}
                                    
                                />
                                {/* Eye Icon for toggling visibility */}
                                <span
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-3 cursor-pointer text-gray-500"
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </span>

                                {/* Password Validation Messages (only show when the password field is triggered) */}
                                {isPasswordTouched && (
                                    <ul className="text-sm text-gray-600 mt-2 flex flex-col items-start space-y-2">
                                        <li className={passwordValidation.minLength ? 'text-green-500' : 'text-red-500'}>
                                            Password must be at least 6 characters long
                                        </li>
                                        <li className={passwordValidation.hasUpperCase ? 'text-green-500' : 'text-red-500'}>
                                            Password must contain at least one uppercase letter
                                        </li>
                                        <li className={passwordValidation.hasNumber ? 'text-green-500' : 'text-red-500'}>
                                            Password must contain at least one number
                                        </li>
                                        <li className={passwordValidation.hasSpecialChar ? 'text-green-500' : 'text-red-500'}>
                                            Password must contain at least one special character
                                        </li>
                                    </ul>
                                )}
                            </div>
                            <div>
                                <Button type="submit" className='w-full'>
                                    Create Account
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Signup




//   <div className= "flex items-center justify-center">
//             <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
//             <div className="mb-2 flex justify-center">
//                     <span className="inline-block w-full max-w-[100px]">
//                         <Logo width="100%" />
//                     </span>
//                 </div>
//                 <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
//                 <p className="mt-2 text-center text-base text-black/60">
//                     Already have an account?&nbsp;
//                     <Link
//                         to="/login"
//                         className="font-medium text-primary transition-all duration-200 hover:underline"
//                     >
//                         Sign In
//                     </Link>
//                 </p>
//                 {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

//                 <form onSubmit={handleSubmit(create)}>
//                     <div className='space-y-5'>
//                         <Input
//                         label="Full Name: "
//                         placeholder="Enter your full name"
//                         {...register("name", {
//                             required: true,
//                         })}
//                         />
//                         <Input
//                         label="Email: "
//                         placeholder="Enter your email"
//                         type="email"
//                         {...register("email", {
//                             required: true,
//                             validate: {
//                                 matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
//                                 "Email address must be a valid address",
//                             }
//                         })}
//                         />
//                         <Input
//                         label="Password: "
//                         type="password"
//                         placeholder="Enter your password"
//                         {...register("password", {
//                             required: true,})}
//                         />
//                         <Button type="submit" className="w-full">
//                             Create Account
//                         </Button>
//                     </div>
//                 </form>
//             </div>

//         </div>



// import { useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import authService from "../appwrite/auth"
// import  { login } from "../store/authSlice"
// import Button from "./Button"
// import Input from "./Input"
// import Logo from "./Logo"
// import { useForm } from "react-hook-form"
// import { useDispatch } from "react-redux"



// function Signup() {
// const navigate = useNavigate();
// const dispatch = useDispatch();
// const { register, handleSubmit } = useForm()
// const [error, setError] = useState('')

// const create = async (data) => {
//     setError("")
// try {
//     const signUpData = await authService.createAccount(data)
//     if (signUpData) {
//         const userData = await authService.getCurrentUser();
//         if (userData) dispatch(login(userData))
//             navigate("/") 
// }
// }

// catch (error) {
//     setError("this is error")
// }
//     }

//     return(
//         <div className="flex flex-wrap">
// <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
//             <div className="mb-2 flex justify-center">
//                     <span className="inline-block w-full max-w-[100px]">
//                         <Logo width="100%" />
//                     </span>
//                 </div>
//                 <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
//                 <p className="mt-2 text-center text-base text-black/60">
//                     Already have an account?&nbsp;
//                     <Link
//                         to="/login"
//                         className="font-medium text-primary transition-all duration-200 hover:underline"
//                     >
//                         Sign In
//                     </Link>
//                 </p>
//                 {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

//                 <form onSubmit={handleSubmit(create)}>
//                     <div className='space-y-5'>
//                         <Input
//                         label="Full Name: "
//                         className = "w-full px-2"
//                         placeholder="Enter your full name"
//                         {...register("name", {
//                             required: true,
//                         })}
//                         />
//                         <Input
//                         label="Email: "
//                         placeholder="Enter your email"
//                         className = "w-full px-2"
//                         type="email"
//                         {...register("email", {
//                             required: true,
//                             validate: {
//                                 matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
//                                 "Email address must be a valid address",
//                             }
//                         })}
//                         />
//                         <Input
//                         label="Password: "
//                         type="password"
//                         className = "w-full px-2"
//                         placeholder="Enter your password"
//                         {...register("password", {
//                             required: true,})}
//                         />
//                         <Button type="submit" className="w-full">
//                             Create Account
//                         </Button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default Signup


// const navigate = useNavigate()
// const [error, setError] = useState("")
// const dispatch = useDispatch();
// const {register, handleSubmit} = useForm()

// const create =  async (data) =>{
//     setError("")     

// try {
//     const userData = await authService.createAccount(data)
//     if (userData) {
//         const userData =  await authService.getCurrentUser()
//         if (userData) dispatch(login(userData))
//             navigate("/")
//     }
// } catch (error) {
//     setError(error)
// }
// }

// return (
    
// )
