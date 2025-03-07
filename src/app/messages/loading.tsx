import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function MessagesLoading() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-8rem)]">
        {/* Conversations List Loading */}
        <Card className="col-span-4 h-full">
          <CardContent className="p-4">
            <Skeleton className="h-8 w-40 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Messages Loading */}
        <Card className="col-span-8 h-full">
          <CardContent className="p-4">
            <Skeleton className="h-8 w-40 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[70%]">
                    <Skeleton className={`h-16 w-64 rounded-lg`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 