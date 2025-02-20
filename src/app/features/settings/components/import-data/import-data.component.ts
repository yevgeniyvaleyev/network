import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppStore } from 'app/core/store/app.store';
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
  
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private appStore = inject(AppStore);

  public isOnline = this.appStore.isOnline;
  public error = signal<string | null>(null);
  public success = signal<string | null>(null);
  public isUploading = signal(false);
  private readonly allowedFileType = 'text/csv';

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
    this.success.set(null);
    this.isUploading.set(true);

    const reader = new FileReader();
    reader.onload = () => {
      const csvContent = reader.result as string;
      this.uploadCsv(csvContent);
    };
    reader.readAsText(file);
  }

  private uploadCsv(csvContent: string): void {
    this.http.post('/api/upload', csvContent).subscribe({
      next: (response: any) => {
        console.log('Import successful:', response);
        this.isUploading.set(false);
        const message = `Successfully imported: ${response.created} created, ${response.updated} updated`;
        this.success.set(message);
        this.snackBar.open(message, 'Close', { duration: 5000 });
        
        if (response.errors?.length > 0) {
          this.error.set(`Some records had errors:\n${response.errors.join('\n')}`);
        }
      },
      error: (error) => {
        console.error('Import failed:', error);
        this.isUploading.set(false);
        this.error.set(error.error?.error || error.error || 'Failed to import contacts');
      }
    });
  }
}
