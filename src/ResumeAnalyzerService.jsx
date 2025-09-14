import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from './AppContext';

const ResumeAnalyzerService = ({ onNavigate }) => {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resume Analyzer</h1>
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Upload Your Resume</h3>
              <p className="text-gray-600 dark:text-gray-400">Upload your resume in PDF or DOCX format for AI analysis</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-2xl text-indigo-600 dark:text-indigo-400 mb-4">2</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">Our AI scans your resume for ATS compatibility and optimization opportunities</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-2xl text-indigo-600 dark:text-indigo-400 mb-4">3</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Get Actionable Feedback</h3>
              <p className="text-gray-600 dark:text-gray-400">Receive detailed feedback and suggestions to improve your resume's effectiveness</p>
            </div>
          </div>
        </div>
        
        {/* Implementation Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Get Started</h2>
          
          {step === 1 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Upload Your Resume
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Drag and drop your PDF or DOCX file, or click to browse
              </p>
              <input
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                id="resume-upload-service"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setStep(2);
                  }
                }}
              />
              <div className="flex flex-col items-center space-y-4">
                <label htmlFor="resume-upload-service" className="cursor-pointer">
                  <div className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
                    Choose File
                  </div>
                </label>
                <button 
                  onClick={() => setStep(2)}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Skip this step (demo)
                </button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Resume Analysis Options
                </h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors cursor-pointer">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Basic ATS Analysis</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Get a basic ATS compatibility score and keyword recommendations
                  </p>
                  <button 
                    onClick={() => {
                      if (credits < 50) {
                        setShowUpgradeModal(true);
                        return;
                      }
                      
                      // Deduct credits
                      setCredits(credits - 50);
                      
                      // Navigate to resume analyzer
                      onNavigate('resume-analyzer');
                    }}
                    className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Start Basic Analysis ({credits >= 50 ? '50 credits' : 'Need more credits'})
                  </button>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors cursor-pointer">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Advanced Analysis</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Detailed section-by-section feedback with improvement suggestions
                  </p>
                  <button 
                    onClick={() => {
                      if (credits < 50) {
                        setShowUpgradeModal(true);
                        return;
                      }
                      
                      // Deduct credits
                      setCredits(credits - 50);
                      
                      // Navigate to resume analyzer
                      onNavigate('resume-analyzer');
                    }}
                    className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Start Advanced Analysis ({credits >= 50 ? '50 credits' : 'Need more credits'})
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <button 
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Benefits Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Why Use Our Resume Analyzer?</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Beat applicant tracking systems (ATS) with optimized formatting</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Identify missing keywords specific to your target role</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Get section-by-section feedback to strengthen weak areas</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Compare your resume against specific job descriptions</span>
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

export default ResumeAnalyzerService;