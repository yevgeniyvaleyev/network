import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

interface PieChartItem {
  percentage: number;
  class: string;
}

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent {
  items = input.required<PieChartItem[]>();
  size = input<number>(100); // Default size in pixels

  protected getConicGradient(): string {
    let currentDegree = 0;
    const gradientStops: string[] = [];

    this.items().forEach((item, index) => {
      const startDegree = currentDegree;
      const endDegree = currentDegree + (item.percentage * 360 / 100);
      
      if (index === 0) {
        gradientStops.push(`var(--${item.class}) ${startDegree}deg ${endDegree}deg`);
      } else {
        gradientStops.push(`var(--${item.class}) 0 ${endDegree}deg`);
      }
      
      currentDegree = endDegree;
    });

    return `conic-gradient(${gradientStops.join(', ')})`;
  }
}
