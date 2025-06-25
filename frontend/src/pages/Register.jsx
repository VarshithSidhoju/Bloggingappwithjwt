import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  CheckCircle, 
  AlertCircle, 
  Shield,
  Check,
  X
} from 'lucide-react';

// Mock API for demonstration
const authAPI = {
  register: async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock email check
    if (userData.email === 'existing@example.com') {
      throw new Error('Email already exists');
    }
    
    // Simulate successful registration
    return {
      data: {
        message: 'Registration successful',
        user: { 
          id: Date.now(), 
          name: userData.name, 
          email: userData.email 
        }
      }
    };
  }
};

function Register() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Password strength checker
  useEffect(() => {
    const password = formData.password;
    const checks = [
      { test: password.length >= 8, message: 'At least 8 characters' },
      { test: /[A-Z]/.test(password), message: 'One uppercase letter' },
      { test: /[a-z]/.test(password), message: 'One lowercase letter' },
      { test: /\d/.test(password), message: 'One number' },
      { test: /[!@#$%^&*(),.?":{}|<>]/.test(password), message: 'One special character' }
    ];
    
    const score = checks.filter(check => check.test).length;
    setPasswordStrength({ score, feedback: checks });
  }, [formData.password]);

  // Real-time validation
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
        return '';
      
      case 'email':
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'Please enter a valid email address';
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        return value === formData.password ? '' : 'Passwords do not match';
      
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Real-time validation for confirm password
    if (name === 'password' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { data } = await authAPI.register(formData);
      setNotification({ 
        message: 'Registration successful! You can now log in.', 
        type: 'success' 
      });
      
      // Simulate navigation to login page
      setTimeout(() => {
        alert('Redirecting to login page...');
      }, 2000);
      
    } catch (err) {
      setNotification({
        message: err.message || 'Registration failed. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'bg-red-500';
    if (passwordStrength.score <= 3) return 'bg-yellow-500';
    if (passwordStrength.score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 3) return 'Fair';
    if (passwordStrength.score <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Join us today and get started</p>
        </div>

        {/* Notification */}
        {notification.message && (
          <div className={`p-4 rounded-lg flex items-center space-x-2 ${
            notification.type === 'success' ? 'bg-green-50 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 text-red-800' :
            'bg-blue-50 text-blue-800'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
                disabled={isLoading}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium ${
                    passwordStrength.score <= 2 ? 'text-red-600' :
                    passwordStrength.score <= 3 ? 'text-yellow-600' :
                    passwordStrength.score <= 4 ? 'text-blue-600' :
                    'text-green-600'
                  }`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                
                {/* Password Requirements */}
                <div className="grid grid-cols-1 gap-1 text-xs">
                  {passwordStrength.feedback.map((check, index) => (
                    <div key={index} className={`flex items-center space-x-1 ${
                      check.test ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {check.test ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      <span>{check.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50' : 
                  formData.confirmPassword && !errors.confirmPassword ? 'border-green-300 bg-green-50' :
                  'border-gray-300'
                }`}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                {errors.confirmPassword}
              </p>
            )}
            {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
              <p className="mt-1 text-sm text-green-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                Passwords match
              </p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
              disabled={isLoading}
            />
            <label htmlFor="terms" className="text-sm text-gray-600 leading-5">
              I agree to the{' '}
              <button type="button" className="text-purple-600 hover:text-purple-500 font-medium">
                Terms of Service
              </button>
              {' '}and{' '}
              <button type="button" className="text-purple-600 hover:text-purple-500 font-medium">
                Privacy Policy
              </button>
            </label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              {errors.terms}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button className="text-purple-600 hover:text-purple-500 font-medium">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
