import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Download, FileSpreadsheet, FileText, Calendar as CalendarIcon, Clock, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { useAssessments, useAthletes } from "@/hooks/useFirebaseData";
import { DocumentData } from "firebase/firestore";

// Define our data interfaces
export interface Assessment extends DocumentData {
  id: string;
  athleteName?: string;
  testType?: string;
  aiScore?: number;
  submissionDate?: string;
  status?: string;
  performanceMetric?: number | string;
  athleteId?: string;
  academyId?: string;
}

export interface Athlete extends DocumentData {
  id: string;
  name?: string;
  age?: number | string;
  state?: string;
  gender?: string;
  registrationDate?: string;
  performance?: {
    overallScore?: number;
    [key: string]: any;
  };
  coachName?: string;
  academyId?: string;
}

// Type for report data row
type ReportDataRow = Record<string, any>;

const reportTemplates = [
  {
    id: 'performance',
    title: 'Athlete Performance Report',
    description: 'Comprehensive analysis of individual athlete performance across all assessments',
    type: 'Performance',
    format: ['PDF', 'Excel'],
    frequency: 'On-demand',
    lastGenerated: '2024-03-10',
  },
  {
    id: 'state-analysis',
    title: 'State-wise Analysis Report',
    description: 'Regional performance comparison and talent distribution analysis',
    type: 'Analytics',
    format: ['PDF', 'Excel'],
    frequency: 'Monthly',
    lastGenerated: '2024-03-01',
  },
  {
    id: 'assessment-summary',
    title: 'Assessment Summary Report',
    description: 'Weekly summary of assessment submissions, approvals, and flags',
    type: 'Operations',
    format: ['PDF'],
    frequency: 'Weekly',
    lastGenerated: '2024-03-08',
  },
  {
    id: 'talent-identification',
    title: 'Talent Identification Report',
    description: 'Shortlist of high-performing athletes for advanced training programs',
    type: 'Talent',
    format: ['PDF', 'Excel'],
    frequency: 'Quarterly',
    lastGenerated: '2024-01-15',
  },
  {
    id: 'cheat-detection',
    title: 'Security & Integrity Report',
    description: 'Analysis of flagged assessments and potential security breaches',
    type: 'Security',
    format: ['PDF'],
    frequency: 'Monthly',
    lastGenerated: '2024-03-01',
  },
  {
    id: 'coach-dashboard',
    title: 'Coach Performance Dashboard',
    description: 'Regional coach performance and athlete development metrics',
    type: 'Coaching',
    format: ['PDF', 'Excel'],
    frequency: 'Quarterly',
    lastGenerated: '2024-01-15',
  },
];

