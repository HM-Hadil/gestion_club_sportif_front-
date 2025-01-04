import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Activite } from '../../models/Activite';
import { ActiviteService } from '../../services/activite.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-activites',
  standalone: true,
  imports: [],
  templateUrl: './activites.component.html',
  styleUrl: './activites.component.css'
})
export class ActivitesComponent {
  activites: Activite[] = [];
  isEntraineur: boolean = false;
  loading: boolean = true;
  error: string = '';

  constructor(
    private activiteService: ActiviteService,
    private authService: AuthService,private http :HttpClient
  ) {
    const user = this.authService.userValue;
     }

  ngOnInit() {
    this.loadActivites();
  }

  private loadActivites(): void {
    this.http.get('http://localhost:9092/activites').subscribe({
      next: (response) => {
        try {
          const data = JSON.parse(JSON.stringify(response));
          console.log('Données récupérées :', data);
        } catch (e) {
          console.error('Erreur de parsing JSON:', e);
        }
      },
      error: (err) => {
        console.error('Erreur HTTP:', err);
      }
    });
  
  }
}
