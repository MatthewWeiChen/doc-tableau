import { google } from "googleapis";

const sheets = google.sheets("v4");

export class GoogleSheetsService {
  private auth;

  constructor() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
  }

  async getSheetData(spreadsheetId: string, range: string = "A1:Z1000") {
    try {
      const authClient = await this.auth.getClient();

      const response = await sheets.spreadsheets.values.get({
        auth: authClient,
        spreadsheetId,
        range,
      });

      const rows = response.data.values || [];

      if (rows.length === 0) {
        return { headers: [], data: [] };
      }

      const headers = rows[0];
      const data = rows.slice(1).map((row) => {
        const item: any = {};
        headers.forEach((header, index) => {
          item[header] = row[index] || "";
        });
        return item;
      });

      return { headers, data };
    } catch (error) {
      console.error("Error fetching sheet data:", error);
      throw new Error("Failed to fetch sheet data");
    }
  }

  async getSheetInfo(spreadsheetId: string) {
    try {
      const authClient = await this.auth.getClient();

      const response = await sheets.spreadsheets.get({
        auth: authClient,
        spreadsheetId,
      });

      return {
        title: response.data.properties?.title,
        sheets: response.data.sheets?.map((sheet) => ({
          id: sheet.properties?.sheetId,
          title: sheet.properties?.title,
        })),
      };
    } catch (error) {
      console.error("Error fetching sheet info:", error);
      throw new Error("Failed to fetch sheet info");
    }
  }
}
