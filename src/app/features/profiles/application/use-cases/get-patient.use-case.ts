import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfilesApiService } from '../../infrastructure';
import type { Patient } from '../../domain';

@Injectable()
export class GetPatientUseCase {
  private readonly api = inject(ProfilesApiService);

  execute(patientId: number): Observable<Patient> {
    return this.api.getPatientById(patientId);
  }
}
