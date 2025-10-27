import Link from 'next/link';
import { AppLogo } from '@/components/app-logo';
import { Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))]">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-12">
        {/* Top row: logo + summary */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
          <div className="max-w-sm">
            <AppLogo className="text-[hsl(var(--sidebar-foreground))]" />
            <p className="mt-3 text-sm opacity-70">
              CertAI Prep helps cloud professionals master AWS, Azure and GCP with AI-generated quizzes, flashcards and spaced reviews.
            </p>
            <p className="mt-2 text-xs opacity-60">It's in the cloud.</p>
          </div>

          {/* Link groups */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
            <div>
              <h4 className="text-xs font-medium opacity-60">Pages</h4>
              <ul className="mt-3 space-y-2">
                <li><a className="transition-colors hover:underline opacity-90 hover:opacity-100" href="#home">Home</a></li>
                <li><a className="transition-colors hover:underline opacity-90 hover:opacity-100" href="#features">About</a></li>
                <li><a className="transition-colors hover:underline opacity-90 hover:opacity-100" href="#contact">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-medium opacity-60">Legal</h4>
              <ul className="mt-3 space-y-2">
                <li><a className="transition-colors hover:underline opacity-90 hover:opacity-100" href="#">Privacy Policy</a></li>
                <li><a className="transition-colors hover:underline opacity-90 hover:opacity-100" href="#">Terms of Service</a></li>
                <li><a className="transition-colors hover:underline opacity-90 hover:opacity-100" href="#">Pricing and Refund Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-medium opacity-60">Follow Us</h4>
              <div className="mt-3 flex items-center gap-4">
                <a aria-label="Instagram" href="#" className="opacity-80 hover:opacity-100 transition-transform duration-200 ease-out hover:-translate-y-0.5"><Instagram className="h-5 w-5" /></a>
                <a aria-label="Twitter" href="#" className="opacity-80 hover:opacity-100 transition-transform duration-200 ease-out hover:-translate-y-0.5"><Twitter className="h-5 w-5" /></a>
                <a aria-label="LinkedIn" href="#" className="opacity-80 hover:opacity-100 transition-transform duration-200 ease-out hover:-translate-y-0.5"><Linkedin className="h-5 w-5" /></a>
                <a aria-label="YouTube" href="#" className="opacity-80 hover:opacity-100 transition-transform duration-200 ease-out hover:-translate-y-0.5"><Youtube className="h-5 w-5" /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[hsl(var(--sidebar-border))]" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs opacity-70">
          <p>© {new Date().getFullYear()} CertAI Prep. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a className="hover:underline" href="#">Privacy</a>
            <a className="hover:underline" href="#">Terms</a>
            <a className="hover:underline" href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

