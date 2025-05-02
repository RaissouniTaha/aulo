# Multi-stage build for Next.js government agency website

# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy project files
COPY . .

# Set environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_MAPBOX_TOKEN
ARG NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN
ENV NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=$NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only necessary files from the builder stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/next-i18next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/build ./build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set proper ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the port the app will run on
EXPOSE 3000

# Set environment variables for runtime
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Command to run the application
CMD ["node", "server.js"]