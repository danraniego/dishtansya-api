import "./database/associations";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { apiLimiter } from "@config/limiter.config";
import { corsOptions } from "@config/cors.config";
import { appRoutes } from "routes";
import { HttpResponse } from "@http/http.response";

dotenv.config();

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);
app.use(compression());

app.get("/health", (_req, res) => {
	res.status(200).json({ status: "ok" });
});

app.use('/', appRoutes);

// 404 Error
app.use((_req: Request, res: Response) => {
	HttpResponse.notFound(res);
});

// Error Handler
app.use((err: Error & { status?: number, type?: string }, _req: Request, res: Response, _next: NextFunction) => {
	if (err.type === 'entity.parse.failed') {
		return HttpResponse.badRequest(res, "Malformed JSON body.");
	}

	HttpResponse.serverError(res, "Something went wrong!", err);
});

export default app;
