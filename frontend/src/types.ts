export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
  }
  
  export interface NoteFile {
    id: string;
    name: string;
    content: string;
    exampleQuestions?: string;
  }