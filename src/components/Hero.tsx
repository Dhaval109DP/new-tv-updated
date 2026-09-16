'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const HERO_IMAGES = [
  "https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
  "https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
  "https://image.tmdb.org/t/p/original/nnMC0BM6XMgO0cSsm2MKlxMRoHA.jpg",
  "https://image.tmdb.org/t/p/original/dqK9Hag1054tghRQSqLSfrkvQnA.jpg",
  "https://image.tmdb.org/t/p/original/h8gHn0OzBoKcXnwfMKgNl6oMHJP.jpg",
  "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg"
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] tv:h-[55vh] overflow-hidden bg-background">
      {HERO_IMAGES.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Hero background ${index + 1}`}
          fill
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          priority={index === 0}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10" />
    </div>
  );
}
