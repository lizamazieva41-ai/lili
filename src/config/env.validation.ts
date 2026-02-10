import { plainToInstance } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsUrl,
  ValidateIf,
  validateSync,
  Min,
  Max,
} from 'class-validator';

enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

enum LogLevel {
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Verbose = 'verbose',
}

class EnvironmentVariables {
  // Application
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV?: NodeEnv = NodeEnv.Development;

  @IsNumber()
  @Min(1)
  @Max(65535)
  @IsOptional()
  PORT?: number = 3000;

  @IsString()
  @IsOptional()
  CORS_ORIGIN?: string = '*';

  // Database
  @IsString()
  @ValidateIf((o) => !o.DB_HOST || !o.DB_NAME)
  DATABASE_URL?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.DATABASE_URL)
  DB_HOST?: string;

  @IsNumber()
  @IsOptional()
  @ValidateIf((o) => !o.DATABASE_URL)
  DB_PORT?: number;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.DATABASE_URL)
  DB_NAME?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.DATABASE_URL)
  DB_USER?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.DATABASE_URL)
  DB_PASSWORD?: string;

  // Redis
  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.REDIS_HOST)
  REDIS_URL?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.REDIS_URL)
  REDIS_HOST?: string;

  @IsNumber()
  @IsOptional()
  @ValidateIf((o) => !o.REDIS_URL)
  REDIS_PORT?: number;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD?: string;

  @IsString()
  @IsOptional()
  REDIS_DUMP_PATH?: string;

  // JWT
  @ValidateIf((o) => o.NODE_ENV !== NodeEnv.Test)
  @IsString()
  @IsOptional()
  JWT_SECRET?: string = 'test-jwt-secret';

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN?: string = '24h';

  @IsString()
  @IsOptional()
  JWT_REFRESH_SECRET?: string;

  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRES_IN?: string = '7d';

  // Telegram
  @ValidateIf((o) => o.NODE_ENV !== NodeEnv.Test)
  @IsString()
  @IsOptional()
  TELEGRAM_BOT_TOKEN?: string = 'test-telegram-bot-token';

  @IsUrl({ require_tld: false })
  @IsOptional()
  TELEGRAM_OAUTH_REDIRECT_URI?: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  TELEGRAM_OAUTH_ORIGIN?: string;

  // Logging
  @IsEnum(LogLevel)
  @IsOptional()
  LOG_LEVEL?: LogLevel = LogLevel.Info;

  // Backup
  @IsString()
  @IsOptional()
  BACKUP_DIR?: string = './backups';
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => {
        const constraints = Object.values(error.constraints || {}).join(', ');
        return `${error.property}: ${constraints}`;
      })
      .join('\n');

    throw new Error(
      `Environment validation failed:\n${errorMessages}\n\nPlease check your .env file and ensure all required variables are set.`,
    );
  }

  return validatedConfig;
}
