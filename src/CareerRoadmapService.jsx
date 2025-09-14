import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from './AppContext';

const CareerRoadmapService = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const { credits, setCredits } = useAppStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Career Roadmap Generator</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Credits required: 50</span>
          </div>
        </div>
        
        {/* Service Description */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-2xl text-indigo-600 dark:text-indigo-400 mb-4">1</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select Your Target Role</h3>
              <p className="text-gray-600 dark:text-gray-400">Choose the specific role you're aiming for in your career</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-2xl text-indigo-600 dark:text-indigo-400 mb-4">2</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Customize Your Plan</h3>
              <p className="text-gray-600 dark:text-gray-400">Specify your experience level and learning preferences</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-2xl text-indigo-600 dark:text-indigo-400 mb-4">3</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Get Your 6-Month Roadmap</h3>
              <p className="text-gray-600 dark:text-gray-400">Receive a personalized learning path with skills, resources, and projects</p>
            </div>
          </div>
        </div>
        
        {/* Implementation Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Get Started</h2>
          
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Select Your Target Role
                </h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div 
                  onClick={() => setStep(2)}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors cursor-pointer"
                >
                  <div className="text-3xl mb-4">💻</div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Technical Roles</h4>
                  <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Frontend Developer</li>
                    <li>• Backend Developer</li>
                    <li>• Full Stack Developer</li>
                    <li>• DevOps Engineer</li>
                    <li>• Data Scientist</li>
                  </ul>
                </div>
                
                <div 
                  onClick={() => setStep(2)}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors cursor-pointer"
                >
                  <div className="text-3xl mb-4">📊</div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Non-Technical Roles</h4>
                  <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Product Manager</li>
                    <li>• UX/UI Designer</li>
                    <li>• Digital Marketer</li>
                    <li>• Project Manager</li>
                    <li>• Business Analyst</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Customize Your Roadmap
                </h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specific Role
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <option value="">Select a role...</option>
                    <option value="frontend-developer">Frontend Developer</option>
                    <option value="backend-developer">Backend Developer</option>
                    <option value="data-analyst">Data Analyst</option>
                    <option value="product-manager">Product Manager</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience Level
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (2-5 years)</option>
                    <option value="senior">Senior Level (5+ years)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <button 
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={() => {
                    if (credits < 50) {
                      setShowUpgradeModal(true);
                      return;
                    }
                    
                    // Deduct credits
                    setCredits(credits - 50);
                    
                    // Navigate to career roadmap
                    onNavigate('career-roadmap');
                  }}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  Generate Roadmap ({credits >= 50 ? '50 credits' : 'Need more credits'})
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Benefits Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Why Use Our Career Roadmap Generator?</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Personalized 6-month learning path tailored to your target role</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Curated free learning resources for each skill</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Practical project ideas to build your portfolio</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Month-by-month progression to keep you on track</span>
            </li>
          </ul>
        </div>
      </motion.div>
      
      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Not Enough Credits</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need at least 50 credits to use this feature. Please upgrade your plan or purchase more credits.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onNavigate('pricing')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerRoadmapService;