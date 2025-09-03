"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreatePollData } from '@/types';
import { validatePollTitle, validatePollOptions } from '@/lib/validations';
import { POLL_SETTINGS } from '@/lib/constants';

export function CreatePollForm() {
  const [formData, setFormData] = useState<CreatePollData>({
    title: '',
    description: '',
    options: ['', ''],
    isPublic: true,
    allowMultipleVotes: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate form
    const newErrors: Record<string, string> = {};
    
    const titleValidation = validatePollTitle(formData.title);
    if (!titleValidation.isValid) {
      newErrors.title = titleValidation.error!;
    }
    
    const optionsValidation = validatePollOptions(formData.options.filter(opt => opt.trim()));
    if (!optionsValidation.isValid) {
      newErrors.options = optionsValidation.error!;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement actual poll creation with your backend
      // const response = await fetch('/api/polls', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     options: formData.options.filter(opt => opt.trim()),
      //   }),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to create poll');
      // }
      // 
      // const poll = await response.json();
      // router.push(`/polls/${poll.id}`);
      
      // Placeholder implementation
      console.log('Creating poll:', formData);
      throw new Error('Poll creation not implemented yet');
    } catch (error) {
      console.error('Poll creation failed:', error);
      setErrors({ general: 'Failed to create poll. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const addOption = () => {
    if (formData.options.length < POLL_SETTINGS.MAX_OPTIONS) {
      setFormData(prev => ({ ...prev, options: [...prev.options, ''] }));
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > POLL_SETTINGS.MIN_OPTIONS) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
        <CardDescription>
          Create a poll to gather opinions from your audience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {errors.general}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title *</Label>
            <Input
              id="title"
              placeholder="What's your question?"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={errors.title ? 'border-red-500' : ''}
              maxLength={POLL_SETTINGS.MAX_TITLE_LENGTH}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.title.length}/{POLL_SETTINGS.MAX_TITLE_LENGTH} characters
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <textarea
              id="description"
              placeholder="Add more context to your poll..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              maxLength={POLL_SETTINGS.MAX_DESCRIPTION_LENGTH}
            />
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/{POLL_SETTINGS.MAX_DESCRIPTION_LENGTH} characters
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Poll Options *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={formData.options.length >= POLL_SETTINGS.MAX_OPTIONS}
              >
                Add Option
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    maxLength={POLL_SETTINGS.MAX_OPTION_LENGTH}
                  />
                  {formData.options.length > POLL_SETTINGS.MIN_OPTIONS && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            {errors.options && (
              <p className="text-sm text-red-500">{errors.options}</p>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isPublic">Make this poll public</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allowMultipleVotes"
                checked={formData.allowMultipleVotes}
                onChange={(e) => setFormData(prev => ({ ...prev, allowMultipleVotes: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="allowMultipleVotes">Allow multiple votes per user</Label>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Poll'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


