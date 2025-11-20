import { db } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface AthletePerformance {
  verticalJump?: number;
  sitUps?: number;
  shuttleRun?: number;
  flexibility?: number;
  pushUps?: number;
  overallScore?: number;
}

export interface AthleteProfileData {
  id?: string;
  fullName: string;
  age?: string;
  gender?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  district?: string;
  state?: string;
  sportInterest?: string[];
  coachName?: string;
  registrationDate: string;
  lastAssessment: string;
  status: 'Active' | 'Inactive' | 'Pending';
  benchmarkStatus: 'Above' | 'At' | 'Below';
  performance?: AthletePerformance;
}

export const createAthleteProfile = async (athleteId: string, profileData: AthleteProfileData) => {
  try {
    const athleteRef = doc(db, 'athletes', athleteId);
    await setDoc(athleteRef, {
      ...profileData,
      id: athleteId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return athleteId;
  } catch (error) {
    console.error('Error creating athlete profile:', error);
    throw error;
  }
};
