import { Seance } from "./Seance";

export interface Activite {

  id: number;
    nom: string;
    entraineurId:string;
    seances: Seance[];
     entraineurFirstname:string;  // Prénom de l'entraîneur
     entraineurLastname:string;
}