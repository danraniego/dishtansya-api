import app from "./app";
import http from "http";
import { logger } from "@utils/logger.util";
import { connectDatabases } from "@database";

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOSTNAME || "0.0.0.0";

const server = http.createServer(app);

server.listen(Number(PORT), HOST, async () => {
	logger.info(`Server is running on http://${HOST}:${PORT}`);
	await connectDatabases();
});
