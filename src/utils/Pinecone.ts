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
}
