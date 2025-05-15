import { useState, useEffect } from "react";

interface FetchDataOptions {
  activeOnly?: boolean;
}

// Simple in-memory cache
const dataCache: { [key: string]: any } = {};

function useFetchData<T>(jsonPath: string, options?: FetchDataOptions): T | null {
  const [data, setData] = useState<T | null>(() => {
    // Try to get data from cache initially
    const cacheKey = `${jsonPath}-${JSON.stringify(options)}`;
    return dataCache[cacheKey] || null;
  });

  useEffect(() => {
    const cacheKey = `${jsonPath}-${JSON.stringify(options)}`;

    // If data is already in state (possibly from cache), don't refetch
    if (data && dataCache[cacheKey]) {
      return;
    }

    const fetchData = async () => {
      try {
        // Check cache again before fetching (in case of concurrent requests, though less likely here)
        if (dataCache[cacheKey]) {
          setData(dataCache[cacheKey]);
          return;
        }

        const response = await fetch(jsonPath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        let jsonData = await response.json();

        if (options?.activeOnly && Array.isArray(jsonData)) {
          jsonData = jsonData.filter(item => (item as any).active === true);
        }
        
        dataCache[cacheKey] = jsonData; // Store in cache
        setData(jsonData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setData(null); // Set to null on error
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonPath, JSON.stringify(options)]); // Effect dependencies

  return data;
}

export default useFetchData;

