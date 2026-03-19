import { LRUCache } from 'lru-cache';

// 1 Hour
const cacheDuration = 1000 * 60 * 60;

const memoryCacheClient = new LRUCache({
    max: 500,
    ttl: cacheDuration,
    ttlAutopurge: true,
});

export default class CacheHandler {
    async get(key) {
        return memoryCacheClient.get(key);
    }

    async set(key, data, ctx) {
        const value = {
            value: data,
            lastModified: Date.now(),
            tags: ctx.tags,
        };

        memoryCacheClient.set(key, value);
    }

    async revalidateTag(_tags) {
        // Nothing...
    }

    resetRequestCache() {
        // Nothing...
    }
}
