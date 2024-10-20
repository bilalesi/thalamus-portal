import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { drz, artifacts } from '@/api/db'
import { eq, and } from 'drizzle-orm';

export const server = {
    getArtifacts: defineAction({
        input: z.object({
            self: z.string(),
            url: z.string(),
        }),
        handler: async (input) => {
            const art = await drz.select().from(artifacts).where(and(
                eq(artifacts.self, input.self),
                eq(artifacts.url, input.url)
            )).limit(1).get();
            return art;
        }
    })
}