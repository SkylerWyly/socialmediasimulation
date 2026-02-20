import { Suspense } from 'react';
import { ConsentPageContent } from '@/components/consent-page-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function ConsentPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Informed Consent</CardTitle>
          <Skeleton className="h-4 w-3/4 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-10/12" />
        </CardContent>
      </Card>
    </div>
  )
}

export default function ConsentPage() {
  return (
    <Suspense fallback={<ConsentPageFallback />}>
      <ConsentPageContent />
    </Suspense>
  );
}