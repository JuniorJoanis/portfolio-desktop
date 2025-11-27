/**
 * Obfuscates email address to prevent bot harvesting
 * Uses character codes to make it harder for bots to parse from HTML source
 */
export const getObfuscatedEmail = (): string => {
  // Split and reconstruct using character codes
  const emailUser = String.fromCharCode(106, 117, 110, 105, 111, 114) + '.' + 
                    String.fromCharCode(106, 111, 97, 110, 105, 115);
  const emailDomain = String.fromCharCode(103, 109, 97, 105, 108) + '.' + 
                      String.fromCharCode(99, 111, 109);
  return `${emailUser}@${emailDomain}`;
};

/**
 * Returns the mailto link for the obfuscated email
 */
export const getEmailMailtoLink = (): string => {
  return `mailto:${getObfuscatedEmail()}`;
};

