import React from 'react';
import { File, Trash, Edit, FileInput, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NoteFile {
  id: string;
  name: string;
  content: string;
  exampleQuestions?: string;
  isUploaded?: boolean;
  uploadStatus?: 'idle' | 'uploading' | 'uploaded' | 'error';
}

interface NotesListProps {
  notes: NoteFile[];
  deleteNote: (id: string) => void;
  selectNoteForQuiz: (note: NoteFile) => void;
}

const NotesList = ({ notes, deleteNote, selectNoteForQuiz }: NotesListProps) => {
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'uploading':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      default:
        return <File className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'uploaded':
        return 'Synced';
      case 'error':
        return 'Sync Failed';
      case 'uploading':
        return 'Syncing...';
      default:
        return 'Local';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            My Study Notes
          </h2>
          <p className="text-slate-600 mt-1">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'} ready for quiz generation
          </p>
        </div>
        {notes.length > 0 && (
          <Badge variant="secondary" className="px-3 py-1">
            {notes.filter(note => note.uploadStatus === 'uploaded').length} synced
          </Badge>
        )}
      </div>
      
      {notes.length === 0 ? (
        <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <File className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No notes yet</h3>
            <p className="text-slate-500 max-w-md">
              Upload your study materials or create notes manually to get started with AI-powered quiz generation
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <CardHeader className="relative z-10 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <File className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg leading-tight truncate" title={note.name}>
                        {note.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        {getStatusIcon(note.uploadStatus)}
                        <span className="text-xs text-slate-500">
                          {getStatusText(note.uploadStatus)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {note.exampleQuestions && (
                    <Badge variant="outline" className="ml-2 flex-shrink-0">
                      <FileInput className="h-3 w-3 mr-1" />
                      Examples
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10 pt-0">
                <div className="bg-slate-50 rounded-lg p-4 h-24 overflow-hidden">
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {note.content.length > 120 
                      ? `${note.content.substring(0, 120)}...` 
                      : note.content}
                  </p>
                </div>
                
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{note.content.length} characters</span>
                  {note.exampleQuestions && (
                    <span>With examples</span>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="relative z-10 flex justify-between gap-2 pt-4 bg-slate-50/50">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deleteNote(note.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => selectNoteForQuiz(note)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
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