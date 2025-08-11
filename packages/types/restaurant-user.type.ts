export interface IRestaurantUser {
  id: number;
  user_id: string;
  restaurant_id: number;
  upvoted: boolean;
  favorited: boolean;
  rating: number | null;
  comment: string | null;
  visited_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateRestaurantUserData {
  user_id: string;
  restaurant_id: number;
  upvoted?: boolean;
  favorited?: boolean;
  rating?: number;
  comment?: string;
  visited_at?: Date;
}

export interface CreateRestaurantUserDto {
  user_id: string;
  restaurant_id: number;
  upvoted?: boolean;
  favorited?: boolean;
  rating?: number;
  comment?: string;
  visited_at?: Date;
}

export interface UpdateRestaurantUserData {
  user_id?: string;
  restaurant_id?: string;
  upvoted?: boolean;
  favorited?: boolean;
  rating?: number;
  comment?: string;
  visited_at?: Date;
}
