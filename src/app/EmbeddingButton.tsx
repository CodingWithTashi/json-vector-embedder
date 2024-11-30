"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { loadMonasteryData, InputData } from "./input-data";
import { Document } from "@langchain/core/documents";
import { TaskType } from "@google/generative-ai";

export default function EmbeddingButton() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "embedding" | "completed" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Improved document preparation function
  const prepareDocuments = (arrayData: InputData[]): Document[] => {
    return arrayData.map((item: InputData, index: number) => ({
      pageContent: `
        Name: ${item.entitle}
        Description: ${item.encontent}
        
        Location Details:
        - Street: ${item.street}
        - Address: ${item.address_2}
        - State: ${item.state}
        - Country: ${item.country}
        - Postal Code: ${item.postal_code}
        
        Contact Information:
        - Phone: ${item.phone}
        - Email: ${item.email}
        - Website: ${item.web}
        
        Additional Context:
        - Categories: ${item.categories}
        - Type: ${item.type}
      `.trim(),
      metadata: {
        index: index,
        source: `cta`,
        id: item.id,
        type: item.type,
        name: item.entitle,
        location: {
          street: item.street,
          address: item.address_2,
          state: item.state,
          country: item.country,
        },
        contact: {
          phone: item.phone,
          email: item.email,
          website: item.web,
        },
      },
    }));
  };

  const handleEmbedding = async () => {
    try {
      // Reset state
      setProgress(0);
      setStatus("embedding");
      setErrorMessage("");

      // Fetch JSON data
      const arrayData: InputData[] = await loadMonasteryData();

      // Update progress to 10%
      setProgress(10);

      // Initialize Pinecone client
      const pinecone = new Pinecone({
        apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
      });

      // Update progress to 30%
      setProgress(30);

      // Select Pinecone index
      const indexName = process.env.NEXT_PUBLIC_PINECONE_INDEX!;
      const index = pinecone.Index(indexName);

      // Initialize Gemini Embeddings with enhanced configuration
      const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
        modelName: "embedding-001",
        taskType: TaskType.RETRIEVAL_DOCUMENT, // Added task type for better embeddings
      });

      // Update progress to 50%
      setProgress(50);

      // Prepare documents with enhanced semantic content
      const docs = prepareDocuments(arrayData);

      // Update progress to 70%
      setProgress(70);

      // Create Pinecone vector store and upsert embeddings with namespace
      await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex: index,
        namespace: "monastery_data", // Added specific namespace
      });

      // Update progress to 100%
      setProgress(100);
      setStatus("completed");
    } catch (error) {
      console.error("Embedding error:", error);
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setProgress(0);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Button
        onClick={handleEmbedding}
        disabled={status === "embedding"}
        className="w-full"
      >
        {status === "embedding" ? "Embedding..." : "Start Embedding"}
      </Button>

      {status === "embedding" && (
        <Progress value={progress} className="w-full" />
      )}

      {status === "completed" && (
        <div className="text-green-600 text-center">
          Embedding completed successfully!
        </div>
      )}

      {status === "error" && (
        <div className="text-red-600 text-center">Error: {errorMessage}</div>
      )}
    </div>
  );
}
