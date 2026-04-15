import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Device } from '../models/device.model';

interface CreateDeviceResponse {
  _id: string;
  name: string;
  type: string;
  status: string;
  ip: string;
  os: string;
  lastSeen: string;
}

interface DeleteDeviceResponse {
  deleted: boolean;
}

type DeviceMutationPayload = Partial<Pick<Device, 'name' | 'type' | 'status' | 'ip' | 'os' | 'lastSeen'>>;

@Injectable({ providedIn: 'root' })

export class DeviceService {
  private devices$ = new BehaviorSubject<Device[]>([]);
  private searchQuery$ = new BehaviorSubject<string>('');
  private statusFilter$ = new BehaviorSubject<string>('tous');
  private isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadDevices();
  }

  loadDevices(): void {
    this.isLoading$.next(true);
    this.http.get<any[]>('http://localhost:3001/devices').pipe(
      map(devices => devices.map(d => ({
        ...d,
        id: d.id || d._id
      })))
    ).subscribe({
      next: (devices) => {
        this.devices$.next(devices);
        this.isLoading$.next(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des équipements', error);
        this.isLoading$.next(false);
      }
    });
  }

  addDevice(device: DeviceMutationPayload): Observable<CreateDeviceResponse> {
    return this.http.post<CreateDeviceResponse>('http://localhost:3001/devices', device).pipe(
      tap(() => {
        this.loadDevices();
      })
    );
  }

  getDevice(id: string): Observable<Device> {
    return this.http.get<any>(`http://localhost:3001/devices/${id}`).pipe(
      map(dev => ({
        ...dev,
        id: dev.id || dev._id
      }))
    );
  }

  updateDevice(id: string, device: DeviceMutationPayload): Observable<Device> {
    const { id: _unusedId, ...sanitizedDevice } = device as any;
    const { _id: _unusedMongoId, ...finalPayload } = sanitizedDevice;
    
    return this.http.patch<Device>(`http://localhost:3001/devices/${id}`, finalPayload).pipe(
      tap(() => {
        this.loadDevices();
      })
    );
  }

  deleteDevice(id: string): Observable<DeleteDeviceResponse> {
    return this.http.delete<DeleteDeviceResponse>(`http://localhost:3001/devices/${id}`).pipe(
      tap(() => {
        this.loadDevices();
      })
    );
  }

  setSearch(query: string): void { this.searchQuery$.next(query); }
  setFilter(status: string): void { this.statusFilter$.next(status); }
  getLoadingState(): Observable<boolean> { return this.isLoading$.asObservable(); }

  getFilteredDevices(): Observable<Device[]> {
    return combineLatest([this.devices$, this.searchQuery$, this.statusFilter$]).pipe(
      map(([devices, query, status]) => devices.filter(device => {
        const matchSearch = device.name.toLowerCase().includes(query.toLowerCase())
          || device.type.toLowerCase().includes(query.toLowerCase());
        const matchStatus = status === 'tous' || device.status === status;
        return matchSearch && matchStatus;
      }))
    );
  }

  getStats(): Observable<{ total: number, online: number, offline: number, maintenance: number }> {
    return this.devices$.pipe(
      map(devices => ({
        total: devices.length,
        online: devices.filter(d => d.status === 'online').length,
        offline: devices.filter(d => d.status === 'offline').length,
        maintenance: devices.filter(d => d.status === 'maintenance').length,
      }))
    );
  }
}