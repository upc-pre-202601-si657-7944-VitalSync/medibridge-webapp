import { Injectable, inject } from '@angular/core';
import { CreateFamilyMemberUseCase } from '../use-cases/create-family-member.use-case';
import { GetFamilyMemberUseCase } from '../use-cases/get-family-member.use-case';
import { LinkFamilyToPatientUseCase } from '../use-cases/link-family-to-patient.use-case';
import { GetPatientUseCase } from '../use-cases/get-patient.use-case';
import { GetDoctorUseCase } from '../use-cases/get-doctor.use-case';
import type { CreateFamilyMemberData } from '../use-cases/create-family-member.use-case';
import type { FamilyMember, Patient, Doctor } from '../../domain';

@Injectable()
export class ProfilesFacade {
  private readonly createFamilyMemberUseCase = inject(CreateFamilyMemberUseCase);
  private readonly getFamilyMemberUseCase = inject(GetFamilyMemberUseCase);
  private readonly linkFamilyToPatientUseCase = inject(LinkFamilyToPatientUseCase);
  private readonly getPatientUseCase = inject(GetPatientUseCase);
  private readonly getDoctorUseCase = inject(GetDoctorUseCase);

  createFamilyMember(data: CreateFamilyMemberData) {
    return this.createFamilyMemberUseCase.execute(data);
  }

  getFamilyMember(id: number) {
    return this.getFamilyMemberUseCase.execute(id);
  }

  linkFamilyToPatient(patientId: number, familyMemberId: number) {
    return this.linkFamilyToPatientUseCase.execute(patientId, familyMemberId);
  }

  getPatient(patientId: number) {
    return this.getPatientUseCase.execute(patientId);
  }

  getDoctor(doctorId: number) {
    return this.getDoctorUseCase.execute(doctorId);
  }
}
