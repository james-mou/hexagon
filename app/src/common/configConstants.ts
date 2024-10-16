const BASE_API_URL = import.meta.env.VITE_API_URL;
const isProduction = import.meta.env.MODE === "production";

export { BASE_API_URL, isProduction };
