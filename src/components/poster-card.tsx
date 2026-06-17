import Link from 'next/link';
import Image from 'next/image';

interface PosterCardProps {
    href: string;
    imageUrl: string;
    name: string;
    imageHint: string;
    priority?: boolean;
}

export function PosterCard({ href, imageUrl, name, imageHint, priority = false }: PosterCardProps) {
    return (
        <Link href={href} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 group">
            <div className="w-40 tv:w-52 aspect-[2/3] rounded-lg overflow-hidden transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary/20 border-2 border-transparent group-hover:border-primary/80 focus:border-primary/80">
                <Image
                    src={imageUrl}
                    alt={`Poster for ${name}`}
                    width={200}
                    height={300}
                    className="w-full h-full object-cover"
                    data-ai-hint={imageHint}
                    priority={priority}
                />
            </div>
        </Link>
    );
}
