import { pineconeIndex } from "@/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, StreamingTextResponse, Message } from "ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages.slice(-6);

    // Initialize Gemini Embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
      modelName: "embedding-001",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    });

    // Create embedding for the query (using last message)
    const queryText = messages[messages.length - 1].content;
    const embedding = await embeddings.embedQuery(queryText);

    // Query Pinecone vector database
    const vectorQueryResponse = await pineconeIndex
      .namespace("monastery_data")
      .query({
        vector: embedding,
        topK: 4,
        includeMetadata: true,
      });

    // Extract relevant documents
    const relevantDocs = vectorQueryResponse.matches.map(
      (match) => match.metadata?.text as string
    );

    // If no relevant documents found, return a specific response
    if (relevantDocs.length === 0) {
      return new Response(
        JSON.stringify({
          content:
            "I apologize, but I couldn't find any relevant information in my knowledge base to answer this query. Could you please ask something related to Tibetan monasteries, statues, or events?",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Construct system prompt with retrieved context
    const systemPrompt =
      "You are a specialized assistant with knowledge only about Tibetan monasteries, statues, and related events. " +
      "You MUST only respond based on the following retrieved contextual information. " +
      "If the user's query cannot be answered using these sources, politely explain that you cannot provide an answer. " +
      "Provide a concise, informative response staying strictly within the context:\n\n" +
      relevantDocs
        .map(
          (doc, index) =>
            `[Source ${index + 1}]\n${JSON.stringify(doc, null, 2)}`
        )
        .join("\n\n") +
      "\n\nImportant: Your response must be directly derived from these sources only.";

    // Initialize Gemini model
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string
    );
    const geminiModel = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
    });

    // Generate streaming response
    const chatStream = await geminiModel.generateContentStream({
      contents: [
        { role: "user", parts: [{ text: systemPrompt }] },
        ...messages.map((msg: Message) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        })),
      ],
    });

    const stream = GoogleGenerativeAIStream(chatStream);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
