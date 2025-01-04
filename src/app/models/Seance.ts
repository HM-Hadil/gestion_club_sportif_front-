import { Inscription } from "./Inscription";
import { Salle } from "./Salle";

export interface Seance {
  id: number;
  dateDebut: string;
  dateFin: string;
  nombreLimite: number;
  prix: number;
  status: string;
  salle: Salle;
}