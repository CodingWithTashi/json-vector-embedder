# Vector Embedding Project with JSON and Pinecone

## Overview
This project demonstrates how to perform vector embeddings on JSON data using a Language Model (LLM), store the embeddings in Pinecone, and enable semantic search and retrieval.

## Prerequisites
- Python 3.8+
- Pinecone account
- OpenAI API key (or alternative LLM provider)
- Required Python libraries:
  - `pinecone-client`
  - `gemini`
  - `node`

## Installation

1. Clone the repository:
```bash
git clone https://github.com/CodingWithTashi/json-vector-embedder.git
cd json-vector-embedder
```

2. Install dependencies:
```bash
npm i
```

3. Set up environment variables:
```bash
NEXT_PUBLIC_PINECONE_API_KEY=key
NEXT_PUBLIC_PINECONE_INDEX=key
NEXT_PUBLIC_GOOGLE_API_KEY=key
```

## Step-by-Step Process

### 1. Import JSON Data
```python
import json

import inpuDataList from "../../example.data.json";

export async function loadInputData(): Promise<InputData[]> {
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
```

### 2. Save Embeddings in Pinecone
```
await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex: index,
        namespace: "monastery_data", // Added specific namespace
      });
```

### 3. Query with LLM
```
const vectorQueryResponse = await pineconeIndex
      .namespace("monastery_data")
      .query({
        vector: embedding,
        topK: 4,
        includeMetadata: true,
      });
```

## Contributing
Contributions are welcome! Please submit a pull request or open an issue.


## Acknowledgements
- Pinecone
- OpenAI/Gemini
```
