import { useEffect, useState } from "react";
import sun from "@/assets/sun.svg";
import moon from "@/assets/moon.svg";

const ToggleDarkMode = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
      aria-label="Toggle dark mode"
    >
      <img
        src={darkMode ? sun : moon}
        alt={darkMode ? "Sun icon" : "Moon icon"}
        className="h-6 w-6"
      />
    </button>
  );
};

export default ToggleDarkMode;
