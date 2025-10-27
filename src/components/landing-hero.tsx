import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileQuestion, Layers3, ShieldCheck } from 'lucide-react';

export function LandingHero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(30,58,138,0.22),transparent_65%)]" />
      <div className="mx-auto max-w-screen-xl px-10 py-32 md:py-48 text-center">
        <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight leading-tight">
          Built for cloud professionals.
        </h1>
        <h2 className="mt-3 text-5xl md:text-7xl font-headline font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-primary">
          By cloud engineers.
        </h2>
        <p className="mt-8 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
          We get it. We've been there. The
          <span className="text-primary font-semibold"> production pressure</span>. The service
          <span className="text-primary font-semibold"> sprawl</span>. The acronym
          <span className="text-primary font-semibold"> overload</span>. Meet a prep partner on your side - turning your runbooks, notes and whitepapers into certification-grade quizzes, flashcards and scenario drills.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="#features">See Features</Link>
          </Button>
        </div>

        <div className="mt-8 text-xs md:text-sm text-muted-foreground">
          Trusted by 1,000+ cloud builders across 20+ organizations
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          {["AB","CD","EF","GH","IJ"].map((x,i)=> (
            <Avatar key={i} className="h-8 w-8 border">
              <AvatarFallback>{x}</AvatarFallback>
            </Avatar>
          ))}
          <span className="text-xs text-muted-foreground rounded-full border px-2 py-0.5">+999</span>
        </div>

        {/* Hero feature cards */}
        <div className="mt-12 grid gap-4 md:grid-cols-3 text-left">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileQuestion className="h-5 w-5 text-primary"/> Scenario Quizzes</CardTitle>
              <CardDescription>Architecture, operations and security case studies.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Domain-weighted questions with explanations and service trade-offs.
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Layers3 className="h-5 w-5 text-primary"/> Instant Flashcards</CardTitle>
              <CardDescription>From notes and whitepapers, exportable to CSV.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Includes CLI/SDK gotchas, limits and multi-cloud equivalents.
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary"/> Mock Exams</CardTitle>
              <CardDescription>Timed practice with readiness score.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Track accuracy per domain and identify weak topics to review.
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

