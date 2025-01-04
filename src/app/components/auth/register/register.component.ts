import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserRequest } from '../../../models/UserRequest';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // Correction ici
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  error: string = '';
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Joueur', [Validators.required]] // Valeur par défaut
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const userData: UserRequest = {
      firstname: this.registerForm.get('firstname')?.value, // Correction ici
      lastname: this.registerForm.get('lastname')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      phone: this.registerForm.get('phone')?.value,
      role: this.registerForm.get('role')?.value
    };


    this.authService.register(userData).subscribe({
      next: (response) => {

        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.error = error.error?.message || 'Une erreur est survenue lors de l\'inscription';
        this.loading = false;
      }
    });
  }
}
