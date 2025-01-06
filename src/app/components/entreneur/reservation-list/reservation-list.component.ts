import { Component } from '@angular/core';
import { ActiviteService } from '../../../services/activite.service';
import { InscriptionService } from '../../../services/inscription.service';
import { Inscription } from '../../../models/Inscription';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserResult } from '../../../models/UserResult';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [DatePipe,NgClass],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.css'
})
export class ReservationListComponent {
  seanceId: number = 0;
  inscriptions: Inscription[] = [];
  usersMap: Map<string, UserResult> = new Map();
  loading: boolean = true;
  error: string | null = null;
  nombreInscrits: number = 0;
  nombreConfirmes: number = 0;
  nombreEnAttente: number = 0;
  nombreAnnules: number = 0;

  constructor(
    private route: ActivatedRoute,
    private inscriptionService: InscriptionService,
    private userService: AuthService,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
     
      this.seanceId = +params['seanceId'];
      this.loadInscriptions();
    });
  }

  private loadInscriptions() {
    this.loading = true;
    this.inscriptionService.getInscriptionsBySeance(this.seanceId)
      .subscribe({
        next: (inscriptions) => {
          console.log('Inscriptions reçues:', inscriptions); // Vérifiez les données
          this.inscriptions = inscriptions;
          this.updateStatistics();
          this.loadUsersInfo();
        },
        error: (error) => {
          this.error = 'Une erreur est survenue lors du chargement des inscriptions.';
          this.loading = false;
          console.error('Erreur:', error);
        }
      });
  }
  

  private updateStatistics() {
    this.nombreInscrits = this.inscriptions.length;
    this.nombreConfirmes = this.inscriptions.filter(i => i.statut === 'CONFIRMÉ').length;
    this.nombreEnAttente = this.inscriptions.filter(i => i.statut === 'EN_ATTENTE').length;
    this.nombreAnnules = this.inscriptions.filter(i => i.statut === 'ANNULÉ').length;
  }
  private loadUsersInfo() {
    const uniqueJoueurIds = [...new Set(
      this.inscriptions
        .map(i => i.joueurId)
        .filter(joueurId => joueurId) // Filtrer les joueurs inexistants
    )];
  
    if (uniqueJoueurIds.length === 0) {
      console.warn('Aucun joueur ID valide trouvé.');
      this.loading = false;
      return;
    }
  
    Promise.all(
      uniqueJoueurIds.map(joueurId => this.userService.getUserById(joueurId).toPromise())
    ).then(users => {
      users.forEach(user => {
        if (user) {
          this.usersMap.set(user.id, user);
        }
      });
      this.loading = false;
    }).catch(error => {
      console.error('Erreur lors du chargement des informations utilisateurs:', error);
      this.loading = false;
    });
  }
  
  getUserInfo(joueurId: string): UserResult | undefined {
    return this.usersMap.get(joueurId);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'CONFIRMÉ':
        return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ANNULÉ':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  }}