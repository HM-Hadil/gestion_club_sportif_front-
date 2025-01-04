import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Activite } from '../models/Activite';

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

  createActivite(activite: any): Observable<Activite> {
    return this.http.post<Activite>(`${this.apiUrl}/activites`, activite);
  }

  updateActivite(id: number, activite: any): Observable<Activite> {
    return this.http.put<Activite>(`${this.apiUrl}/${id}`, activite);
  }

  deleteActivite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
