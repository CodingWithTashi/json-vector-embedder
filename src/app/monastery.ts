export interface InputData {
  id: number;
  tbtitle: string; // Tibetan title
  entitle: string; // English title
  tbcontent: string; // Tibetan content
  encontent: string; // English content
  categories: string; // Categories
  street: string; // Street address
  address_2: string; // Additional address line
  state: string; // State/Province
  postal_code: string; // Postal code
  country: string; // Country
  phone: string; // Phone number
  email: string; // Email address
  web: string; // Website URL
  type: string; // Type of institution (e.g., monastery)
}
import inpuDataList from "../../example.data.json";

export async function loadMonasteryData(): Promise<InputData[]> {
  try {
    if (inpuDataList.length === 0) {
      throw new Error("No data found in the JSON file");
    } else if (inpuDataList.length == 1 && inpuDataList[0].type === "test") {
      throw new Error("Add actual json data to example.data.json");
    } else {
      return inpuDataList as InputData[];
    }
  } catch (error) {
    console.error("Error loading or parsing JSON file:", error);
    throw error;
  }
}
