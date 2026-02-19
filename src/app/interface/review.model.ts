export interface Review {
  id: string;
  projectId: string;
  
  reviewerId: string | number; 
  reviewerType: 'empresa' | 'freelancer';

  revieweeId: string | number; 
  revieweeType: 'empresa' | 'freelancer';

  rating: number; 
  comment: string; 
  timestamp: string;
}