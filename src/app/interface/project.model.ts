export interface Project {
  id: string; 
  titulo: string;
  descricao: string;
  

  empresaId: string | number; 
  freelancerId?: string | number; 
  

  status: 'Aberto' | 'Em Andamento' | 'Concluído' | 'Cancelado';
  orcamento: number;
  dataPostagem: Date;
  prazoFinal?: Date;
  habilidadesNecessarias?: string[];
}