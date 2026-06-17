'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { getContentRecommendations, ContentRecommendationsInput, ContentRecommendationsOutput } from '@/ai/flows/content-recommendations';
import { getContentSuggestions } from '@/ai/flows/content-suggestions';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { Wand2, LoaderCircle, AlertTriangle, Play, Film, Tv, ListVideo, Video, Bookmark, Trash2, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toSlug } from '@/lib/utils';
import { Separator } from './ui/separator';

import { useDashboard } from '@/hooks/use-dashboard';

export function AIRecommendations() {
  const { state, updateState } = useDashboard();
  
  const [viewingHistory, setViewingHistory] = useState('');
  const [recommendations, setRecommendations] = useState<ContentRecommendationsOutput['recommendations']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync with global state
  useEffect(() => {
    if (state.aiData) {
      setViewingHistory(state.aiData.history);
      setRecommendations(state.aiData.results);
    }
  }, [state.aiData]);

  // State for auto-suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const savedSearches = state.savedSearches || [];

  const { toast } = useToast();

  const platformLinkGenerators: {[key: string]: (title: string) => string} = {
    'Desi Cinemas': (title: string) => `https://desicinemas.to/movies/${toSlug(title)}/`,
    'Bollyzone': (title: string) => `https://www.bollyzone.to/category/${toSlug(title)}/`,
    'Play Desi!': (title: string) => `https://playdesi.info/series/${toSlug(title)}/`,
    'Dailymotion': (title: string) => `https://www.dailymotion.com/search/${toSlug(title)}`,
    'T-Flix': (title: string) => `https://tv.tflix.app/`,
  };

  const liveMatches = [
    { title: "India vs England - T20", link: "https://tv.tflix.app/" },
    { title: "Pakistan vs Australia - ODI", link: "https://tv.tflix.app/" },
    { title: "IPL Final - CSK vs MI", link: "https://tv.tflix.app/" },
  ];

  useEffect(() => {
    if (currentQuery.toLowerCase().trim() === 'live') {
      setSuggestions(liveMatches.map(m => m.title));
      setPopoverOpen(true);
      return;
    }

    if (!currentQuery || currentQuery.length < 2) {
      setSuggestions([]);
      setPopoverOpen(false);
      return;
    }

    const fetchSuggestions = async () => {
      setIsSuggestionsLoading(true);
      try {
        const result = await getContentSuggestions({ query: currentQuery }) as any;
        
        if (result && result.error) {
          throw new Error(result.error);
        } else if (result && result.suggestions && result.suggestions.length > 0) {
          setSuggestions(result.suggestions);
          setPopoverOpen(true);
        } else {
          setSuggestions([]);
          setPopoverOpen(false);
        }
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
        setSuggestions([]);
        setPopoverOpen(false);
      } finally {
        setIsSuggestionsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [currentQuery]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setViewingHistory(value);

    const terms = value.split(/,\s*/);
    const lastTerm = terms[terms.length - 1];
    setCurrentQuery(lastTerm);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    const isLiveMatch = liveMatches.some(m => m.title === suggestion);
    if(isLiveMatch) {
        const match = liveMatches.find(m => m.title === suggestion);
        if (match) {
            window.open(match.link, '_blank');
        }
        setPopoverOpen(false);
        return;
    }

    const terms = viewingHistory.split(/,\s*/);
    terms[terms.length - 1] = suggestion;
    const newValue = terms.join(', ') + ', ';

    setViewingHistory(newValue);
    setSuggestions([]);
    setCurrentQuery(suggestion);
    setPopoverOpen(false);
    textareaRef.current?.focus();
  };

  const handleSaveSearch = () => {
    const termToSave = currentQuery.trim();
    if (termToSave && !savedSearches.includes(termToSave)) {
      const newSavedSearches = [...savedSearches, termToSave];
      updateState({ savedSearches: newSavedSearches });
      toast({
        title: 'Search Saved',
        description: `"${termToSave}" has been added to your saved searches.`,
      });
    } else if (savedSearches.includes(termToSave)) {
        toast({
            variant: 'destructive',
            title: 'Already Saved',
            description: `"${termToSave}" is already in your saved searches.`,
        });
    }
  };

  const handleRemoveSearch = (termToRemove: string) => {
    const newSavedSearches = savedSearches.filter(term => term !== termToRemove);
    updateState({ savedSearches: newSavedSearches });
    toast({
        title: 'Search Removed',
        description: `"${termToRemove}" has been removed from your saved searches.`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPopoverOpen(false);
    const trimmedHistory = viewingHistory.trim().replace(/,$/, '').trim();

    if (!trimmedHistory) {
      setError('Please enter some movies or shows you have watched.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setRecommendations([]);

    try {
      const input: ContentRecommendationsInput = { viewingHistory: trimmedHistory };
      const result = await getContentRecommendations(input) as any;
      
      if (result && result.error) {
        throw new Error(result.error);
      } else if (result && result.recommendations) {
        setRecommendations(result.recommendations);
        // Sync to other devices
        updateState({
          aiData: {
            history: trimmedHistory,
            results: result.recommendations,
            timestamp: Date.now()
          }
        });
      } else {
        throw new Error('No recommendations found.');
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError('Failed to get recommendations. Please try again later.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <Card className="w-full bg-card/80 backdrop-blur-sm border-border/50 rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Wand2 className="h-8 w-8 tv:h-10 tv:w-10 text-primary" />
              <CardTitle className="text-3xl tv:text-4xl font-headline tracking-wide">AI Recommendations</CardTitle>
            </div>
            <CardDescription className="text-lg tv:text-xl !mt-2">
              Tell us what you've watched, and we'll suggest what to watch next!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverAnchor asChild>
                    <div className="space-y-2">
                        <Textarea
                          ref={textareaRef}
                          value={viewingHistory}
                          onChange={handleTextChange}
                          placeholder="e.g., Lagaan, 3 Idiots, Mirzapur, or type 'live' for matches..."
                          className="min-h-[100px] text-base tv:min-h-[120px] tv:text-lg"
                          aria-label="Your viewing history"
                          disabled={isLoading}
                          autoComplete="off"
                        />
                        {error && <p className="text-destructive text-sm tv:text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> {error}</p>}
                    </div>
                </PopoverAnchor>
                <PopoverContent 
                    className="w-[var(--radix-popover-anchor-width)] p-1" 
                    align="start"
                    onOpenAutoFocus={(e) => e.preventDefault()} // prevent stealing focus from textarea
                >
                    {isSuggestionsLoading ? (
                        <div className="p-2 text-sm text-muted-foreground flex items-center gap-2">
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            <span>Loading suggestions...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {suggestions.map((suggestion, index) => (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    className="justify-start font-normal"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </Button>
                            ))}
                        </div>
                    )}
                </PopoverContent>
              </Popover>
              <div className="flex flex-wrap items-center gap-4">
                <Button type="submit" size="lg" className="flex-shrink-0 text-lg h-12 tv:text-xl tv:h-14" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                      Getting Recommendations...
                    </>
                  ) : (
                    'Find My Next Binge'
                  )}
                </Button>

                {currentQuery.trim() && !isLoading && (
                  <div className="flex items-center gap-2 border-l border-border pl-4">
                      <Button size="icon" variant="outline" title={`Save "${currentQuery.trim()}"`} onClick={handleSaveSearch}>
                          <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button asChild size="icon" variant="outline" title={`Play on Desi Cinemas`}>
                          <Link href={platformLinkGenerators['Desi Cinemas'](currentQuery)} target="_blank" rel="noopener noreferrer">
                              <Film className="h-4 w-4" />
                          </Link>
                      </Button>
                      <Button asChild size="icon" variant="outline" title={`Play on Bollyzone`}>
                          <Link href={platformLinkGenerators['Bollyzone'](currentQuery)} target="_blank" rel="noopener noreferrer">
                              <Tv className="h-4 w-4" />
                          </Link>
                      </Button>
                      <Button asChild size="icon" variant="outline" title={`Play on Play Desi!`}>
                          <Link href={platformLinkGenerators['Play Desi!'](currentQuery)} target="_blank" rel="noopener noreferrer">
                              <ListVideo className="h-4 w-4" />
                          </Link>
                      </Button>
                       <Button asChild size="icon" variant="outline" title={`Watch on Dailymotion`}>
                          <Link href={platformLinkGenerators['Dailymotion'](currentQuery)} target="_blank" rel="noopener noreferrer">
                              <Video className="h-4 w-4" />
                          </Link>
                      </Button>
                       <Button asChild size="icon" variant="outline" title={`Watch on T-Flix`}>
                          <Link href={platformLinkGenerators['T-Flix'](currentQuery)} target="_blank" rel="noopener noreferrer">
                              <Trophy className="h-4 w-4" />
                          </Link>
                      </Button>
                  </div>
                )}
              </div>
            </form>

            {savedSearches.length > 0 && (
              <div className="mt-8">
                <Separator className="my-6" />
                <h3 className="text-2xl tv:text-3xl font-headline text-primary mb-4">Saved Searches</h3>
                <div className="flex flex-col gap-4">
                  {savedSearches.map((term) => (
                    <div key={term} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <span className="text-lg font-medium text-foreground">{term}</span>
                      <div className="flex items-center gap-2">
                        <Button asChild size="icon" variant="outline" title={`Play on Desi Cinemas`}>
                            <Link href={platformLinkGenerators['Desi Cinemas'](term)} target="_blank" rel="noopener noreferrer">
                                <Film className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild size="icon" variant="outline" title={`Play on Bollyzone`}>
                            <Link href={platformLinkGenerators['Bollyzone'](term)} target="_blank" rel="noopener noreferrer">
                                <Tv className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild size="icon" variant="outline" title={`Play on Play Desi!`}>
                            <Link href={platformLinkGenerators['Play Desi!'](term)} target="_blank" rel="noopener noreferrer">
                                <ListVideo className="h-4 w-4" />
                            </Link>
                        </Button>
                         <Button asChild size="icon" variant="outline" title={`Watch on Dailymotion`}>
                            <Link href={platformLinkGenerators['Dailymotion'](term)} target="_blank" rel="noopener noreferrer">
                                <Video className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild size="icon" variant="outline" title={`Watch on T-Flix`}>
                            <Link href={platformLinkGenerators['T-Flix'](term)} target="_blank" rel="noopener noreferrer">
                                <Trophy className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="icon" variant="destructive" title={`Remove "${term}"`} onClick={() => handleRemoveSearch(term)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(isLoading || recommendations.length > 0) && (
                <div className="mt-8">
                    <Separator className="my-6" />
                    <h3 className="text-2xl tv:text-3xl font-headline text-primary mb-4">Here are your recommendations:</h3>
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                               <Card key={i} className="p-4 bg-muted/30 flex flex-col justify-between">
                                <div>
                                  <Skeleton className="h-6 w-3/4 mb-2" />
                                  <Skeleton className="h-4 w-1/4 mb-4" />
                                  <Skeleton className="h-10 w-full" />
                                </div>
                                <Skeleton className="h-10 w-36 mt-4" />
                               </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recommendations.map((rec, index) => (
                              <Card key={index} className="p-4 flex flex-col justify-between animate-in fade-in-0 zoom-in-95 bg-muted/30">
                                <div>
                                  <h4 className="text-xl tv:text-2xl font-semibold leading-none tracking-tight mb-1">{rec.title}</h4>
                                  <Badge variant="secondary" className="w-fit my-2 tv:text-base">Recommended on {rec.platform}</Badge>
                                  <p className="text-base text-muted-foreground">{rec.reason}</p>
                                </div>
                                <div className="mt-4 self-start flex flex-wrap gap-2">
                                    {Object.entries(platformLinkGenerators).map(([name, linkGenerator]) => (
                                    <Button
                                        key={name}
                                        asChild
                                        size="sm"
                                    >
                                        <Link href={linkGenerator(rec.title)} target="_blank" rel="noopener noreferrer">
                                            <Play className="mr-2 h-4 w-4" />
                                            {name}
                                        </Link>
                                    </Button>
                                    ))}
                                </div>
                              </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
