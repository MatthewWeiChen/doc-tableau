export class GoogleSheetsService {
  async getSheetData(spreadsheetId: string, range: string = "A1:Z1000") {
    console.log(`📊 Mock: Fetching data for sheet ${spreadsheetId}`);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return different mock data based on sheet ID
    if (spreadsheetId === "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms") {
      return this.getSalesData();
    } else if (spreadsheetId.includes("users")) {
      return this.getUserData();
    } else {
      return this.getFinancialData();
    }
  }

  private getSalesData() {
    return {
      headers: ["Product", "Sales", "Region", "Month", "Category", "Revenue"],
      data: [
        {
          Product: "MacBook Pro",
          Sales: "45",
          Region: "North America",
          Month: "January",
          Category: "Electronics",
          Revenue: "67500",
        },
        {
          Product: "iPhone 15",
          Sales: "120",
          Region: "North America",
          Month: "January",
          Category: "Electronics",
          Revenue: "119880",
        },
        {
          Product: "iPad Air",
          Sales: "78",
          Region: "Europe",
          Month: "January",
          Category: "Electronics",
          Revenue: "46800",
        },
        {
          Product: "AirPods Pro",
          Sales: "200",
          Region: "Asia",
          Month: "January",
          Category: "Accessories",
          Revenue: "49800",
        },
        {
          Product: "Apple Watch",
          Sales: "95",
          Region: "North America",
          Month: "February",
          Category: "Wearables",
          Revenue: "38000",
        },
        {
          Product: "MacBook Air",
          Sales: "67",
          Region: "Europe",
          Month: "February",
          Category: "Electronics",
          Revenue: "73370",
        },
        {
          Product: "iPhone 15 Pro",
          Sales: "89",
          Region: "Asia",
          Month: "February",
          Category: "Electronics",
          Revenue: "106780",
        },
        {
          Product: "Magic Keyboard",
          Sales: "156",
          Region: "North America",
          Month: "March",
          Category: "Accessories",
          Revenue: "46800",
        },
        {
          Product: "Studio Display",
          Sales: "23",
          Region: "Europe",
          Month: "March",
          Category: "Electronics",
          Revenue: "36570",
        },
        {
          Product: "Mac Studio",
          Sales: "34",
          Region: "Asia",
          Month: "March",
          Category: "Electronics",
          Revenue: "67660",
        },
        {
          Product: "AirTag",
          Sales: "445",
          Region: "North America",
          Month: "April",
          Category: "Accessories",
          Revenue: "13350",
        },
        {
          Product: "HomePod mini",
          Sales: "78",
          Region: "Europe",
          Month: "April",
          Category: "Smart Home",
          Revenue: "7800",
        },
        {
          Product: "Apple TV 4K",
          Sales: "56",
          Region: "Asia",
          Month: "April",
          Category: "Entertainment",
          Revenue: "11200",
        },
        {
          Product: "Magic Mouse",
          Sales: "134",
          Region: "North America",
          Month: "May",
          Category: "Accessories",
          Revenue: "10720",
        },
        {
          Product: "Mac Pro",
          Sales: "12",
          Region: "Europe",
          Month: "May",
          Category: "Electronics",
          Revenue: "71940",
        },
        {
          Product: "Pro Display XDR",
          Sales: "8",
          Region: "Asia",
          Month: "May",
          Category: "Electronics",
          Revenue: "39992",
        },
        {
          Product: "iPad Pro",
          Sales: "67",
          Region: "North America",
          Month: "June",
          Category: "Electronics",
          Revenue: "73370",
        },
        {
          Product: "Apple Pencil",
          Sales: "123",
          Region: "Europe",
          Month: "June",
          Category: "Accessories",
          Revenue: "15990",
        },
      ],
    };
  }

  private getUserData() {
    return {
      headers: [
        "User ID",
        "Name",
        "Email",
        "Registration Date",
        "Plan",
        "Monthly Revenue",
      ],
      data: [
        {
          "User ID": "U001",
          Name: "John Smith",
          Email: "john@example.com",
          "Registration Date": "2024-01-15",
          Plan: "Pro",
          "Monthly Revenue": "29",
        },
        {
          "User ID": "U002",
          Name: "Sarah Johnson",
          Email: "sarah@example.com",
          "Registration Date": "2024-01-18",
          Plan: "Basic",
          "Monthly Revenue": "9",
        },
        {
          "User ID": "U003",
          Name: "Mike Wilson",
          Email: "mike@example.com",
          "Registration Date": "2024-02-01",
          Plan: "Enterprise",
          "Monthly Revenue": "99",
        },
        {
          "User ID": "U004",
          Name: "Emma Davis",
          Email: "emma@example.com",
          "Registration Date": "2024-02-05",
          Plan: "Pro",
          "Monthly Revenue": "29",
        },
        {
          "User ID": "U005",
          Name: "Alex Brown",
          Email: "alex@example.com",
          "Registration Date": "2024-02-10",
          Plan: "Basic",
          "Monthly Revenue": "9",
        },
      ],
    };
  }

  private getFinancialData() {
    return {
      headers: [
        "Quarter",
        "Revenue",
        "Expenses",
        "Profit",
        "Growth Rate",
        "Department",
      ],
      data: [
        {
          Quarter: "Q1 2024",
          Revenue: "2847392",
          Expenses: "1823945",
          Profit: "1023447",
          "Growth Rate": "12.5%",
          Department: "Sales",
        },
        {
          Quarter: "Q1 2024",
          Revenue: "1456783",
          Expenses: "987654",
          Profit: "469129",
          "Growth Rate": "8.3%",
          Department: "Marketing",
        },
        {
          Quarter: "Q1 2024",
          Revenue: "756432",
          Expenses: "543210",
          Profit: "213222",
          "Growth Rate": "15.2%",
          Department: "Product",
        },
        {
          Quarter: "Q2 2024",
          Revenue: "3124567",
          Expenses: "1987432",
          Profit: "1137135",
          "Growth Rate": "18.7%",
          Department: "Sales",
        },
        {
          Quarter: "Q2 2024",
          Revenue: "1678945",
          Expenses: "1123456",
          Profit: "555489",
          "Growth Rate": "11.4%",
          Department: "Marketing",
        },
      ],
    };
  }
}
