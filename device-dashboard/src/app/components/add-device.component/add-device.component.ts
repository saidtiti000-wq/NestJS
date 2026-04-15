import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DeviceService } from '../../services/device.service';
import { Device } from '../../models/device.model';
import { DeviceFormComponent } from '../device-form.component/device-form.component';

@Component({
    selector: 'app-add-device',
    standalone: true,
    imports: [CommonModule,RouterModule, DeviceFormComponent],
    templateUrl: './add-device.component.html',
    styleUrl: './add-device.component.scss'
})
export class AddDeviceComponent {
    newDevice: Partial<Device> = {
        status: 'online',
        os: 'Unknown',
        ip: '0.0.0.0',
        lastSeen: new Date().toISOString()
    };

    isSubmitting = false;

    constructor(private deviceService: DeviceService, private router: Router) { }

    onSubmit(): void {
        this.isSubmitting = true;
        this.deviceService.addDevice(this.newDevice).subscribe({
            next: () => {
                this.isSubmitting = false;
                this.router.navigate(['/']);
            },
            error: (err: unknown) => {
                console.error('Erreur lors de l\'ajout', err);
                this.isSubmitting = false;

            }
        });
    }
}
