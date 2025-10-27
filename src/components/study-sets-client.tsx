'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2, BookOpen, Pencil, FolderPlus } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  content: z.string().min(50, 'Content must be at least 50 characters long.'),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function StudySetsClient() {
  const { studySets, addStudySet, removeStudySet, updateStudySet, folders, addFolder, renameFolder } = useAppStore(state => ({
    studySets: state.studySets,
    addStudySet: state.addStudySet,
    removeStudySet: state.removeStudySet,
    updateStudySet: state.updateStudySet,
    folders: state.folders,
    addFolder: state.addFolder,
    renameFolder: state.renameFolder,
  }));
  const { toast } = useToast();
  const [search, setSearch] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', content: '', tags: '' },
  });

  // Edit dialog state + form
  const [editOpen, setEditOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const editForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', content: '', tags: '' },
  });

  // Folder state
  const [selectedFolder, setSelectedFolder] = React.useState<string | 'all' | 'root'>('all');
  const [createFolderOpen, setCreateFolderOpen] = React.useState(false);
  const folderForm = useForm<{ name: string }>({ defaultValues: { name: '' } });
  // Per-form folder picker (default to currently selected filter when not 'all')
  const [createFormFolder, setCreateFormFolder] = React.useState<string | 'root' | 'all'>('root');
  React.useEffect(() => {
    setCreateFormFolder(selectedFolder === 'all' ? 'root' : selectedFolder);
  }, [selectedFolder]);

  // Handle file uploads (txt/md) and populate content/title
  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      const texts = await Promise.all(
        Array.from(files).map(async (file) => {
          // Only read as text for now (works for .txt/.md)
          // For other types, a message is appended.
          const allowed = /\.(txt|md|markdown)$/i.test(file.name);
          if (!allowed) {
            return `\n\n[Unsupported file type: ${file.name}]`;
          }
          const t = await file.text();
          return `\n\n# ${file.name}\n${t}`;
        })
      );
      const current = form.getValues('content') || '';
      form.setValue('content', (current + texts.join('')).trimStart());
      // If there is a single file and title is empty, use filename (no ext)
      if (files.length === 1 && !form.getValues('title')) {
        const base = files[0].name.replace(/\.[^/.]+$/, '');
        form.setValue('title', base);
      }
    } catch (e) {
      // no-op
    }
  };

  const startEdit = (id: string) => {
    const set = studySets?.find(s => s.id === id);
    if (!set) return;
    setEditingId(id);
    editForm.reset({
      title: set.title,
      content: set.content,
      tags: (set.tags || []).join(', '),
    });
    setEditOpen(true);
  };

  const onEditSubmit: SubmitHandler<FormValues> = (data) => {
    if (!editingId) return;
    const tags = (data.tags || '')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    updateStudySet(editingId, { title: data.title, content: data.content, tags });
    toast({ title: 'Study Set Updated', description: `"${data.title}" has been saved.` });
    setEditOpen(false);
    setEditingId(null);
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const tags = (data.tags || '')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    const folderId = createFormFolder === 'all' ? null : (createFormFolder === 'root' ? null : createFormFolder);
    addStudySet({ title: data.title, content: data.content, tags, folderId });
    toast({
      title: 'Study Set Added',
      description: `"${data.title}" has been successfully saved.`,
    });
    form.reset();
  };

  const handleDelete = (id: string, title: string) => {
    removeStudySet(id);
    toast({
      title: 'Study Set Deleted',
      description: `"${title}" has been removed.`,
      variant: 'destructive',
    });
  };

  // Build filtered list (folder + search)
  const filteredSets = React.useMemo(() => {
    let list = [...(studySets || [])];
    const q = (search || '').toLowerCase();
    if (q) {
      list = list.filter(s => {
        const tagStr = (s.tags || []).join(' ').toLowerCase();
        return s.title.toLowerCase().includes(q) || tagStr.includes(q);
      });
    }
    if (selectedFolder === 'root') {
      list = list.filter(s => !s.folderId);
    } else if (selectedFolder !== 'all') {
      list = list.filter(s => s.folderId === selectedFolder);
    }
    return list;
  }, [studySets, search, selectedFolder]);

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card id="add-set-form" className="sticky top-20">
          <CardHeader>
            <CardTitle>Add New Study Set</CardTitle>
            <CardDescription>
              Add your notes, textbook chapters, or any other study material here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., AWS S3 Basics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Choose folder for this study set */}
                <div className="space-y-2">
                  <FormLabel>Folder</FormLabel>
                  <Select value={createFormFolder} onValueChange={(v:any)=>setCreateFormFolder(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="root">Root</SelectItem>
                      {folders?.map(f => (
                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Upload files */}
                <div className="space-y-2">
                  <FormLabel>Upload Files</FormLabel>
                  <Input
                    type="file"
                    multiple
                    accept=".txt,.md,.markdown"
                    onChange={(e) => handleFilesSelected(e.currentTarget.files)}
                    // @ts-ignore
                    ref={fileInputRef}
                  />
                  <p className="text-xs text-muted-foreground">Upload .txt or .md files. We’ll append their contents to the editor below. PDF support coming soon.</p>
                </div>

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your study material here..."
                          className="min-h-[200px] font-code text-xs"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., s3, security, basics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Study Set
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <h2 className="text-2xl font-headline font-semibold">Your Study Sets</h2>
          <div className="flex items-center gap-2">
            <Select value={selectedFolder} onValueChange={(v:any)=>setSelectedFolder(v)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="root">Root</SelectItem>
                {folders?.map(f => (
                  <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Search title or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm"><FolderPlus className="h-4 w-4 mr-1"/>New Folder</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Folder</DialogTitle></DialogHeader>
                <Form {...folderForm}>
                  <form onSubmit={folderForm.handleSubmit((vals)=>{ const id=addFolder(vals.name,null); setSelectedFolder(id); setCreateFolderOpen(false); folderForm.reset(); })} className="space-y-3">
                    <Input placeholder="Folder name" {...folderForm.register('name',{required:true})} />
                    <div className="flex justify-end"><Button type="submit">Create</Button></div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-xs text-muted-foreground">Tip: Use folders to group related topics. Move sets with the folder selector on each card.</p>
        </div>
        {filteredSets && filteredSets.length > 0 ? (
          <div className="space-y-4">
            {filteredSets.reverse().map((set) => (
              <Card key={set.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{set.title}</span>
                    <div className="flex items-center gap-1">
                    {/* Open */}
                    <Button asChild variant="ghost" size="icon" aria-label="Open">
                      <Link href={`/quiz?studySetId=${set.id}`}>
                        <BookOpen className="h-4 w-4" />
                      </Link>
                    </Button>
                    {/* Edit */}
                    <Dialog open={editOpen && editingId === set.id} onOpenChange={(o)=>{ if(!o){ setEditOpen(false); setEditingId(null);} }}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => startEdit(set.id)} aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Study Set</DialogTitle>
                        </DialogHeader>
                        <Form {...editForm}>
                          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                            <FormField control={editForm.control} name="title" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={editForm.control} name="content" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl><Textarea className="min-h-[200px] font-code text-xs" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={editForm.control} name="tags" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl><Input placeholder="comma separated" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <div className="flex justify-end gap-2">
                              <Button type="button" variant="outline" onClick={()=>{setEditOpen(false); setEditingId(null);}}>Cancel</Button>
                              <Button type="submit">Save Changes</Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                    {/* Move to folder */}
                    <Select value={set.folderId || 'root'} onValueChange={(v)=>updateStudySet(set.id,{ folderId: v==='root'? null : v })}>
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="root">Root</SelectItem>
                        {folders?.map(f => (<SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    {/* Delete */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the study set "{set.title}" and any associated quizzes or flashcards. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(set.id, set.title)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    <span>
                      Created on {new Date(set.createdAt).toLocaleDateString()} &bull;{' '}
                      {set.content.split(' ').length} words
                    </span>
                    {set.tags && set.tags.length > 0 && (
                      <span className="block mt-2 space-x-2">
                        {set.tags.map((t, i) => (
                          <span key={i} className="inline-block text-[10px] px-2 py-0.5 rounded bg-accent text-accent-foreground">#{t}</span>
                        ))}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 font-code">
                    {set.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Study Sets {selectedFolder !== 'all' ? 'in this folder' : 'found'}</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md">
              {selectedFolder !== 'all'
                ? 'This folder is empty. Create a study set, upload notes, or move existing sets here.'
                : 'Try creating a study set, uploading notes, or clearing the search filter.'}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <Button onClick={() => document.getElementById('add-set-form')?.scrollIntoView({ behavior: 'smooth' })} size="sm">Add Study Set</Button>
              <Button onClick={() => (fileInputRef as any)?.current?.click()} variant="outline" size="sm">Upload Files</Button>
              <Button onClick={() => setCreateFolderOpen(true)} variant="ghost" size="sm">New Folder</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
