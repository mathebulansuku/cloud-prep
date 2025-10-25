export function AppLogo() {
  return (
    <div className="flex items-center gap-2.5 font-headline text-lg font-semibold tracking-tight text-foreground">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M12 2a10 10 0 1 0 5.5 1.8L20 8" />
          <path d="M12 2a5 5 0 0 0-5 5" />
          <path d="M12 12a5 5 0 0 1 5 5" />
          <path d="M12 22a10 10 0 1 0-5.5-1.8L4 16" />
        </svg>
      </div>
      <span className="group-data-[collapsible=icon]:hidden">
        CertAI Prep
      </span>
    </div>
  );
}
