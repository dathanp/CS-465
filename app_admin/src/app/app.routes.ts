import { Routes } from '@angular/router';
import { AddTripComponent } from './add-trip/add-trip.component';
import { TripListingComponent } from './trip-listing/trip-listing.component';
import { EditTripComponent } from './edit-trip/edit-trip.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AdminGuard } from './admin.guard';
import { AdminRegisterComponent } from './admin-register/admin-register.component';
import { UsersComponent } from './users/users.component';
import { LayoutComponent } from './layout/layout.component';
import { ReservationsComponent } from './reservations/reservations.component';

export const routes: Routes = [

    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'admin-register', component: AdminRegisterComponent },
    { path: 'login', component: LoginComponent },
    {
      path: '',
      component: LayoutComponent,
      children: [
        { path: 'add-trip', component: AddTripComponent, canActivate: [AdminGuard] },
        { path: 'edit-trip', component: EditTripComponent, canActivate: [AdminGuard] },
        { path: 'reservations', component: ReservationsComponent },
        { path: 'list-trips', component: TripListingComponent },
        { path: 'users', component: UsersComponent },
      ],
    },
  ];