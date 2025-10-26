import React, { useEffect, useState } from "react";

// Function to calculate the initial theme state.
const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const savedTheme = localStorage.getItem("theme");
    
    // Check for saved theme first.
    if (savedTheme === "dark") {
      return true; // Return dark mode if explicitly saved as 'dark'
    }
    
    // If no saved theme or saved as 'light', default to Light Mode (return false).
    // This ignores the system's "prefers-color-scheme" setting on first load.
    return false;
  }
  
  // Default to light if not in a browser environment.
  return false;
};

export default function ThemeToggle() {
  // Initialize state with the result of getInitialTheme()
  const [dark, setDark] = useState(getInitialTheme);

  // useEffect to sync the 'dark' state to the DOM class and localStorage.
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const toggle = () => {
    // Toggling the state will trigger the useEffect to update DOM/localStorage
    setDark((prevDark) => !prevDark);
  };

  return (
    <button
      onClick={toggle}
      className="p-2 border rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    >
      {dark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}