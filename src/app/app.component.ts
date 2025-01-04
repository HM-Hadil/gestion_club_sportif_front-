import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ActivitesComponent } from './components/activites/activites.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ActivitesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gestion_club_sportif_front';
}
