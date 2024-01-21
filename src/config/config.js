import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({});

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    MONGO_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
export default {
  env: envVars.NODE_ENV,
  mongo_url: envVars.MONGO_URL,
  jwt_secret: envVars.JWT_SECRET,
};
