'use client';

import { useDashboard } from '@/hooks/use-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { StickyNote, Plus, Trash2, Pin } from 'lucide-react';
import { useState } from 'react';
import { Note } from '@/lib/types';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';

export function QuickNotes() {
  const { state, updateState, deviceType } = useDashboard();
  const { notes } = state;
  const isPhone = deviceType === 'phone';

  // If we're on the TV and there are no notes, hide the widget
  if (!isPhone && notes.length === 0) return null;

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      color: 'bg-yellow-500/20',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pinned: false
    };
    updateState({ notes: [newNote, ...notes] });
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    updateState({
      notes: notes.map(n => 
        n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
      )
    });
  };

  const handleDeleteNote = (id: string) => {
    updateState({ notes: notes.filter(n => n.id !== id) });
  };

  return (
    <section className="container mx-auto px-6 mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-bold font-headline flex items-center gap-2">
          <StickyNote className="w-6 h-6 text-primary" />
          Quick Notes
        </h2>
        {isPhone && (
          <Button onClick={handleAddNote} size="sm" variant="outline" className="gap-2">
            <Plus className="w-4 h-4" /> Add Note
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {notes.map(note => (
          <Card key={note.id} className={`h-full ${note.color} border-primary/20 backdrop-blur-sm relative group transition-all duration-300 hover:shadow-lg`}>
            {isPhone && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-8 w-8 ${note.pinned ? 'text-primary' : 'text-muted-foreground'}`}
                  onClick={() => handleUpdateNote(note.id, { pinned: !note.pinned })}
                >
                  <Pin className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <CardHeader className="pb-2 pt-4 px-4">
              {isPhone ? (
                <Input 
                  value={note.title} 
                  onChange={(e) => handleUpdateNote(note.id, { title: e.target.value })}
                  className="font-semibold bg-transparent border-none p-0 h-auto focus-visible:ring-0 text-lg"
                  placeholder="Note Title"
                />
              ) : (
                <CardTitle className="text-lg flex items-center gap-2">
                  {note.title}
                  {note.pinned && <Pin className="h-4 w-4 text-primary" />}
                </CardTitle>
              )}
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {isPhone ? (
                <Textarea 
                  value={note.content}
                  onChange={(e) => handleUpdateNote(note.id, { content: e.target.value })}
                  className="min-h-[120px] bg-white/5 border-none resize-none focus-visible:ring-primary/50"
                  placeholder="Write something..."
                />
              ) : (
                <div className="whitespace-pre-wrap text-muted-foreground text-sm">
                  {note.content || <span className="italic opacity-50">Empty note</span>}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {isPhone && notes.length === 0 && (
          <div 
            onClick={handleAddNote}
            className="h-[200px] rounded-xl border-2 border-dashed border-muted flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary cursor-pointer transition-colors"
          >
            <Plus className="w-8 h-8 mb-2" />
            <span>Create your first note</span>
          </div>
        )}
      </div>
    </section>
  );
}
