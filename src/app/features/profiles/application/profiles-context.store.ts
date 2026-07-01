import { Injectable, signal } from '@angular/core';

const FAMILY_MEMBER_PROFILE_ID_KEY = 'profiles-family-member-profile-id';
const LINKED_PATIENT_ID_KEY = 'profiles-linked-patient-id';

@Injectable({ providedIn: 'root' })
export class ProfilesContextStore {
  readonly familyMemberProfileId = signal<number | null>(this.#readNumber(FAMILY_MEMBER_PROFILE_ID_KEY));
  readonly linkedPatientId = signal<number | null>(this.#readNumber(LINKED_PATIENT_ID_KEY));

  setFamilyMemberProfileId(id: number): void {
    this.familyMemberProfileId.set(id);
    this.#writeNumber(FAMILY_MEMBER_PROFILE_ID_KEY, id);
  }

  setLinkedPatientId(id: number): void {
    this.linkedPatientId.set(id);
    this.#writeNumber(LINKED_PATIENT_ID_KEY, id);
  }

  clearLinkedPatientId(): void {
    this.linkedPatientId.set(null);
    this.#remove(LINKED_PATIENT_ID_KEY);
  }

  #readNumber(key: string): number | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = Number(raw);
      return Number.isNaN(parsed) ? null : parsed;
    } catch {
      return null;
    }
  }

  #writeNumber(key: string, value: number): void {
    try {
      localStorage.setItem(key, String(value));
    } catch {
      // ignore storage failures
    }
  }

  #remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore storage failures
    }
  }
}
