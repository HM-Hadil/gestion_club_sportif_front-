import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Activite } from '../../models/Activite';
import { ActiviteService } from '../../services/activite.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import Swal from 'sweetalert2';
import { AsyncPipe, DatePipe, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-activites',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, NgIf, AsyncPipe, DatePipe],
  templateUrl: './activites.component.html',
  styleUrl: './activites.component.css'
})
export class ActivitesComponent {
  activites: Activite[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private activiteService: ActiviteService,
    private http: HttpClient,  private authService: AuthService,
    private router: Router
  ) {
  
  }

  ngOnInit() {
    this.loadActivites();
  }

  private loadActivites(): void {
    this.loading = true;
    this.error = '';
    
    this.http.get<Activite[]>('http://localhost:9092/activites').subscribe({
      next: (response) => {
        this.activites = response;
        console.log(response, this.activites);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des activités';
        this.loading = false;
        console.error('Erreur HTTP:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  inscrireASeance(seanceId: number): void {
    const token = localStorage.getItem('user');
    if (token) {
      const tokenParts = token.split('.');
      const decodedToken = JSON.parse(atob(tokenParts[1]));
      const email = decodedToken.sub;  // Extraire l'email du token

      // Récupérer les informations de l'utilisateur
      this.authService.getUserInfo(email).subscribe(user => {
        const joueurId = user.id;

        // Inscrire le joueur à la séance
        this.authService.inscrireASeance(seanceId, joueurId).subscribe({
          next: (response) => {
            console.log('Joueur inscrit avec succès!', response);
            // Afficher une notification de succès
            Swal.fire({
              icon: 'success',
              title: 'Inscription réussie',
              text: 'Le joueur a été inscrit à la séance avec succès.',
            });
          },
          error: (err) => {
            console.error('Erreur d\'inscription:', err);
            if (err.status === 403) {  // Vérifiez si c'est l'erreur de séance commencée
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Cette séance a déjà commencé. Vous ne pouvez pas inscrire un joueur à cette séance.',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Erreur d\'inscription',
                text: 'Une erreur inconnue est survenue. Veuillez réessayer.',
              });
            }
          }
        });
      });
    } else {
      console.error('Token d\'authentification manquant');
    }
  }
}