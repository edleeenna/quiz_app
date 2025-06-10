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
        return <Clock className="h-4 w-4 text-gray-400" />;
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

  if (notes.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mb-6">
          <File className="h-12 w-12 text-blue-500" />
        </div>
        <h3 className="text-2xl font-semibold mb-3">No notes yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Upload your study materials or create notes manually to get started with AI-powered quiz generation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Your <span className="gradient-text">Study Notes</span>
          </h2>
          <p className="text-muted-foreground mt-1">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'} ready for quiz generation
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {notes.filter(note => note.uploadStatus === 'uploaded').length} synced
        </Badge>
      </div>
      
      {/* Notes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note, index) => (
          <Card 
            key={note.id} 
            className="group glass-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <File className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg truncate group-hover:gradient-text transition-all duration-300">
                      {note.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(note.uploadStatus)}
                      <span className="text-xs text-muted-foreground">
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
            
            <CardContent className="pb-4">
              <div className="bg-muted/30 rounded-lg p-4 h-24 overflow-hidden relative group-hover:bg-muted/50 transition-colors">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {note.content.length > 150 
                    ? `${note.content.substring(0, 150)}...` 
                    : note.content}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-muted/30 to-transparent group-hover:from-muted/50" />
              </div>
              
              <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                <span>{note.content.length} characters</span>
                {note.exampleQuestions && (
                  <span>With examples</span>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-0 flex justify-between space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => deleteNote(note.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
              
              <Button 
                size="sm" 
                onClick={() => selectNoteForQuiz(note)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 group/btn"
              >
                <Edit className="h-4 w-4 mr-1 group-hover/btn:scale-110 transition-transform" />
                Generate Quiz
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NotesList;