import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Device } from '../../models/device.model';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-device-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './device-card.component.html',
  styleUrl: './device-card.component.scss'
})
export class DeviceCardComponent {
  @Input() device!: Device;

  constructor(private deviceService: DeviceService) { }

  onDelete(event: Event): void {
    event.stopPropagation();
    if (confirm(`est ce que tu veux vraiment supprimer "${this.device.name}" ?`)) {
      this.deviceService.deleteDevice(this.device.id).subscribe();
    }
  }

  getIcon(): string {
    const icons: Readonly<Record<string, string>> = {
      Laptop: '💻', Serveur: '🖧', Imprimante: '🖨️',
      Switch: '🔀', Desktop: '🖥️', Caméra: '📷',
      Stockage: '💾', Routeur: '📡'
    };
    return icons[this.device.type] ?? '🔧';
  }

  getStatusLabel(): string {
    const labels: Readonly<Record<Device['status'], string>> = {
      online: 'En ligne',
      offline: 'Hors ligne',
      maintenance: 'Maintenance'
    };
    return labels[this.device.status];
  }
}