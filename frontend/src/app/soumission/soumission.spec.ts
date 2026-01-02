import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Soumission } from './soumission';

describe('Soumission', () => {
  let component: Soumission;
  let fixture: ComponentFixture<Soumission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Soumission]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Soumission);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
