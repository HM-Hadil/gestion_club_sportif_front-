import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Activite } from '../models/Activite';
import { ActiviteRequest } from '../models/ActiviteRequest';
import { Seance } from '../models/Seance';

@Injectable({
  providedIn: 'root'
})
export class ActiviteService {

  private apiUrl = 'http://localhost:9092/activites';

  constructor(private http: HttpClient) {}

  getAllActivites(): Observable<Activite[]> {
    return this.http.get<Activite[]>(this.apiUrl);
  }
  getActiviteById(id: number): Observable<Activite> {
    return this.http.get<Activite>(`${this.apiUrl}/${id}`);
  }

  getActivitiesByEntraineur(entraineurId: string): Observable<Activite[]> {
    return this.http.get<Activite[]>(`${this.apiUrl}/entraineur/${entraineurId}`);
  }
  createActivite(activiteRequest: ActiviteRequest): Observable<Activite> {
    return this.http.post<Activite>(`${this.apiUrl}/activites`, activiteRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage: string;
        let errorType: string;
  
        if (error.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error.message) {
            errorMessage = error.error.message;
            errorType = error.error.error; // Extrait le type d'erreur, ex: SALLE_RESERVEE
          } else {
            errorMessage = 'Une erreur inattendue est survenue';
          }
        } else {
          errorMessage = 'Erreur de communication avec le serveur';
        }
  
        return throwError(() => ({
          type: errorType || 'AUTRE',
          message: errorMessage,
        }));
      })
    );
  }
  

  updateActivite(id: number, activite: any): Observable<Activite> {
    return this.http.put<Activite>(`${this.apiUrl}/${id}`, activite);
  }

  // Mettre à jour les séances d'une activité
  updateActiviteSeances(
    activiteId: number, 
    seances: Seance[], 
    salleId: number
  ): Observable<Activite> {
    return this.http.put<Activite>(
      `${this.apiUrl}/${activiteId}/seances`, 
      seances,
      { params: { salleId: salleId.toString() } }
    );
  }

  // Supprimer une activité
  deleteActivite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Supprimer une séance
  deleteSeance(activiteId: number, seanceId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${activiteId}/seances/${seanceId}`);
  }
}
