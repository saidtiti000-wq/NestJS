import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger 9 devices au démarrage', () => {
    expect(component.devices.length).toBe(9);
  });

  it('devrait avoir les stats correctes', () => {
    expect(component.stats.total).toBe(9);
    expect(component.stats.online).toBe(5);
    expect(component.stats.offline).toBe(2);
    expect(component.stats.maintenance).toBe(2);
  });

  it('devrait avoir "tous" comme filtre par défaut', () => {
    expect(component.activeFilter).toBe('tous');
  });

  it('devrait changer activeFilter quand onFilter est appelé', () => {
    component.onFilter('online');
    expect(component.activeFilter).toBe('online');
  });

  it('devrait retourner le bon label pour chaque filtre', () => {
    expect(component.getFilterLabel('tous')).toBe('Tous');
    expect(component.getFilterLabel('online')).toBe('En ligne');
    expect(component.getFilterLabel('offline')).toBe('Hors ligne');
    expect(component.getFilterLabel('maintenance')).toBe('Maintenance');
  });

  it('devrait se désabonner à la destruction', () => {
    const spy = jest.spyOn(component['sub'], 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});