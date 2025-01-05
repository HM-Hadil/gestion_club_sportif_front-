import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Salle } from '../../../models/Salle';
import { ActiviteService } from '../../../services/activite.service';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';
import { ActiviteRequest } from '../../../models/ActiviteRequest';

@Component({
  selector: 'app-add-activity',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.css']
})
export class AddActivityComponent {
  activiteForm: FormGroup;
  salles: Salle[] = [];
  loading = false;
  entraineurId: string = '';
  errorMessages: string[] = [];
  seanceErrors: { [key: number]: string } = {};

  constructor(
    private fb: FormBuilder,
    private activiteService: ActiviteService,
    private salleService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {
    this.activiteForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      seances: this.fb.array([])
    });
  }

  ngOnInit() {
    this.getEntraineurIdFromToken();
    this.loadSalles();
    this.addSeance(); // Ajouter une première séance par défaut
  }

  private getEntraineurIdFromToken() {
    const token = localStorage.getItem('user');
    if (token) {
      const tokenParts = token.split('.');
      const decodedToken = JSON.parse(atob(tokenParts[1]));
      const email = decodedToken.sub;

      this.authService.getUserInfo(email).subscribe({
        next: (user) => {
          this.entraineurId = user.id;
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
        }
      });
    }
  }

  get seances() {
    return this.activiteForm.get('seances') as FormArray;
  }

  createSeanceFormGroup(): FormGroup {
    return this.fb.group({
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      nombreLimite: ['', [Validators.required, Validators.min(1)]],
      prix: ['', [Validators.required, Validators.min(0)]],
      status: ['DISPONIBLE'],
      salleId: ['', Validators.required]
    });
  }

  addSeance() {
    this.seances.push(this.createSeanceFormGroup());
  }

  removeSeance(index: number) {
    this.seances.removeAt(index);
    delete this.seanceErrors[index];
  }

  loadSalles(): void {
    this.salleService.getAllSalles().subscribe({
      next: (response) => {
        this.salles = response;
      },
      error: (error) => {
        console.error('Error fetching salles:', error);
      }
    });
  }

  onSubmit() {
    if (this.activiteForm.valid) {
      this.loading = true;
      this.errorMessages = [];
      this.seanceErrors = {};
  
      const activiteRequest: ActiviteRequest = {
        entraineurId: this.entraineurId,
        nom: this.activiteForm.value.nom,
        seances: this.activiteForm.value.seances,
      };
  
      this.activiteService.createActivite(activiteRequest).subscribe({
        next: () => {
          this.router.navigate(['/activites']);
        },
        error: (error) => {
          this.loading = false;
  
          if (error.type === 'SALLE_RESERVEE') {
            const seanceIndex = this.findSeanceIndexFromError(error.message);
            if (seanceIndex !== -1) {
              this.seanceErrors[seanceIndex] = error.message;
            } else {
              this.errorMessages.push(error.message);
            }
          } else {
            this.errorMessages.push(error.message || 'Une erreur est survenue lors de la création de l\'activité');
          }
        }
      });
    } else {
      this.errorMessages.push('Veuillez remplir correctement tous les champs requis.');
    }
  }
  

  private findSeanceIndexFromError(errorMessage: string): number {
    const match = errorMessage.match(/Séance (\d+)/);
    if (match && match[1]) {
      return parseInt(match[1], 10) - 1;
    }
    return -1;
  }
}
