import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { Document } from "langchain/document";

export class Pinecone {
  private client: PineconeClient = new PineconeClient();

  public init = async () => {
    await this.client.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? "",
      apiKey: process.env.PINECONE_API_KEY ?? "",
    });
  };

  public storeDocuments = async (
    documents: Document<Record<string, any>>[]
  ) => {
    const pineconeIndex = this.client.Index(
      process.env.PINECONE_INDEX_NAME ?? ""
    );
    const embeddings = new OpenAIEmbeddings();
    await PineconeStore.fromDocuments(documents, embeddings, {
      namespace: process.env.PINECONE_NAMESPACE,
      pineconeIndex,
      textKey: "text",
    });
  };

  private getVectorStore = async () => {
    const pineconeIndex = this.client.Index(
      process.env.PINECONE_INDEX_NAME ?? ""
    );
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-ada-002",
    });
    return PineconeStore.fromExistingIndex(embeddings, {
      namespace: process.env.PINECONE_NAMESPACE,
      pineconeIndex,
      textKey: "text",
    });
  };

  public findSimilarVectors = async (prompt: string) => {
    const vectorStore = await this.getVectorStore();
    const similarties = await vectorStore.similaritySearch(prompt);
    const similarVectors = similarties
      .map((similarity) => similarity.pageContent)
      .join("");
    return similarVectors;
  };
}
