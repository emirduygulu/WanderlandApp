// unsplash api

import apiClient from "./apiClient";
import { MEDIA_API_KEY } from "./config";

const Unsplash_URL = 'https://api.unsplash.com';

export const searchPhotos = async(query: string, page =1, perPage=5) =>{
    const response =await apiClient.get(`${Unsplash_URL}/search/photos`,{
        headers:{
            Authorization:`Client-ID ${MEDIA_API_KEY}`,
        },
        params: {query,page, per_page:perPage },
    });
    return response.data;
};

export const getRandomPhoto = async() =>{
    const response = await apiClient.get(`${Unsplash_URL}/photos/random`,{
        headers:{
            Authorization:`Client-ID ${MEDIA_API_KEY}`,
        },
    });
    return response.data;
}