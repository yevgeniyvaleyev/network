import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingAccessComponent } from './pending-access.component';

describe('PendingAccessComponent', () => {
  let component: PendingAccessComponent;
  let fixture: ComponentFixture<PendingAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingAccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
