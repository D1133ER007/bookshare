'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function MessagesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Messages page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Something went wrong!</h2>
        <p className="text-muted-foreground mb-4">
          {error.message || 'An error occurred while loading messages.'}
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
} 