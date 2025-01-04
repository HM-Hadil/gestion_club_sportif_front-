export interface Activite {
  id: string;
  nom: string;
  entraineur: {
    id: string;
    firstname: string;
    lastname: string;
  };
  seances: Array<{
    id: number;
    dateDebut: string; // Type string car récupéré depuis l'API JSON
    dateFin: string;   // Type string car récupéré depuis l'API JSON
    nombreLimite: number;
    prix: number;
    status: string;
    salle: {
      id: number;
      nom: string;
    };
  }>;
}
