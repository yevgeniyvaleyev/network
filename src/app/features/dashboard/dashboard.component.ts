import { Component } from '@angular/core';
import { AppMainLayoutComponent } from '../../core/layout/app-main-layout/app-main-layout.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AppMainLayoutComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {


}
