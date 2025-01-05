import { Component } from '@angular/core';
import { ActiviteService } from '../../../services/activite.service';
import { AuthService } from '../../../services/auth.service';
import { Activite } from '../../../models/Activite';
import { DatePipe } from '@angular/common';
import { Seance } from '../../../models/Seance';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.css'
})
export class ActivityListComponent {
  activites: Activite[] = [];
  entraineurId: string = '';
prochaineSceance: any;
expandedActiviteId: number | null = null;


  constructor(
    private activiteService: ActiviteService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getEntraineurIdFromToken();
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
}

