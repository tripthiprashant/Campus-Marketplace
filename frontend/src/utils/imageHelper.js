const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Returns a fully-qualified image URL or fallback placeholder
 * @param {string|null} imagePath
 * @param {string} [type='product'] 'product' | 'avatar'
 * @returns {string}
 */
export const getImageUrl = (imagePath, type = 'product') => {
  if (!imagePath) {
    return type === 'avatar' ? getAvatarPlaceholder() : getProductPlaceholder();
  }

  // If already an absolute URL (e.g. starts with http:// or https://)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Clean double slashes
  const cleanBase = API_BASE_URL.replace(/\/$/, '');
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  return `${cleanBase}${cleanPath}`;
};

/**
 * Generates an SVG placeholder for missing product images
 */
export const getProductPlaceholder = () => {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#F1F5F9"/>
      <circle cx="200" cy="130" r="40" fill="#E2E8F0"/>
      <path d="M185 130L195 140L215 120" stroke="#94A3B8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="200" y="195" font-family="Inter, sans-serif" font-size="14" font-weight="500" fill="#94A3B8" text-anchor="middle">No Image Available</text>
    </svg>
  `);
};

/**
 * Generates an SVG placeholder for missing user avatars
 */
export const getAvatarPlaceholder = (username = 'User') => {
  const initial = username ? username.charAt(0).toUpperCase() : 'U';
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#4F46E5"/>
      <text x="50" y="60" font-family="Inter, sans-serif" font-size="40" font-weight="600" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">${initial}</text>
    </svg>
  `);
};
