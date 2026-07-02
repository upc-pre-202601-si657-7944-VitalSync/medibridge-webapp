import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfilesApiService } from '../../infrastructure';
import type { FamilyMember } from '../../domain';

@Injectable()
export class GetFamilyMemberUseCase {
  private readonly api = inject(ProfilesApiService);

  execute(id: number): Observable<FamilyMember> {
    return this.api.getFamilyMemberById(id);
  }
}
