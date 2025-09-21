import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import countriesData from '../data/countries.json';

// UI Components (reusing from App.jsx)
const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white',
    outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-lg font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = '', hover = false }) => (
  <motion.div
    whileHover={hover ? { y: -2, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } : {}}
    className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
  >
    {children}
  </motion.div>
);

const Input = ({ className = '', error, ...props }) => (
  <input
    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
      error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
    } ${className}`}
    {...props}
  />
);

const Textarea = ({ className = '', error, ...props }) => (
  <textarea
    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none ${
      error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
    } ${className}`}
    {...props}
  />
);

const Select = ({ children, className = '', error, ...props }) => (
  <select
    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
      error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
    } ${className}`}
    {...props}
  >
    {children}
  </select>
);

const Badge = ({ children, variant = 'default', onRemove }) => {
  const variants = {
    default: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
    success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
  };
  
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`}>
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:text-red-600 dark:hover:text-red-400"
          type="button"
        >
          ×
        </button>
      )}
    </span>
  );
};

const OnboardingForm = ({ isOpen, onClose, onComplete, onSkip }) => {
  const [formData, setFormData] = useState({
    skills: [],
    jobExperience: '',
    education: {
      degree: '',
      major: '',
      graduationYear: ''
    },
    collegeUniversity: '',
    city: '',
    country: '',
    age: '',
    contactNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [skillInput, setSkillInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Common skills suggestions
  const skillSuggestions = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'C++', 'C#',
    'HTML', 'CSS', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'Agile', 'Scrum',
    'Machine Learning', 'Data Analysis', 'Project Management', 'Leadership',
    'Communication', 'Problem Solving', 'Teamwork', 'Time Management'
  ];

  const validateForm = () => {
    const newErrors = {};

    // Age validation
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 16 || age > 70) {
        newErrors.age = 'Age must be between 16 and 70';
      }
    }

    // Contact number validation
    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
    } else {
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(formData.contactNumber)) {
        newErrors.contactNumber = 'Please enter a valid phone number with country code (e.g., +1234567890)';
      }
    }

    // Country validation
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    // City validation
    if (!formData.city) {
      newErrors.city = 'City is required';
    }

    // College/University validation
    if (!formData.collegeUniversity) {
      newErrors.collegeUniversity = 'College/University name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Store in localStorage
    const onboardingData = {
      ...formData,
      education: {
        ...formData.education,
        graduationYear: formData.education.graduationYear ? parseInt(formData.education.graduationYear) : undefined
      },
      age: parseInt(formData.age),
      completedAt: new Date().toISOString()
    };

    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.removeItem('onboardingSkipped');

    setShowSuccess(true);
    setTimeout(() => {
      onComplete(onboardingData);
      setShowSuccess(false);
    }, 1500);
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingSkipped', 'true');
    onSkip();
  };

  const addSkill = (skill) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill]
      }));
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSkillInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleEducationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        [field]: value
      }
    }));
  };

  const getCountryPhoneCode = (countryCode) => {
    const country = countriesData.find(c => c.code === countryCode);
    return country ? country.phoneCode : '';
  };

  const handleCountryChange = (countryCode) => {
    const phoneCode = getCountryPhoneCode(countryCode);
    setFormData(prev => ({
      ...prev,
      country: countryCode,
      contactNumber: phoneCode
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <Card className="relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                type="button"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Tell us about yourself
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Help us personalize your experience (optional)
                </p>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                  Step 1 of 1
                </div>
              </div>

              {showSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Profile Updated!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Thank you for completing your profile.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Skills
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={handleSkillInputKeyPress}
                          placeholder="Add a skill..."
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => addSkill(skillInput)}
                          variant="outline"
                        >
                          Add
                        </Button>
                      </div>
                      
                      {/* Skill suggestions */}
                      <div className="flex flex-wrap gap-2">
                        {skillSuggestions
                          .filter(skill => !formData.skills.includes(skill))
                          .slice(0, 8)
                          .map(skill => (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => addSkill(skill)}
                              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              + {skill}
                            </button>
                          ))}
                      </div>
                      
                      {/* Selected skills */}
                      {formData.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.skills.map(skill => (
                            <Badge key={skill} onRemove={() => removeSkill(skill)}>
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Job Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Job Experience
                    </label>
                    <Textarea
                      value={formData.jobExperience}
                      onChange={(e) => handleInputChange('jobExperience', e.target.value)}
                      placeholder="Tell us about your work experience..."
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Optional - Describe your professional background
                    </p>
                  </div>

                  {/* Education */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Degree
                      </label>
                      <Select
                        value={formData.education.degree}
                        onChange={(e) => handleEducationChange('degree', e.target.value)}
                      >
                        <option value="">Select degree</option>
                        <option value="High School">High School</option>
                        <option value="Associate">Associate</option>
                        <option value="Bachelor's">Bachelor's</option>
                        <option value="Master's">Master's</option>
                        <option value="PhD">PhD</option>
                        <option value="Other">Other</option>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Major/Field
                      </label>
                      <Input
                        value={formData.education.major}
                        onChange={(e) => handleEducationChange('major', e.target.value)}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        College/University Name
                      </label>
                      <Input
                        value={formData.collegeUniversity}
                        onChange={(e) => handleInputChange('collegeUniversity', e.target.value)}
                        placeholder="University name"
                        error={errors.collegeUniversity}
                      />
                      {errors.collegeUniversity && (
                        <p className="text-red-500 text-sm mt-1">{errors.collegeUniversity}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Graduation Year
                      </label>
                      <Input
                        type="number"
                        value={formData.education.graduationYear}
                        onChange={(e) => handleEducationChange('graduationYear', e.target.value)}
                        placeholder="2024"
                        min="1950"
                        max="2030"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <Input
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Your city"
                        error={errors.city}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country
                      </label>
                      <Select
                        value={formData.country}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        error={errors.country}
                      >
                        <option value="">Select country</option>
                        {countriesData.map(country => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </Select>
                      {errors.country && (
                        <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                      )}
                    </div>
                  </div>

                  {/* Age and Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Age
                      </label>
                      <Input
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        placeholder="25"
                        min="16"
                        max="70"
                        error={errors.age}
                      />
                      {errors.age && (
                        <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Must be between 16-70
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contact Number
                      </label>
                      <Input
                        value={formData.contactNumber}
                        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                        placeholder="+1234567890"
                        error={errors.contactNumber}
                      />
                      {errors.contactNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Include country code
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      Save & Continue
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleSkip}
                      className="flex-1"
                    >
                      Skip for Now
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingForm;
