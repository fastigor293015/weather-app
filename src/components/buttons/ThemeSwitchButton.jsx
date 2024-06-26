import { useEffect, useState } from "react";

const ThemeSwitchButton = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const themeValue = localStorage.getItem("dark-theme");

    if (themeValue) {
      setIsDarkTheme(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkTheme(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const onChange = (e) => {
    const isDark = e.target.checked;
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dark-theme", true);
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.removeItem("dark-theme");
    }
    setIsDarkTheme(isDark);
  }

  return (
    <label className="btn sidebar__theme-switch-label" htmlFor="theme-switch">
      <input type="checkbox" id="theme-switch" checked={isDarkTheme} onChange={onChange} aria-label="Переключить тему" />
      <div className="sidebar__theme-switch-container">
        <div className="sidebar__theme-switch-indicator">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M10.6067 2.12132C9.83451 1.34916 8.89689 0.8358 7.9126 0.572756C8.44717 2.57528 7.93381 4.79418 6.36403 6.36396C4.79425 7.93374 2.57535 8.4471 0.572826 7.91253C0.83587 8.89682 1.34923 9.83444 2.12139 10.6066C4.46333 12.9485 8.26473 12.9485 10.6067 10.6066C12.9486 8.26466 12.9486 4.46326 10.6067 2.12132Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </label>
  );
}

export default ThemeSwitchButton;

