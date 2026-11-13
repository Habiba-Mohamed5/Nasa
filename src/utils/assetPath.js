/**
 * Safely resolves an asset URL respecting Vite's base path
 * Handles both local development ('/') and GitHub Pages ('/Nasa/')
 */
export function assetPath(path) {
  if (!path) return '';
  const clean = path.replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${clean}`;
}

export default assetPath;
