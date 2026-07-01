import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfilesApiService } from '../../infrastructure';

@Injectable()
export class LinkFamilyToPatientUseCase {
  private readonly api = inject(ProfilesApiService);

  execute(patientId: number, familyMemberId: number): Observable<void> {
    return this.api.linkFamilyToPatient(patientId, familyMemberId);
  }
}
