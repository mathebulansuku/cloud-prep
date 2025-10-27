'use client';

import React, { useEffect, useState, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/lib/store';
import { createFlashcardsAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Layers3, Lightbulb, Download, RotateCw } from 'lucide-react';
import type { Flashcard } from '@/lib/types';

const formSchema = z.object({
  studySetId: z.string().min(1, 'Please select a study set.'),
  numberOfFlashcards: z.coerce.number().min(1).max(50),
});

type FormValues = z.infer<typeof formSchema>;

export function FlashcardsClient() {
  const { studySets, addFlashcards, generatedFlashcards: generatedFlashcardsMap, srs, reviewFlashcard } = useAppStore(state => ({
    studySets: state.studySets,
    addFlashcards: state.addFlashcards,
    generatedFlashcards: state.generatedFlashcards,
    srs: state.srs,
    reviewFlashcard: state.reviewFlashcard,
  }));
  const { toast } = useToast();
  const [generatedFlashcards, setGeneratedFlashcards] = React.useState<Flashcard[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studySetId: '',
      numberOfFlashcards: 10,
    },
  });

  // SRS review state
  const [reviewSetId, setReviewSetId] = React.useState<string>('');
  const [reviewIndex, setReviewIndex] = React.useState(0);
  const [showAnswer, setShowAnswer] = React.useState(false);

  const [state, formAction] = useActionState(createFlashcardsAction, {
    message: '',
  });

  // Avoid hydration mismatch by rendering skeleton until mounted
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (state.message && state.flashcards) {
      toast({ title: 'Success', description: state.message });
      setGeneratedFlashcards(state.flashcards);
      addFlashcards(form.getValues('studySetId'), state.flashcards);
      setIsGenerating(false);
    }
    if (state.error) {
      toast({ title: 'Error', description: state.error, variant: 'destructive' });
      setIsGenerating(false);
    }
  }, [state]);

  const handleSubmit = (data: FormValues) => {
    setIsGenerating(true);
    const selectedSet = studySets?.find(s => s.id === data.studySetId);
    if (!selectedSet) {
      toast({ title: 'Error', description: 'Selected study set not found.', variant: 'destructive' });
      setIsGenerating(false);
      return;
    }

    const formData = new FormData();
    formData.append('studyMaterials', selectedSet.content);
    formData.append('numberOfFlashcards', data.numberOfFlashcards.toString());

    React.startTransition(() => {
      formAction(formData);
    });
  };

  const exportToCSV = () => {
    const headers = ['"question"',' "answer"'];
    const rows = generatedFlashcards.map(fc => `"${fc.question.replace(/"/g, '""')}" , "${fc.answer.replace(/"/g, '""')}"`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "flashcards.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Exported', description: 'Flashcards have been exported to CSV.' });
  }

  // Build due queue for selected review set (declare before any early returns to keep hooks order stable)
  const now = Date.now();
  const dueQueue = React.useMemo(() => {
    if (!reviewSetId) return [] as { id: string; question: string; answer: string }[];
    const cards = (generatedFlashcardsMap[reviewSetId] || []) as any[];
    const srsForSet = srs[reviewSetId] || {};
    return cards.filter(c => (srsForSet[c.id]?.dueAt || 0) <= now).map(c => ({ id: c.id as string, question: c.question, answer: c.answer }));
  }, [generatedFlashcardsMap, reviewSetId, srs, now]);

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-36" />
        </CardContent>
      </Card>
    );
  }

  const handleReview = (rating: 'again'|'good'|'easy') => {
    const current = dueQueue[reviewIndex];
    if (!current) return;
    reviewFlashcard(reviewSetId, current.id, rating);
    setShowAnswer(false);
    setReviewIndex(i => i + 1);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Generate Flashcards</CardTitle>
          <CardDescription>
            Select a study set to automatically generate flashcards using AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="studySetId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Study Set</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isGenerating}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a study set..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {studySets && studySets.length > 0 ? (
                            studySets.map(set => (
                              <SelectItem key={set.id} value={set.id}>
                                {set.title}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No study sets available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numberOfFlashcards"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Flashcards</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="50" {...field} disabled={isGenerating} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isGenerating || !studySets || studySets.length === 0}>
                {isGenerating ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spaced Repetition</CardTitle>
          <CardDescription>Review cards that are due today.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6 items-end">
            <div>
              <Label>Select Study Set</Label>
              <Select value={reviewSetId} onValueChange={setReviewSetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a set..." />
                </SelectTrigger>
                <SelectContent>
                  {studySets?.map(set => (
                    <SelectItem key={set.id} value={set.id}>{set.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Due today: <span className="font-semibold text-foreground">{dueQueue.length}</span>
            </div>
          </div>

          {reviewSetId && dueQueue.length > 0 && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Card {Math.min(reviewIndex + 1, dueQueue.length)} / {dueQueue.length}</CardTitle>
                  <CardDescription>Tap reveal to see the answer.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg font-medium">{dueQueue[reviewIndex]?.question}</p>
                  {showAnswer && (
                    <p className="text-muted-foreground">{dueQueue[reviewIndex]?.answer}</p>
                  )}
                  <div className="flex gap-2">
                    {!showAnswer ? (
                      <Button variant="secondary" onClick={() => setShowAnswer(true)}>Reveal</Button>
                    ) : (
                      <>
                        <Button variant="destructive" onClick={() => handleReview('again')}>Again</Button>
                        <Button variant="outline" onClick={() => handleReview('good')}>Good</Button>
                        <Button onClick={() => handleReview('easy')}>Easy</Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {reviewSetId && dueQueue.length === 0 && (
            <p className="text-sm text-muted-foreground">No cards due right now. Come back later!</p>
          )}
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-headline font-semibold">Generated Flashcards</h2>
            {generatedFlashcards.length > 0 && (
                <Button variant="outline" onClick={exportToCSV}>
                    <Download className="mr-2 h-4 w-4" />
                    Export to CSV
                </Button>
            )}
        </div>
        {isGenerating ? (
          <div className="w-full p-6"><Skeleton className="w-full h-64 rounded-lg" /></div>
        ) : generatedFlashcards.length > 0 ? (
          <Carousel className="w-full max-w-xl mx-auto">
            <CarouselContent>
              {generatedFlashcards.map((card, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card
                      className="group h-64 [transform-style:preserve-3d] transition-transform duration-500"
                      onClick={(e) => e.currentTarget.classList.toggle('[transform:rotateY(180deg)]')}
                    >
                      <div className="relative h-full w-full">
                        {/* Front of card */}
                        <div className="absolute flex h-full w-full items-center justify-center p-6 text-center [backface-visibility:hidden]">
                          <div>
                            <p className="text-sm text-muted-foreground">Question {index + 1}/{generatedFlashcards.length}</p>
                            <p className="text-lg font-semibold mt-2">{card.question}</p>
                          </div>
                        </div>
                        {/* Back of card */}
                        <div className="absolute flex h-full w-full items-center justify-center p-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                           <div>
                            <p className="text-sm font-semibold text-primary">Answer</p>
                            <p className="text-md mt-2">{card.answer}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
            <Layers3 className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Flashcards Generated Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Use the form above to generate a new set of flashcards from your study materials.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
