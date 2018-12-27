export const getFirstName = name => name.split(' ')[0];

export const isValidPassword = password =>
  password.length >= 8 && !password.toLowerCase().includes('password');
