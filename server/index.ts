import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeTelegramBot, cleanupExistingBot } from "./telegram";
import { SimpleSwapClient } from "./simpleswap";
import { domainProcessor } from "./domain-processor";
import { PaymentMonitor } from "./payment-monitor";
import { giftCardProcessor } from "./giftcard-processor";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve attached_assets as static files for gift card images, etc.
app.use('/assets', express.static('attached_assets'));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Cleanup any existing Telegram bot instances before starting server
  await cleanupExistingBot();
  
  // Initialize exchange client if API key is available
  let simpleSwapClient: SimpleSwapClient | null = null;
  const simpleSwapApiKey = process.env.SIMPLESWAP_API_KEY;
  if (simpleSwapApiKey) {
    simpleSwapClient = new SimpleSwapClient(simpleSwapApiKey);
    console.log("✅ Exchange client initialized");
  } else {
    console.log("⚠️ SIMPLESWAP_API_KEY not set - swap functionality disabled");
  }

  const server = await registerRoutes(app, simpleSwapClient);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
  }, async () => {
    log(`serving on port ${port}`);
    
    // Initialize Telegram bot ONLY after server is confirmed running
    try {
      const telegramBot = await initializeTelegramBot(simpleSwapClient);
      if (telegramBot) {
        console.log("✅ Telegram bot ready - users can interact via @zektaswapbot");
      }
    } catch (error) {
      console.error("⚠️ Failed to initialize Telegram bot:", error);
    }

    // Start domain processor for automatic domain registration
    domainProcessor.start();
    
    // Start payment monitor for automatic payment detection
    const paymentMonitor = new PaymentMonitor(simpleSwapClient);
    paymentMonitor.start();
    
    // Start gift card processor for automatic gift card fulfillment
    giftCardProcessor.start();
  });
})();
