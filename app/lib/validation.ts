export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateEmail(email: string): string | null {
  if (!email) {
    return "Email is required.";
  }
  
  if (!isValidEmail(email)) {
    return "Please enter a valid email address.";
  }
  
  return null;
}
