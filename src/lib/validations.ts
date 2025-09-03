// Validation schemas and functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePollTitle = (title: string): { isValid: boolean; error?: string } => {
  if (!title.trim()) {
    return { isValid: false, error: "Poll title is required" };
  }
  
  if (title.length > 200) {
    return { isValid: false, error: "Poll title must be less than 200 characters" };
  }
  
  return { isValid: true };
};

export const validatePollOptions = (options: string[]): { isValid: boolean; error?: string } => {
  if (options.length < 2) {
    return { isValid: false, error: "At least 2 options are required" };
  }
  
  if (options.length > 10) {
    return { isValid: false, error: "Maximum 10 options allowed" };
  }
  
  const validOptions = options.filter(option => option.trim().length > 0);
  if (validOptions.length !== options.length) {
    return { isValid: false, error: "All options must have text" };
  }
  
  if (validOptions.length !== new Set(validOptions).size) {
    return { isValid: false, error: "Options must be unique" };
  }
  
  return { isValid: true };
};

export const validatePollOption = (option: string): { isValid: boolean; error?: string } => {
  if (!option.trim()) {
    return { isValid: false, error: "Option text is required" };
  }
  
  if (option.length > 100) {
    return { isValid: false, error: "Option must be less than 100 characters" };
  }
  
  return { isValid: true };
};


