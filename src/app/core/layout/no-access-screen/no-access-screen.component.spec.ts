import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAccessScreenComponent } from './no-access-screen.component';

describe('NoAccessScreenComponent', () => {
  let component: NoAccessScreenComponent;
  let fixture: ComponentFixture<NoAccessScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoAccessScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoAccessScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
