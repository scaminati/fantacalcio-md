# Stage 1: Build the application
FROM node:22.17.1-alpine as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Create the production image
FROM node:22.17.1-alpine as production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package* ./
COPY tsconfig* ./
RUN npm install --production

EXPOSE 8080
CMD ["node", "dist/standalone.js"]