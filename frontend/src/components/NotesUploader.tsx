
import React, { useState } from 'react';
import { Plus, File, X, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import mammoth from 'mammoth';

interface NoteFile {
  id: string;
  name: string;
  content: string;
  exampleQuestions?: string;
}

interface NotesUploaderProps {
  addNote: (note: NoteFile) => void;
}

const NotesUploader = ({ addNote }: NotesUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteName, setNoteName] = useState('');
  const [exampleQuestions, setExampleQuestions] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  
  // For uploaded files
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedContent, setUploadedContent] = useState('');
  const [uploadedExampleQuestions, setUploadedExampleQuestions] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    try {
      let content = '';
      const ext = file.name.split('.').pop()?.toLowerCase();
  
      if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        content = result.value;
      } else {
        content = await file.text();
      }
  
      setUploadedFile(file);
      setUploadedContent(content);
      setActiveTab('examples'); // Switch to examples tab after upload
      toast.success("File uploaded successfully. Add example questions if needed.");
    } catch (error) {
      toast.error("Failed to read file");
      console.error("Error reading file:", error);
    }
  };
  

  const handleUploadedNoteSubmit = () => {
    if (!uploadedFile || !uploadedContent) {
      toast.error("Please upload a file first");
      return;
    }
    
    const newNote = {
      id: crypto.randomUUID(),
      name: uploadedFile.name,
      content: uploadedContent,
      exampleQuestions: uploadedExampleQuestions.trim() || undefined
    };
    
    addNote(newNote);
    setUploadedFile(null);
    setUploadedContent('');
    setUploadedExampleQuestions('');
    setActiveTab('upload');
    toast.success("Note with examples saved successfully!");
  };

  const handleManualNoteSubmit = () => {
    if (!noteContent.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }
    
    if (!noteName.trim()) {
      toast.error("Note name cannot be empty");
      return;
    }
    
    const newNote = {
      id: crypto.randomUUID(),
      name: noteName.trim(),
      content: noteContent.trim(),
      exampleQuestions: exampleQuestions.trim() || undefined
    };
    
    addNote(newNote);
    setNoteContent('');
    setNoteName('');
    setExampleQuestions('');
    toast.success("Note created successfully!");
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 w-full">
      {/* File Uploader */}
      <Card className="border border-dashed border-border">
        <CardContent className="p-6">
          <div
            className={`flex flex-col items-center justify-center h-60 rounded-lg transition-colors ${
              dragActive ? "bg-accent/20" : "bg-muted/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FileText className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Drag & drop your notes</p>
            <p className="text-sm text-muted-foreground mb-4">
              Upload text files (TXT, MD, DOC). 
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Large files may not be able to be processed by AI.
            </p>
            <Button variant="outline" className="relative">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".txt,.md,.doc,.docx"
                onChange={handleFileChange}
              />
              <Plus className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
          </div>
        </CardContent>
        {uploadedFile && (
          <CardFooter className="flex justify-between items-center bg-muted/30 p-3 border-t">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm truncate max-w-[180px]">{uploadedFile.name}</span>
            </div>
            <Button size="sm" onClick={handleUploadedNoteSubmit}>
              <Plus className="h-4 w-4 mr-2" />
              Save Note
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Manual Entry or Example Questions for Uploaded File */}
      <Card>
        <CardHeader>
          {uploadedFile ? (
            <>
              <CardTitle>Add Examples for Uploaded Note</CardTitle>
              <CardDescription>Add example questions to guide the AI</CardDescription>
            </>
          ) : (
            <>
              <CardTitle>Create Note</CardTitle>
              <CardDescription>Enter your notes manually and optionally include example questions</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {uploadedFile ? (
            <div className="space-y-4">
              <div className="p-3 bg-muted/20 rounded-md">
                <p className="text-sm font-medium mb-1">File: {uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground mb-2">
                  {uploadedContent.length > 100 
                    ? `${uploadedContent.substring(0, 100)}...` 
                    : uploadedContent}
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="uploaded-example-questions" className="text-sm font-medium">
                  Example Questions
                </label>
                <Textarea
                  id="uploaded-example-questions"
                  placeholder={`Enter example questions to guide the AI in quiz generation. Try to match format below or AI might not return a good result...\n e.g.\nQ: What is the capital of France?\na) Berlin\nb) Madrid\nc) Paris (correct)\nd) Rome`}
                  className="min-h-[200px]"
                  value={uploadedExampleQuestions}
                  onChange={(e) => setUploadedExampleQuestions(e.target.value)}
                />

                <p className="text-xs text-muted-foreground mt-1">
                  Format: Write one question per line, followed by options (a, b, c, d) and indicate the correct answer.
                  </p>
                
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="upload">Note Content</TabsTrigger>
                <TabsTrigger value="examples">Example Questions</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="note-name" className="text-sm font-medium">
                    Note Title
                  </label>
                  <Input
                    id="note-name"
                    placeholder="Enter note title"
                    value={noteName}
                    onChange={(e) => setNoteName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="note-content" className="text-sm font-medium">
                    Note Content
                  </label>
                  <Textarea
                    id="note-content"
                    placeholder="Enter your notes here..."
                    className="min-h-[150px]"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="examples" className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="example-questions" className="text-sm font-medium">
                    Example Questions (Optional)
                  </label>
                  <Textarea
                    id="example-questions"
                    placeholder={`Enter example questions to guide the AI in quiz generation. Try to match format below or AI might not return a good result...\n \nQ: What is the capital of France?\na) Berlin\nb) Madrid\nc) Paris (correct)\nd) Rome`}
                    className="min-h-[200px]"
                    value={exampleQuestions}
                    onChange={(e) => setExampleQuestions(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: Write one question per line, followed by options (a, b, c, d) and indicate the correct answer. This will help guide the AI.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter>
          {uploadedFile ? (
            <Button onClick={handleUploadedNoteSubmit} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Save Note with Examples
            </Button>
          ) : (
            <Button onClick={handleManualNoteSubmit} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Note
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotesUploader;
