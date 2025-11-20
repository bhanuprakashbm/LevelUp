import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { ArrowLeft, User, MapPin, Phone, Mail, Calendar, Trophy, Target, TrendingUp, Edit, Trash2, Activity, Zap, BarChart3, Ruler } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFirestoreDocument } from "@/hooks/useFirebaseData";
import { useAthletesCRUD } from "@/hooks/useFirebaseCRUD";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function AthleteProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: athlete, loading, error } = useFirestoreDocument('athletes', id || null);
  const athletesCRUD = useAthletesCRUD();

  if (loading) {
    return (
      <MainLayout title="Athlete Profile" description="Loading athlete information...">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !athlete) {
    return (
      <MainLayout title="Athlete Profile" description="Athlete not found">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Athlete Not Found</h2>
          <p className="text-gray-600 mb-6">The athlete you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/athletes')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Athletes
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleEdit = () => {
    navigate(`/athletes?edit=${athlete.id}`);
  };

  const handleDelete = async () => {
    const success = await athletesCRUD.delete(athlete.id);
    if (success) {
      toast.success(`${athlete.name} has been deleted successfully.`);
      navigate('/athletes');
    } else {
      toast.error('Failed to delete athlete. Please try again.');
    }
  };

  const getBenchmarkColor = (status: string) => {
    switch (status) {
      case 'Above':
        return 'bg-green-100 text-green-800';
      case 'At':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  // Update the athlete's overall score to 85%
  const updatedAthlete = {
    ...athlete,
    performance: {
      ...athlete.performance,
      overallScore: 85, // Set overall score to 85%
      verticalJump: 75, // 75cm (good score)
      sitUps: 48, // 48 reps (80% of 60)
      shuttleRun: 12.5, // 12.5 seconds (good time)
      flexibility: 24, // 24cm (80% of 30cm)
      pushUps: 25, // 25 reps (83% of 30)
    },
    benchmarkStatus: 'Above' // Update benchmark status to 'Above' for 85%
  };

  const performanceMetrics = [
    { name: 'Vertical Jump', value: updatedAthlete.performance?.verticalJump || 0, unit: 'cm', max: 100 },
    { name: 'Sit-ups', value: updatedAthlete.performance?.sitUps || 0, unit: 'reps', max: 60 },
    { name: 'Shuttle Run', value: updatedAthlete.performance?.shuttleRun || 0, unit: 'sec', max: 15, reverse: true },
    { name: 'Flexibility', value: updatedAthlete.performance?.flexibility || 0, unit: 'cm', max: 30 },
    { name: 'Push-ups', value: updatedAthlete.performance?.pushUps || 0, unit: 'reps', max: 30 },
  ];

  // Mock analysis data - replace with actual data from your backend
  const videoAnalyses = [
    {
      id: '1',
      date: new Date().toISOString(),
      jumpHeight: 45.2,
      strideLength: 1.8,
      jointAngles: {
        knee: 135,
        ankle: 85,
        hip: 170,
      },
      speed: 85,
      balance: 78,
      technique: 82,
      overallScore: 82,
      summary: 'Good technique with room for improvement in balance and knee flexion during takeoff.',
      recommendations: [
        'Focus on increasing knee flexion during takeoff for better jump height',
        'Work on ankle stability exercises to improve balance',
        'Consider professional coaching to refine your technique'
      ],
      videoUrl: athlete.performance?.videoUrl
    },
    // Add more analysis results as needed
  ];

  return (
    <MainLayout title={`${athlete.name} - Profile`} description="Detailed athlete information and performance metrics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/athletes')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{athlete.name}</h1>
              <p className="text-muted-foreground">{athlete.age} years old • {athlete.gender}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Athlete</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {athlete.name}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={athletesCRUD.deleting}>
                    {athletesCRUD.deleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="video-analysis">Video Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Full Name</p>
                    <p className="text-sm text-muted-foreground">{athlete.name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Age</p>
                    <p className="text-sm text-muted-foreground">{athlete.age} years</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Gender</p>
                    <p className="text-sm text-muted-foreground">{athlete.gender}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Status</p>
                    <Badge className={getStatusColor(athlete.status)}>{athlete.status}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{athlete.phoneNumber}</span>
                  </div>
                  {athlete.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{athlete.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{athlete.district}, {athlete.state}</span>
                  </div>
                  {athlete.address && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{athlete.address}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sports & Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Sports & Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Sports Interest</p>
                    <div className="flex flex-wrap gap-1">
                      {(athlete.sportInterest || []).map((sport: string) => (
                        <Badge key={sport} variant="outline" className="text-xs">
                          {sport}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Overall Score</p>
                    <div className="flex items-center gap-2">
                      <Progress value={athlete.performance?.overallScore || 0} className="flex-1" />
                      <span className="text-sm font-semibold">{athlete.performance?.overallScore || 0}%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Benchmark Status</p>
                    <Badge className={getBenchmarkColor(athlete.benchmarkStatus)}>
                      {athlete.benchmarkStatus} Benchmark
                    </Badge>
                  </div>
                  {athlete.coachName && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Coach</p>
                      <p className="text-sm text-muted-foreground">{athlete.coachName}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Registration Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Registration Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Registration Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(athlete.registrationDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Last Assessment</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(athlete.lastAssessment).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Athlete ID</p>
                  <p className="text-sm text-muted-foreground font-mono">{athlete.id}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {performanceMetrics.map((metric) => (
                <Card key={metric.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{metric.name}</span>
                      <span className="text-2xl font-bold">
                        {metric.value} {metric.unit}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress 
                      value={metric.reverse ? 
                        ((metric.max - metric.value) / metric.max) * 100 : 
                        (metric.value / metric.max) * 100
                      } 
                      className="w-full" 
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      {metric.reverse ? 'Lower is better' : 'Higher is better'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Overall Performance Score</p>
                    <div className="flex items-center gap-2">
                      <Progress value={80} className="flex-1" />
                      <div className="text-4xl font-bold">80%</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Benchmark Comparison</p>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      At National Benchmark
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Assessment History
                </CardTitle>
                <CardDescription>
                  Track performance improvements over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Assessment history feature coming soon...</p>
                  <p className="text-sm">This will show detailed assessment records and progress tracking.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Analysis Tab */}
          <TabsContent value="video-analysis" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Video Analysis History
                  </CardTitle>
                  <CardDescription>
                    Review past performance analyses and track your progress over time.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {videoAnalyses.length > 0 ? (
                    videoAnalyses.map((analysis) => (
                      <Card key={analysis.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/50 py-3 px-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-lg">Analysis - {new Date(analysis.date).toLocaleDateString()}</CardTitle>
                              <CardDescription>{analysis.summary}</CardDescription>
                            </div>
                            <Badge variant={analysis.overallScore >= 85 ? 'default' : analysis.overallScore >= 70 ? 'secondary' : 'destructive'}>
                              {analysis.overallScore}% Overall
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Jump Height</div>
                              <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xl font-semibold">{analysis.jumpHeight} <span className="text-sm text-muted-foreground">cm</span></span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Stride Length</div>
                              <div className="flex items-center gap-2">
                                <Ruler className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xl font-semibold">{analysis.strideLength} <span className="text-sm text-muted-foreground">m</span></span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm font-medium">Technique</div>
                              <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xl font-semibold">{analysis.technique} <span className="text-sm text-muted-foreground">/100</span></span>
                              </div>
                            </div>
                          </div>

                          {analysis.videoUrl && (
                            <div className="mb-4">
                              <video 
                                src={analysis.videoUrl} 
                                controls 
                                className="w-full max-h-64 rounded-md"
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            <h4 className="font-medium">Recommendations</h4>
                            <div className="space-y-2">
                              {analysis.recommendations.map((rec, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm">
                                  <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                  <span>{rec}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-medium">No video analyses found</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Submit a video analysis to see detailed performance metrics and recommendations.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
