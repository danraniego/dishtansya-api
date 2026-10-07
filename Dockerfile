# ------------------------
# ---- Build Stage ----
# ------------------------
FROM node:20.13-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript -> JavaScript
RUN npm run build


# ------------------------
# ---- Production Stage ----
# ------------------------
FROM node:20.13-alpine
WORKDIR /app

# Install SSL certificates (for AWS RDS and HTTPS requests)
RUN apk add --no-cache ca-certificates curl && \
    mkdir -p /usr/local/share/ca-certificates/rds && \
    curl -o /usr/local/share/ca-certificates/rds/global-bundle.pem https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem && \
    update-ca-certificates

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built app from builder stage

COPY --from=builder /app/dist ./dist

# Environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Expose app port
EXPOSE $PORT

# Run the app
CMD ["node", "dist/index.js"]