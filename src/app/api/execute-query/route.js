// src/app/api/execute-query/route.js

import { executeQuery } from '../../../lib/database'; // Adjust path to your database functions
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { query } = body;

    // Validate request body
    if (!query) {
      return NextResponse.json({ 
        success: false, 
        error: 'Query parameter is required',
        data: []
      }, { status: 400 });
    }

    if (typeof query !== 'string') {
      return NextResponse.json({ 
        success: false, 
        error: 'Query must be a string',
        data: []
      }, { status: 400 });
    }

    if (query.trim().length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Query cannot be empty',
        data: []
      }, { status: 400 });
    }

    // Execute query using your existing function
    const result = executeQuery(query);
    
    // Your executeQuery function already returns the correct format:
    // { success: boolean, data: array, columns?: array, error?: string }
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: `Server error: ${error.message}`,
      data: []
    }, { status: 500 });
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ 
    success: false, 
    error: 'Method not allowed. Only POST requests are accepted.',
    data: []
  }, { status: 405 });
}