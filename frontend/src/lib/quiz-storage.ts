// Quiz storage utilities
export const updateQuizAttempt = async (quizId: string, score: number) => {
  // Store the quiz attempt
  try {
    // Implementation can be expanded based on storage requirements
    console.log(`Quiz ${quizId} completed with score ${score}`);
  } catch (error) {
    console.error('Failed to update quiz attempt:', error);
  }
};