import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Infospanel } from './infospanel';

describe('Infospanel', () => {
  let component: Infospanel;
  let fixture: ComponentFixture<Infospanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Infospanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Infospanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
