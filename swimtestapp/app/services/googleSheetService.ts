import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { SwimTestData } from '../page';

const sheets = google.sheets('v4');

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT || '{}'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function getAuthClient(): Promise<JWT> {
  return await auth.getClient() as JWT;
}

export async function getSheetData(spreadsheetId: string, range: string) {
  const client = await getAuthClient();
  const response = await sheets.spreadsheets.values.get({
  auth: client,
  spreadsheetId,
  range,
  });
  return response.data.values;
}

export async function addSheetData(spreadsheetId: string, data: SwimTestData) {
  const client = await getAuthClient();
  
  // Get the last row number by querying the last cell in column C
  const currentData = await sheets.spreadsheets.values.get({
  auth: client,
  spreadsheetId,
  range: 'Sheet1!C:C',
  majorDimension: 'COLUMNS',
  });
  const nextRow = currentData.data.values ? currentData.data.values[0].length + 1 : 1;
  const range = `Sheet1!A${nextRow}:E${nextRow}`;

  await sheets.spreadsheets.values.update({
  auth: client,
  spreadsheetId,
  range,
  valueInputOption: 'RAW',
  requestBody: {
    values: [[ data.lastName, data.firstName, data.bandColor, data.tester, data.testDate]],
  },
  });
}
