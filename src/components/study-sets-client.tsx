'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  content: z.string().min(50, 'Content must be at least 50 characters long.'),
});

type FormValues = z.infer<typeof formSchema>;

export function StudySetsClient() {
  const { studySets, addStudySet, removeStudySet } = useAppStore(state => ({
    studySets: state.studySets,
    addStudySet: state.addStudySet,
    removeStudySet: state.removeStudySet,
  }));
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', content: '' },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    addStudySet(data);
    toast({
      title: 'Study Set Added',
      description: `"${data.title}" has been successfully saved.`,
    });
    form.reset();
  };

  const handleDelete = (id: string, title: string) => {
    removeStudySet(id);
    toast({
      title: 'Study Set Deleted',
      description: `"${title}" has been removed.`,
      variant: 'destructive',
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Add New Study Set</CardTitle>
            <CardDescription>
              Add your notes, textbook chapters, or any other study material here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., AWS S3 Basics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your study material here..."
                          className="min-h-[200px] font-code text-xs"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Study Set
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <h2 className="text-2xl font-headline font-semibold mb-4">Your Study Sets</h2>
        {studySets && studySets.length > 0 ? (
          <div className="space-y-4">
            {[...studySets].reverse().map((set) => (
              <Card key={set.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{set.title}</span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the study set "{set.title}" and any associated quizzes or flashcards. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(set.id, set.title)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardTitle>
                  <CardDescription>
                    Created on {new Date(set.createdAt).toLocaleDateString()} &bull;{' '}
                    {set.content.split(' ').length} words
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 font-code">
                    {set.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Study Sets Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first study set to start generating quizzes and flashcards.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
