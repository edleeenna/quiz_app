import React, { useState } from 'react';
import { Plus, File, FileText, Upload, Loader, CheckCircle, AlertCircle, Sparkles, BookOpen, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
      setActiveTab('examples');
      toast.success("File processed successfully! Now add example questions to improve quiz quality.", {
        duration: 5000,
        action: {
          label: "Add Examples",
          onClick: () => setActiveTab('examples')
        }
      });
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
    
    const uploadSuccess = await uploadNoteToRAG(noteData);
    
    if (uploadSuccess) {
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
    
    const uploadSuccess = await uploadNoteToRAG(noteData);
    
    if (uploadSuccess) {
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
      const newNote: NoteFile = {
        ...noteData,
        isUploaded: false,
        uploadStatus: 'error'
      };
      
      addNote(newNote);
      toast.error("Note saved locally but failed to upload to server. You can retry uploading later.");
    }
  };

  const handleSkipExamples = () => {
    handleUploadedNoteSubmit();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium">
          <Sparkles className="h-4 w-4 mr-2" />
          Upload Your Study Materials
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">
          Transform Your <span className="gradient-text">Notes</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your study materials or create notes manually. Our AI will analyze your content and generate personalised quizzes.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* File Upload Card */}
        <Card className="glass-card border-2 border-dashed border-border/50 hover:border-blue-300 transition-all duration-300 group animate-scale-in">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">Upload Files</CardTitle>
            <CardDescription>
              Drag & drop or browse to upload your study materials
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <div
              className={`relative flex flex-col items-center justify-center h-48 rounded-xl transition-all duration-300 ${
                dragActive 
                  ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 border-dashed" 
                  : "bg-muted/30 border-2 border-dashed border-muted-foreground/25 hover:bg-muted/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center space-y-4">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  dragActive ? "bg-blue-100 dark:bg-blue-800" : "bg-muted"
                }`}>
                  <FileText className={`h-6 w-6 ${dragActive ? "text-blue-600" : "text-muted-foreground"}`} />
                </div>
                
                <div>
                  <p className="font-medium mb-1">
                    {dragActive ? "Drop your files here" : "Drag & drop your files"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports TXT, MD, DOCX files
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
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
                      <File className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                      Browse Files
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
          
          {uploadedFile && (
            <CardFooter className="bg-muted/20 border-t">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">File processed successfully</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-blue-500 animate-bounce-gentle" />
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Manual Entry or Example Questions Card */}
        <Card className={`glass-card animate-scale-in transition-all duration-300 ${
          uploadedFile ? 'ring-2 ring-blue-200 dark:ring-blue-800 shadow-lg' : ''
        }`} style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            {uploadedFile ? (
              <>
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 animate-bounce-gentle">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-center flex items-center justify-center space-x-2">
                  <span>🎯 Boost Quiz Quality!</span>
                </CardTitle>
                <CardDescription className="text-center">
                  <strong>Add example questions to guide the AI</strong> and get better, more relevant quiz questions tailored to your style.
                </CardDescription>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                        💡 Pro Tip: Example questions dramatically improve AI output!
                      </p>
                      <p className="text-yellow-700 dark:text-yellow-300">
                        Show the AI your preferred question format and difficulty level for much better results.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-center">Create Manually</CardTitle>
                <CardDescription className="text-center">
                  Enter your notes and optional example questions
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {uploadedFile ? (
              // Example Questions for Uploaded File
              <div className="space-y-4">
                <div className="bg-muted/20 rounded-lg p-4 border">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-sm">File: {uploadedFile.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {uploadedContent.length > 100 
                      ? `${uploadedContent.substring(0, 100)}...` 
                      : uploadedContent}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="uploaded-example-questions" className="text-sm font-medium flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-blue-500" />
                      <span>Example Questions</span>
                    </label>
                    <Badge variant="secondary" className="text-xs">
                      Recommended
                    </Badge>
                  </div>
                  
                  <Textarea
                    id="uploaded-example-questions"
                    placeholder={`💡 Add example questions to guide the AI:\n\nQ: What is the main function of mitochondria?\na) Protein synthesis\nb) Energy production (correct)\nc) DNA storage\nd) Waste removal\n\nQ: Which organelle controls cell activities?\na) Nucleus (correct)\nb) Cytoplasm\nc) Cell membrane\nd) Vacuole`}
                    className="min-h-[200px] bg-background/50 border-border/50 focus:border-blue-300 resize-none"
                    value={uploadedExampleQuestions}
                    onChange={(e) => setUploadedExampleQuestions(e.target.value)}
                    disabled={isUploading}
                  />
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <strong>Format tip:</strong> Write questions with 4 options (a, b, c, d) and mark the correct answer. 
                      This helps the AI understand your preferred style and difficulty level.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Manual Entry Tabs
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-6 bg-muted/50">
                  <TabsTrigger value="upload" disabled={isUploading} className="data-[state=active]:bg-background">
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="examples" disabled={isUploading} className="data-[state=active]:bg-background">
                    Examples
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="note-name" className="text-sm font-medium">
                      Note Title
                    </label>
                    <Input
                      id="note-name"
                      placeholder="e.g., Biology Chapter 5 - Cell Structure"
                      value={noteName}
                      onChange={(e) => setNoteName(e.target.value)}
                      className="bg-background/50 border-border/50 focus:border-blue-300"
                      disabled={isUploading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="note-content" className="text-sm font-medium">
                      Note Content
                    </label>
                    <Textarea
                      id="note-content"
                      placeholder="Enter your study notes here..."
                      className="min-h-[200px] bg-background/50 border-border/50 focus:border-blue-300 resize-none"
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      disabled={isUploading}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="examples" className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="example-questions" className="text-sm font-medium flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span>Example Questions (Optional)</span>
                    </label>
                    <Textarea
                      id="example-questions"
                      placeholder={`Guide the AI with example questions:\n\nQ: What is the powerhouse of the cell?\na) Nucleus\nb) Mitochondria (correct)\nc) Ribosome\nd) Golgi apparatus`}
                      className="min-h-[200px] bg-background/50 border-border/50 focus:border-purple-300 resize-none"
                      value={exampleQuestions}
                      onChange={(e) => setExampleQuestions(e.target.value)}
                      disabled={isUploading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Provide example questions to help the AI understand your preferred format and style.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
          
          <CardFooter className="space-y-3">
            {uploadedFile ? (
              <div className="w-full space-y-3">
                <Button 
                  onClick={handleUploadedNoteSubmit} 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
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
                      Save Note {uploadedExampleQuestions.trim() ? 'with Examples' : ''}
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleSkipExamples}
                  className="w-full text-muted-foreground hover:text-foreground"
                  disabled={isUploading}
                >
                  Skip Examples & Save Note
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleManualNoteSubmit} 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                disabled={isUploading}
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
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default NotesUploader;