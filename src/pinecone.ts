import { Pinecone } from "@pinecone-database/pinecone";
const apiKey = process.env.NEXT_PUBLIC_PINECONE_API_KEY;
if (!apiKey)
  throw new Error("No Pinecone API key found in environment variables");
const pinecone = new Pinecone({
  apiKey: apiKey,
});
export default pinecone;
export const pineconeIndex = pinecone.index(
  process.env.NEXT_PUBLIC_PINECONE_INDEX!
);
