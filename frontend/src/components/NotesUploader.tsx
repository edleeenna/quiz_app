import React, { useState } from 'react';
import { Plus, File, FileText, Upload, Loader, CheckCircle, AlertCircle, Cloud, Sparkles } from 'lucide-react';
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
  isUploaded?: boolean;
  uploadStatus?: 'idle' | 'uploading' | 'uploaded' | 'error';
}

interface NotesUploaderProps {
  addNote: (note: NoteFile) => void;
}

const API_BASE_URL = 'https://quiz-app-gs-c0g.fly.dev';

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
      toast.success("File processed successfully! You can now add example questions or save directly.");
    } catch (error) {
      toast.error("Failed to read file");
      console.error("Error reading file:", error);
    }
  };

  const uploadNoteToRAG = async (noteData: Omit<NoteFile, 'isUploaded' | 'uploadStatus'>) => {
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
    }
  };

  const handleUploadedNoteSubmit = async () => {
    if (!uploadedFile || !uploadedContent) {
      toast.error("Please upload a file first");
      return;
    }
    
    setIsUploading(true);
    
    const noteData = {
      id: crypto.randomUUID(),
      name: uploadedFile.name,
      content: uploadedContent,
      exampleQuestions: uploadedExampleQuestions.trim() || undefined
    };
    
    const uploadSuccess = await uploadNoteToRAG(noteData);
    
    if (uploadSuccess) {
      const newNote: NoteFile = {
        ...noteData,
        isUploaded: true,
        uploadStatus: 'uploaded'
      };
      
      addNote(newNote);
      
      // Reset form
      setUploadedFile(null);
      setUploadedContent('');
      setUploadedExampleQuestions('');
      setActiveTab('upload');
      
      toast.success("Note uploaded and saved successfully!");
    } else {
      const newNote: NoteFile = {
        ...noteData,
        isUploaded: false,
        uploadStatus: 'error'
      };
      
      addNote(newNote);
      toast.error("Note saved locally but failed to upload to server. You can retry uploading later.");
    }
    
    setIsUploading(false);
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
    
    setIsUploading(true);
    
    const noteData = {
      id: crypto.randomUUID(),
      name: noteName.trim(),
      content: noteContent.trim(),
      exampleQuestions: exampleQuestions.trim() || undefined
    };
    
    const uploadSuccess = await uploadNoteToRAG(noteData);
    
    if (uploadSuccess) {
      const newNote: NoteFile = {
        ...noteData,
        isUploaded: true,
        uploadStatus: 'uploaded'
      };
      
      addNote(newNote);
      
      // Reset form
      setNoteContent('');
      setNoteName('');
      setExampleQuestions('');
      
      toast.success("Note uploaded and created successfully!");
    } else {
      const newNote: NoteFile = {
        ...noteData,
        isUploaded: false,
        uploadStatus: 'error'
      };
      
      addNote(newNote);
      toast.error("Note saved locally but failed to upload to server. You can retry uploading later.");
    }
    
    setIsUploading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Upload Your Study Materials
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your notes into interactive quizzes with AI-powered question generation
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* File Upload Card */}
        <Card className="relative overflow-hidden border-2 border-dashed border-border hover:border-blue-300 transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Cloud className="h-6 w-6 text-blue-600" />
              Upload Files
            </CardTitle>
            <CardDescription>
              Drag and drop your study materials or browse to upload
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div
              className={`relative flex flex-col items-center justify-center h-64 rounded-xl transition-all duration-300 ${
                dragActive 
                  ? "bg-blue-50 border-2 border-blue-300 border-dashed" 
                  : "bg-slate-50 border-2 border-slate-200 border-dashed hover:bg-slate-100"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center space-y-4">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                  dragActive ? "bg-blue-100" : "bg-slate-200"
                }`}>
                  <FileText className={`h-8 w-8 ${dragActive ? "text-blue-600" : "text-slate-500"}`} />
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-700">
                    {dragActive ? "Drop your files here" : "Drag & drop your files"}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Supports TXT, MD, DOCX files
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="relative group/btn hover:border-blue-300 hover:text-blue-600"
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
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2 transition-transform group-hover/btn:scale-110" />
                      Browse Files
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
          
          {uploadedFile && (
            <CardFooter className="bg-slate-50 border-t">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{uploadedFile.name}</p>
                    <p className="text-sm text-slate-500">Ready to save</p>
                  </div>
                </div>
                <Button 
                  onClick={handleUploadedNoteSubmit} 
                  disabled={isUploading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isUploading ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Save Note
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Manual Entry Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-6 w-6 text-purple-600" />
              Create Manually
            </CardTitle>
            <CardDescription>
              Enter your notes directly and add example questions
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                <TabsTrigger value="upload" disabled={isUploading} className="data-[state=active]:bg-white">
                  Note Content
                </TabsTrigger>
                <TabsTrigger value="examples" disabled={isUploading} className="data-[state=active]:bg-white">
                  Examples
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <label htmlFor="note-name" className="text-sm font-medium text-slate-700">
                    Note Title
                  </label>
                  <Input
                    id="note-name"
                    placeholder="e.g., Biology Chapter 5 - Cell Structure"
                    value={noteName}
                    onChange={(e) => setNoteName(e.target.value)}
                    className="border-slate-200 focus:border-blue-300 focus:ring-blue-200"
                    disabled={isUploading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="note-content" className="text-sm font-medium text-slate-700">
                    Note Content
                  </label>
                  <Textarea
                    id="note-content"
                    placeholder="Paste or type your study notes here..."
                    className="min-h-[200px] border-slate-200 focus:border-blue-300 focus:ring-blue-200 resize-none"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    disabled={isUploading}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="examples" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <label htmlFor="example-questions" className="text-sm font-medium text-slate-700">
                    Example Questions (Optional)
                  </label>
                  <Textarea
                    id="example-questions"
                    placeholder={`Add example questions to guide AI generation:\n\nQ: What is the powerhouse of the cell?\na) Nucleus\nb) Mitochondria (correct)\nc) Ribosome\nd) Golgi apparatus`}
                    className="min-h-[200px] border-slate-200 focus:border-blue-300 focus:ring-blue-200 resize-none"
                    value={exampleQuestions}
                    onChange={(e) => setExampleQuestions(e.target.value)}
                    disabled={isUploading}
                  />
                  <p className="text-xs text-slate-500">
                    Providing examples helps the AI generate better questions in your preferred style
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="relative z-10">
            <Button 
              onClick={handleManualNoteSubmit} 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isUploading || !noteContent.trim() || !noteName.trim()}
            >
              {isUploading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Creating Note...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Note
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* File Content Preview and Example Questions for Uploaded Files */}
      {uploadedFile && uploadedContent && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* File Content Preview */}
          <Card className="border border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                File Content Preview: {uploadedFile.name}
              </CardTitle>
              <CardDescription>
                Review the extracted content from your uploaded file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-sm text-slate-700 whitespace-pre-wrap">
                  {uploadedContent.length > 1000 
                    ? `${uploadedContent.substring(0, 1000)}...\n\n[Content truncated - ${uploadedContent.length} total characters]`
                    : uploadedContent}
                </pre>
              </div>
              <div className="mt-3 text-sm text-slate-500">
                {uploadedContent.length} characters extracted
              </div>
            </CardContent>
          </Card>

          {/* Example Questions for Uploaded File */}
          <Card className="border border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Add Example Questions (Optional)
              </CardTitle>
              <CardDescription>
                Help the AI generate better questions by providing examples for your uploaded content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={`Add example questions to guide AI generation:\n\nQ: What is the main topic of this content?\na) Option A\nb) Option B (correct)\nc) Option C\nd) Option D`}
                className="min-h-[150px] border-slate-200 focus:border-blue-300 focus:ring-blue-200 resize-none"
                value={uploadedExampleQuestions}
                onChange={(e) => setUploadedExampleQuestions(e.target.value)}
                disabled={isUploading}
              />
              <p className="text-xs text-slate-500 mt-2">
                These examples will help the AI understand your preferred question format and style
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotesUploader;