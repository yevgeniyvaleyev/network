import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReconnectListComponent } from './components/reconnect-list/reconnect-list.component';
import { AppMainLayoutComponent } from '../../core/layout/app-main-layout/app-main-layout.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReconnectListComponent, AppMainLayoutComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent { }
