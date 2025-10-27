import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/app-logo';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Lightbulb, Layers3, FileQuestion, BarChart3, ShieldCheck, Clock, Check } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LandingHero } from '@/components/landing-hero';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
      {/* Floating nav pill */}
      <div className="fixed right-4 top-4 z-50">
        <div className="flex items-center gap-3 rounded-full border bg-background/80 px-3 md:px-4 py-2 shadow-lg backdrop-blur">
          <nav className="hidden md:flex items-center gap-5 text-sm text-muted-foreground">
            <a href="#home" className="hover:text-foreground">Home</a>
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#blog" className="hover:text-foreground">Blog</a>
            <a href="#contact" className="hover:text-foreground">Contact</a>
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/sign-in">Login</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-4 grid gap-4">
                <a href="#home" className="text-sm">Home</a>
                <a href="#features" className="text-sm">Features</a>
                <a href="#pricing" className="text-sm">Pricing</a>
                <a href="#blog" className="text-sm">Blog</a>
                <a href="#contact" className="text-sm">Contact</a>
                <div className="pt-2 border-t" />
                <Button asChild variant="ghost" className="justify-start">
                  <Link href="/sign-in">Login</Link>
                </Button>
                <Button asChild className="justify-start">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Logo top-left */}
      <div className="absolute left-6 top-6 z-40">
        <AppLogo />
      </div>

      {/* Hero */}
      <LandingHero />

      {/* Features */}
      <section id="features" className="mx-auto max-w-screen-2xl px-6 md:px-10 pb-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-headline font-semibold">Everything you need to pass, faster</h2>
          <p className="text-muted-foreground mt-2">Tailored for AWS, Azure and GCP — built by engineers, for engineers.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileQuestion className="h-5 w-5 text-primary"/> AI Quiz Generator</CardTitle>
              <CardDescription>From your notes, runbooks and whitepapers.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• Scenario-based items (architect, ops, security)</li>
                <li>• Domain weighting per certification blueprint</li>
                <li>• Explanations with service trade-offs</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Layers3 className="h-5 w-5 text-primary"/> Flashcards in Seconds</CardTitle>
              <CardDescription>Concept Q/A instantly; export to CSV.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• CLI, SDK, and console gotchas</li>
                <li>• Service limits and defaults</li>
                <li>• Multi-cloud equivalence hints</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary"/> Spaced Repetition</CardTitle>
              <CardDescription>Reviews exactly when retention drops.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• SM-2 scheduling with Again/Good/Easy</li>
                <li>• Due-today queue and streaks</li>
                <li>• Tag-focused drill sessions</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary"/> Explanations & Feedback</CardTitle>
              <CardDescription>Know why answers are right/wrong.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• Root-cause guidance and next resources</li>
                <li>• Architecture trade-offs and cost notes</li>
                <li>• Links back to your original notes</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary"/> Progress Tracking</CardTitle>
              <CardDescription>See where to focus next.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• Accuracy by domain/service</li>
                <li>• Readiness score over time</li>
                <li>• Time-to-answer and confidence</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary"/> Private by Default</CardTitle>
              <CardDescription>Your content, your control.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• Local-first storage with export</li>
                <li>• Optional cloud sync later</li>
                <li>• Clear data-handling prompts</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-screen-2xl px-6 md:px-10 pb-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-headline font-semibold">Simple, transparent pricing</h2>
          <p className="text-muted-foreground mt-2">Start free. Upgrade when you want more power.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>For getting started</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-1">
              <div className="text-4xl font-bold">$0<span className="text-base font-normal text-muted-foreground">/mo</span></div>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5"/> 3 study sets</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5"/> Basic AI quizzes</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5"/> Flashcards + CSV export</li>
              </ul>
              <Button asChild className="mt-auto w-full rounded-full"><a href="/sign-up">Get Started</a></Button>
            </CardContent>
          </Card>

          <Card className="h-full flex flex-col border-primary/30 shadow-lg">
            <CardHeader>
              <div className="text-xs inline-flex rounded-full bg-primary/10 text-primary px-2 py-0.5 mb-2">Popular</div>
              <CardTitle>Pro</CardTitle>
              <CardDescription>For focused certification prep</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-1">
              <div className="text-4xl font-bold">$9<span className="text-base font-normal text-muted-foreground">/mo</span></div>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5"/> Unlimited study sets</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5"/> Scenario-based quizzes + explanations</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5"/> Spaced repetition (SRS) scheduling</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5"/> Progress insights + readiness score</li>
              </ul>
              <Button asChild className="mt-auto w-full rounded-full"><a href="/sign-up">Go Pro</a></Button>
            </CardContent>
          </Card>

          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>For groups and bootcamps</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-1">
              <div className="text-4xl font-bold">$29<span className="text-base font-normal text-muted-foreground">/mo</span></div>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5"/> Seats for 5 users</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5"/> Shared sets + quizzes</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5"/> Team analytics dashboard</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5"/> Priority support</li>
              </ul>
              <Button asChild variant="outline" className="mt-auto w-full rounded-full"><a href="#contact">Contact Sales</a></Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-screen-2xl px-6 md:px-10 pb-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-headline font-semibold">Three steps to confident prep</h2>
          <p className="text-muted-foreground mt-2">From notes to mastery in minutes.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">1</div>
              <h3 className="mt-4 font-semibold">Add your study set</h3>
              <p className="text-sm text-muted-foreground mt-1">Paste notes or summaries and tag them for easy filtering.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">2</div>
              <h3 className="mt-4 font-semibold">Generate a quiz</h3>
              <p className="text-sm text-muted-foreground mt-1">Pick difficulty and type; get instant questions with explanations.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">3</div>
              <h3 className="mt-4 font-semibold">Review with SRS</h3>
              <p className="text-sm text-muted-foreground mt-1">Flashcards are scheduled automatically so knowledge sticks.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="px-6 md:px-10 pb-24">
        <div className="mx-auto max-w-6xl rounded-2xl border p-8 md:p-12 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-headline font-semibold">Ready to accelerate your prep?</h3>
              <p className="text-muted-foreground mt-2">Create your account and generate your first quiz in under a minute.</p>
            </div>
            <div className="flex gap-3">
              <Button asChild size="lg"><Link href="/sign-up">Start Free</Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="/sign-in">Sign In</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </main>
  );
}

