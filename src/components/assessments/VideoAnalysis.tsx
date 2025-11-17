import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Video, 
  Loader2, 
  Trophy, 
  BarChart3, 
  Target, 
  Zap, 
  TrendingUp, 
  Medal, 
  Star, 
  Clock, 
  Ruler, 
  Activity,
  ArrowLeft,
  Play,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Info,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AnalysisResult {
  jumpHeight: number;
  strideLength: number;
  jointAngles: {
    knee: number;
    ankle: number;
    hip: number;
  };
  speed: number;
  balance: number;
  technique: number;
  overallScore: number;
  summary: string;
  recommendations: string[];
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  sport: string;
  score: number;
  tier: "Beginner" | "Intermediate" | "Advanced";
  location: string;
}

interface AthleteProfileData {
  fullName: string;
  age: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  district: string;
  state: string;
  sportInterest: string[];
  coachName?: string;
  registrationDate: string;
  lastAssessment: string;
  performance?: {
    verticalJump?: number;
    sitUps?: number;
    shuttleRun?: number;
    flexibility?: number;
    overallScore?: number;
  };
  benchmarkStatus?: 'Above' | 'At' | 'Below';
  status?: 'Active' | 'Inactive' | 'Pending';
}

interface AssessmentData {
  id: string;
  athleteId: string;
  videoUrl: string;
  analysisResult: AnalysisResult;
  createdAt: any;
  updatedAt: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  testType: string;
}

