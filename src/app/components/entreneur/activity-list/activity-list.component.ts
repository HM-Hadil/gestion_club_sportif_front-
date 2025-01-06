import { Component } from '@angular/core';
import { ActiviteService } from '../../../services/activite.service';
import { AuthService } from '../../../services/auth.service';
import { Activite } from '../../../models/Activite';
import { DatePipe } from '@angular/common';
import { Seance } from '../../../models/Seance';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Salle } from '../../../models/Salle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [DatePipe,ReactiveFormsModule],
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.css'
})
export class ActivityListComponent {
activites: Activite[] = [];
entraineurId: string = '';
prochaineSceance: any;
expandedActiviteId: number | null = null;
salles: Salle[] = [];
showSeanceForm = false;
selectedActiviteId: number | null = null;
seanceForm!: FormGroup;

  
constructor(
  private activiteService: ActiviteService,
  private authService: AuthService,
  private salleService: AdminService,
  private fb: FormBuilder,private router : Router
) {
  this.initSeanceForm();
}
private initSeanceForm() {
  this.seanceForm = this.fb.group({
    dateDebut: ['', Validators.required],
    dateFin: ['', Validators.required],
    prix: ['', [Validators.required, Validators.min(0)]],
    nombreLimite: ['', [Validators.required, Validators.min(1)]],
    salleId: ['', Validators.required]
  });
}
  ngOnInit() {
    this.getEntraineurIdFromToken();
    this.loadSalles();

  }

  toggleActivite(activiteId: number) {
    this.expandedActiviteId = this.expandedActiviteId === activiteId ? null : activiteId;
  }

  private getEntraineurIdFromToken() {
    const token = localStorage.getItem('user');
    if (token) {
      const tokenParts = token.split('.');
      const decodedToken = JSON.parse(atob(tokenParts[1]));
      const email = decodedToken.sub;

      this.authService.getUserInfo(email).subscribe(
        user => {
          this.entraineurId = user.id;
          this.loadActivites();
        },
        error => {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
        }
      );
    }
  }
  showAddSeanceForm(activiteId: number) {
    this.selectedActiviteId = activiteId;
    this.showSeanceForm = true;
    this.initSeanceForm(); // Réinitialiser le formulaire
  }

  submitSeance() {
    if (this.seanceForm.valid && this.selectedActiviteId) {
      const seanceData = {
        ...this.seanceForm.value,
        salleId: Number(this.seanceForm.value.salleId),
        status: 'DISPONIBLE' // Ajoutez le statut par défaut
      };

      // Créez un tableau avec la nouvelle séance
      const seances = [seanceData];

      this.activiteService.updateActiviteSeances(
        this.selectedActiviteId,
        seances,
        seanceData.salleId
      ).subscribe({
        next: (updatedActivite) => {
          console.log('Séance ajoutée avec succès:', updatedActivite);
          const index = this.activites.findIndex(a => a.id === this.selectedActiviteId);
          if (index !== -1) {
            this.activites[index] = updatedActivite;
          }
          this.cancelAddSeance();
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de la séance:', error);
          // Ajoutez ici la gestion des erreurs (par exemple, afficher un message à l'utilisateur)
        }
      });
    }
  }
  cancelAddSeance() {
    this.showSeanceForm = false;
    this.selectedActiviteId = null;
    this.seanceForm.reset();
  }
  private loadActivites() {
    this.activiteService.getActivitiesByEntraineur(this.entraineurId)
      .subscribe(
        (data) => {
          this.activites = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération des activités:', error);
        }
      );
  }

  loadSalles(): void {
    this.salleService.getAllSalles().subscribe({
      next: (response) => {
        this.salles = response;
        console.log('Salles chargées:', this.salles); 
      },
      error: (error) => {
        console.error('Error fetching salles:', error);
      }
    });
  }

 

  updateActivite(activite: Activite) {
    this.activiteService.updateActivite(activite.id, activite).subscribe({
      next: (updatedActivite) => {
        const index = this.activites.findIndex(a => a.id === updatedActivite.id);
        if (index !== -1) {
          this.activites[index] = updatedActivite;
        }
        // Ajoutez ici un message de succès
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        // Ajoutez ici la gestion des erreurs
      }
    });
  }

  updateSeances(activiteId: number, seances: Seance[], salleId: number) {
    this.activiteService.updateActiviteSeances(activiteId, seances, salleId).subscribe({
      next: (updatedActivite) => {
        const index = this.activites.findIndex(a => a.id === updatedActivite.id);
        if (index !== -1) {
          this.activites[index] = updatedActivite;
        }
        // Ajoutez ici un message de succès
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour des séances:', error);
        // Ajoutez ici la gestion des erreurs
      }
    });
  }

  deleteActivite(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      this.activiteService.deleteActivite(id).subscribe({
        next: () => {
          this.activites = this.activites.filter(a => a.id !== id);
          // Ajoutez ici un message de succès
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          // Ajoutez ici la gestion des erreurs
        }
      });
    }
  }

  deleteSeance(activiteId: number, seanceId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
      this.activiteService.deleteSeance(activiteId, seanceId).subscribe({
        next: () => {
          const activite = this.activites.find(a => a.id === activiteId);
          if (activite) {
            activite.seances = activite.seances.filter(s => s.id !== seanceId);
          }
          // Ajoutez ici un message de succès
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la séance:', error);
          // Ajoutez ici la gestion des erreurs
        }
      });
    }
  }

  getStatusClass(status: string): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'DISPONIBLE':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'PRESQUE_COMPLET':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'COMPLET':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return baseClasses;
    }
  }

  viewInscriptions(seanceId: number) {
    // Navigate to the inscriptions list page with parameters
    this.router.navigate(['/inscriptions',  seanceId]);
  }
}

