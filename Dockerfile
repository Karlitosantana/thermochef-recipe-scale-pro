# Use the official Node.js 18 image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application with dummy env vars
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dummy
ENV CLERK_SECRET_KEY=sk_test_dummy
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_dummy
ENV STRIPE_SECRET_KEY=sk_test_dummy
ENV NEXT_PUBLIC_APP_URL=https://thermochef.up.railway.app

RUN npm run build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start"]