import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userInfo: any; // Stocker les informations utilisateur
  error: string = ''; // Gérer les erreurs
  email: string = ''; // Récupérer l'email de l'utilisateur connecté

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }


  ngOnInit(): void {
    // Récupérer l'email depuis le token stocké
    const token = localStorage.getItem('user');
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      this.email = tokenPayload.sub; // Extraction de l'email
    }

    if (this.email) {
      this.getUserInfo();
    }
  }

  getUserInfo(): void {
    this.authService.getUserInfo(this.email).subscribe({
      next: (data) => {
        this.userInfo = data;
      },
      error: (err) => {
        this.error = err.error || 'Impossible de récupérer les informations utilisateur';
      }
    });
  }
  logout() {
    // Call the logout method from AuthService
    this.authService.logout();

    // Redirect the user to the login page or any other route
    this.router.navigate(['/login']);
  }
}
