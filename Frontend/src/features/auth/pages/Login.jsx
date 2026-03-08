import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await handleLogin({ email, password });
      navigate("/");
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-10 h-10 text-red-500 animate-spin" />
          <p className="text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-between bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 p-12 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-16">
              <span className="text-red-500 font-bold text-3xl font-serif tracking-tight">
                Interview AI
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-5xl lg:text-6xl font-serif text-white leading-tight mb-6 font-light">
              Welcome back.
              <br />
              Continue your
              <br />
              journey.
            </h2>
            <p className="text-slate-400 text-lg max-w-md font-light">
              Access your account and explore endless possibilities ahead.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-sm">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-12 h-12">
                  <svg
                    viewBox="0 0 60 60"
                    fill="none"
                    className="w-full h-full"
                  >
                    <path
                      d="M30 10L45 20V40L30 50L15 40V20Z"
                      stroke="url(#grad1)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M30 10L40 16M30 10L20 16"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-slate-900"
                    />
                    <defs>
                      <linearGradient
                        id="grad1"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="text-slate-900 font-bold text-lg">Brand</span>
              </div>
            </div>

            {/* Form Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-serif text-slate-900 font-light">
                Login
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                Sign in to your account to continue
              </p>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{errors.submit}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    placeholder="name@example.com"
                    className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200 bg-white"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: "" });
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-11 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 ${
                      errors.password
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200 bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 mb-4 mt-8 bg-red-500 border-2 border-red-600 hover:bg-red-600 disabled:bg-red-400 text-red=500 font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-red-500/30 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-red-500/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-slate-600 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-red-500 hover:text-red-600 transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;