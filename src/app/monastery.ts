export interface Monastery {
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
import monasteryData from "../../data.json";

export async function loadMonasteryData(): Promise<Monastery[]> {
  try {
    return monasteryData as Monastery[];
  } catch (error) {
    console.error("Error loading or parsing JSON file:", error);
    throw error;
  }
}
