export interface UserDocument {
  id: string;
  userId: string | number; 
  fileName: string; 
  fileType: string; 
  downloadUrl: string; 
  uploadedAt: string; 
}