import type { ReactNode } from 'react';
import { AppButton } from './app-button';

interface Platform {
    name: string;
    href: string;
    logo: ReactNode;
}

interface HeroSectionProps {
    lastVisited: Platform;
}

export function HeroSection({ lastVisited }: HeroSectionProps) {
    return (
        <div className="relative w-full h-[60vh] md:h-[70vh] tv:h-[55vh]">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10" />
            <div className="relative z-20 flex flex-col justify-end h-full p-8 md:p-12 lg:p-16 tv:px-24 tv:py-20">
                <div className="max-w-xl">
                    <p className="text-2xl md:text-3xl font-semibold text-foreground/90 mb-4">Continue Watching on</p>
                    <AppButton 
                        name={lastVisited.name} 
                        href={lastVisited.href} 
                        logo={lastVisited.logo} 
                    />
                </div>
            </div>
        </div>
    );
}