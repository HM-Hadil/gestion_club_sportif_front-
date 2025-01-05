import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Salle } from '../../../models/Salle';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-list-salle',
  standalone: true,
  imports: [],
  templateUrl: './list-salle.component.html',
  styleUrl: './list-salle.component.css'
})
export class ListSalleComponent {
  salles: Salle[] = [];

  constructor(private salleService: AdminService) {}

  ngOnInit(): void {
    // Fetch the list of salles when the component initializes
    this.getSalles();
  }

  // Method to get all salles
  getSalles(): void {
    this.salleService.getAllSalles().subscribe(
      (response) => {
        this.salles = response; // Set the salles array with the response from the backend
      },
      (error) => {
        console.error('Error fetching salles', error);
      }
    );
  }

  // Method to delete a salle
  deleteSalle(id: number): void {
    // Use SweetAlert2 for confirmation before deletion
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette salle sera définitivement supprimée!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, proceed with the delete
        this.salleService.deleteSalle(id).subscribe(
          () => {
            Swal.fire(
              'Supprimée!',
              'La salle a été supprimée avec succès.',
              'success'
            );
            // Refresh the list of salles
            this.getSalles();
          },
          (error) => {
            console.error('Error deleting salle', error);
            // Display SweetAlert with error message if salle has scheduled sessions
            if (error.error.includes("Impossible de supprimer la salle")) {
              Swal.fire(
                'Erreur!',
                'Impossible de supprimer la salle car elle a des séances programmées.',
                'error'
              );
            } else {
              Swal.fire(
                'Erreur!',
                'Il y a eu un problème lors de la suppression de la salle.',
                'error'
              );
            }
          }
        );
      }
    });
  }
}