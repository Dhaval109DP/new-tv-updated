'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDashboard, DashboardProvider } from '@/hooks/use-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoaderCircle, SmartphoneNfc, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// We'll create these inner components in the next steps
// import { NotesEditor } from '@/components/widgets/NotesEditor';
// import { TasksEditor } from '@/components/widgets/TasksEditor';

import { getContentRecommendations } from '@/ai/flows/content-recommendations';
import { useToast } from '@/hooks/use-toast';

function EditorContent() {
  const { pairCode, setPairCode, isOnline, state, updateState, broadcastMessage } = useDashboard();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInitializing, setIsInitializing] = useState(true);
  const { toast } = useToast();

  // Restore pair code from URL if missing
  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !pairCode) {
      setPairCode(code);
    } else if (!code && !pairCode) {
      router.push('/remote');
    }
    
    // Slight delay to prevent flashing while setting code
    const timer = setTimeout(() => setIsInitializing(false), 100);
    return () => clearTimeout(timer);
  }, [searchParams, pairCode, setPairCode, router]);

  if (isInitializing || !pairCode) {
    return <div className="min-h-screen flex items-center justify-center"><LoaderCircle className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-headline font-bold">Remote Control</h1>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {isOnline ? (
              <span className="flex items-center text-green-500">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                Connected
              </span>
            ) : (
              <span className="flex items-center text-yellow-500">
                <LoaderCircle className="w-3 h-3 animate-spin mr-2" />
                Reconnecting...
              </span>
            )}
            <span className="mx-2">•</span>
            <span className="font-mono">Room: {pairCode}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => {
          setPairCode(null);
          router.push('/remote');
        }}>
          Disconnect
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="dashboard">Dash</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="ai">AI</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="p-8 text-center border-2 border-dashed border-border rounded-xl">
              <SmartphoneNfc className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Connected to TV</h3>
              <p className="text-muted-foreground text-sm">
                Changes made here will appear instantly on your TV screen.
              </p>
            </div>
            
            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-headline font-bold mb-4">Quick Actions</h3>
              <div className="flex gap-2 mb-3">
                <Input 
                  id="cast-input"
                  placeholder="Paste video URL..." 
                  className="flex-1"
                />
                <Button 
                  onClick={() => {
                    const input = document.getElementById('cast-input') as HTMLInputElement;
                    const url = input?.value;
                    if (url) {
                      const finalUrl = url.startsWith('http') ? url : `https://${url}`;
                      const title = prompt("Enter a title for this link:") || "Casted Link";
                      
                      updateState({
                        castedLinks: [
                          ...(state.castedLinks || []),
                          {
                            id: Date.now().toString(),
                            url: finalUrl,
                            title,
                            sentAt: Date.now(),
                            bookmarked: false
                          }
                        ]
                      });
                      input.value = '';
                      toast({ title: 'Sent!', description: 'Link sent to TV.' });
                    }
                  }}
                >
                  Cast to TV
                </Button>
              </div>

              <Button 
                className="w-full mb-3" 
                variant="secondary"
                onClick={() => {
                  const msg = prompt("Message to show on TV:");
                  if (msg) {
                    updateState({
                      announcements: [
                        ...state.announcements, 
                        { id: Date.now().toString(), message: msg, type: 'info', createdAt: Date.now(), dismissedAt: null }
                      ]
                    });
                  }
                }}
              >
                Send Message to TV
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => {
                  const mins = prompt("Timer minutes:");
                  if (mins && !isNaN(Number(mins))) {
                    updateState({
                      timers: [
                        ...state.timers,
                        { id: Date.now().toString(), label: 'Timer', targetTime: Date.now() + Number(mins)*60000, type: 'countdown', createdAt: Date.now(), active: true }
                      ]
                    });
                  }
                }}
              >
                Start Timer
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-8">
            {/* Default Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-headline font-bold">Default Categories (Overrides)</h3>
              <p className="text-sm text-muted-foreground">Change the featured content for the built-in categories.</p>
              {['Movies', 'TV Shows', 'Web Series', 'Videos', 'Sports'].map(title => {
                const override = state.categoryOverrides?.[title];
                const isVisible = override?.visible !== false;
                
                return (
                  <div key={title} className="p-4 border rounded-lg bg-card space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold">{title}</h4>
                      <Button 
                        variant={isVisible ? "outline" : "secondary"} 
                        size="sm"
                        onClick={() => {
                          updateState({
                            categoryOverrides: {
                              ...state.categoryOverrides,
                              [title]: {
                                ...override,
                                visible: !isVisible
                              }
                            }
                          });
                        }}
                      >
                        {isVisible ? 'Hide' : 'Show'}
                      </Button>
                    </div>
                    
                    {isVisible && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">Featured Items (Comma separated)</p>
                        <Input 
                          placeholder="e.g. Kalki, Munjya, Mr. & Mrs. Mahi"
                          defaultValue={override?.customFeaturedContent?.map(c => c.title).join(', ') || ''}
                          onBlur={(e) => {
                            const val = e.target.value.trim();
                            const newContent = val 
                              ? val.split(',').map(t => ({ title: t.trim() }))
                              : undefined; // Clear to default if empty
                              
                            updateState({
                              categoryOverrides: {
                                ...state.categoryOverrides,
                                [title]: {
                                  ...override,
                                  visible: isVisible,
                                  customFeaturedContent: newContent
                                }
                              }
                            });
                            toast({ title: 'Saved', description: `Updated ${title} featured content.` });
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Custom Categories */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-lg font-headline font-bold">Custom Categories</h3>
              {state.customCategories.map(cat => (
                <div key={cat.id} className="p-4 border rounded-lg flex justify-between items-center bg-card">
                  <div>
                    <p className="font-bold">{cat.title}</p>
                    <p className="text-xs text-muted-foreground">{cat.platform}</p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => {
                      updateState({
                        customCategories: state.customCategories.filter(c => c.id !== cat.id)
                      });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button 
                className="w-full gap-2 mt-4" 
                variant="outline"
                onClick={() => {
                  const title = prompt("Category Title (e.g., Anime):");
                  if (!title) return;
                  const platform = prompt("Platform Name (e.g., Crunchyroll):");
                  const link = prompt("URL:");
                  if (title && platform && link) {
                    updateState({
                      customCategories: [
                        ...state.customCategories,
                        {
                          id: Date.now().toString(),
                          title,
                          platform,
                          link,
                          icon: 'Film',
                          featuredContent: [{title: 'Featured 1'}],
                          gradient: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20',
                          visible: true,
                          order: state.customCategories.length
                        }
                      ]
                    });
                  }
                }}
              >
                <Plus className="w-4 h-4" /> Add Custom Category
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-6">
             <div className="space-y-4">
                <h3 className="text-lg font-headline font-bold">AI Recommendations Search</h3>
                <p className="text-sm text-muted-foreground">Type your search here. It will instantly sync to your TV screen!</p>
                <textarea 
                  id="ai-input" 
                  placeholder="Movies, Shows..." 
                  className="w-full min-h-[100px] p-3 rounded-md bg-background border border-border"
                  value={state.aiData?.history || ''}
                  onChange={(e) => {
                    updateState({
                      aiData: {
                        history: e.target.value,
                        results: state.aiData?.results || [],
                        timestamp: Date.now()
                      }
                    });
                  }}
                />
                
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={async () => {
                    const el = document.getElementById('ai-input') as HTMLTextAreaElement;
                    const history = el?.value;
                    if (!history) return;
                    
                    const btn = document.getElementById('ai-btn');
                    if (btn) btn.innerText = 'Wait...';

                    try {
                      const input: { viewingHistory: string } = { viewingHistory: history };
                      const result = await getContentRecommendations(input);
                      
                      if (result && result.recommendations) {
                        updateState({
                          aiData: {
                            history,
                            results: result.recommendations,
                            timestamp: Date.now()
                          }
                        });
                        toast({ title: "Success", description: "Recommendations pushed to TV!" });
                      }
                    } catch (e) {
                      console.error(e);
                      toast({ variant: 'destructive', title: "Error", description: "Failed to generate recommendations." });
                    } finally {
                      if (btn) btn.innerText = 'Generate Recommendations';
                    }
                  }} id="ai-btn">
                    Generate Recommendations
                  </Button>
                  <Button variant="secondary" onClick={() => {
                    const el = document.getElementById('ai-input') as HTMLTextAreaElement;
                    const term = el?.value.trim();
                    if (term && !(state.savedSearches || []).includes(term)) {
                      updateState({ savedSearches: [...(state.savedSearches || []), term] });
                      toast({ title: "Saved", description: "Added to Saved Searches" });
                    }
                  }}>Save Search</Button>
                </div>
             </div>

             {/* Show TV's saved searches on phone */}
             {(state.savedSearches || []).length > 0 && (
               <div className="space-y-4 pt-4 border-t border-border">
                 <h3 className="text-lg font-headline font-bold">Saved Searches</h3>
                 <div className="flex flex-col gap-2">
                   {(state.savedSearches || []).map(term => (
                     <div key={term} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                       <span className="font-medium cursor-pointer" onClick={() => {
                          updateState({
                            aiData: {
                              history: term,
                              results: state.aiData?.results || [],
                              timestamp: Date.now()
                            }
                          });
                       }}>{term}</span>
                       <Button size="icon" variant="ghost" className="text-destructive" onClick={() => {
                         updateState({
                           savedSearches: state.savedSearches.filter(s => s !== term)
                         });
                       }}>
                         <Trash2 className="w-4 h-4" />
                       </Button>
                     </div>
                   ))}
                 </div>
               </div>
             )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

import { Suspense } from 'react';

// Wrap with provider to persist context independently if loaded directly
export default function RemoteEditorPage() {
  return (
    <Suspense fallback={<div className="flex justify-center mt-20"><LoaderCircle className="animate-spin text-primary w-10 h-10" /></div>}>
      <DashboardProvider deviceType="phone">
        <EditorContent />
      </DashboardProvider>
    </Suspense>
  );
}
