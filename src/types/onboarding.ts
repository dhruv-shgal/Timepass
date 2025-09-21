export interface OnboardingFormData {
  skills: string[];
  jobExperience: string;
  education: {
    degree: string;
    major: string;
    graduationYear?: number;
  };
  collegeUniversity: string;
  city: string;
  country: string;
  age: number;
  contactNumber: string;
}

export interface Country {
  code: string;
  name: string;
  phoneCode: string;
}

export interface OnboardingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingFormData) => void;
  onSkip: () => void;
}
