import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfilesApiService } from '../../infrastructure';
import type { FamilyMember } from '../../domain';

export interface CreateFamilyMemberData {
  fullName: string;
}

@Injectable()
export class CreateFamilyMemberUseCase {
  private readonly api = inject(ProfilesApiService);

  execute(data: CreateFamilyMemberData): Observable<FamilyMember> {
    return this.api.createFamilyMember(data);
  }
}
