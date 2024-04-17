import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-bulk-insert',
  templateUrl: './bulk-insert.component.html',
  styleUrls: ['./bulk-insert.component.css']
})
export class BulkInsertComponent {
  selectedFile: File | null = null;
  uploadStatus: string | null = null;
  csvRecords: Record<string, string>[] = [];
  columns: any[] = [];

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.readCSVFile(this.selectedFile);
    }
  }

  readCSVFile(file: File): void {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const text = fileReader.result as string;
      const lines = text.split('\n').filter(line => line); // Exclude empty lines
      const headers = lines[0].split(',').map(header => header.trim());

      this.columns = headers.map(header => ({ name: header, prop: header }));
      this.csvRecords = lines.slice(1, 21).map(line => { // Slice here to take only the first 20 rows
        const values = line.split(',').map(cell => cell.trim());
        const record: Record<string, string> = {};
        headers.forEach((header, index) => {
          record[header] = values[index];
        });
        return record;
      });
    };
    fileReader.readAsText(file);
  }

  onUpload(): void {
    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.http.post('http://127.0.0.1:5000/upload_csv', formData).subscribe({
      next: (response) => {
        this.uploadStatus = 'Upload successful!';
        console.log(response);
      },
      error: (error) => {
        this.uploadStatus = 'Upload failed!';
        console.error('Error:', error);
      }
    });
  }
}
interface CSVRecord {
  [key: string]: string; // Allow any string key
}

