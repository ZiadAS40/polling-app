"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Poll } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

export default function PollDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPoll(id as string);
    }
  }, [id]);

  const fetchPoll = async (pollId: string) => {
    try {
      // TODO: Implement actual API call
      // const response = await fetch(`/api/polls/${pollId}`);
      // const data = await response.json();
      // setPoll(data);
      
      // Placeholder implementation
      console.log('Fetching poll:', pollId);
      setPoll(null);
    } catch (error) {
      console.error('Failed to fetch poll:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async () => {
    if (!poll || selectedOptions.length === 0) return;

    try {
      // TODO: Implement actual voting API call
      // const response = await fetch(`/api/polls/${poll.id}/vote`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ optionIds: selectedOptions }),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to vote');
      // }
      // 
      // const updatedPoll = await response.json();
      // setPoll(updatedPoll);
      // setHasVoted(true);
      
      // Placeholder implementation
      console.log('Voting for options:', selectedOptions);
      throw new Error('Voting not implemented yet');
    } catch (error) {
      console.error('Voting failed:', error);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (!poll) return;

    if (poll.allowMultipleVotes) {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading poll...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Poll Not Found</h2>
              <p className="text-muted-foreground">
                The poll you're looking for doesn't exist or has been removed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired = poll.expiresAt && new Date(poll.expiresAt) < new Date();
  const canVote = !isExpired && poll.isActive && user?.isAuthenticated && !hasVoted;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{poll.title}</CardTitle>
              {poll.description && (
                <CardDescription className="text-base">
                  {poll.description}
                </CardDescription>
              )}
            </div>
            <div className="flex flex-col items-end space-y-2">
              {isExpired && <Badge variant="destructive">Expired</Badge>}
              {!poll.isPublic && <Badge variant="secondary">Private</Badge>}
              {poll.allowMultipleVotes && <Badge variant="outline">Multiple Votes</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={poll.author.avatar} alt={poll.author.name} />
                <AvatarFallback className="text-xs">
                  {poll.author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>by {poll.author.name}</span>
            </div>
            <span>•</span>
            <span>{poll.totalVotes} votes</span>
            <span>•</span>
            <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
            {poll.expiresAt && (
              <>
                <span>•</span>
                <span>
                  {isExpired ? 'Expired' : 'Expires'} {new Date(poll.expiresAt).toLocaleDateString()}
                </span>
              </>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Options:</h3>
            {poll.options.map((option) => {
              const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
              const isSelected = selectedOptions.includes(option.id);
              
              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type={poll.allowMultipleVotes ? "checkbox" : "radio"}
                      id={option.id}
                      name="poll-option"
                      checked={isSelected}
                      onChange={() => handleOptionSelect(option.id)}
                      disabled={!canVote}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={option.id} className="flex-1 cursor-pointer">
                      {option.text}
                    </label>
                    <span className="text-sm text-muted-foreground">
                      {option.votes} votes ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {canVote && (
            <div className="flex justify-center">
              <Button 
                onClick={handleVote}
                disabled={selectedOptions.length === 0}
              >
                Submit Vote
              </Button>
            </div>
          )}

          {!user?.isAuthenticated && (
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground mb-2">
                You need to sign in to vote on this poll.
              </p>
              <Button asChild>
                <a href="/auth/login">Sign In</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


