interface CacheConfig {
    search: {
      duration: number
      storage: 'sessionStorage'
    }
    profile: {
      duration: number
      storage: 'localStorage'
    }
    trending: {
      duration: number
      storage: 'localStorage'
    }
    repository: {  // Add this new configuration
      duration: number
      storage: 'localStorage'
    }
  }
  
  const cacheConfig: CacheConfig = {
    search: {
      duration: 900000, // 15 minutes
      storage: 'sessionStorage',
    },
    profile: {
      duration: 3600000, // 1 hour
      storage: 'localStorage',
    },
    trending: {
      duration: 21600000, // 6 hours
      storage: 'localStorage',
    },
    repository: {  // Add this new configuration
      duration: 3600000, // 1 hour
      storage: 'localStorage',
    }
  }
  
  export const setCache = (key: string, data: any, type: keyof CacheConfig) => {
    const { duration, storage } = cacheConfig[type]
    const item = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + duration,
    }
    window[storage].setItem(key, JSON.stringify(item))
  }
  
  export const getCache = (key: string, type: keyof CacheConfig) => {
    const { storage } = cacheConfig[type]
    const item = window[storage].getItem(key)
    if (!item) return null
  
    const { data, expiry } = JSON.parse(item)
    if (Date.now() > expiry) {
      window[storage].removeItem(key)
      return null
    }
  
    return data
  }