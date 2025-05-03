import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { PatientRecords } from './patient-records.model';

@Injectable({
  providedIn: 'root',
})
export class PatientRecordsService {
  private readonly API_URL = 'assets/data/patient-records.json'; // Adjusted path for patientRecords records
  dataChange: BehaviorSubject<PatientRecords[]> = new BehaviorSubject<
    PatientRecords[]
  >([]);

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all patientRecords records */
  getAllPatientRecords(): Observable<PatientRecords[]> {
    return this.httpClient
      .get<PatientRecords[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new patientRecords record */
  addPatientRecord(patientRecords: PatientRecords): Observable<PatientRecords> {
    return this.httpClient
      .post<PatientRecords>(this.API_URL, patientRecords)
      .pipe(
        map((response) => {
          return patientRecords; // Return the added patientRecords record
        }),
        catchError(this.handleError)
      );
  }

  /** PUT: Update an existing patientRecords record */
  updatePatientRecord(
    patientRecords: PatientRecords
  ): Observable<PatientRecords> {
    return this.httpClient
      .put<PatientRecords>(`${this.API_URL}`, patientRecords)
      .pipe(
        map((response) => {
          return patientRecords; // Return the updated patientRecords record
        }),
        catchError(this.handleError)
      );
  }

  /** DELETE: Remove a patientRecords record by ID */
  deletePatientRecord(id: number): Observable<number> {
    return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
      map(() => {
        return id; // Return the ID of the deleted patientRecords record
      }),
      catchError(this.handleError)
    );
  }

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
