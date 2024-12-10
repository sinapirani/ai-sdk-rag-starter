'use server';

import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from '@/lib/db/schema/resources';
import { db } from '../db';
import { generateEmbeddings } from '../ai/embedding';
import { embeddings as embeddingsTable } from '@/lib/db/schema/embedding';

export const createResource = async (input: NewResourceParams) => {
  try {
    const { content } = insertResourceSchema.parse(input);

    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();

    try {
      const embeddings = await generateEmbeddings(content);
      
      console.log('Generated Embeddings:', embeddings);
      
      if (embeddings.length === 0) {
        console.warn('No embeddings generated for the resource');
        return 'No embeddings were generated.';
      }

      const embeddingValues = embeddings.map(embedding => ({
        resourceId: resource.id,
        ...embedding,
      }));

      console.log('Embedding Values:', embeddingValues);

      const insertResult = await db.insert(embeddingsTable).values(embeddingValues);
      
      console.log('Insert Result:', insertResult);

      return 'Resource successfully created and embedded.';
    } catch (embeddingError) {
      console.error('Embedding Generation Error:', embeddingError);
      return `Embedding error: ${embeddingError instanceof Error ? embeddingError.message : 'Unknown error'}`;
    }
  } catch (error) {
    console.error('Resource Creation Error:', error);
    return error instanceof Error && error.message.length > 0
      ? error.message
      : 'Error, please try again.';
  }
};