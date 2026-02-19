export interface User {

  id: string | number; 
  
  email: string;
  nome: string;
  tipo: 'freelancer' | 'empresa';
  
  fotoUrl?: string;
  bio?: string;
  localizacao?: string;
  habilidades?: string[];
  precoHora?: number;
  nomeEmpresa?: string;
  cnpj?: string;
  website?: string;
}

export interface UserWithPassword extends User {
  password: string;
}