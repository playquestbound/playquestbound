import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useAdminQuests";
import {
  useAdminSubmissions,
  useSubmissionStats,
  useApproveSubmission,
  useRejectSubmission,
  type Submission,
  type SubmissionFilters,
} from "@/hooks/useAdminSubmissions";
import { 
  ArrowLeft, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Video, 
  Loader2,
  ExternalLink,
  AlertTriangle,
  Trophy,
  Coins
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function SubmissionsReview() {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { toast } = useToast();

  const [filters, setFilters] = useState<SubmissionFilters>({
    status: "pending",
    search: "",
  });

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const { data: submissions = [], isLoading: submissionsLoading } = useAdminSubmissions(filters);
  const { data: stats } = useSubmissionStats();

  const approveMutation = useApproveSubmission();
  const rejectMutation = useRejectSubmission();

  if (authLoading || adminLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleApprove = async (submission: Submission) => {
    const xp = submission.quest?.xp_reward || 0;
    const gold = submission.quest?.gold_reward || 0;

    try {
      await approveMutation.mutateAsync({
        submissionId: submission.id,
        xpAwarded: xp,
        goldAwarded: gold,
      });
      toast({
        title: "Submission Approved",
        description: `Awarded ${xp} XP and ${gold} gold to ${submission.profile?.character_name || 'user'}.`,
      });
      setSelectedSubmission(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve submission.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission) return;

    try {
      await rejectMutation.mutateAsync({
        submissionId: selectedSubmission.id,
        reason: rejectReason,
      });
      toast({
        title: "Submission Rejected",
        description: "The submission has been rejected.",
      });
      setRejectModalOpen(false);
      setRejectReason("");
      setSelectedSubmission(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject submission.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-500 border-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-500 border-red-500"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTierColor = (tier: string | null) => {
    switch (tier) {
      case 'grand': return 'text-yellow-500';
      case 'main': return 'text-purple-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Submissions Review
          </h1>
          <p className="text-muted-foreground mt-1">
            {stats?.total || 0} total • {stats?.pending || 0} pending • {stats?.approved || 0} approved • {stats?.rejected || 0} rejected
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by quest or player..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-9"
            />
          </div>
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submissions List */}
        {submissionsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No submissions found
          </div>
        ) : (
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <Card key={submission.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className={`text-lg ${getTierColor(submission.quest?.tier || null)}`}>
                        {submission.quest?.title || 'Unknown Quest'}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        by <span className="font-medium text-foreground">{submission.profile?.character_name || 'Unknown Player'}</span>
                        {' • '}
                        Lv.{submission.profile?.level || 1} {submission.profile?.class || 'Adventurer'}
                      </p>
                    </div>
                    {getStatusBadge(submission.status || 'pending')}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm mb-4">
                    {submission.submitted_at && (
                      <span className="text-muted-foreground">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true })}
                      </span>
                    )}
                    {submission.completion_lat && submission.completion_lng && (
                      <span className="text-green-500">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        GPS Verified
                      </span>
                    )}
                    {submission.video_url && (
                      <a 
                        href={submission.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        <Video className="w-4 h-4 inline mr-1" />
                        View Video
                        <ExternalLink className="w-3 h-3 inline ml-1" />
                      </a>
                    )}
                    {submission.challenge_confirmed && (
                      <span className="text-purple-500">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Challenge Confirmed
                      </span>
                    )}
                    {(submission.fraud_score || 0) > 0 && (
                      <span className="text-red-500">
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        Fraud Score: {submission.fraud_score}
                      </span>
                    )}
                  </div>

                  {/* Rewards Info */}
                  <div className="flex items-center gap-4 text-sm mb-4 p-2 bg-muted/30 rounded">
                    <span className="text-purple-400">
                      <Trophy className="w-4 h-4 inline mr-1" />
                      {submission.quest?.xp_reward || 0} XP
                    </span>
                    <span className="text-yellow-500">
                      <Coins className="w-4 h-4 inline mr-1" />
                      {submission.quest?.gold_reward || 0} Gold
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {submission.quest?.difficulty || 'Easy'}
                    </Badge>
                  </div>

                  {/* Actions */}
                  {submission.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(submission)}
                        disabled={approveMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {approveMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setRejectModalOpen(true);
                        }}
                        className="border-red-600/50 text-red-400 hover:bg-red-600/10"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {submission.status === 'approved' && (
                    <div className="text-sm text-green-500">
                      Awarded: {submission.xp_awarded || 0} XP, {submission.gold_awarded || 0} Gold
                    </div>
                  )}

                  {submission.status === 'rejected' && submission.rejection_reason && (
                    <div className="text-sm text-red-400">
                      Reason: {submission.rejection_reason}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Reject Modal */}
        <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Submission</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this submission is being rejected..."
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleReject}
                disabled={rejectMutation.isPending || !rejectReason.trim()}
              >
                {rejectMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : null}
                Reject Submission
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}