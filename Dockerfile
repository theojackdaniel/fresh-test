FROM node:6-alpine
COPY server.js /app/
ENV PORT 8080
CMD ["node", "/app/server.js"]
