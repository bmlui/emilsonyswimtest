import { NextResponse } from 'next/server';
import { getSheetData, addSheetData } from '../../services/googleSheetService';

const testData = [
  { firstName: 'Alice', lastName: 'Smith', bandColor: 'Red', tester: 'John Doe', testDate: '2023-10-01', fullName: 'Alice Smith' },
  { firstName: 'Bob', lastName: 'Johnson', bandColor: 'Green', tester: 'Jane Doe', testDate: '2023-10-02', fullName: 'Bob Johnson' },
  { firstName: 'Charlie', lastName: 'Brown', bandColor: 'Green', tester: 'Jim Beam', testDate: '2023-10-03', fullName: 'Charlie Brown' },
  { firstName: 'David', lastName: 'Williams', bandColor: 'Yellow', tester: 'Jack Daniels', testDate: '2023-10-04', fullName: 'David Williams' },
  { firstName: 'Eve', lastName: 'Davis', bandColor: 'Red', tester: 'Johnny Walker', testDate: '2023-10-05', fullName: 'Eve Davis' },
];

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || 'your-spreadsheet-id';
const RANGE = process.env.SPREADSHEET_GET_RANGE || 'Sheet1!A:E';


export async function GET() {
  const data = await getSheetData(SPREADSHEET_ID, RANGE);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  await addSheetData(SPREADSHEET_ID, body);
  return NextResponse.json({ message: 'Data added successfully', data: testData });
}