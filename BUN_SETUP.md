# Running with Bun

This project is configured to use **Bun** as the runtime. Bun provides faster performance and better developer experience.

## Quick Start

1. **Install Bun** (if not already installed):
   - Visit [bun.sh](https://bun.sh) and follow installation instructions
   - Or use: `curl -fsSL https://bun.sh/install | bash`

2. **Install all dependencies from root**:
   ```bash
   bun run install:all
   ```

3. **Set up environment files**:
   - Create `api/.env` with your MongoDB connection and JWT secret
   - Create `frontend/.env` (optional) with API URL

4. **Start both servers concurrently**:
   ```bash
   bun run dev
   ```

That's it! Both backend and frontend will start automatically.

## What's Different with Bun?

- **Faster**: Bun is significantly faster than Node.js
- **Built-in watch mode**: No need for nodemon - use `bun --watch`
- **Native TypeScript support**: Works out of the box
- **Better package management**: `bun install` is faster than npm/yarn

## Scripts Available

From the **root directory**:
- `bun run dev` - Start both API and frontend concurrently
- `bun run install:all` - Install dependencies for root, api, and frontend
- `bun run build` - Build the frontend for production
- `bun run dev:api` - Start only the API server
- `bun run dev:frontend` - Start only the frontend server
- `bun run start:api` - Start API in production mode
- `bun run start:frontend` - Preview frontend build

## Backend (API)

The API uses Bun's `--watch` flag for hot reload:
```bash
cd api
bun --watch server.js
```

Or use the npm script:
```bash
bun run dev
```

## Frontend

The frontend uses Vite, which works seamlessly with Bun:
```bash
cd frontend
bun run dev
```

## Troubleshooting

### Bun not found
- Make sure Bun is installed: `bun --version`
- Install from [bun.sh](https://bun.sh/docs/installation)

### Port conflicts
- Change ports in `api/.env` (PORT) and `frontend/vite.config.js` if needed

### MongoDB connection issues
- Ensure MongoDB is running locally or use MongoDB Atlas
- Check your `MONGODB_URI` in `api/.env`

## Benefits of Using Bun

1. **Performance**: Up to 3x faster than Node.js for many operations
2. **Built-in tools**: No need for external tools like nodemon
3. **Package manager**: Faster dependency installation
4. **TypeScript**: Native support without additional configuration
5. **Compatibility**: Works with most Node.js packages and APIs

## Switching Back to Node.js

If you need to use Node.js instead:
- Change `api/package.json` scripts to use `node` and `nodemon`
- Use `npm` or `yarn` instead of `bun`
- Update the root `package.json` scripts accordingly

However, Bun is recommended for the best experience!

