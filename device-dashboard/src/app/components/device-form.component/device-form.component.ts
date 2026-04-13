import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Device } from '../../models/device.model';

@Component({
  selector: 'app-device-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './device-form.component.html',
  styleUrl: './device-form.component.scss',
})
export class DeviceFormComponent {
  @Input() device: Partial<Device> = {};
  @Input() isSubmitting = false;
  @Input() submitLabel = "Enregistrer";
  @Input() submittingLabel = "Traitement en cours...";

  @Output() submitted = new EventEmitter<void>();

  onSubmit(): void {
    this.submitted.emit();
  }
  

}


