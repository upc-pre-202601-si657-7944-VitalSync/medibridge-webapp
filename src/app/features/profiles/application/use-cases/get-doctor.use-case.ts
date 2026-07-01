import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfilesApiService } from '../../infrastructure';
import type { Doctor } from '../../domain';

@Injectable()
export class GetDoctorUseCase {
  private readonly api = inject(ProfilesApiService);

  execute(doctorId: number): Observable<Doctor> {
    return this.api.getDoctorById(doctorId);
  }
}
