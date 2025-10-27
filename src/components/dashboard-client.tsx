'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ArrowRight, BookCopy, FileQuestion, Layers3 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const chartConfig = {
  score: {
    label: 'Score',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function DashboardClient() {
  const store = useAppStore(state => ({
    studySets: state.studySets,
    quizAttempts: state.quizAttempts,
    generatedFlashcards: state.generatedFlashcards,
    srs: state.srs,
  }));

  const welcomeImage = PlaceHolderImages.find(img => img.id === 'dashboard-welcome');
  
  if (!store) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-80 w-full rounded-xl" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
            <Skeleton className="h-[400px] w-full" />
        </div>
    );
  }

  const { studySets, quizAttempts, generatedFlashcards, srs } = store;

  const totalFlashcards = Object.values(generatedFlashcards).flat().length;
  const now = Date.now();
  const dueToday = Object.entries(generatedFlashcards).reduce((acc, [setId, cards]) => {
    const setSrs = srs?.[setId] || {};
    const due = (cards as any[]).filter((c: any) => (setSrs[c.id]?.dueAt || Infinity) <= now).length;
    return acc + due;
  }, 0);

  const chartData = (quizAttempts ?? []).slice(-10).map(attempt => ({
    date: new Date(attempt.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: attempt.score,
  }));

  const averageScore = quizAttempts && quizAttempts.length > 0
    ? Math.round(quizAttempts.reduce((acc, curr) => acc + curr.score, 0) / quizAttempts.length)
    : 0;

  return (
    <div className="space-y-6">
      {(!studySets?.length && !quizAttempts?.length && totalFlashcards === 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Welcome! Let’s get you started</CardTitle>
            <CardDescription>Follow these quick steps to set up your study workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Add a study set with your notes and optional tags.</li>
              <li>Generate a quiz to check your understanding.</li>
              <li>Create flashcards and review due cards with SRS.</li>
            </ol>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm"><Link href="/study-sets">Add Study Set</Link></Button>
              <Button asChild size="sm" variant="secondary"><Link href="/quiz">Create a Quiz</Link></Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
        {welcomeImage && (
          <Image
            src={welcomeImage.imageUrl}
            alt={welcomeImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={welcomeImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-white">Welcome to CertAI Prep</h1>
          <p className="mt-2 text-lg text-white/90 max-w-2xl">
            Your intelligent partner for cloud certification success. Upload study materials, generate quizzes, and master concepts with AI-powered flashcards.
          </p>
          <Button asChild className="mt-4" size="lg">
            <Link href="/study-sets">
              Get Started <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Sets</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studySets?.length || 0}</div>
            <p className="text-xs text-muted-foreground">materials uploaded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
            <Layers3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dueToday}</div>
            <p className="text-xs text-muted-foreground">flashcards to review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Taken</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizAttempts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">total attempts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <div className="h-4 w-4 text-accent">{averageScore}%</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
            <p className="text-xs text-muted-foreground">across all quizzes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flashcards Created</CardTitle>
            <Layers3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFlashcards}</div>
            <p className="text-xs text-muted-foreground">ready for review</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Performance</CardTitle>
          <CardDescription>Your scores on the last 10 quizzes.</CardDescription>
        </CardHeader>
        <CardContent>
          {quizAttempts && quizAttempts.length > 0 ? (
            <div className="h-[300px]">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart data={chartData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    unit="%"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="score" fill="var(--color-score)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>
          ) : (
            <div className="flex h-[300px] flex-col items-center justify-center text-center">
              <h3 className="text-lg font-semibold">No Quiz Data Yet</h3>
              <p className="text-muted-foreground">Take a quiz to see your performance here.</p>
              <Button asChild variant="secondary" className="mt-4">
                <Link href="/quiz">Create a Quiz</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
