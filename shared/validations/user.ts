// 3 to 32 characters, with letters, numbers, _ and .
export const USERNAME_REGEX = /^[a-zA-Z0-9_.]{3,32}$/;
export const USERNAME_RULES_MESSAGE = 'Usernames use 3 to 32 letters, numbers, dots or underscores.';
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const EMAIL_RULES_MESSAGE = 'Enter a valid email address.';
