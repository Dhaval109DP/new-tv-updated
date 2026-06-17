import { useState } from 'react';
import { useDashboard } from '@/hooks/use-dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link2, Bookmark, BookmarkCheck, Trash2 } from 'lucide-react';

export function CastedLinksWidget() {
  const { state, updateState } = useDashboard();
  const links = state.castedLinks || [];

  if (links.length === 0) return null;

  // Sort: bookmarked first, then newest first
  const sortedLinks = [...links].sort((a, b) => {
    if (a.bookmarked && !b.bookmarked) return -1;
    if (!a.bookmarked && b.bookmarked) return 1;
    return b.sentAt - a.sentAt;
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const targetLink = links.find(l => l.id === id);
    if (!targetLink) return;

    const isNowBookmarked = !targetLink.bookmarked;

    // Update castedLinks array
    const newCastedLinks = links.map(link => 
      link.id === id ? { ...link, bookmarked: isNowBookmarked } : link
    );

    // Sync with global quickLinks (the Bookmark Bar)
    let newQuickLinks = [...state.quickLinks];
    if (isNowBookmarked) {
      newQuickLinks.push({
        id: targetLink.id, // Use same ID so we can track it
        title: targetLink.title,
        url: targetLink.url,
        order: state.quickLinks.length
      });
    } else {
      newQuickLinks = newQuickLinks.filter(q => q.id !== targetLink.id);
    }

    updateState({
      castedLinks: newCastedLinks,
      quickLinks: newQuickLinks
    });
  };

  const deleteLink = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateState({
      castedLinks: links.filter(link => link.id !== id)
    });
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20 shadow-xl overflow-hidden mb-6">
      <CardHeader className="pb-3 border-b border-border/50 bg-muted/30">
        <CardTitle className="text-lg flex items-center gap-2">
          <Link2 className="w-5 h-5 text-primary" />
          Received Links
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedLinks.map((link) => (
            <a 
              key={link.id} 
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-muted/50 border border-border transition-colors group"
            >
              <div className="flex flex-col overflow-hidden mr-2">
                <span className="font-medium truncate">{link.title}</span>
                <span className="text-xs text-muted-foreground truncate">{link.url}</span>
              </div>
              <div className="flex gap-1 opacity-100 transition-opacity">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className={`h-8 w-8 ${link.bookmarked ? 'text-primary' : 'text-muted-foreground'}`}
                  onClick={(e) => toggleBookmark(link.id, e)}
                >
                  {link.bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 text-destructive"
                  onClick={(e) => deleteLink(link.id, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
