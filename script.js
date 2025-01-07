// // Run this immediately
// if (
//   localStorage.getItem("theme") === "dark" ||
//   (!localStorage.getItem("theme") &&
//     window.matchMedia("(prefers-color-scheme: dark)").matches)
// ) {
//   document.documentElement.classList.add("dark");
//   // Add this line to set initial checkbox state
//   document.addEventListener("DOMContentLoaded", () => {
//     document.getElementById("switch").checked = true;
//   });
// } else {
//   document.documentElement.classList.remove("dark");
//   document.addEventListener("DOMContentLoaded", () => {
//     document.getElementById("switch").checked = false;
//   });
// }

// const toggleDarkMode = () => {
//   const htmlElement = document.documentElement;
//   const checkbox = document.getElementById("switch");

//   if (htmlElement.classList.contains("dark")) {
//     htmlElement.classList.remove("dark");
//     localStorage.setItem("theme", "light");
//   } else {
//     htmlElement.classList.add("dark");
//     localStorage.setItem("theme", "dark");
//   }
// };

// // Apply the saved theme on page load
// document.addEventListener("DOMContentLoaded", () => {
//   const checkbox = document.getElementById("switch");
//   // Set checkbox state based on current theme
//   checkbox.checked = document.documentElement.classList.contains("dark");
// });

// // Optional: Listen for system theme changes
// window
//   .matchMedia("(prefers-color-scheme: dark)")
//   .addEventListener("change", ({ matches }) => {
//     if (!localStorage.getItem("theme")) {
//       // Only auto-switch if user hasn't manually set a preference
//       const checkbox = document.getElementById("switch");
//       if (matches) {
//         document.documentElement.classList.add("dark");
//         checkbox.checked = true;
//       } else {
//         document.documentElement.classList.remove("dark");
//         checkbox.checked = false;
//       }
//     }
//   });




  
  