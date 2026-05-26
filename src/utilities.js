// Updated at 2026-05-08 17:55
const getUserInfo = () => {
  try {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// In development Vite proxies these paths to avoid CORS.
// In production set VITE_API_BASE_URL and VITE_PRODUCT_API_BASE_URL env vars.
const baseURL = import.meta.env.VITE_API_BASE_URL || "";
const productAPIBase = import.meta.env.VITE_PRODUCT_API_BASE_URL || "/product-api";

export { getUserInfo, baseURL, productAPIBase };
