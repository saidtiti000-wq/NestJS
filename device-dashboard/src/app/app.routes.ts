import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component/dashboard.component';
import { AddDeviceComponent } from './components/add-device.component/add-device.component';
import { EditDeviceComponent } from './components/edit-device.component/edit-device.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent, title: 'Dashboard' },
    { path: 'add', component: AddDeviceComponent, title: 'Ajouter un équipement' },
    { path: 'edit/:id', component: EditDeviceComponent, title: 'Modifier un équipement' },
    { path: '**', redirectTo: '' }
];
