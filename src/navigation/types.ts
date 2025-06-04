import { SearchResult } from '../services/SearchService';

// Navigation types
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Main: undefined;
  Favorite: undefined;
  Search: undefined;
  SearchResults: {
    query: string;
    results: SearchResult[];
    category?: string;
    isCategorySearch?: boolean;
  };
  SearchDetail: {
    result: SearchResult;
  };
  SmartChat: undefined;
  Profile: undefined;
  EditProfile: undefined;
  AvatarSelector: undefined;
  Notifications: undefined;
  Settings: undefined;
  TravelBlogScreen: undefined;
  BlogDetail: {
    blog: {
      id: number;
      blogTitle: string;
      blogContent: string;
      yazar: string;
      tarih: string;
      kategori: string;
      resim: string;
      konum: string;
      okunmaSuresi: string;
    };
  };
  CreateBlog: undefined;
  CategoryDetail: {
    id: string;
    name: string;
  };
  CityGuideContent: {
    id: string;
    name: string;
  };
  Content: {
    item: {
      id: string;
      name: string;
      location: string;
      description: string;
      rating: number;
      reviews: number;
      distance: string;
      imageUrl: string;
      images: { id: string; uri: string }[];
    }
  };
  CityGuide: undefined;
}; 