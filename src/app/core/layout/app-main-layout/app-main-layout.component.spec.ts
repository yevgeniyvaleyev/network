import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMainLayoutComponent } from './app-main-layout.component';

describe('MainComponent', () => {
  let component: AppMainLayoutComponent;
  let fixture: ComponentFixture<AppMainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppMainLayoutComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AppMainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
