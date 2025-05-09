// Spoonacular Api 

// services/spoonacularApi.ts
import apiClient from './apiClient';
import { FOOD_API_KEY } from './config';

const SPOONACULAR_URL = 'https://api.spoonacular.com';

export const searchRecipes = async (query: string, number = 10) => {
  const response = await apiClient.get(`${SPOONACULAR_URL}/recipes/complexSearch`, {
    params: {
      query,
      number,
      apiKey: FOOD_API_KEY,
    },
  });

  return response.data;
};

export const getRecipeInformation = async (id: string) => {
  const response = await apiClient.get(`${SPOONACULAR_URL}/recipes/${id}/information`, {
    params: {
      apiKey: FOOD_API_KEY,
    },
  });

  return response.data;
};
