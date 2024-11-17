import { FaSun, FaMoon } from 'react-icons/fa'
import { useDarkMode } from '../hooks/useDarkMode'

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useDarkMode()

  const handleToggle = () => {
    setIsDarkMode(prev => !prev)
  }

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
    </button>
  )
}