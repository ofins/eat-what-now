// // Create a safe fetch wrapper that always gets fresh token
// const createAuthenticatedFetch = () => {
//   const originalFetch = window.fetch;

//   return async (url: RequestInfo | URL, options: RequestInit = {}) => {
//     // Always get fresh token from localStorage
//     const currentToken = localStorage.getItem("token") || "";

//     const authenticatedOptions: RequestInit = {
//       ...options,
//       headers: {
//         ...options.headers,
//         Authorization: `Bearer ${currentToken}`,
//         "x-signature": import.meta.env.VITE_SIGNATURE,
//       },
//     };

//     return originalFetch(url, authenticatedOptions);
//   };
// };

// // Replace window.fetch with our authenticated version
// window.fetch = createAuthenticatedFetch();

// // Optional: Export function to restore original fetch if needed
// export const restoreOriginalFetch = () => {
//   // Store reference to original fetch for cleanup if needed
//   const originalFetch = globalThis.fetch;
//   return () => {
//     window.fetch = originalFetch;
//   };
// };
