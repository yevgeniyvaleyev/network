import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AppLayoutComponent } from 'core/layout/app-layout/app-layout.component';

@Component({
  selector: 'app-import-data',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    AppLayoutComponent
  ],
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss']
})
export class ImportDataComponent {
  public error = signal<string | null>(null);
  private readonly allowedFileType = 'text/csv';
  private readonly http = inject(HttpClient);

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    if (file.type !== this.allowedFileType) {
      this.error.set('Please select a CSV file');
      (event.target as HTMLInputElement).value = ''; // Reset file input
      return;
    }

    this.error.set(null);
    const reader = new FileReader();
    reader.onload = () => {
      const csvContent = reader.result as string;
      this.uploadCsv(csvContent);
    };
    reader.readAsText(file);
  }

  private uploadCsv(csvContent: string): void {
    this.http.post(`/import-contacts`, csvContent).subscribe({
      next: (response: any) => {
        console.log('Import successful:', response);
        // TODO: Show success message
      },
      error: (error) => {
        console.error('Import failed:', error);
        this.error.set(error.error || 'Failed to import contacts');
      }
    });
  }
}
