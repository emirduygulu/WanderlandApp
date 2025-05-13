// 📁 FoursquareService.js

const FSQ_API_KEY = 'fsq3JeH31UQ+807jYa94GoyV21yM3IN48B9pML4otvksmQ0=';

// 📌 Endpoint: Search places by keyword
export const searchFSQPlaces = async (lat, lon, query) => {
  try {
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?query=${query}&ll=${lat},${lon}&limit=20&radius=100000&sort=POPULARITY&categories=16000,16003,16004,16007,10000,12000&fields=fsq_id,name,location,geocodes&locale=tr`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: FSQ_API_KEY,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Foursquare Search Error:', error);
    return { results: [] };
  }
};

// https://api.foursquare.com/v3/places/{fsq_id}
export const getFSQPlaceDetails = async (fsq_id) => {
  try {
    const fields = 'fsq_id,name,description,photos,rating,website,location,tel,email,hours,price,categories';
    const response = await fetch(
      `https://api.foursquare.com/v3/places/${fsq_id}?fields=${fields}&locale=tr`, 
      {
        headers: {
          Accept: 'application/json',
          Authorization: FSQ_API_KEY,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Foursquare Details Error:', error);
    return {};
  }
};
