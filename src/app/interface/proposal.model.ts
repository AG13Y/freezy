import { UserDocument } from "./document.model";

export interface Proposal {
  id: string; 
  projetoId: string; 
  freelancerId: string | number; 
  
  mensagem: string; 
  valorProposto: number; 
  prazoEstimadoDias: number; 
  
  status: 'Pendente' | 'Aprovada' | 'Recusada';
  dataEnvio: Date;

  attachedDocuments?: UserDocument[];
}