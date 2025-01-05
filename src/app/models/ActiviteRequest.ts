import { SeanceRequest } from "./SeanceRequest";

export interface ActiviteRequest {
  entraineurId: string;
  nom: string;
  seances: SeanceRequest[];
}