interface VideoAnalysisProps {
  onAnalysisComplete?: (result: any, profileData: AthleteProfileData) => void;
  athleteId: string;
  testType: string;
  existingProfile?: AthleteProfileData;
  onAssessmentSaved?: (assessmentId: string) => void;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Arjun Kumar", sport: "Athletics", score: 95, tier: "Advanced", location: "Delhi" },
  { rank: 2, name: "Priya Sharma", sport: "Swimming", score: 92, tier: "Advanced", location: "Mumbai" },
  { rank: 3, name: "Rohit Singh", sport: "Boxing", score: 89, tier: "Advanced", location: "Punjab" },
  { rank: 4, name: "Anita Patel", sport: "Badminton", score: 85, tier: "Intermediate", location: "Gujarat" },
  { rank: 5, name: "Vikram Reddy", sport: "Tennis", score: 82, tier: "Intermediate", location: "Hyderabad" },
];

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const SPORT_INTERESTS = [
  'Athletics', 'Swimming', 'Boxing', 'Badminton', 'Tennis',
  'Basketball', 'Football', 'Cricket', 'Hockey', 'Volleyball',
  'Table Tennis', 'Wrestling', 'Judo', 'Taekwondo', 'Karate'
];
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export function VideoAnalysis({ 
  onAnalysisComplete, 
  athleteId, 
  testType = 'vertical_jump', 
  existingProfile, 
  onAssessmentSaved 
}: VideoAnalysisProps) {
  const [step, setStep] = useState<'profile' | 'video' | 'results'>('profile');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState("");
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile form state
  const [profileData, setProfileData] = useState<AthleteProfileData>({
    fullName: '',
    age: '',
    gender: '',
    phoneNumber: '',
    email: '',
    address: '',
    district: '',
    state: '',
    sportInterest: [],
    coachName: '',
    registrationDate: new Date().toISOString(),
    lastAssessment: new Date().toISOString(),
    status: 'Active',
    benchmarkStatus: 'At',
    performance: {
      overallScore: 0
    }
  });

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize with existing profile if available
  useEffect(() => {
    if (existingProfile) {
      setProfileData({
        ...existingProfile,
        // Ensure all required fields have default values
        sportInterest: existingProfile.sportInterest || [],
        performance: {
          ...existingProfile.performance,
          overallScore: existingProfile.performance?.overallScore || 0
        },
        status: existingProfile.status || 'Active',
        benchmarkStatus: existingProfile.benchmarkStatus || 'At'
      });
      setStep('video'); // Skip to video step if profile exists
    }
  }, [existingProfile]);

  useEffect(() => {
    if (isAnalysisComplete && analysisResult) {
      setShowResults(true);
    } else if (!isAnalysisComplete) {
      setShowResults(false);
    }
  }, [isAnalysisComplete, analysisResult]);

  const validateProfile = () => {
    const newErrors: Record<string, string> = {};

    if (!profileData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!profileData.age || isNaN(Number(profileData.age)) || Number(profileData.age) < 5 || Number(profileData.age) > 100) 
      newErrors.age = 'Please enter a valid age between 5 and 100';
    if (!profileData.gender) newErrors.gender = 'Gender is required';
    if (!profileData.phoneNumber.trim() || !/^\d{10}$/.test(profileData.phoneNumber)) 
      newErrors.phoneNumber = 'Valid 10-digit phone number is required';
    if (!profileData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email))
      newErrors.email = 'Valid email is required';
    if (!profileData.district.trim()) newErrors.district = 'District is required';
    if (!profileData.state) newErrors.state = 'State is required';
    if (profileData.sportInterest.length === 0) newErrors.sportInterest = 'At least one sport interest is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileInputChange = (field: keyof AthleteProfileData, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSportInterestChange = (sport: string, isChecked: boolean) => {
    setProfileData(prev => {
      const updatedInterests = isChecked
        ? [...prev.sportInterest, sport]
        : prev.sportInterest.filter(s => s !== sport);

      return {
        ...prev,
        sportInterest: updatedInterests
      };
    });
  };

  const handleNextStep = () => {
    if (step === 'profile' && !validateProfile()) {
      return;
    }

    if (step === 'profile') {
      setStep('video');
    } else if (step === 'video' && videoFile) {
      handleAnalyze();
    }
  };

  const generateMockAnalysis = (filename: string): AnalysisResult => {
    // Generate consistent mock data based on filename for demo purposes
    const seed = filename.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (min: number, max: number) => {
      const num = Math.sin(seed) * 10000;
      return Math.floor((num - Math.floor(num)) * (max - min + 1)) + min;
    };

    const baseScore = random(60, 95);
    const jumpHeight = random(35, 70);
    const strideLength = Math.round((random(80, 170) / 100) * 10) / 10; // 0.8m to 1.7m
    
    return {
      jumpHeight,
      strideLength,
      jointAngles: {
        knee: random(120, 160),
        ankle: random(80, 100),
        hip: random(160, 190)
      },
      speed: Math.min(100, baseScore + random(-10, 10)),
      balance: Math.min(100, baseScore + random(-15, 15)),
      technique: Math.min(100, baseScore + random(-5, 5)),
      overallScore: baseScore,
      summary: `Analysis of ${filename} shows ${baseScore > 85 ? 'excellent' : baseScore > 70 ? 'good' : 'developing'} athletic performance with room for improvement in specific areas.`,
      recommendations: [
        'Focus on increasing knee flexion during takeoff for better jump height',
        'Work on ankle stability exercises to improve balance',
        'Consider professional coaching to refine your technique'
      ]
    };
  };

  const uploadVideoToFirebase = async (file: File): Promise<string> => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `videos/${athleteId || 'anonymous'}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Failed to upload video');
    }
  };

  const saveAssessmentToFirestore = async (assessmentData: Omit<AssessmentData, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const assessmentId = uuidv4();
      const assessmentRef = doc(db, 'assessments', assessmentId);
      const athleteRef = doc(db, 'athletes', athleteId);
      
      const assessment: AssessmentData = {
        ...assessmentData,
        id: assessmentId,
        athleteId,
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

      return assessmentId;
    } catch (error) {
      console.error('Error saving assessment:', error);
      throw error;
    }
  };

  const simulateAnalysis = useCallback(async () => {
    if (!videoFile) {
      toast.error('No video file selected');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisResult(null);
    setIsAnalysisComplete(false);
    setCurrentStep('Initializing analysis...');

    try {
      // Step 1: Upload video
      setCurrentStep('Uploading video...');
      setAnalysisProgress(20);
      const videoUrl = await uploadVideoToFirebase(videoFile);
      setVideoUrl(videoUrl);
      
      // Simulate remaining analysis steps
      const steps = [
        { step: 'Processing video frames...', progress: 40, duration: 1200 },
        { step: 'Analyzing movement patterns...', progress: 65, duration: 1500 },
        { step: 'Generating performance metrics...', progress: 85, duration: 1000 },
        { step: 'Finalizing report...', progress: 100, duration: 500 }
      ];

      for (const { step, progress, duration } of steps) {
        setCurrentStep(step);
        setAnalysisProgress(progress);
        await new Promise(resolve => setTimeout(resolve, duration));
      }

      // Generate mock analysis result
      const result = generateMockAnalysis(videoFile.name);
      setAnalysisResult(result);
      setIsAnalysisComplete(true);
      setStep('results');

      // Save assessment to Firestore
      if (athleteId) {
        const assessmentId = await saveAssessmentToFirestore({
          videoUrl,
          analysisResult: result,
          status: 'completed',
          testType: testType
        });
        
        if (onAssessmentSaved) {
          onAssessmentSaved(assessmentId);
        }
      }

      // Update profile with analysis results
      const benchmarkStatus = result.overallScore >= 85 ? 'Above' : 
                           result.overallScore >= 70 ? 'At' : 'Below';
      
      const updatedProfile: AthleteProfileData = {
        ...profileData,
        lastAssessment: new Date().toISOString(),
        performance: {
          ...profileData.performance,
          verticalJump: result.jumpHeight,
          overallScore: result.overallScore
        },
        benchmarkStatus: benchmarkStatus as 'Above' | 'At' | 'Below'
      };

      if (onAnalysisComplete) {
        onAnalysisComplete({ success: true, data: result }, updatedProfile);
      }

      toast.success('Analysis completed and saved successfully!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed. Please try again with a different video.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [videoFile, onAnalysisComplete, profileData]);

  const handleAnalyze = async () => {
    try {
      await simulateAnalysis();
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to start analysis. Please try again.');
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setVideoFile(null);
    setPreviewUrl(null);
    setIsAnalysisComplete(false);
    setShowResults(false);
    setAnalysisProgress(0);
    setCurrentStep('');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is a video
      if (!file.type.startsWith('video/')) {
        toast.error('Please upload a video file');
        return;
      }
      
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Video file size should be less than 50MB');
        return;
      }
      
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {analysisResult.overallScore}
                <span className="text-muted-foreground">/100</span>
              </div>
              <div className="mt-2">
                <Progress value={analysisResult.overallScore} className="h-2" />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {analysisResult.overallScore >= 85 ? 'Excellent' : 
                 analysisResult.overallScore >= 70 ? 'Good' : 'Needs Improvement'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" /> Jump Height
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analysisResult.jumpHeight} <span className="text-muted-foreground text-sm">cm</span>
              </div>
              <div className="mt-2">
                <Progress value={(analysisResult.jumpHeight / 70) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Ruler className="h-4 w-4" /> Stride Length
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analysisResult.strideLength} <span className="text-muted-foreground text-sm">m</span>
              </div>
              <div className="mt-2">
                <Progress value={(analysisResult.strideLength / 1.7) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <Target className="h-4 w-4 mr-2" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="leaderboard">
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detailed Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Speed</span>
                    <span className="text-sm font-medium">{analysisResult.speed}/100</span>
                  </div>
                  <Progress value={analysisResult.speed} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Balance</span>
                    <span className="text-sm font-medium">{analysisResult.balance}/100</span>
                  </div>
                  <Progress value={analysisResult.balance} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Technique</span>
                    <span className="text-sm font-medium">{analysisResult.technique}/100</span>
                  </div>
                  <Progress value={analysisResult.technique} className="h-2" />
                </div>
                
                <div className="pt-4">
                  <h4 className="font-medium mb-2">Joint Angles</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Knee</div>
                      <div className="text-xl font-bold">{analysisResult.jointAngles.knee}°</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Ankle</div>
                      <div className="text-xl font-bold">{analysisResult.jointAngles.ankle}°</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Hip</div>
                      <div className="text-xl font-bold">{analysisResult.jointAngles.hip}°</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommendations" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personalized Recommendations</CardTitle>
                <CardDescription>{analysisResult.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisResult.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leaderboard" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leaderboard</CardTitle>
                <CardDescription>See how you compare to other athletes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockLeaderboard.map((entry) => (
                    <div key={entry.rank} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {entry.rank}
                        </div>
                        <div>
                          <div className="font-medium">{entry.name}</div>
                          <div className="text-xs text-muted-foreground">{entry.sport} • {entry.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={entry.tier === 'Advanced' ? 'default' : 'secondary'}>
                          {entry.tier}
                        </Badge>
                        <div className="font-bold">{entry.score}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const renderProfileForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Athlete Profile Details
        </CardTitle>
        <CardDescription>
          Please provide the athlete's information to proceed with the analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={profileData.fullName}
              onChange={(e) => handleProfileInputChange('fullName', e.target.value)}
              placeholder="Enter full name"
            />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              min="5"
              max="100"
              value={profileData.age}
              onChange={(e) => handleProfileInputChange('age', e.target.value)}
              placeholder="Enter age"
            />
            {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>Gender *</Label>
            <div className="flex gap-4">
              {GENDER_OPTIONS.map((gender) => (
                <div key={gender} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={gender}
                    name="gender"
                    checked={profileData.gender === gender}
                    onChange={() => handleProfileInputChange('gender', gender)}
                    className="h-4 w-4 text-primary"
                  />
                  <Label htmlFor={gender} className="font-normal">{gender}</Label>
                </div>
              ))}
            </div>
            {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">+91</span>
              <Input
                id="phoneNumber"
                value={profileData.phoneNumber}
                onChange={(e) => handleProfileInputChange('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                maxLength={10}
              />
            </div>
            {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => handleProfileInputChange('email', e.target.value)}
              placeholder="athlete@example.com"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select
              value={profileData.state}
              onValueChange={(value) => handleProfileInputChange('state', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="district">District *</Label>
            <Input
              id="district"
              value={profileData.district}
              onChange={(e) => handleProfileInputChange('district', e.target.value)}
              placeholder="Enter district"
            />
            {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Textarea
              id="address"
              value={profileData.address}
              onChange={(e) => handleProfileInputChange('address', e.target.value)}
              placeholder="Enter full address"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Sports Interest *</Label>
            <div className="grid grid-cols-2 gap-2">
              {SPORT_INTERESTS.slice(0, 6).map((sport) => (
                <div key={sport} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`sport-${sport}`}
                    checked={profileData.sportInterest.includes(sport)}
                    onChange={(e) => handleSportInterestChange(sport, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary"
                  />
                  <Label htmlFor={`sport-${sport}`} className="text-sm font-normal">
                    {sport}
                  </Label>
                </div>
              ))}
            </div>
            {errors.sportInterest && <p className="text-sm text-red-500">{errors.sportInterest}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coachName">Coach Name (Optional)</Label>
            <Input
              id="coachName"
              value={profileData.coachName || ''}
              onChange={(e) => handleProfileInputChange('coachName', e.target.value)}
              placeholder="Enter coach's name"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleNextStep}>
          Next: Upload Video
        </Button>
      </CardFooter>
    </Card>
  );

  const renderVideoUpload = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setStep('profile')}
            className="h-8 w-8" 
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>Upload Performance Video</CardTitle>
            <CardDescription>
              Record your performance and upload the video for analysis
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            className="hidden"
          />
          
          {previewUrl ? (
            <div className="space-y-4">
              <video 
                src={previewUrl} 
                controls 
                className="w-full max-h-64 mx-auto rounded-md"
              />
              <p className="text-sm text-muted-foreground">
                {videoFile?.name} ({(videoFile?.size ? (videoFile.size / (1024 * 1024)).toFixed(2) : 0)} MB)
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Drag and drop your video here</p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files (MP4, WebM, or MOV, max 50MB)
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setStep('profile')}
          >
            Back
          </Button>
          <Button 
            onClick={handleNextStep} 
            disabled={!videoFile || isAnalyzing}
            className="gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {currentStep} {analysisProgress > 0 && `${Math.round(analysisProgress)}%`}
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Analysis
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Note: Video processing may take a few moments depending on the length of the video.</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {step !== 'profile' && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={step === 'video' ? () => setStep('profile') : resetAnalysis}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h2 className="text-2xl font-bold">
          {step === 'profile' ? 'Athlete Profile' : 
           step === 'video' ? 'Upload Video' : 'Performance Analysis'}
        </h2>
      </div>
      
      {step === 'profile' && renderProfileForm()}
      {step === 'video' && renderVideoUpload()}
      {step === 'results' && analysisResult && (
        <Card className="w-full">
          <CardContent className="pt-6">
            {renderAnalysisResult()}
          </CardContent>
        </Card>
      )}
      
      {step === 'results' && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-800">Analysis Complete</h4>
            <p className="text-sm text-green-700">
              The performance analysis has been saved to the athlete's profile. You can view all analyses in the Video Analysis tab.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}