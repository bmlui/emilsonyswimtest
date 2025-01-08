import { NextResponse } from 'next/server';
import { getSheetData, addSheetData } from '../../services/googleSheetService';

import redisClient from '../../services/redis';


const SPREADSHEET_ID = process.env.SPREADSHEET_ID || 'your-spreadsheet-id';
const RANGE = process.env.SPREADSHEET_RANGE || 'Sheet1!A:E';
const cacheKey = 'sheetData';


export async function GET() {
  // Try to get data from Redis cache
  const data = await redisClient.getList(cacheKey);
  if (data && data.length > 0) {
    const parsedData = data.map((item: string) => JSON.parse(item));
    // Return the parsed data as JSON
    parsedData[0].push('used redis');
    return NextResponse.json(parsedData);
  }
  // If not in cache, fetch from Google Sheets
  const sheetData = await getSheetData(SPREADSHEET_ID, RANGE);
  
  // Store the fetched data in Redis cache
  if (sheetData) {
    await redisClient.setList(cacheKey, sheetData.map((row: string[]) => JSON.stringify(row)));
  }

  return NextResponse.json(sheetData);
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    await addSheetData(SPREADSHEET_ID, RANGE, body);

    // Push the new data to the Redis list after adding it to the sheet
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to add data' }, { status: 500 });
  }
  try {
    const redisPushData = [body.firstName, body.lastName, body.bandColor, body.tester, body.testDate];
  await redisClient.pushToEnd(cacheKey, JSON.stringify(redisPushData));
  } catch (error) { 
    console.error(error);
  }

  return NextResponse.json({ message: 'Data added successfully' });
}