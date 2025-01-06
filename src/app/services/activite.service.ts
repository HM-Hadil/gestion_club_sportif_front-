import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
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

  // Corriger la méthode pour ajouter des séances
  updateActiviteSeances(
    activiteId: number, 
    seances: Seance[], 
    salleId: number
  ): Observable<Activite> {
    const url = `${this.apiUrl}/${activiteId}/seances`;
    return this.http.put<Activite>(url, seances, {
      params: { salleId: salleId.toString() }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la mise à jour des séances:', error);
        return throwError(() => error);
      })
    );
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erreur inconnue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client : ${error.error.message}`;
    } else {
      errorMessage = `Erreur serveur : ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
  

  // Supprimer une activité
  deleteActivite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('user'); // ou récupérez le token de votre service d'auth
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  deleteSeance(activiteId: number, seanceId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${activiteId}/seances/${seanceId}`,
      
    );
  }
}
