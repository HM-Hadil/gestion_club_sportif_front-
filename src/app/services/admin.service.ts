import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Salle } from '../models/Salle';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:9092/salles';  // Adjust the base URL if needed

  constructor(private http: HttpClient) { }

  // Create a new salle
  createSalle(salle: Salle): Observable<Salle> {
    return this.http.post<Salle>(`${this.apiUrl}`, salle);
  }

  // Fetch all salles
  getAllSalles(): Observable<Salle[]> {
    return this.http.get<Salle[]>(`${this.apiUrl}`);
  }
 
  // Fetch available salles
  getAvailableSalles(): Observable<Salle[]> {
    return this.http.get<Salle[]>(`${this.apiUrl}/disponibles`);
  }
    // Method to delete a salle by ID
  deleteSalle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
