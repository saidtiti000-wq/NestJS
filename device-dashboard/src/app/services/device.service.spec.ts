import { TestBed } from '@angular/core/testing';
import { DeviceService } from './device.service';

describe('DeviceService', () => {
  let service: DeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceService);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait retourner les bonnes statistiques', () => {
    const stats = service.getStats();
    expect(stats.total).toBe(9);
    expect(stats.online).toBe(5);
    expect(stats.offline).toBe(2);
    expect(stats.maintenance).toBe(2);
  });

  it('devrait retourner tous les devices par défaut', (done) => {
    service.getFilteredDevices().subscribe(devices => {
      expect(devices.length).toBe(9);
      done();
    });
  });

  it('devrait filtrer par nom LAPTOP', (done) => {
    service.setSearch('LAPTOP');
    service.getFilteredDevices().subscribe(devices => {
      expect(devices.length).toBe(2);
      expect(devices.every(d => d.name.includes('LAPTOP'))).toBe(true);
      done();
    });
  });

  it('devrait filtrer par statut online', (done) => {
    service.setFilter('online');
    service.getFilteredDevices().subscribe(devices => {
      expect(devices.every(d => d.status === 'online')).toBe(true);
      done();
    });
  });

  it('devrait retourner vide si aucun résultat', (done) => {
    service.setSearch('XXXXINEXISTANT');
    service.getFilteredDevices().subscribe(devices => {
      expect(devices.length).toBe(0);
      done();
    });
  });

  it('devrait combiner recherche + filtre', (done) => {
    service.setSearch('LAPTOP');
    service.setFilter('offline');
    service.getFilteredDevices().subscribe(devices => {
      expect(devices.length).toBe(1);
      expect(devices[0].name).toBe('LAPTOP-HR-03');
      done();
    });
  });
});