import { db } from './firebase';
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export interface AssessmentData {
  id: string;
  athleteId: string;
  videoUrl?: string;
  analysisResult: any;
  createdAt: any;
  updatedAt: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  testType?: string;
}

export const saveAssessment = async (athleteId: string, assessmentData: Omit<AssessmentData, 'id' | 'athleteId' | 'createdAt' | 'updatedAt'>) => {
  try {
    const assessmentId = uuidv4();
    const assessmentRef = doc(db, 'assessments', assessmentId);
    const athleteRef = doc(db, 'athletes', athleteId);
    
    const assessment: AssessmentData = {
      id: assessmentId,
      athleteId,
      ...assessmentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Save assessment
    await setDoc(assessmentRef, assessment);
    
    // Update athlete's assessments array and lastAssessment date
    await updateDoc(athleteRef, {
      assessments: arrayUnion(assessmentId),
      lastAssessment: serverTimestamp(),
      'performance.overallScore': assessmentData.analysisResult.overallScore,
      'performance.verticalJump': assessmentData.analysisResult.jumpHeight,
      benchmarkStatus: assessmentData.analysisResult.overallScore >= 85 ? 'Above' : 
                      assessmentData.analysisResult.overallScore >= 70 ? 'At' : 'Below'
    });

    return { success: true, id: assessmentId };
  } catch (error) {
    console.error('Error saving assessment:', error);
    throw error;
  }
};

export const getAthleteAssessments = async (athleteId: string) => {
  try {
    const athleteRef = doc(db, 'athletes', athleteId);
    const athleteDoc = await getDoc(athleteRef);
    
    if (!athleteDoc.exists()) {
      throw new Error('Athlete not found');
    }
    
    const athleteData = athleteDoc.data();
    const assessmentIds = athleteData.assessments || [];
    
    // In a real app, you would fetch the actual assessment documents here
    // For now, we'll return the IDs and the assessment data will be fetched separately
    return {
      ...athleteData,
      assessmentIds
    };
  } catch (error) {
    console.error('Error getting athlete assessments:', error);
    throw error;
  }
};
