import { useState, useEffect } from 'react'

/**
 * Custom hook to detect if the current screen size is mobile
 * Uses Tailwind's md breakpoint (768px) as the threshold
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768) // Tailwind's md breakpoint
    }

    // Check on mount
    checkIsMobile()

    // Add event listener for resize with debouncing
    let timeoutId: NodeJS.Timeout
    const debouncedCheck = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkIsMobile, 100)
    }

    window.addEventListener('resize', debouncedCheck)

    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedCheck)
      clearTimeout(timeoutId)
    }
  }, [])

  return isMobile
}
