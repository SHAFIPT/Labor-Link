import { Schema } from 'mongoose';

export  interface IReview {
  userId: Schema.Types.ObjectId;
  reviewerProfile : string
  reviewerName: string;
  reviewText: string;
  imageUrl: string[]; 
  rating: number;  // Rating score (e.g., 1 to 5)
  createdAt: Date;
}