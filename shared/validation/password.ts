export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;

// At least one lowercase letter, one uppercase letter and one special character, 12 to 128 characters.
// \p{Ll} and \p{Lu} also match accented letters (é, À...).
export const PASSWORD_REGEX = /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*[^\p{L}\p{N}\s]).{12,128}$/u;

export const PASSWORD_RULES_MESSAGE =
  'Password not strong enough.';
