"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Create and Participate in Polls
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Engage your audience with interactive polls. Create custom polls, gather opinions, 
            and make data-driven decisions with our intuitive polling platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user?.isAuthenticated ? (
              <>
                <Button asChild size="lg">
                  <Link href="/polls/create">Create Poll</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/polls">Browse Polls</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/auth/register">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/polls">Browse Polls</Link>
                </Button>
              </>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Easy Poll Creation</CardTitle>
              <CardDescription>
                Create polls in seconds with our intuitive interface. Add multiple options, 
                set expiration dates, and customize privacy settings.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Real-time Results</CardTitle>
              <CardDescription>
                See poll results update in real-time as people vote. Visual charts and 
                percentages help you understand the data at a glance.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your polls are secure and private. Choose between public and private polls, 
                and control who can participate in your surveys.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* CTA Section */}
        {!user?.isAuthenticated && (
          <section className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Ready to get started?</h2>
            <p className="text-muted-foreground">
              Join thousands of users creating and participating in polls every day.
            </p>
            <Button asChild size="lg">
              <Link href="/auth/register">Create Your Account</Link>
            </Button>
          </section>
        )}
      </div>
    </div>
  );
}