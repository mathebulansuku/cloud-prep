'use client';

import React, { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/lib/store';
import { createQuizAction, getFeedbackAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, RotateCw, Sparkles, ArrowRight, ArrowLeft, CheckCircle, XCircle, Trophy } from 'lucide-react';
import type { QuizQuestion, QuizAttempt } from '@/lib/types';

const questionTypes = [
  { id: 'multiple choice', label: 'Multiple Choice' },
  { id: 'true/false', label: 'True/False' },
  { id: 'short answer', label: 'Short Answer' },
];

const difficultyLevels = ['easy', 'medium', 'hard'];

const setupSchema = z.object({
  studySetId: z.string().min(1, 'Please select a study set.'),
  numberOfQuestions: z.coerce.number().min(1).max(20),
  questionTypes: z.array(z.string()).refine(value => value.some(item => item), {
    message: 'You have to select at least one question type.',
  }),
  difficultyLevel: z.string().min(1, 'Please select a difficulty level.'),
});

type SetupFormValues = z.infer<typeof setupSchema>;

type QuizStage = 'setup' | 'taking' | 'results';

export function QuizClient() {
  const store = useAppStore(state => state);
  const { toast } = useToast();

  const [stage, setStage] = useState<QuizStage>('setup');
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[] | null>(null);
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string|string[])[]>([]);
  const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState<number | null>(null);

  if (!store) {
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
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-24 w-full" />
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

  const { studySets, addQuiz, addQuizAttempt: saveAttempt, updateFeedback } = store;

  const setupForm = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      studySetId: '',
      numberOfQuestions: 5,
      questionTypes: ['multiple choice'],
      difficultyLevel: 'medium',
    },
  });

  const [state, formAction] = useFormState(createQuizAction, { message: '' });

  useEffect(() => {
    if (state.message && state.quiz) {
      toast({ title: 'Success', description: state.message });
      const selectedSet = studySets?.find(s => s.id === setupForm.getValues('studySetId'));
      if (!selectedSet) {
        toast({ title: 'Error', description: 'Could not find the study set.', variant: 'destructive'});
        setIsGenerating(false);
        return;
      }
      const quizId = addQuiz({
        studySetId: selectedSet!.id,
        studySetTitle: selectedSet!.title,
        questions: state.quiz,
      });
      setCurrentQuizId(quizId);
      setCurrentQuiz(state.quiz);
      setUserAnswers(new Array(state.quiz.length).fill(''));
      setStage('taking');
      setIsGenerating(false);
    }
    if (state.error) {
      toast({ title: 'Error', description: state.error, variant: 'destructive' });
      setIsGenerating(false);
    }
  }, [state, addQuiz, setupForm, studySets, toast]);

  const handleSetupSubmit = (data: SetupFormValues) => {
    setIsGenerating(true);
    const selectedSet = studySets?.find(s => s.id === data.studySetId);
    if (!selectedSet) {
      toast({ title: 'Error', description: 'Selected study set not found.', variant: 'destructive' });
      setIsGenerating(false);
      return;
    }
    const formData = new FormData();
    formData.append('studyMaterial', selectedSet.content);
    formData.append('numberOfQuestions', data.numberOfQuestions.toString());
    data.questionTypes.forEach(qt => formData.append('questionTypes', qt));
    formData.append('difficultyLevel', data.difficultyLevel);
    formAction(formData);
  };

  const handleAnswerChange = (answer: string | string[]) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleQuizSubmit = () => {
    if (!currentQuiz || !currentQuizId) return;
    setIsSubmitting(true);
    let score = 0;
    const isCorrectArray: boolean[] = [];

    currentQuiz.forEach((q, i) => {
      const isQCorrect = JSON.stringify(userAnswers[i]) === JSON.stringify(q.correctAnswer);
      if (isQCorrect) score++;
      isCorrectArray.push(isQCorrect);
    });

    const finalScore = Math.round((score / currentQuiz.length) * 100);
    const attemptId = saveAttempt({
        quizId: currentQuizId,
        answers: userAnswers,
        score: finalScore,
        feedback: new Array(currentQuiz.length).fill(null),
        isCorrect: isCorrectArray,
    });
    const savedAttempt = store.quizAttempts?.find(a => a.id === attemptId);
    setLatestAttempt(savedAttempt || null);
    setStage('results');
    setIsSubmitting(false);
  };

  const handleGetFeedback = async (questionIndex: number) => {
    if (!currentQuiz || !latestAttempt) return;
    setFeedbackLoading(questionIndex);
    const question = currentQuiz[questionIndex];
    const result = await getFeedbackAction({
        question: question.question,
        studentAnswer: Array.isArray(userAnswers[questionIndex]) ? (userAnswers[questionIndex] as string[]).join(', ') : userAnswers[questionIndex] as string,
        correctAnswer: question.correctAnswer,
        explanation: `The correct answer is ${question.correctAnswer}.`
    });
    if (result.feedback) {
      updateFeedback(latestAttempt.id, questionIndex, result.feedback);
      setLatestAttempt(prev => {
        if (!prev) return null;
        const newFeedback = [...prev.feedback];
        newFeedback[questionIndex] = result.feedback!;
        return {...prev, feedback: newFeedback};
      });
    } else if (result.error) {
      toast({ title: 'Feedback Error', description: result.error, variant: 'destructive' });
    }
    setFeedbackLoading(null);
  };
  
  const progress = currentQuiz ? ((currentQuestionIndex + 1) / currentQuiz.length) * 100 : 0;
  const currentQ = currentQuiz?.[currentQuestionIndex];

  if (stage === 'taking' && currentQ) {
    return (
      <Card>
        <CardHeader>
          <Progress value={progress} className="mb-4" />
          <CardTitle>Question {currentQuestionIndex + 1} of {currentQuiz?.length}</CardTitle>
          <CardDescription className="text-lg pt-2">{currentQ.question}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQ.type === 'multiple choice' && (
            <RadioGroup
              onValueChange={(value) => handleAnswerChange(value)}
              value={userAnswers[currentQuestionIndex] as string}
            >
              {currentQ.answers.map((answer, i) => (
                <FormItem key={i} className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors">
                   <FormControl>
                    <RadioGroupItem value={answer} />
                  </FormControl>
                  <FormLabel className="font-normal flex-1 cursor-pointer">{answer}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          )}
           {currentQ.type === 'true/false' && (
             <RadioGroup
              onValueChange={(value) => handleAnswerChange(value)}
              value={userAnswers[currentQuestionIndex] as string}
              className="space-y-2"
            >
              {currentQ.answers.map((answer, i) => (
                 <FormItem key={i} className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors">
                  <FormControl>
                    <RadioGroupItem value={answer} />
                  </FormControl>
                  <FormLabel className="font-normal flex-1 cursor-pointer">{answer}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          )}
           {currentQ.type === 'short answer' && (
              <Input 
                placeholder="Your answer..." 
                onChange={(e) => handleAnswerChange(e.target.value)} 
                value={userAnswers[currentQuestionIndex] as string}
              />
           )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentQuestionIndex(p => p - 1)} disabled={currentQuestionIndex === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentQuestionIndex === currentQuiz.length - 1 ? (
             <Button onClick={handleQuizSubmit} disabled={isSubmitting}>
              {isSubmitting ? <RotateCw className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
               Submit Quiz
            </Button>
          ) : (
            <Button onClick={() => setCurrentQuestionIndex(p => p + 1)}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  if (stage === 'results' && latestAttempt && currentQuiz) {
    return (
        <div className="space-y-6">
            <Card className="text-center">
                <CardHeader>
                    <div className="mx-auto bg-accent rounded-full p-4 w-fit text-accent-foreground">
                        <Trophy className="h-10 w-10"/>
                    </div>
                    <CardTitle className="text-3xl font-headline mt-4">Quiz Complete!</CardTitle>
                    <CardDescription>You scored</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-6xl font-bold text-primary">{latestAttempt.score}%</p>
                </CardContent>
                <CardFooter className="justify-center">
                     <Button onClick={() => setStage('setup')}>Take Another Quiz</Button>
                </CardFooter>
            </Card>

            <h2 className="text-2xl font-headline font-semibold">Review Your Answers</h2>
            <div className="space-y-4">
                {currentQuiz.map((q, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-2">
                                {latestAttempt.isCorrect[i] ? <CheckCircle className="h-5 w-5 mt-1 text-green-500 flex-shrink-0"/> : <XCircle className="h-5 w-5 mt-1 text-red-500 flex-shrink-0"/>}
                                Question {i+1}: {q.question}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <p><strong>Your answer:</strong> {Array.isArray(latestAttempt.answers[i]) ? (latestAttempt.answers[i] as string[]).join(', ') : latestAttempt.answers[i] as string || 'Not answered'}</p>
                            <p><strong>Correct answer:</strong> {q.correctAnswer}</p>
                            {latestAttempt.feedback[i] ? (
                                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    <AlertTitle className="text-primary font-semibold">AI Feedback</AlertTitle>
                                    <AlertDescription>{latestAttempt.feedback[i]}</AlertDescription>
                                </Alert>
                            ) : (
                                <Button size="sm" variant="outline" onClick={() => handleGetFeedback(i)} disabled={feedbackLoading === i}>
                                    {feedbackLoading === i ? <RotateCw className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                                    Get AI Feedback
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Quiz</CardTitle>
        <CardDescription>
          Customize and generate a new quiz based on your study materials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...setupForm}>
          <form onSubmit={setupForm.handleSubmit(handleSetupSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={setupForm.control}
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
                          studySets.map(set => <SelectItem key={set.id} value={set.id}>{set.title}</SelectItem>)
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
                control={setupForm.control}
                name="numberOfQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="20" {...field} disabled={isGenerating}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={setupForm.control}
                name="questionTypes"
                render={() => (
                  <FormItem>
                    <FormLabel>Question Types</FormLabel>
                    <div className="space-y-2">
                    {questionTypes.map(item => (
                      <FormField
                        key={item.id}
                        control={setupForm.control}
                        name="questionTypes"
                        render={({ field }) => (
                          <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={checked => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(field.value?.filter(value => value !== item.id));
                                }}
                                disabled={isGenerating}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={setupForm.control}
                name="difficultyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isGenerating}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a difficulty..." />
                        </Trigger>
                      </FormControl>
                      <SelectContent>
                        {difficultyLevels.map(level => <SelectItem key={level} value={level} className="capitalize">{level}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isGenerating || !studySets || studySets.length === 0}>
              {isGenerating ? <><RotateCw className="mr-2 h-4 w-4 animate-spin" />Generating Quiz...</> : <><Lightbulb className="mr-2 h-4 w-4" />Generate Quiz</>}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
