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

export async function addSheetData(spreadsheetId: string,range:string,  data: SwimTestData) {
  const client = await getAuthClient();
  
  await sheets.spreadsheets.values.append({
  auth: client,
  spreadsheetId,
  range,
  valueInputOption: 'RAW',
  requestBody: {
    values: [[ data.lastName, data.firstName, data.bandColor, data.tester, data.testDate]],
  },
  });
}
