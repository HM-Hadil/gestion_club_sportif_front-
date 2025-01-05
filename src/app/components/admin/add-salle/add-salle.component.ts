import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Salle } from '../../../models/Salle';
import { AdminService } from '../../../services/admin.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-salle',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-salle.component.html',
  styleUrl: './add-salle.component.css'
})
export class AddSalleComponent {
  salleForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,private router:Router, private salleService: AdminService) {}

  ngOnInit(): void {
    // Initialize the form with validation
    this.salleForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      status: ['', Validators.required]
    });
  }

  // Getter for easy access to form controls in the template
  get f() { return this.salleForm.controls; }

  onSubmit(): void {
    if (this.salleForm.invalid) {
      return; // Do not submit the form if it's invalid
    }

    const newSalle: Salle = {
      id: 0, // Automatically handled by the backend (or can be omitted)
      nom: this.salleForm.value.nom,
      status: this.salleForm.value.status
    };

    this.salleService.createSalle(newSalle).subscribe(
      (response) => {
        console.log('Salle created successfully', response);

        // SweetAlert2 Success message
        Swal.fire({
          icon: 'success',
          title: 'Salle created!',
          text: 'The salle has been successfully created.',
          confirmButtonText: 'OK'
        }).then(() => {
          // Redirect to the listSalle page after success
          this.router.navigate(['/list-salle']);
        });
      },
      (error) => {
        console.error('Error creating salle', error);

        // SweetAlert2 Error message
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'There was an error creating the salle. Please try again.',
          confirmButtonText: 'OK'
        });
      }
    );
  }}