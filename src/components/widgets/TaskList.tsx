'use client';

import { useDashboard } from '@/hooks/use-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ListTodo, Plus, Trash2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Task } from '@/lib/types';
import { Checkbox } from '../ui/checkbox';
import { useState } from 'react';

export function TaskList() {
  const { state, updateState, deviceType } = useDashboard();
  const { tasks } = state;
  const isPhone = deviceType === 'phone';
  const [newTaskText, setNewTaskText] = useState('');

  if (!isPhone && tasks.length === 0) return null;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: Date.now(),
      completedAt: null
    };

    updateState({ tasks: [...tasks, newTask] });
    setNewTaskText('');
  };

  const handleToggleTask = (id: string, completed: boolean) => {
    // Both phone and TV can check off tasks
    updateState({
      tasks: tasks.map(t => 
        t.id === id ? { ...t, completed, completedAt: completed ? Date.now() : null } : t
      )
    });
  };

  const handleDeleteTask = (id: string) => {
    updateState({ tasks: tasks.filter(t => t.id !== id) });
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <section className="container mx-auto px-6 mb-10">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold font-headline flex items-center gap-2">
          <ListTodo className="w-6 h-6 text-primary" />
          Checklist
        </h2>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
        <CardContent className="p-4 md:p-6 space-y-4">
          
          {isPhone && (
            <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
              <Input 
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 bg-background"
              />
              <Button type="submit"><Plus className="w-4 h-4" /></Button>
            </form>
          )}

          <div className="space-y-2">
            {activeTasks.length === 0 && completedTasks.length === 0 && !isPhone && (
              <p className="text-muted-foreground italic">No tasks yet.</p>
            )}
            
            {activeTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between group p-2 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id={`task-${task.id}`} 
                    checked={task.completed}
                    onCheckedChange={(c) => handleToggleTask(task.id, c as boolean)}
                    className="w-5 h-5 rounded-full"
                  />
                  <label 
                    htmlFor={`task-${task.id}`}
                    className="text-lg font-medium cursor-pointer"
                  >
                    {task.text}
                  </label>
                </div>
                {isPhone && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            {completedTasks.length > 0 && (
              <div className="pt-4 mt-4 border-t border-border/50">
                <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Completed</p>
                {completedTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between group p-2 hover:bg-muted/50 rounded-lg transition-colors opacity-60">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id={`task-${task.id}`} 
                        checked={task.completed}
                        onCheckedChange={(c) => handleToggleTask(task.id, c as boolean)}
                        className="w-5 h-5 rounded-full"
                      />
                      <label 
                        htmlFor={`task-${task.id}`}
                        className="text-lg font-medium cursor-pointer line-through text-muted-foreground"
                      >
                        {task.text}
                      </label>
                    </div>
                    {isPhone && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
