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
      <h2 className="text-2xl font-bold text-white">My Notes ({notes.length})</h2>
      
      {notes.length === 0 ? (
        <Card className="border border-dashed border-white/10 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
            <File className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2 text-white">No notes yet</h3>
            <p className="text-gray-400">
              Upload or create notes to generate quizzes
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id} className="overflow-hidden animate-fade-in bg-card/50 backdrop-blur-sm border-white/10 group hover:border-white/20 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-white">
                  <File className="h-5 w-5 mr-2 text-theme-blue" />
                  <span className="truncate">{note.name}</span>
                  {note.exampleQuestions && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-theme-purple/20 text-theme-purple">
                      <FileInput className="h-3 w-3 mr-1" />
                      Examples
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-24 overflow-hidden text-gray-400 text-sm">
                  {note.content.length > 150 
                    ? `${note.content.substring(0, 150)}...` 
                    : note.content}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-white/10 pt-4 pb-2 bg-white/5">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deleteNote(note.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => selectNoteForQuiz(note)}
                  className="bg-gradient-to-r from-theme-blue to-theme-purple hover:opacity-90"
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