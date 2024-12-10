import { embed, embedMany } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { db } from '../db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { embeddings } from '@/lib/db/schema/embedding';
import {chunk} from 'llm-chunk'
// const embeddingModel = openai.embedding('text-embedding-ada-002');
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY
})
const embeddingModel = google.textEmbeddingModel('text-embedding-004');

const generateChunks = (input: string): string[] => {
  const c =  chunk(input, {
    minLength: 0,          // number of minimum characters into chunk
    maxLength: 1000,       // number of maximum characters into chunk
    splitter: "paragraph", // paragraph | sentence
    overlap: 0,            // number of overlap chracters
    delimiters: ""         // regex for base split method
  })
  console.log(c);
  return c
  
};

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => {
    console.log('embedings', e, i);
    
    return { content: chunks[i], embedding: e }
  });
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )})`;
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.5))
    .orderBy(t => desc(t.similarity))
    .limit(4);
  console.log('similarGuides', similarGuides);
  
  return similarGuides;
};