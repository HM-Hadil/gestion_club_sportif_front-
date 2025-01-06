import { Activite } from "./Activite";

export interface SeanceIns {
  id: number;
  activite: Activite;
  dateDebut: Date;
  dateFin: Date;
  capaciteMax: number;
  description?: string;
}