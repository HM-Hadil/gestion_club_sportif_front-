import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { UserResult } from '../models/UserResult';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http:HttpClient) { }

  private api = 'http://localhost:9092/api/users'; 


   getInactivePartners(): Observable<UserResult[]> {
    const url = `${this.api}/inactive`;
    return this.http.get<UserResult[]>(url)
      .pipe(
        tap(_ => console.log('Fetched inactive partners')),
        catchError(this.handleError<UserResult[]>('getInactivePartners', []))
      );
  }
  

    /**
   * Activate a partner account.
   * @param id - The UUID of the user to activate.
   * @returns An observable of the activation response.
   */
    activatePartnerAccount(id: string): Observable<any> {
      const url = `http://localhost:9092/api/auth/activateEntreneur`;
      return this.http.post<any>(url, null, {
        params: { id },
        headers: this.httpOptions.headers
      })
      .pipe(
        tap(_ => console.log(`Activated partner account with id=${id}`)),
        catchError(this.handleError<any>('activatePartnerAccount'))
      );
    }


   /**
   * Delete a partner account.
   * @param id - The UUID of the user to delete.
   * @returns An observable of the response.
   */
   deletePartnerAccount(id: string): Observable<any> {
    const url = `${this.api}users/delete`;
    return this.http.delete<any>(url, {
      params: { id },
      headers: this.httpOptions.headers
    })
    .pipe(
      tap(_ => console.log(`Deleted partner account with id=${id}`)),
      catchError(this.handleError<any>('deletePartnerAccount'))
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
}
