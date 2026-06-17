import type { ReactNode } from 'react';
import Link from 'next/link';
import { Card } from './ui/card';

interface AppButtonProps {
    href: string;
    name: string;
    logo: ReactNode;
    onClick?: () => void;
}

export function AppButton({ href, name, logo, onClick }: AppButtonProps) {
    return (
        <Link href={href} target="_blank" rel="noopener noreferrer" className="flex-shrink-0" onClick={onClick}>
            <Card className="w-64 h-24 tv:w-80 tv:h-32 flex items-center justify-center p-4 bg-card/80 backdrop-blur-sm border-border/50 rounded-xl transition-all duration-300 ease-in-out hover:bg-primary/20 hover:border-primary/50 focus:bg-primary/20 focus:border-primary/50">
                <div className="scale-125 tv:scale-150">
                    {logo}
                </div>
            </Card>
        </Link>
    )
}
