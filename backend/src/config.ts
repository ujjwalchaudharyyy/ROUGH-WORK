import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'displaceos_emergency_jwt_secret_key_prod_2026',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  aiProvider: process.env.AI_PROVIDER || 'rule_engine',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
};
