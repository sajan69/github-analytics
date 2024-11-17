import { useState, useEffect } from 'react'
export function useDarkMode(defaultValue = false) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || defaultValue;
    }
    return defaultValue;
  });
  
  useEffect(() => {
    const root = window.document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  return [isDarkMode, setIsDarkMode] as const
}