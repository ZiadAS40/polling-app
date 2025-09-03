"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Poll } from '@/types';
import { PollCard } from '@/features/polls/components/PollCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function MyPollsPage() {
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.isAuthenticated) {
      fetchMyPolls();
    }
  }, [user]);

  const fetchMyPolls = async () => {
    try {
      // TODO: Implement actual API call
      // const response = await fetch('/api/polls/my');
      // const data = await response.json();
      // setPolls(data);
      
      // Placeholder implementation
      console.log('Fetching my polls');
      setPolls([]);
    } catch (error) {
      console.error('Failed to fetch my polls:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user?.isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
              <p className="text-muted-foreground mb-4">
                You need to sign in to view your polls.
              </p>
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your polls...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Polls</h1>
            <p className="text-muted-foreground">
              Manage and view your created polls
            </p>
          </div>
          <Button asChild>
            <Link href="/polls/create">Create New Poll</Link>
          </Button>
        </div>

        {polls.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No polls yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't created any polls yet. Create your first poll to get started!
                </p>
                <Button asChild>
                  <Link href="/polls/create">Create Your First Poll</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


