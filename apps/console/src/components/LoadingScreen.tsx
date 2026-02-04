
import { Spinner } from '@object-ui/components';

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="flex items-center gap-2">
        <Spinner className="h-4 w-4" />
        <span className="text-sm text-muted-foreground">Initializing ObjectStack Console...</span>
      </div>
    </div>
  );
}
