import { AlertCircle, RefreshCw, ServerOff, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ApiErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  variant?: 'default' | 'compact' | 'inline';
}

export function ApiErrorState({
  title = 'Failed to load data',
  message = 'There was a problem connecting to the server. Please check your connection and try again.',
  onRetry,
  variant = 'default',
}: ApiErrorStateProps) {
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-destructive/80">{message}</p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="flex-shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="rounded-full bg-destructive/10 p-3 mb-4">
          <WifiOff className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md">{message}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-6 animate-fade-in">
          <ServerOff className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2 animate-fade-in">
          {title}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md animate-fade-in">
          {message}
        </p>
        {onRetry && (
          <Button 
            onClick={onRetry} 
            className="animate-fade-in"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
        )}
        <p className="text-xs text-muted-foreground mt-6 animate-fade-in">
          If the problem persists, please contact support.
        </p>
      </CardContent>
    </Card>
  );
}
