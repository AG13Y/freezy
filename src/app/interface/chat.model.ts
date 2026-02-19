

export interface Message {
  id: string;
  senderId: string | number; 
  text: string;
  timestamp: Date;
}


export interface ChatModel {
  id: string;
  participantIds: (string | number)[]; 
  messages: Message[];
}