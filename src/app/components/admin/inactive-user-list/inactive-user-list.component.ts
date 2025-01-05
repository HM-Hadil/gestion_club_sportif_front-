import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { UserResult } from '../../../models/UserResult';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-inactive-user-list',
  standalone: true,
  imports: [],
  templateUrl: './inactive-user-list.component.html',
  styleUrl: './inactive-user-list.component.css'
})
export class InactiveUserListComponent {


  users: UserResult[] = [];
  errorMessage: string = '';
  message: string = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadInactivePartners();
  }

  loadInactivePartners(): void {
    this.userService.getInactivePartners().subscribe(
      partners => {this.users = partners;
        console.log("partner accounts list",partners)
      }
    );
  }

  accepter(id:string){

    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to activate this partner's account?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, activate it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.activatePartnerAccount(id)
          .subscribe(
            response => {
              this.message = 'Account activated successfully. Please check the user\'s email for login details.';
              Swal.fire(
                'Activated!',
                'The partner account has been activated.',
                'success'
              );
              this.loadInactivePartners();
            },
            error => {
              this.message = 'An error occurred while activating the account.';
              Swal.fire(
                'Error!',
                'An error occurred while activating the account.',
                'error'
              );
            }
          );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'The activation was cancelled.',
          'info'
        );
      }
    });
  }

  delete(id:string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this partner's account?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deletePartnerAccount(id)
          .subscribe(
            response => {
              this.message = 'Account deleted successfully.';
              Swal.fire(
                'Deleted!',
                'The partner account has been deleted.',
                'success'
              );
              this.loadInactivePartners();

            },
            error => {
              this.message = 'An error occurred while deleting the account.';
              Swal.fire(
                'Error!',
                'An error occurred while deleting the account.',
                'error'
              );
            }
          );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'The deletion was cancelled.',
          'info'
        );
      }
    });
  }
}
