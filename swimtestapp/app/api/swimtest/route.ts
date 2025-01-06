import { NextResponse } from 'next/server';
import { getSheetData, addSheetData } from '../../services/googleSheetService';


const SPREADSHEET_ID = process.env.SPREADSHEET_ID || 'your-spreadsheet-id';
const RANGE = process.env.SPREADSHEET_GET_RANGE || 'Sheet1!A:E';


export async function GET() {
  const data = await getSheetData(SPREADSHEET_ID, RANGE);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
  await addSheetData(SPREADSHEET_ID, body);
  } catch (error) {
  console.error(error);
  return NextResponse.json({ message: 'Failed to add data' }, { status: 500 });
  }
  return NextResponse.json({ message: 'Data added successfully' });
}