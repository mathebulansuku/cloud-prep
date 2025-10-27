'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { designFeatureAction } from '@/lib/actions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const schema = z.object({
  featureName: z.string().min(2, 'Enter a feature name'),
  targetCloud: z.enum(['aws','azure','gcp','multi']).default('multi'),
  targetCertification: z.string().optional(),
  learnerContext: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function FeatureDesignerClient() {
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { featureName: '', targetCloud: 'multi', targetCertification: '', learnerContext: '' } });
  const [state, action] = useActionState(designFeatureAction, { formatted: '' });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const onSubmit = (values: Values) => {
    const fd = new FormData();
    fd.append('featureName', values.featureName);
    fd.append('targetCloud', values.targetCloud);
    if (values.targetCertification) fd.append('targetCertification', values.targetCertification);
    if (values.learnerContext) fd.append('learnerContext', values.learnerContext);
    React.startTransition(() => action(fd));
  };

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>AI Feature Designer</CardTitle>
          <CardDescription>Describe a feature, pick a target cloud/cert, and generate a full spec.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="featureName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Feature name</FormLabel>
                  <FormControl><Input placeholder="e.g., Adaptive Knowledge Tree" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="targetCloud" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target cloud</FormLabel>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multi">Multi-cloud</SelectItem>
                        <SelectItem value="aws">AWS</SelectItem>
                        <SelectItem value="azure">Azure</SelectItem>
                        <SelectItem value="gcp">GCP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="targetCertification" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target certification (optional)</FormLabel>
                    <FormControl><Input placeholder="e.g., AWS SAA-C03" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="learnerContext" render={({ field }) => (
                <FormItem>
                  <FormLabel>Learner context (optional)</FormLabel>
                  <FormControl><Textarea rows={5} placeholder="Notes about weak topics, uploaded material summary, goals..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit">Generate Spec</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Result</CardTitle>
          <CardDescription>Copy the generated Markdown spec or iterate by tweaking inputs.</CardDescription>
        </CardHeader>
        <CardContent>
          {state?.formatted ? (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {state.formatted}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No spec yet. Fill the form and click Generate.</p>
          )}
          {state?.error && <p className="text-sm text-destructive mt-2">{state.error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

