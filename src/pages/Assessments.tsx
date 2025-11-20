import { MainLayout } from "@/components/layout/main-layout";
import { Play, Eye, CheckCircle, XCircle, AlertTriangle, Filter, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { createAthleteProfile } from '@/lib/athletes';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAssessments } from "@/hooks/useFirebaseData";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VideoAnalysis } from "@/components/assessments/VideoAnalysis";
import { useAssessmentsCRUD, useAthletesCRUD } from "@/hooks/useFirebaseCRUD";
import { useState } from "react";
import { toast } from "sonner";

export default function Assessments() {
  const { data: assessments, loading: assessmentsLoading, error: assessmentsError } = useAssessments();
  const [openUploader, setOpenUploader] = useState(false);
  const { create: createAssessment, update: updateAssessment } = useAssessmentsCRUD();
  const { create: createAthlete } = useAthletesCRUD();
  const [updatingAssessment, setUpdatingAssessment] = useState<string | null>(null);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'Flagged':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4 text-danger" />;
      default:
        return <Eye className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Flagged':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (assessmentId: string, status: string) => {
    try {
      setUpdatingAssessment(assessmentId);
      await updateAssessment(assessmentId, { status });
      toast.success(`Assessment ${status.toLowerCase()} successfully`);
      // No need to refetch as useFirestoreQuery provides real-time updates
    } catch (error) {
      console.error(`Error ${status.toLowerCase()}ing assessment:`, error);
      toast.error(`Failed to ${status.toLowerCase()} assessment`);
    } finally {
      setUpdatingAssessment(null);
    }
  };

  const navigate = useNavigate();

  return (
    <MainLayout 
      title="Assessment Review"
      description="Review and validate athlete performance assessments"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setOpenUploader(true)}>New Assessment</Button>
        </div>
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search by athlete name or assessment ID..." 
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Test Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tests</SelectItem>
                    <SelectItem value="vertical-jump">Vertical Jump</SelectItem>
                    <SelectItem value="sit-ups">Sit-ups</SelectItem>
                    <SelectItem value="shuttle-run">Shuttle Run</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Cards */}
        {assessmentsError && (
          <div className="text-center py-8 text-red-600">
            Error loading assessments: {assessmentsError.message}
          </div>
        )}
        
        {assessmentsLoading ? (
          <div className="space-y-4">
            {Array.from({length: 5}).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {assessments?.map((assessment) => (
            <Card key={assessment.id} className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(assessment.status)}
                    <div>
                      <CardTitle className="text-lg">{assessment.athleteName}</CardTitle>
                      <CardDescription>
                        {assessment.testType} • Submitted {new Date(assessment.submissionDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`status-badge ${getStatusBadge(assessment.status)}`}>
                    {assessment.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Video Player */}
                  <div className="space-y-4">
                    {assessment.videoUrl ? (
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <video 
                          src={assessment.videoUrl} 
                          controls 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">No video available</p>
                        </div>
                      </div>
                    )}
                    
                    {assessment.cheatDetected && (
                      <Card className="border-danger bg-danger-muted">
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 text-danger-foreground">
                            <AlertTriangle className="h-5 w-5" />
                            <span className="font-medium">Cheat Detection Alert</span>
                          </div>
                          <p className="text-sm text-danger-foreground/80 mt-1">
                            AI algorithms have detected potential irregularities in this assessment
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Assessment Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">AI Confidence Score</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all" 
                              style={{ width: `${assessment.aiScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">{assessment.aiScore}%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Performance Metric</p>
                        <p className="text-lg font-semibold">{assessment.performanceMetric}</p>
                      </div>
                    </div>

                    {assessment.reviewerNotes && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Reviewer Notes</p>
                        <p className="text-sm bg-muted p-3 rounded-lg">{assessment.reviewerNotes}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button 
                        size="sm" 
                        variant={assessment.status === 'Approved' ? 'default' : 'outline'}
                        className={`${assessment.status === 'Approved' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        onClick={() => handleStatusUpdate(assessment.id, 'Approved')}
                        disabled={updatingAssessment === assessment.id}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {updatingAssessment === assessment.id && assessment.status !== 'Approved' ? 'Processing...' : 'Approve'}
                      </Button>
                      <Button 
                        variant={assessment.status === 'Flagged' ? 'default' : 'outline'}
                        size="sm"
                        className={`${assessment.status === 'Flagged' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
                        onClick={() => handleStatusUpdate(assessment.id, 'Flagged')}
                        disabled={updatingAssessment === assessment.id}
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        {updatingAssessment === assessment.id && assessment.status !== 'Flagged' ? 'Processing...' : 'Flag'}
                      </Button>
                      <Button 
                        variant={assessment.status === 'Rejected' ? 'default' : 'destructive'}
                        size="sm"
                        className={assessment.status === 'Rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
                        onClick={() => handleStatusUpdate(assessment.id, 'Rejected')}
                        disabled={updatingAssessment === assessment.id}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        {updatingAssessment === assessment.id && assessment.status !== 'Rejected' ? 'Processing...' : 'Reject'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) || []}
          </div>
        )}
      </div>
    {/* Video Analysis Dialog */}
      <Dialog open={openUploader} onOpenChange={setOpenUploader}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>New Assessment Video Analysis</DialogTitle>
          </DialogHeader>
          <VideoAnalysis
            onAnalysisComplete={async (result: any, profileData: any) => {
              try {
                // Create athlete data for the athletes collection
                const athleteData = {
                  name: profileData.fullName || "New Athlete",
                  age: parseInt(profileData.age) || 0,
                  gender: profileData.gender || '',
                  state: profileData.state || '',
                  district: profileData.district || '',
                  phoneNumber: profileData.phoneNumber || '',
                  email: profileData.email || '',
                  address: profileData.address || '',
                  sportInterest: profileData.sportInterest || [],
                  coachName: profileData.coachName || '',
                  performance: {
                    verticalJump: 0,
                    sitUps: 0,
                    shuttleRun: 0,
                    flexibility: 0,
                    overallScore: result?.data?.overallScore || 0,
                    pushUps: result?.data?.pushUps || 0
                  },
                  status: 'Active',
                  registrationDate: new Date().toISOString(),
                  lastAssessment: new Date().toISOString(),
                  benchmarkStatus: result?.data?.overallScore >= 85 ? 'Above' : result?.data?.overallScore >= 70 ? 'At' : 'Below'
                };

                // Create the athlete in the athletes collection
                const athleteId = await createAthlete(athleteData);
                
                if (athleteId) {
                  // Create the assessment
                  const newAssessment = {
                    athleteId,
                    athleteName: athleteData.name,
                    testType: result?.test_type || "push_ups",
                    submissionDate: new Date().toISOString(),
                    status: "Completed",
                    aiScore: result?.data?.overallScore || 0,
                    videoUrl: "/uploads/videos/push-ups.mp4",
                    cheatDetected: false,
                    performanceMetric: result?.data?.pushUps || 0,
                  };
                  
                  // Save the assessment
                  await createAssessment(newAssessment);
                  
                  // Close the dialog and redirect to the athlete's profile
                  setOpenUploader(false);
                  navigate(`/athletes/${athleteId}`);
                } else {
                  throw new Error("Failed to create athlete profile");
                }
              } catch (err) {
                console.error(err);
                toast.error("Failed to save analysis results");
                setOpenUploader(false);
              }
            }}
            onAssessmentSaved={(assessmentId) => {
              // This callback is called after the assessment is saved
              // We don't need to do anything here as we're already handling the redirect in onAnalysisComplete
            }}
            athleteId={`ATHLETE_${Date.now()}`}
            testType="push_ups"
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}