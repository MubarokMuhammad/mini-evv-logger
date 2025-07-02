export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  timestamp: string;
}

export const getCurrentLocation = (clickTimestamp?: string): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported, using mock location');
      resolve(getMockLocation(clickTimestamp));
      return;
    }

    // First attempt with high accuracy
    const tryHighAccuracy = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const timestamp = clickTimestamp || new Date().toISOString();
          
          console.log(`[DEBUG] Location obtained with accuracy: ${position.coords.accuracy}m`);
          
          try {
            // Get address from coordinates using reverse geocoding
            const address = await getAddressFromCoordinates(latitude, longitude);
            
            resolve({
              latitude,
              longitude,
              address,
              timestamp
            });
          } catch (error) {
            // If reverse geocoding fails, use coordinates as fallback
            resolve({
              latitude,
              longitude,
              address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              timestamp
            });
          }
        },
        (error) => {
          console.warn('High accuracy geolocation failed, trying with lower accuracy:', error);
          tryLowAccuracy();
        },
        {
          enableHighAccuracy: true, // Enable high accuracy for precise location
          timeout: 15000, // Increase timeout for better accuracy
          maximumAge: 30000  // Reduce cache time for fresher location data
        }
      );
    };

    // Fallback attempt with lower accuracy
    const tryLowAccuracy = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const timestamp = clickTimestamp || new Date().toISOString();
          
          console.log(`[DEBUG] Location obtained with lower accuracy: ${position.coords.accuracy}m`);
          
          try {
            // Get address from coordinates using reverse geocoding
            const address = await getAddressFromCoordinates(latitude, longitude);
            
            resolve({
              latitude,
              longitude,
              address,
              timestamp
            });
          } catch (error) {
            // If reverse geocoding fails, use coordinates as fallback
            resolve({
              latitude,
              longitude,
              address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              timestamp
            });
          }
        },
        (error) => {
          console.error('All geolocation attempts failed:', error);
          console.warn('Using mock location as fallback');
          // Instead of rejecting, use mock location as fallback
          resolve(getMockLocation(clickTimestamp));
        },
        {
          enableHighAccuracy: false, // Lower accuracy for fallback
          timeout: 10000,
          maximumAge: 60000
        }
      );
    };

    // Start with high accuracy attempt
    tryHighAccuracy();
  });
};

// Mock location for testing/fallback
const getMockLocation = (clickTimestamp?: string): LocationData => {
  return {
    latitude: 37.7749,
    longitude: -122.4194,
    address: 'San Francisco, CA (Mock Location)',
    timestamp: clickTimestamp || new Date().toISOString()
  };
};

const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
  try {
    // Using OpenStreetMap Nominatim API for reverse geocoding (free)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Mini EVV Logger App'
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.display_name) {
        return data.display_name;
      }
    }
    
    // Fallback to coordinates if API fails
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};
