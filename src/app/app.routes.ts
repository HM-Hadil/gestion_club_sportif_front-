import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ActivitesComponent } from './components/activites/activites.component';
import { DashboardComponent } from './components/joueurs/dashboard/dashboard.component';
import { MesInscriptionComponent } from './components/joueurs/mes-inscription/mes-inscription.component';
import { InactiveUserListComponent } from './components/admin/inactive-user-list/inactive-user-list.component';
import { DashbAdminComponent } from './components/admin/dashb-admin/dashb-admin.component';
import { AddSalleComponent } from './components/admin/add-salle/add-salle.component';
import { ListSalleComponent } from './components/admin/list-salle/list-salle.component';
import { DashbEntreneurComponent } from './components/entreneur/dashb-entreneur/dashb-entreneur.component';
import { ActivityListComponent } from './components/entreneur/activity-list/activity-list.component';
import { AddActivityComponent } from './components/entreneur/add-activity/add-activity.component';
import { ReservationListComponent } from './components/entreneur/reservation-list/reservation-list.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
   { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'activites', component: ActivitesComponent },
  { path: '', component: HomeComponent },

  {
    path: 'dashboardJoueur',
    component: DashboardComponent,
    children: [
      { path: 'mes-inscriptions', component: MesInscriptionComponent },
    ]
  },

  {
    path: 'admin',
  component: DashbAdminComponent,
    children: [
      { path: 'add-salle', component: AddSalleComponent },
      { path: 'gestion-user', component: InactiveUserListComponent },
      {path:'list-salle',component:ListSalleComponent}
    ]
  },
  { 
        path: 'inscriptions/:seanceId', 
        component: ReservationListComponent
      },

  {
    path: 'trainer-dashboard',
    component: DashbEntreneurComponent,
    children: [
      { path: 'add-activity', component: AddActivityComponent },
      { path: 'activity-list', component: ActivityListComponent },
      { path: 'registration-list', component: ReservationListComponent },
    
      { path: '', redirectTo: 'activity-list', pathMatch: 'full' }  // Default route
    ]
  },
];
