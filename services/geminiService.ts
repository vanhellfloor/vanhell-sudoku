import { GoogleGenAI } from "@google/genai";
import { Grid } from '../types';

export const getGeminiHint = async (grid: Grid): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey });
    
    // Construct a simple representation of the board for the AI
    const boardString = grid.map(row => 
      row.map(cell => cell.value === 0 ? '.' : cell.value).join(' ')
    ).join('\n');

    const prompt = `
      You are a friendly and encouraging Sudoku Coach.
      Here is the current state of a 9x9 Sudoku board (dots '.' represent empty cells):

      ${boardString}

      Identify ONE logical next step for the player. Look for easy wins first like "Naked Singles" or a row/column that is almost full.
      
      Provide the hint in this format:
      "Look at row [X], column [Y]. Consider what number is missing there..."
      
      Then briefly explain the logic (e.g., "The number 5 can't go anywhere else in this block because...").
      
      Keep it short (max 2 sentences), encouraging, and helpful. Do not just give the answer immediately, guide them.
      Langue: Français (French). Be fun and modern.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Continuez ! Vous vous débrouillez très bien.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "L'IA Coach fait une petite sieste. Essayez de vérifier vos lignes et colonnes !";
  }
};