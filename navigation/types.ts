// Navigation types
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: undefined;
  Home: undefined;
  Favorite: undefined;
  Search: undefined;
  SmartChat: undefined;
  Profile: undefined;
  Notifications: undefined;
  TravelerCard: undefined;
  CategoryDetail: { categoryId: string };
  CityGuideContent: { name: string; description: string };
  Content: {
    item?: {
      id: string;
      name: string;
      location: string;
      description: string;
      rating: number;
      reviews: number;
      distance: string;
      amenities?: number;
      images: Array<{
        id: string;
        uri: string;
      }>;
      isFavorite?: boolean;
    };
    itemId?: string; // Alternative: pass just the ID to fetch the data in the ContentScreen
  };
}; 