import { gameQuestions, checkAnswer } from '@/lib/gameQuestions';
import { executeQuery } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(gameQuestions);
}

export async function POST(request) {
  try {
    const { questionId, query } = await request.json();
    
    // Execute the query
    const result = executeQuery(query);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error,
        type: 'syntax_error'
      });
    }
    
    // Check if answer is correct
    const isCorrect = checkAnswer(questionId, result);
    
    return NextResponse.json({
      success: true,
      correct: isCorrect,
      userOutput: result.data,
      type: isCorrect ? 'correct' : 'wrong_output'
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' }, 
      { status: 500 }
    );
  }
}