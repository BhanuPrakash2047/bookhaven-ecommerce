import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, User, Mail, Lock, Phone, Building, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { loginUser, clearLoginError, selectLoginLoading, selectLoginError, selectIsAuthenticated } from '../store/slices/authSlice';

const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoginLoading);
  const error = useSelector(selectLoginError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    username: '',
    fname: '',
    lname: '',
    email: '',
    phone: '',
    department: '',
    password: '',
    confirmPassword: ''
  });

  // Cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Clear errors when switching forms
  useEffect(() => {
    dispatch(clearLoginError());
  }, [isLogin, dispatch]);

  const handleLoginSubmit = async () => {
    if (loginForm.username && loginForm.password) {
      dispatch(loginUser({
        username: loginForm.username,
        password: loginForm.password
      }));
    }
  };

  const handleRegisterSubmit = async () => {
    
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:9000/register/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idno: registerForm.username,
          fname: registerForm.fname,
          lname: registerForm.lname,
          email: registerForm.email,
          phone: registerForm.phone,
          department: registerForm.department,
          password: registerForm.password,
          role: 'User'
        }),
      });

      if (response.ok) {
        console.log("ok bro ")
        alert('Registration successful! Please login.');
        setIsLogin(true);
        setRegisterForm({
          username: '',
          fname: '',
          lname: '',
          email: '',
          phone: '',
          department: '',
          password: '',
          confirmPassword: ''
        });
      } else {
         console.log("not ok1 bro ")
        const errorText = await response.text();
        alert('Registration failed: ' + errorText);
      }
    } catch (error) {
         console.log("not ok2 bro ")
      alert('Registration failed: ' + error.message);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-orange-100 text-center transform animate-pulse">
          <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-light text-slate-800 mb-4">Welcome to BookHaven</h2>
          <p className="text-slate-600 text-lg">You have been successfully authenticated.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 relative overflow-hidden">
      {/* Subtle animated background elements */}
      <div 
        className="fixed w-80 h-80 rounded-full bg-gradient-to-r from-orange-400/20 to-orange-400/20 blur-3xl pointer-events-none transition-all duration-500 ease-out"
        style={{
          left: cursorPosition.x - 160,
          top: cursorPosition.y - 160,
        }}
      />
      
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-orange-200/40 rounded-full animate-pulse" />
      <div className="absolute top-32 right-32 w-2 h-2 bg-amber-300/50 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-40 left-16 w-3 h-3 bg-orange-300/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 right-20 w-6 h-6 bg-amber-200/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-10 w-1 h-1 bg-orange-400/60 rounded-full animate-ping" />
      <div className="absolute top-1/3 right-10 w-1 h-1 bg-amber-400/60 rounded-full animate-ping" style={{ animationDelay: '2s' }} />

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className={`w-full max-w-md transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-2xl mr-4 backdrop-blur-sm">
                <BookOpen className="w-8 h-8 text-orange-600" />
              </div>
              <h1 className="text-4xl font-light text-slate-800 tracking-wide">BookHaven</h1>
            </div>
            <p className="text-slate-600 text-lg font-light leading-relaxed">
              {isLogin ? 'Welcome back to your literary sanctuary' : 'Join our community of passionate readers'}
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-lg border border-white/50 overflow-hidden">
            {/* Tab Switcher */}
            <div className="flex relative bg-white/30">
              <div 
                className={`absolute top-0 h-full bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-full transition-all duration-300 ease-out ${
                  isLogin ? 'left-2 w-[calc(50%-8px)]' : 'right-2 w-[calc(50%-8px)]'
                }`}
              />
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 relative z-10 ${
                  isLogin 
                    ? 'text-orange-700' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 relative z-10 ${
                  !isLogin 
                    ? 'text-orange-700' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50/80 border border-red-200/50 rounded-2xl text-red-600 text-sm backdrop-blur-sm">
                  {error}
                </div>
              )}

              {isLogin ? (
                /* Login Form */
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Username
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                      <input
                        type="text"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 bg-white/60 hover:bg-white/80 focus:bg-white text-slate-800 placeholder-slate-400"
                        placeholder="Enter your username"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full pl-12 pr-12 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 bg-white/60 hover:bg-white/80 focus:bg-white text-slate-800 placeholder-slate-400"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLoginSubmit}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white py-4 rounded-2xl font-medium transition-all duration-300 focus:ring-4 focus:ring-orange-300/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Register Form */
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={registerForm.fname}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, fname: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 bg-white/60 hover:bg-white/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400"
                        placeholder="First name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={registerForm.lname}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, lname: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 bg-white/60 hover:bg-white/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400"
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Username
                    </label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                      <input
                        type="text"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 bg-white/60 hover:bg-white/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400"
                        placeholder="Choose a username"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                      <input
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 bg-white/60 hover:bg-white/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Phone
                      </label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                        <input
                          type="tel"
                          value={registerForm.phone}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 bg-white/60 hover:bg-white/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400"
                          placeholder="Phone number"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Department
                      </label>
                      <div className="relative group">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                        <input
                          type="text"
                          value={registerForm.department}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, department: e.target.value }))}
                          className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 bg-white/60 hover:bg-white/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400"
                          placeholder="Department"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 bg-white/60 hover:bg-white/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400"
                        placeholder="Create a password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 bg-white/60 hover:bg-white/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400"
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRegisterSubmit}
                    className="w-full bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white py-4 rounded-2xl font-medium transition-all duration-300 focus:ring-4 focus:ring-orange-300/50 flex items-center justify-center group mt-6 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-slate-600 text-sm font-light">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-orange-600 hover:text-orange-700 underline decoration-2 underline-offset-2 transition-colors duration-200"
              >
                {isLogin ? 'Sign up here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;