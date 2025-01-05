import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { InscriptionService } from '../../../services/inscription.service';

@Component({
  selector: 'app-mes-inscription',
  standalone: true,
  imports: [],
  templateUrl: './mes-inscription.component.html',
  styleUrl: './mes-inscription.component.css'
})
export class MesInscriptionComponent {
  userInfo: any = null;
  error: string | null = null;
  inscriptions: any[] = [];

  
  constructor(
    private authService: AuthService,
    private inscriptionService: InscriptionService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('user');
    if (token) {
      try {
        const tokenParts = token.split('.');
        const decodedToken = JSON.parse(atob(tokenParts[1]));
        const email = decodedToken.sub;

        this.authService.getUserInfo(email).subscribe({
          next: (response) => {
            this.userInfo = response;

            this.inscriptionService.getMesInscriptions(response.id).subscribe({
              next: (inscriptions) => {
                this.inscriptions = inscriptions;
                console.log(inscriptions);
              },
              error: (err) => {
                this.error = 'Erreur lors de la récupération des inscriptions.';
                console.error(err);
              }
            });
          },
          error: (err) => {
            this.error = 'Erreur lors de la récupération des informations utilisateur.';
            console.error(err);
          }
        });
      } catch (err) {
        this.error = 'Token invalide ou expiré.';
        console.error(err);
      }
    } else {
      this.error = "Aucun utilisateur n'est connecté.";
    }
  }
  reserver(inscriptionId: number): void {
    // Appeler le service pour confirmer la présence
    this.inscriptionService.confirmerPresence(inscriptionId).subscribe(() => {
      // Rafraîchir les inscriptions après la confirmation
      this.ngOnInit();
    });
  }

  annuler(inscriptionId: number): void {
    // Appeler le service pour annuler l'inscription
    this.inscriptionService.annulerInscription(inscriptionId).subscribe(() => {
      // Rafraîchir les inscriptions après l'annulation
      this.ngOnInit();
    });
  }
 }