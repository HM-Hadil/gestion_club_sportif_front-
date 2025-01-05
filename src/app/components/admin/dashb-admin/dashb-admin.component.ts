import { Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashb-admin',
  standalone: true,
  imports: [SidebarComponent,RouterOutlet,RouterLink],
  templateUrl: './dashb-admin.component.html',
  styleUrl: './dashb-admin.component.css'
})
export class DashbAdminComponent {

}
