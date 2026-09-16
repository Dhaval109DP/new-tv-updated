'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface PosterCardProps {
    href: string;
    imageUrl: string;
    name: string;
    imageHint: string;
    priority?: boolean;
}

export function PosterCard({ href, imageUrl, name, imageHint, priority = false }: PosterCardProps) {
    const [error, setError] = useState(false);

    const isValidUrl = (url: string) => {
        if (!url || typeof url !== 'string') return false;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    return (
        <Link href={href} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 group tv-poster-focus">
            <div className="w-40 tv:w-52 aspect-[2/3] rounded-lg overflow-hidden transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary/20 border-2 border-transparent group-hover:border-primary/80 relative bg-muted">
                {!error && isValidUrl(imageUrl) ? (
                    <Image
                        src={imageUrl}
                        alt={`Poster for ${name}`}
                        width={200}
                        height={300}
                        className="w-full h-full object-cover absolute inset-0"
                        data-ai-hint={imageHint}
                        priority={priority}
                        onError={() => setError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-background flex items-center justify-center p-4 text-center">
                        <span className="text-sm font-medium text-foreground line-clamp-3">{name}</span>
                    </div>
                )}
            </div>
        </Link>
    );
}
