import type { ReactNode } from 'react';

interface ContentCarouselProps {
    title: string;
    children: ReactNode;
}

export function ContentCarousel({ title, children }: ContentCarouselProps) {
    return (
        <section className="w-full mb-10 md:mb-12 tv:mb-16">
            <h2 className="text-2xl md:text-3xl tv:text-4xl font-bold font-headline mb-4 md:mb-6">{title}</h2>
            <div className="flex overflow-x-auto pb-4 -mb-4 gap-4 md:gap-6 tv:gap-8 scrollbar-hide">
                {children}
            </div>
        </section>
    )
}
