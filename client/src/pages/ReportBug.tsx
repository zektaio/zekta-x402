import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Bug, CheckCircle2, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import { Link } from 'wouter';

export default function ReportBug() {
  const { toast } = useToast();
  const [twitterHandle, setTwitterHandle] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitBugMutation = useMutation({
    mutationFn: async (data: { twitterHandle?: string; bugDescription: string }) => {
      const response = await fetch('/api/bugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw result;
      }
      
      return result;
    },
    onSuccess: (data) => {
      if (data.ok) {
        setSubmitted(true);
        setTwitterHandle('');
        setBugDescription('');
        
        // Invalidate bugs list cache so it refreshes
        queryClient.invalidateQueries({ queryKey: ['/api/bugs'] });
        
        toast({
          title: "Bug Reported!",
          description: "Thanks for helping improve Zekta. We'll look into it.",
        });
      }
    },
    onError: (error: any) => {
      const errorMessage = error.error || error.message || "Failed to submit bug report";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bugDescription.trim()) {
      toast({
        title: "Missing Description",
        description: "Please describe the bug you encountered",
        variant: "destructive"
      });
      return;
    }

    submitBugMutation.mutate({
      twitterHandle: twitterHandle.trim() || undefined,
      bugDescription: bugDescription.trim()
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/">
                <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                  <img src="/logo.png" alt="Zekta Logo" className="w-10 h-10" />
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                    ZEKTA
                  </span>
                </div>
              </Link>
              <div className="hidden md:flex items-center gap-2">
                <div className="h-6 w-px bg-gray-300"></div>
                <span className="text-sm font-medium text-gray-600">Report Bug</span>
              </div>
            </div>
            <Link href="/bugs">
              <Button variant="ghost" size="sm" className="text-gray-700" data-testid="link-view-bugs">
                View All Bugs
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-blue-100 mb-4">
            <Bug className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Report a Bug
          </h1>
          <p className="text-lg text-gray-600">
            Help us improve Zekta by reporting issues you encounter
          </p>
        </div>

        {/* Success Message */}
        {submitted && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Bug report submitted successfully! We appreciate your help.
            </AlertDescription>
          </Alert>
        )}

          {/* Report Form */}
          <Card data-testid="card-report-bug-form">
            <CardHeader>
              <CardTitle>Bug Details</CardTitle>
              <CardDescription>
                Provide as much detail as possible about the issue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Twitter Handle (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="twitter-handle">
                    Twitter Handle <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      @
                    </span>
                    <Input
                      id="twitter-handle"
                      data-testid="input-twitter-handle"
                      placeholder="yourtwitter"
                      value={twitterHandle}
                      onChange={(e) => setTwitterHandle(e.target.value)}
                      className="pl-8"
                      maxLength={100}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Optional: For follow-up if we need more details
                  </p>
                </div>

                {/* Bug Description */}
                <div className="space-y-2">
                  <Label htmlFor="bug-description">
                    Bug Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="bug-description"
                    data-testid="textarea-bug-description"
                    placeholder="Describe the bug you encountered...&#10;&#10;Include:&#10;• What you were trying to do&#10;• What happened instead&#10;• Steps to reproduce"
                    value={bugDescription}
                    onChange={(e) => setBugDescription(e.target.value)}
                    className="min-h-[200px] resize-y"
                    maxLength={5000}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {bugDescription.length} / 5000 characters
                  </p>
                </div>

                {/* Duplicate Warning */}
                {submitBugMutation.error && (submitBugMutation.error as any).message?.includes("already been reported") && (
                  <Alert className="border-yellow-500/50 bg-yellow-500/10">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <AlertDescription className="text-yellow-500">
                      This bug has already been reported. Check the{' '}
                      <Link href="/bugs">
                        <a className="underline font-medium">bug list</a>
                      </Link>{' '}
                      to see its status.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={submitBugMutation.isPending || !bugDescription.trim()}
                  data-testid="button-submit-bug"
                >
                  {submitBugMutation.isPending ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Bug Report
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

        {/* Info Card */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong className="text-gray-900">Before submitting:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Check if the bug has already been reported</li>
                  <li>Include clear steps to reproduce the issue</li>
                  <li>Mention your browser/device if relevant</li>
                  <li>Add error messages if you saw any</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
