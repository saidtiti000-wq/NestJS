import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DeviceService } from '../../services/device.service';
import { Device } from '../../models/device.model';
import { DeviceFormComponent } from '../device-form.component/device-form.component';
import { SpinnerComponent } from '../../shared/spinner.component/spinner.component';

@Component({
  selector: 'app-edit-device',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DeviceFormComponent,
    SpinnerComponent    // ✅ REQUIRED
  ],
  templateUrl: './edit-device.component.html',
  styleUrl: '../add-device.component/add-device.component.scss'
})
export class EditDeviceComponent implements OnInit {

  device: Partial<Device> = {
    status: 'online',
    os: 'Unknown',
    ip: '0.0.0.0'
  };

  isSubmitting = false;
  isLoading = true;
  hasError = false;
  id!: string;

  constructor(
    private deviceService: DeviceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    if (!this.id) {
      this.router.navigate(['/']);
      return;
    }

    this.deviceService.getDevice(this.id).subscribe({
      next: (dev) => {
        this.device = dev || {};
        this.hasError = !dev;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  onSubmit(): void {
    this.isSubmitting = true;
    this.deviceService.updateDevice(this.id, this.device).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (err: unknown) => {
        console.error('Erreur lors de la mise à jour', err);
        this.isSubmitting = false;
      }
    });
  }
}