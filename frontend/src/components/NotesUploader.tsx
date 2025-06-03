import React, { useState } from 'react';
import { Plus, File, FileText, Upload, Loader, CheckCircle, AlertCircle } from 'lucide-react';
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
  isUploaded?: boolean; // Track if note is uploaded to RAG
  uploadStatus?: 'idle' | 'uploading' | 'uploaded' | 'error';
}

interface NotesUploaderProps {
  addNote: (note: NoteFile) => void;
}

const API_BASE_URL = 'https://quiz-app-286055422108.europe-west1.run.app';

const NotesUploader = ({ addNote }: NotesUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteName, setNoteName] = useState('');
  const [exampleQuestions, setExampleQuestions] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [isUploading, setIsUploading] = useState(false);
  
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
      setActiveTab('examples');
      toast.success("File processed successfully. Add example questions if needed.");
    } catch (error) {
      toast.error("Failed to read file");
      console.error("Error reading file:", error);
    }
  };

  const uploadNoteToRAG = async (noteData: Omit<NoteFile, 'isUploaded' | 'uploadStatus'>) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("id", noteData.id);
      formData.append("name", noteData.name);
      formData.append("content", noteData.content);

      const response = await fetch(`${API_BASE_URL}/upload-notes`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      
      return true;
    } catch (error) {
      console.error("Error uploading note to RAG:", error);
      toast.error("Failed to upload note to server");
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadedNoteSubmit = async () => {
    if (!uploadedFile || !uploadedContent) {
      toast.error("Please upload a file first");
      return;
    }
    
    const noteData = {
      id: crypto.randomUUID(),
      name: uploadedFile.name,
      content: uploadedContent,
      exampleQuestions: uploadedExampleQuestions.trim() || undefined
    };
    
    // Upload to RAG system first
    const uploadSuccess = await uploadNoteToRAG(noteData);
    
    if (uploadSuccess) {
      // Add to local state with upload status
      const newNote: NoteFile = {
        ...noteData,
        isUploaded: true,
        uploadStatus: 'uploaded'
      };
      
      addNote(newNote);
      setUploadedFile(null);
      setUploadedContent('');
      setUploadedExampleQuestions('');
      setActiveTab('upload');
      toast.success("Note uploaded and saved successfully!");
    } else {
      // Still add to local state but mark as not uploaded
      const newNote: NoteFile = {
        ...noteData,
        isUploaded: false,
        uploadStatus: 'error'
      };
      
      addNote(newNote);
      toast.error("Note saved locally but failed to upload to server. You can retry uploading later.");
    }
  };

  const handleManualNoteSubmit = async () => {
    if (!noteContent.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }
    
    if (!noteName.trim()) {
      toast.error("Note name cannot be empty");
      return;
    }
    
    const noteData = {
      id: crypto.randomUUID(),
      name: noteName.trim(),
      content: noteContent.trim(),
      exampleQuestions: exampleQuestions.trim() || undefined
    };
    
    // Upload to RAG system first
    const uploadSuccess = await uploadNoteToRAG(noteData);
    
    if (uploadSuccess) {
      // Add to local state with upload status
      const newNote: NoteFile = {
        ...noteData,
        isUploaded: true,
        uploadStatus: 'uploaded'
      };
      
      addNote(newNote);
      setNoteContent('');
      setNoteName('');
      setExampleQuestions('');
      toast.success("Note uploaded and created successfully!");
    } else {
      // Still add to local state but mark as not uploaded
      const newNote: NoteFile = {
        ...noteData,
        isUploaded: false,
        uploadStatus: 'error'
      };
      
      addNote(newNote);
      toast.error("Note saved locally but failed to upload to server. You can retry uploading later.");
    }
  };

  const getUploadStatusIcon = () => {
    if (isUploading) {
      return <Loader className="h-4 w-4 animate-spin text-yellow-500" />;
    }
    return null;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 w-full">
      {/* File Uploader */}
      <Card className="border border-dashed border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div
            className={`flex flex-col items-center justify-center h-60 rounded-lg transition-colors ${
              dragActive ? "bg-accent/20" : "bg-muted/30"
            } border-2 border-dashed ${dragActive ? 'border-accent' : 'border-muted'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Drag & drop your notes</p>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Upload text files (TXT, MD, DOCX).<br />
              Large files may not be able to be processed by AI.
            </p>
            <Button 
              variant="outline" 
              className="relative group hover:border-accent hover:text-accent"
              disabled={isUploading}
            >
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".txt,.md,.docx"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {isUploading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                  Browse Files
                </>
              )}
            </Button>
          </div>
        </CardContent>
        {uploadedFile && (
          <CardFooter className="flex justify-between items-center bg-muted/30 p-3 border-t backdrop-blur-sm">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm truncate max-w-[180px]">{uploadedFile.name}</span>
            </div>
            <Button 
              size="sm" 
              onClick={handleUploadedNoteSubmit} 
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Save Note
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Manual Entry or Example Questions for Uploaded File */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          {uploadedFile ? (
            <>
              <CardTitle className="flex items-center">
                Add Examples for Uploaded Note
                {getUploadStatusIcon()}
              </CardTitle>
              <CardDescription>Add example questions to guide the AI</CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="flex items-center">
                Create Note
                {getUploadStatusIcon()}
              </CardTitle>
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
                  className="min-h-[200px] bg-background/50"
                  value={uploadedExampleQuestions}
                  onChange={(e) => setUploadedExampleQuestions(e.target.value)}
                  disabled={isUploading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format: Write one question per line, followed by options (a, b, c, d) and indicate the correct answer.
                </p>
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="upload" disabled={isUploading}>Note Content</TabsTrigger>
                <TabsTrigger value="examples" disabled={isUploading}>Example Questions</TabsTrigger>
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
                    className="bg-background/50"
                    disabled={isUploading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="note-content" className="text-sm font-medium">
                    Note Content
                  </label>
                  <Textarea
                    id="note-content"
                    placeholder="Enter your notes here..."
                    className="min-h-[150px] bg-background/50"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    disabled={isUploading}
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
                    className="min-h-[200px] bg-background/50"
                    value={exampleQuestions}
                    onChange={(e) => setExampleQuestions(e.target.value)}
                    disabled={isUploading}
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
            <Button 
              onClick={handleUploadedNoteSubmit} 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Uploading to Server...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Save Note with Examples
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleManualNoteSubmit} 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Uploading to Server...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Note
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotesUploader;
