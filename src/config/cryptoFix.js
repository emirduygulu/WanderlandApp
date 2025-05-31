// Mock crypto functionality
export const randomBytes = (size) => {
  // Return a dummy array of specified size filled with random values
  const arr = new Array(size);
  for (let i = 0; i < size; i++) {
    arr[i] = Math.floor(Math.random() * 256);
  }
  return Buffer.from(arr);
};

export const getRandomValues = (arr) => {
  // Fill the array with dummy values
  for (let i = 0; i < arr.length; i++) {
    arr[i] = Math.floor(Math.random() * 256);
  }
  return arr;
};

// Mock RNRandomBytes implementation
export const RNRandomBytes = {
  seed: new Array(32).fill(1), // Provide a non-null seed value
  randomBytes: (length, callback) => {
    // Create a base64 string of random bytes
    const bytes = randomBytes(length);
    const base64 = Buffer.from(bytes).toString('base64');
    
    if (callback) {
      callback(null, base64);
    }
    return base64;
  }
};

// Other crypto functions can be added here as needed
export default {
  randomBytes,
  getRandomValues,
  RNRandomBytes
}; 