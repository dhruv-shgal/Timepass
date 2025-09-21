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

    console.log('Onboarding check:', { completed, skipped, data });

    setIsCompleted(completed);
    
    if (data) {
      setOnboardingData(JSON.parse(data));
    }

    // Show onboarding if neither completed nor skipped
    if (!completed && !skipped) {
      console.log('Showing onboarding in 1 second...');
      // Add a small delay for smooth transition
      setTimeout(() => {
        console.log('Setting showOnboarding to true');
        setShowOnboarding(true);
      }, 1000);
    } else {
      console.log('Onboarding already completed or skipped');
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

  // Add a test function to force show onboarding
  const forceShowOnboarding = () => {
    console.log('Force showing onboarding...');
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
    resetOnboarding,
    forceShowOnboarding
  };
};
