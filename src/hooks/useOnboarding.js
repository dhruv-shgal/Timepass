import { useState, useEffect } from 'react';

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Check if onboarding was completed or skipped
    const completed = localStorage.getItem('onboardingCompleted') === 'true';
    const skipped = localStorage.getItem('onboardingSkipped') === 'true';
    const data = localStorage.getItem('onboardingData');

    setIsCompleted(completed);
    
    if (data) {
      setOnboardingData(JSON.parse(data));
    }

    // Show onboarding if neither completed nor skipped
    if (!completed && !skipped) {
      // Add a small delay for smooth transition
      setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
    }
  }, []);

  const handleComplete = (data) => {
    setOnboardingData(data);
    setIsCompleted(true);
    setShowOnboarding(false);
  };

  const handleSkip = () => {
    setShowOnboarding(false);
  };

  const openOnboarding = () => {
    setShowOnboarding(true);
  };

  const closeOnboarding = () => {
    setShowOnboarding(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('onboardingSkipped');
    localStorage.removeItem('onboardingData');
    setOnboardingData(null);
    setIsCompleted(false);
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    onboardingData,
    isCompleted,
    handleComplete,
    handleSkip,
    openOnboarding,
    closeOnboarding,
    resetOnboarding
  };
};
