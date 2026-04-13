import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceCardComponent } from './device-card.component';
import { Device } from '../../models/device.model';

const MOCK_DEVICE: Device = {
  id: 1,
  name: 'LAPTOP-TEST-01',
  type: 'Laptop',
  status: 'online',
  ip: '192.168.1.1',
  os: 'Windows 11',
  lastSeen: 'il y a 2 min'
};

describe('DeviceCardComponent', () => {
  let component: DeviceCardComponent;
  let fixture: ComponentFixture<DeviceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceCardComponent);
    component = fixture.componentInstance;
    component.device = MOCK_DEVICE;
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait retourner 💻 pour un Laptop', () => {
    expect(component.getIcon()).toBe('💻');
  });

  it('devrait retourner 🔧 pour un type inconnu', () => {
    component.device = { ...MOCK_DEVICE, type: 'Inconnu' };
    expect(component.getIcon()).toBe('🔧');
  });

  it('devrait retourner "En ligne" pour status online', () => {
    expect(component.getStatusLabel()).toBe('En ligne');
  });

  it('devrait retourner "Hors ligne" pour status offline', () => {
    component.device = { ...MOCK_DEVICE, status: 'offline' };
    expect(component.getStatusLabel()).toBe('Hors ligne');
  });

  it('devrait retourner "Maintenance" pour status maintenance', () => {
    component.device = { ...MOCK_DEVICE, status: 'maintenance' };
    expect(component.getStatusLabel()).toBe('Maintenance');
  });

  it('devrait afficher le nom dans le HTML', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.device-name')?.textContent).toContain('LAPTOP-TEST-01');
  });

  it('devrait avoir la classe CSS online sur le badge', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.badge')?.classList.contains('online')).toBe(true);
  });
});