import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inscription } from '../models/Inscription';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {

  private apiUrl = 'http://localhost:9092/api/inscriptions'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  // Récupérer les inscriptions de l'utilisateur connecté
  getMesInscriptions(id:string): Observable<Inscription[]> {
    return this.http.get<Inscription[]>(`${this.apiUrl}/mes-inscriptions/${id}`);
  }
  confirmerPresence(inscriptionId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${inscriptionId}/confirmerPresence`, {});
  }

  annulerInscription(inscriptionId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${inscriptionId}/annuler`, {});
  }
}
