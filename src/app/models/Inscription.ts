export interface Inscription {
  id: number;  
  seanceName: string;  
  seance:any;       // Le nom de l'activité (récupéré à partir de la séance)
  joueurId: string;  
  dateInscription: string; 
  statut: string;  
  presenceConfirmee: boolean;  
  commentaire: string | null; 
}