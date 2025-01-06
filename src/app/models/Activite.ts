import { Seance } from "./Seance";
import { UserRequest } from "./UserRequest";
import { UserResult } from "./UserResult";

export interface Activite {

  id: number;
    nom: string;
    entraineurId:string;
    seances: Seance[];
     entraineurFirstname:string;  
     entraineurLastname:string;
     
     entraineur: UserResult;
}