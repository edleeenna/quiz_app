
import React from 'react';
import { File, Trash, Edit, FileInput } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface NoteFile {
  id: string;
  name: string;
  content: string;
  exampleQuestions?: string;
}

interface NotesListProps {
  notes: NoteFile[];
  deleteNote: (id: string) => void;
  selectNoteForQuiz: (note: NoteFile) => void;
}

const NotesList = ({ notes, deleteNote, selectNoteForQuiz }: NotesListProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold">My Notes ({notes.length})</h2>
      
      {notes.length === 0 ? (
        <Card className="border border-dashed border-border bg-muted/30">
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
            <File className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No notes yet</h3>
            <p className="text-muted-foreground">
              Upload or create notes to generate quizzes
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id} className="overflow-hidden animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <File className="h-5 w-5 mr-2 text-primary" />
                  <span className="truncate">{note.name}</span>
                  {note.exampleQuestions && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                      <FileInput className="h-3 w-3 mr-1" />
                      Examples
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-24 overflow-hidden text-muted-foreground text-sm">
                  {note.content.length > 150 
                    ? `${note.content.substring(0, 150)}...` 
                    : note.content}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4 pb-2 bg-muted/30">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deleteNote(note.id)}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => selectNoteForQuiz(note)}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Generate Quiz
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;
