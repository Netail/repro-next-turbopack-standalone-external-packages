FROM node:24-trixie-slim

ENV NODE_ENV=production

RUN addgroup --system --gid 999 nodejs && \
    adduser --system --uid 999 nextjs

COPY --chown=nextjs:nodejs /.next/standalone/out ./
COPY --chown=nextjs:nodejs /.next/static ./apps/test-app/.next/static
# COPY --chown=nextjs:nodejs /.next/node_modules ./apps/test-app/node_modules

# Set the correct permission for pre-render cache
RUN chown -R nextjs:nodejs ./apps/test-app/.next

USER nextjs

EXPOSE 8080

ENV PORT=8080

ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/app/api-reference/config/next-config-js/output
CMD node ./apps/test-app/server.js
