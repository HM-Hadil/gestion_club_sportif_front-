import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserRequest } from '../models/UserRequest';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:9092/api/auth';
  private userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user') || 'null'));

  constructor(private http: HttpClient) {}

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
}
