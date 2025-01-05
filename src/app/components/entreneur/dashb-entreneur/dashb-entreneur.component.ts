import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashb-entreneur',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './dashb-entreneur.component.html',
  styleUrl: './dashb-entreneur.component.css'
})
export class DashbEntreneurComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  logout() {
    // Call the logout method from AuthService
    this.authService.logout();

    // Redirect the user to the login page or any other route
    this.router.navigate(['/login']);
  }
}
