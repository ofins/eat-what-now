let token = localStorage.getItem("token") || "";

const originFetch = window.fetch;

window.fetch = async (url, options = {}) => {
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "x-signature": import.meta.env.VITE_SIGNATURE,
  };

  return originFetch(url, options);
};

window.addEventListener("auth-change", () => {
  token = localStorage.getItem("token") || "";
});
