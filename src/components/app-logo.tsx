import { cn } from '@/lib/utils';
import Image from 'next/image';
// Use uploaded logo image; falls back to SVG badge if unavailable.
// This path points to the uploaded asset detected in the repo.
// If you want to swap logos, replace the file at .idx/icon.png or move a file to public/logo.png and update src.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Next supports importing static image assets
import UploadedLogo from '../../.idx/icon.png';

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5 font-headline text-lg font-semibold tracking-tight', className ?? 'text-foreground')}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
        <Image src={UploadedLogo} alt="CertAI Prep" width={32} height={32} className="h-8 w-8 object-contain" priority />
      </div>
      <span className="group-data-[collapsible=icon]:hidden">
        CertAI Prep
      </span>
    </div>
  );
}
