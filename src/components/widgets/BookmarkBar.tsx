'use client';

import { useDashboard } from '@/hooks/use-dashboard';
import { Bookmark, Plus, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { QuickLink } from '@/lib/types';
import Link from 'next/link';

export function BookmarkBar() {
  const { state, updateState, deviceType } = useDashboard();
  const { quickLinks } = state;
  const isPhone = deviceType === 'phone';

  if (!isPhone && quickLinks.length === 0) return null;

  const handleAddLink = () => {
    const url = prompt('Enter URL (e.g., https://youtube.com):');
    if (!url) return;
    
    const title = prompt('Enter title:') || url;
    
    const newLink: QuickLink = {
      id: Date.now().toString(),
      title,
      url: url.startsWith('http') ? url : `https://${url}`,
      order: quickLinks.length
    };
    
    updateState({ quickLinks: [...quickLinks, newLink] });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating
    e.stopPropagation();
    updateState({ quickLinks: quickLinks.filter(l => l.id !== id) });
  };

  return (
    <section className="container mx-auto px-6 mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-bold font-headline flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-primary" />
          Quick Links
        </h2>
      </div>

      <div className="flex flex-wrap gap-4">
        {quickLinks.map(link => (
          <div key={link.id} className="relative group">
            <Link href={link.url} target="_blank" rel="noopener noreferrer">
              <Card className="bg-card/80 hover:bg-primary/10 border-primary/20 hover:border-primary/50 transition-all cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <ExternalLink className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium pr-2">{link.title}</span>
                </CardContent>
              </Card>
            </Link>
            
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 w-6 h-6 opacity-100 transition-opacity rounded-full shadow-lg"
              onClick={(e) => handleDelete(link.id, e)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}

        {isPhone && (
          <Button 
            onClick={handleAddLink}
            variant="outline"
            className="h-[74px] border-dashed border-2 hover:border-primary hover:text-primary gap-2 px-6"
          >
            <Plus className="w-4 h-4" /> Add Link
          </Button>
        )}
      </div>
    </section>
  );
}
