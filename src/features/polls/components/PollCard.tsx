"use client";

import Link from 'next/link';
import { Poll } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PollCardProps {
  poll: Poll;
}

export function PollCard({ poll }: PollCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isExpired = poll.expiresAt && new Date(poll.expiresAt) < new Date();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg line-clamp-2">
              <Link 
                href={`/polls/${poll.id}`}
                className="hover:text-primary transition-colors"
              >
                {poll.title}
              </Link>
            </CardTitle>
            {poll.description && (
              <CardDescription className="line-clamp-2">
                {poll.description}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-col items-end space-y-2">
            {isExpired && (
              <Badge variant="destructive">Expired</Badge>
            )}
            {!poll.isPublic && (
              <Badge variant="secondary">Private</Badge>
            )}
            {poll.allowMultipleVotes && (
              <Badge variant="outline">Multiple Votes</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={poll.author.avatar} alt={poll.author.name} />
              <AvatarFallback className="text-xs">
                {poll.author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              by {poll.author.name}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{poll.totalVotes} votes</span>
            <span>{poll.options.length} options</span>
            <span>{formatDate(poll.createdAt)}</span>
          </div>
          
          {poll.expiresAt && (
            <div className="text-sm text-muted-foreground">
              {isExpired ? (
                <span className="text-destructive">Expired {formatDate(poll.expiresAt)}</span>
              ) : (
                <span>Expires {formatDate(poll.expiresAt)}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


