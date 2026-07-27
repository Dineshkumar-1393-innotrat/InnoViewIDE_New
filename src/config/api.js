import './env';

export const API = {
  MAIN: import.meta.env.VITE_API_BASE_URL,
  ADMIN: import.meta.env.VITE_ADMIN_API_BASE_URL,
  GITHUB: import.meta.env.VITE_GITHUB_API_BASE_URL,
  CLOUDINARY: import.meta.env.VITE_CLOUDINARY_URL,
};
