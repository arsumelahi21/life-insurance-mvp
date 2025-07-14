import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after a minute.",
});


const app = express();
app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(limiter);

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'lifeuser',
  password: process.env.DB_PASSWORD || 'lifepass',
  database: process.env.DB_NAME || 'lifedb',
  port: Number(process.env.DB_PORT) || 5555,
});

pool.query(`
  CREATE TABLE IF NOT EXISTS user_submissions (
    id SERIAL PRIMARY KEY,
    age INTEGER NOT NULL,
    income INTEGER NOT NULL,
    dependents INTEGER NOT NULL,
    risk_tolerance VARCHAR(10) NOT NULL,
    recommendation TEXT NOT NULL,
    explanation TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

type RecommendationInput = {
  age: number;
  income: number;
  dependents: number;
  riskTolerance: "Low" | "Medium" | "High";
};

function getRecommendation(input: RecommendationInput) {
  let recommendation = "";
  let explanation = "";

  if (input.age < 40 && input.riskTolerance === "High") {
    recommendation = `Term Life – $${input.income * 10} for 20 years`;
    explanation = "You're young with high risk tolerance, so a high-value, longer term life policy fits you.";
  } else if (input.age < 40) {
    recommendation = `Term Life – $${input.income * 7} for 20 years`;
    explanation = "You're young; a standard term life plan provides affordable protection for your family.";
  } else if (input.riskTolerance === "Low") {
    recommendation = `Whole Life – $${input.income * 5}`;
    explanation = "You prefer lower risk and steady protection, so whole life insurance fits your needs.";
  } else {
    recommendation = `Term Life – $${input.income * 5} for 10 years`;
    explanation = "A shorter term life plan fits your profile for flexibility and protection.";
  }

  // Add logic for dependents:
  if (input.dependents > 2) {
    recommendation += " (Increased coverage due to multiple dependents)";
  }

  return { recommendation, explanation };
}

app.post('/recommendation',limiter, async (req, res) => {
  try {
    const { age, income, dependents, riskTolerance } = req.body;

    // Validation
    if (
      typeof age !== 'number' ||
      typeof income !== 'number' ||
      typeof dependents !== 'number' ||
      !["Low", "Medium", "High"].includes(riskTolerance)
    ) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const { recommendation, explanation } = getRecommendation({
      age,
      income,
      dependents,
      riskTolerance,
    });

    // Store in DB
    await pool.query(
      `INSERT INTO user_submissions (age, income, dependents, risk_tolerance, recommendation, explanation) VALUES ($1,$2,$3,$4,$5,$6)`,
      [age, income, dependents, riskTolerance, recommendation, explanation]
    );

    return res.json({ recommendation, explanation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
