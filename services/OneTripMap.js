
const OTM_API_KEY = '5ae2e3f221c38a28845f05b674f143e88996df66592ed1d4d38906af';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 📌 Endpoint: Places in radius
// https://api.opentripmap.com/0.1/en/places/radius?radius={RADIUS}&lon={LON}&lat={LAT}&format=json&apikey=...
export const searchOTMPlaces = async (lat, lon, radius = 50000) => {
  try {
    const response = await fetch(
      `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&format=json&apikey=${OTM_API_KEY}&rate=3&limit=15`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('OpenTripMap Search Error:', error);
    return [];
  }
};

export const getOTMPlaceDetails = async (xid) => {
  try {
    // İstekler arasında 300ms bekle (rate limit aşımını önlemek için)
    await delay(300);
    
    const response = await fetch(
      `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${OTM_API_KEY}&lang=tr`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('OpenTripMap Details Error:', error);
    return {};
  }
};