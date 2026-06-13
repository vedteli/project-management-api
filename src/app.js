import express from "express";
import cors from "cors";
import healthCheckRouter from "./routes/healthcheck.routes.js";

const app = express();

// basic configuration
app.use(express.json({ limit:"16kb"} ));
app.use(express.urlencoded({ extended: true, limit:"16kb" }));
app.use(express.static("public"));


// cors configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || "https://localhost:8000",
  credentials: true,
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"]
}))

// routes configuration
app.use("/api/v1/healthcheck", healthCheckRouter)

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/about', (req, res) => {
    res.send("<h1 style='color: cyan'> About Us Page </h1>");
})

export default app;