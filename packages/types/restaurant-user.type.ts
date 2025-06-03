export interface IRestaurantUser {
  id: number;
  user_id: number;
  restaurant_id: number;
  upvoted: boolean;
  downvoted: boolean;
  favorited: boolean;
  rating: number | null;
  comment: string | null;
  visited_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateRestaurantUserData {
  user_id: number;
  restaurant_id: number;
  upvoted?: boolean;
  downvoted?: boolean;
  favorited?: boolean;
  rating?: number;
  comment?: string;
  visited_at?: Date;
}