export default function Reports() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);
  const [templates, setTemplates] = useState([...reportTemplates]);

  // Fetch real data from Firebase with proper typing
  const { data: assessmentsData = [] } = useAssessments();
  const { data: athletesData = [] } = useAthletes();
  
  // Cast the data to our typed interfaces
  const assessments = (assessmentsData || []) as Assessment[];
  const athletes = (athletesData || []) as Athlete[];
  
  // Generate report data from Firebase
  const generateReportData = async (reportId: string): Promise<ReportDataRow[]> => {
    try {
      switch(reportId) {
        case 'performance':
          // Performance report - show all assessments with athlete details
          return assessments.map(assessment => ({
            id: assessment.id,
            athlete: assessment.athleteName || 'Unknown Athlete',
            testType: assessment.testType || 'N/A',
            score: assessment.aiScore || 0,
            date: assessment.submissionDate ? new Date(assessment.submissionDate).toLocaleDateString() : 'N/A',
            status: assessment.status || 'Pending',
            performanceMetric: assessment.performanceMetric || 0
          }));
          
        case 'state-analysis':
          // State-wise analysis
          const stateData: Record<string, {count: number, totalScore: number, topScore: number, topPerformer: string}> = {};
          
          athletes.forEach(athlete => {
            const state = athlete.state || 'Unknown';
            const score = athlete.performance?.overallScore || 0;
            
            if (!stateData[state]) {
              stateData[state] = { count: 0, totalScore: 0, topScore: 0, topPerformer: '' };
            }
            
            stateData[state].count++;
            stateData[state].totalScore += score;
            
            if (score > stateData[state].topScore) {
              stateData[state].topScore = score;
              stateData[state].topPerformer = athlete.name || 'Unknown';
            }
          });
          
          return Object.entries(stateData).map(([state, data]) => ({
            state,
            athletes: data.count,
            avgScore: data.count > 0 ? Math.round((data.totalScore / data.count) * 100) / 100 : 0,
            topPerformer: data.topPerformer,
            topScore: data.topScore
          }));
          
        case 'assessment-summary':
          // Assessment summary by date
          const summaryByDate: Record<string, {total: number, approved: number, pending: number, flagged: number, rejected: number}> = {};
          
          assessments.forEach(assessment => {
            const date = assessment.submissionDate ? new Date(assessment.submissionDate).toISOString().split('T')[0] : 'Unknown';
            
            if (!summaryByDate[date]) {
              summaryByDate[date] = { total: 0, approved: 0, pending: 0, flagged: 0, rejected: 0 };
            }
            
            summaryByDate[date].total++;
            
            switch(assessment.status?.toLowerCase()) {
              case 'approved': summaryByDate[date].approved++; break;
              case 'pending': summaryByDate[date].pending++; break;
              case 'flagged': summaryByDate[date].flagged++; break;
              case 'rejected': summaryByDate[date].rejected++; break;
            }
          });
          
          return Object.entries(summaryByDate).map(([date, counts]) => ({
            date,
            ...counts
          }));
          
        case 'talent-identification':
          // Top performers
          return athletes
            .filter(athlete => (athlete.performance?.overallScore || 0) >= 80) // Filter high performers
            .map(athlete => ({
              id: athlete.id,
              name: athlete.name || 'Unknown',
              age: athlete.age || 'N/A',
              state: athlete.state || 'N/A',
              score: athlete.performance?.overallScore || 0,
              potential: (athlete.performance?.overallScore || 0) >= 90 ? 'Elite' : 'High',
              testScores: JSON.stringify(athlete.performance || {})
            }))
            .sort((a, b) => b.score - a.score);
            
        case 'coach-dashboard':
          // Coach performance (simplified - in a real app, you'd have coach assignments)
          const coachData: Record<string, {athletes: number, totalScore: number}> = {};
          
          athletes.forEach(athlete => {
            const coach = athlete.coachName || 'Unassigned';
            const score = athlete.performance?.overallScore || 0;
            
            if (!coachData[coach]) {
              coachData[coach] = { athletes: 0, totalScore: 0 };
            }
            
            coachData[coach].athletes++;
            coachData[coach].totalScore += score;
          });
          
          return Object.entries(coachData).map(([coach, data]) => {
            const avgScore = data.athletes > 0 ? data.totalScore / data.athletes : 0;
            return {
              coach,
              athletes: data.athletes,
              avgScore: Math.round(avgScore * 100) / 100,
              successRate: `${Math.min(100, Math.max(60, Math.round(avgScore)))}%`,
              avgImprovement: `${Math.floor(Math.random() * 15) + 5}%` // Random improvement for demo
            };
          });
          
        default:
          return [];
      }
    } catch (error) {
      console.error('Error generating report data:', error);
      toast.error('Failed to generate report data');
      return [];
    }
  };

  const generatePdf = (report: { title: string }, data: ReportDataRow[]) => {
    const doc = new jsPDF();
    const title = report.title;
    const date = new Date().toLocaleDateString();
    
    // Add title and date
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date}`, 14, 30);
    
    // Add a line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 35, 200, 35);
    
    // Prepare data for the table
    if (data.length > 0) {
      const headers = [Object.keys(data[0])];
      const rows = data.map(item => Object.values(item));
      
      // @ts-ignore - jspdf-autotable types are not perfect
      doc.autoTable({
        head: headers,
        body: rows,
        startY: 40,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] },
      });
    } else {
      doc.text('No data available', 14, 45);
    }
    
    return doc;
  };

  const generateExcel = (report: { title: string }, data: ReportDataRow[]) => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    
    return wb;
  };

  const handleDownloadReport = async (reportId: string, format: 'PDF' | 'Excel' = 'PDF') => {
    try {
      setDownloadingReport(reportId);
      
      // Get the report data
      const reportIndex = templates.findIndex(r => r.id === reportId);
      if (reportIndex === -1) return;
      const report = templates[reportIndex];
      
      // Generate data for the report from Firebase
      const reportData = await generateReportData(reportId);
      
      if (format === 'PDF') {
        // Generate PDF
        const doc = generatePdf(report, reportData);
        
        // Save the PDF
        doc.save(`${report.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`);
      } else {
        // Generate Excel
        const wb = generateExcel(report, reportData);
        
        // Save the Excel file
        XLSX.writeFile(wb, `${report.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.xlsx`);
      }
      
      // Update last generated date
      setTemplates(prevTemplates => {
        const updatedTemplates = [...prevTemplates];
        updatedTemplates[reportIndex] = {
          ...updatedTemplates[reportIndex],
          lastGenerated: new Date().toISOString().split('T')[0]
        };
        return updatedTemplates;
      });
      
      toast.success(`${report.title} downloaded successfully`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setDownloadingReport(null);
    }
  };

  const handleQuickExport = async () => {
    try {
      setDownloadingReport('quick-export');
      
      // Generate data for quick export from Firebase
      const data = await generateReportData('performance');
      
      // Generate Excel
      const wb = generateExcel({ title: 'Athlete Performance Export' }, data);
      
      // Save the Excel file
      XLSX.writeFile(wb, `athlete-performance-export-${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast.success('Athlete data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    } finally {
      setDownloadingReport(null);
    }
  };


  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'Performance':
        return 'bg-primary/10 text-primary';
      case 'Analytics':
        return 'bg-success/10 text-success';
      case 'Operations':
        return 'bg-warning/10 text-warning';
      case 'Talent':
        return 'bg-purple-100 text-purple-700';
      case 'Security':
        return 'bg-danger/10 text-danger';
      case 'Coaching':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <MainLayout 
      title="Reports & Export"
      description="Generate and export comprehensive performance reports"
    >
      <div className="space-y-6 w-full">
        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 w-full">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">Quick Export</p>
                  <p className="text-sm text-muted-foreground">Export current athlete data</p>
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={handleQuickExport}
                disabled={!!downloadingReport}
              >
                {downloadingReport === 'quick-export' ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export to Excel
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-warning" />
                <div>
                  <p className="font-semibold">Custom Report</p>
                  <p className="text-sm text-muted-foreground">Build custom analytics</p>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Create Custom
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Report Filters */}
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center w-full">
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="talent">Talent</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Select date range"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <div className="grid gap-4 lg:grid-cols-2 w-full">
          {templates.map((report) => (
            <Card key={report.id} className="transition-all hover:shadow-lg w-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <Badge className={getTypeColor(report.type)} variant="outline">
                        {report.type}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {report.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Format</p>
                    <div className="flex gap-1 mt-1">
                      {report.format.map((fmt) => (
                        <Badge key={fmt} variant="outline" className="text-xs">
                          {fmt}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Frequency</p>
                    <p className="font-medium mt-1">{report.frequency}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm">
                    <p className="text-muted-foreground">Last Generated</p>
                    <p className="font-medium">{new Date(report.lastGenerated).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex gap-2">
                      {report.format.map((format) => (
                        <Button 
                          key={format}
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadReport(report.id, format as 'PDF' | 'Excel')}
                          disabled={!!downloadingReport}
                          className="gap-1"
                        >
                          {downloadingReport === report.id ? (
                            <Clock className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          {format}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Recently generated reports available for download</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'March Performance Summary.pdf', size: '2.3 MB', date: '2024-03-10', status: 'Ready' },
                { name: 'State Analysis Q1 2024.xlsx', size: '4.7 MB', date: '2024-03-08', status: 'Ready' },
                { name: 'Weekly Assessment Report.pdf', size: '1.8 MB', date: '2024-03-05', status: 'Ready' },
                { name: 'Talent Identification Jan-Mar.xlsx', size: '3.2 MB', date: '2024-03-01', status: 'Ready' },
              ].map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.size} • {file.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-success/10 text-success">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      {file.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const extension = file.name.split('.').pop()?.toLowerCase();
                        const format = extension === 'xlsx' ? 'Excel' : 'PDF' as const;
                        handleDownloadReport(file.name.replace(/\.[^/.]+$/, ''), format);
                      }}
                      disabled={!!downloadingReport}
                    >
                      {downloadingReport === file.name ? (
                        <Clock className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}