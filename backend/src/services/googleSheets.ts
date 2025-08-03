import { google } from "googleapis";

const sheets = google.sheets("v4");

export class GoogleSheetsService {
  private auth: any;

  constructor() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
  }

  async getSheetInfo(spreadsheetId: string): Promise<{
    title: string;
    sheets: Array<{ id: number; title: string; index: number }>;
  }> {
    try {
      console.log(`📊 Getting real sheet info for ${spreadsheetId}`);

      const authClient = await this.auth.getClient();

      const response = await sheets.spreadsheets.get({
        auth: authClient,
        spreadsheetId,
        fields: "properties.title,sheets.properties(sheetId,title,index)",
      });

      const spreadsheet = response.data;

      return {
        title: spreadsheet.properties?.title || "Unknown Spreadsheet",
        sheets: (spreadsheet.sheets || []).map((sheet: any) => ({
          id: sheet.properties?.sheetId || 0,
          title: sheet.properties?.title || "Untitled",
          index: sheet.properties?.index || 0,
        })),
      };
    } catch (error) {
      console.error("Error fetching sheet info:", error);
      throw new Error(
        `Failed to fetch sheet info: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getSheetData(
    spreadsheetId: string,
    sheetName: string = "",
    range: string = "A1:Z1000"
  ): Promise<{ headers: string[]; data: any[] }> {
    try {
      console.log(
        `📊 Getting real data for sheet "${sheetName}" in ${spreadsheetId}`
      );

      const authClient = await this.auth.getClient();

      // If sheetName is provided, use it in the range
      const fullRange = sheetName ? `'${sheetName}'!${range}` : range;

      const response = await sheets.spreadsheets.values.get({
        auth: authClient,
        spreadsheetId,
        range: fullRange,
        valueRenderOption: "FORMATTED_VALUE",
        dateTimeRenderOption: "FORMATTED_STRING",
      });

      const rows = response.data.values || [];

      if (rows.length === 0) {
        return { headers: [], data: [] };
      }

      // First row is headers
      const headers = rows[0].map((header: any) => String(header || "").trim());

      // Remaining rows are data
      const data = rows
        .slice(1)
        .map((row: any[]) => {
          const item: any = {};
          headers.forEach((header: string, colIndex: number) => {
            // Handle missing columns in some rows
            const cellValue = row[colIndex];
            item[header] =
              cellValue !== undefined ? String(cellValue).trim() : "";
          });
          return item;
        })
        .filter((row: any) => {
          // Filter out completely empty rows
          return Object.values(row).some(
            (value: any) => String(value).trim() !== ""
          );
        });

      console.log(
        `✅ Successfully fetched ${data.length} rows with ${headers.length} columns`
      );

      return { headers, data };
    } catch (error) {
      console.error("Error fetching sheet data:", error);

      // More specific error messages
      if (error instanceof Error) {
        if (error.message.includes("Unable to parse range")) {
          throw new Error(`Invalid range or sheet name: "${sheetName}"`);
        } else if (error.message.includes("Requested entity was not found")) {
          throw new Error("Spreadsheet not found or not accessible");
        } else if (
          error.message.includes("The caller does not have permission")
        ) {
          throw new Error(
            "Permission denied. Make sure the service account has access to the spreadsheet."
          );
        }
      }

      throw new Error(
        `Failed to fetch sheet data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async testConnection(spreadsheetId: string): Promise<boolean> {
    try {
      console.log(`🧪 Testing connection to ${spreadsheetId}`);

      const authClient = await this.auth.getClient();

      const response = await sheets.spreadsheets.get({
        auth: authClient,
        spreadsheetId,
        fields: "properties.title",
      });

      const title = response.data.properties?.title;
      console.log(`✅ Connection successful to: ${title}`);
      return true;
    } catch (error) {
      console.error("❌ Connection test failed:", error);
      return false;
    }
  }
}
