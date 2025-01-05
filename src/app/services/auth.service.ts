import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserRequest } from '../models/UserRequest';
import { Router } from '@angular/router';
import { UserResult } from '../models/UserResult';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:9092/api/auth';
  private userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user') || 'null'));

  constructor(private http: HttpClient,private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/authenticate`, { email, password })
      .pipe(map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }


  register(userData: UserRequest): Observable<any> {
    const endpoint ='/register' ;
    return this.http.post(`${this.apiUrl}${endpoint}`, userData);
  }

  activateEntraineur(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/activateEntreneur`, null, {
      params: { id }
    });
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  get userValue() {
    return this.userSubject.value;
  }


  // Méthode pour inscrire un joueur à une séance
  inscrireASeance(seanceId: number, joueurId: string): Observable<any> {
  
    
  
      // L'utilisateur est un joueur, on procède à l'inscription
      return this.http.post(`http://localhost:9092/api/inscriptions/seances/${seanceId}/${joueurId}`, {});
    }
    
  

 
  getUserInfo(email: string): Observable<UserResult> {
    const url = `http://localhost:9092/api/users/user/email/${encodeURIComponent(email)}`;
    return this.http.get<UserResult>(url);
  }

 
}
