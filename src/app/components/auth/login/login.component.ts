import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Correction de styleUrl -> styleUrls
})
export class LoginComponent {
  loginForm!: FormGroup;
  error: string = '';
  loading: boolean = false;
  role!: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(
      this.f['email'].value,
      this.f['password'].value
    ).subscribe({
      next: (response) => {
        // Store the token in localStorage (if successful)
        
        // Decode the token to extract user information
        const token = localStorage.getItem('user');
        if (token) {
          const tokenParts = token.split('.');
          const decodedToken = JSON.parse(atob(tokenParts[1]));
          const email = decodedToken.sub;  // Extract the email from the token

          // Fetch user info from the backend based on the email
          this.authService.getUserInfo(email).subscribe(user => {
            this.role = user.role;
            console.log('role',this.role) // Get the user's role
            
            // Display a SweetAlert2 success message
            Swal.fire({
              title: 'Connexion réussie !',
              text: 'Bienvenue sur votre profil.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              // Redirect based on the user's role
              if (this.role === 'Entreneur') {
                this.router.navigate(['/trainer-dashboard']); 
              } else if (this.role === 'Joueur') {
                this.router.navigate(['/dashboardJoueur']);  
              } else {
                // Handle unknown roles if needed
                this.router.navigate(['/login']);
              }
            });
          });
        }
      },
      error: (error) => {
        // Handle error with SweetAlert2
        Swal.fire({
          title: 'Erreur',
          text: error.error || 'Une erreur est survenue',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.loading = false;
      }
    });
  }
}
