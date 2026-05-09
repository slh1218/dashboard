import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { initialize } from "./db/store.js";
import indicatorsRouter  from "./routes/indicators.js";
import frameworksRouter  from "./routes/frameworks.js";
import performanceRouter from "./routes/performance.js";
import importRouter      from "./routes/import.js";
import adminRouter       from "./routes/admin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

initialize();

app.use(express.json({ limit: "256kb" }));
app.use(express.static(path.join(__dirname, "public")));
// Expose sample CSV (and any future read-only assets) for download from /data
app.use("/data", express.static(path.join(__dirname, "data")));

app.use("/api/indicators",  indicatorsRouter);
app.use("/api/frameworks",  frameworksRouter);
app.use("/api/performance", performanceRouter);
app.use("/api/import",      importRouter);
app.use("/api/admin",       adminRouter);

// Last-resort error handler — keeps stack traces out of the response.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`CMSN Dashboard running at http://localhost:${PORT}`);
});
