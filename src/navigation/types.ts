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
  SmartChat: undefined;
  Profile: undefined;
  Notifications: undefined;
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