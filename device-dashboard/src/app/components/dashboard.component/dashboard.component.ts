import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DeviceService } from '../../services/device.service';
import { DeviceCardComponent } from '../device-card.component/device-card.component';
import { Device } from '../../models/device.model';
import { SpinnerComponent } from '../../shared/spinner.component/spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DeviceCardComponent,SpinnerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  devices: Device[] = [];
  isLoading = true;
  searchQuery = '';
  activeFilter = 'tous';
  stats = { total: 0, online: 0, offline: 0, maintenance: 0 };
  filters = ['tous', 'online', 'offline', 'maintenance'];

  private sub!: Subscription;
  private searchSub!: Subscription;
  private searchSubject = new Subject<string>();

  private statsSub!: Subscription;
  private loadingSub!: Subscription;

  constructor(private deviceService: DeviceService) { }

  ngOnInit(): void {
    this.statsSub = this.deviceService.getStats().subscribe(stats => {
      this.stats = stats;
    });


    this.sub = this.deviceService.getFilteredDevices().subscribe(devices => {
      this.devices = devices;
    });

    this.loadingSub = this.deviceService.getLoadingState().subscribe(isLoading => {
      this.isLoading = isLoading;
    });


    this.searchSub = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.deviceService.setSearch(query);
    });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onFilter(status: string): void {
    this.activeFilter = status;
    this.deviceService.setFilter(status);
  }

  getFilterLabel(status: string): string {
    const labels: Record<string, string> = {
      tous: 'Tous', online: 'En ligne',
      offline: 'Hors ligne', maintenance: 'Maintenance'
    };
    return labels[status];
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
    if (this.searchSub) this.searchSub.unsubscribe();
    if (this.statsSub) this.statsSub.unsubscribe();
    if (this.loadingSub) this.loadingSub.unsubscribe();
  }
}