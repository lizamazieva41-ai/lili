/**
 * Type declarations for passport-telegram module
 * This is a stub to satisfy TypeScript compilation
 */
declare module 'passport-telegram' {
  import { Strategy as PassportStrategy } from 'passport';

  interface TelegramStrategyOptions {
    botToken: string | undefined;
    callbackURL: string | undefined;
    passReqToCallback?: boolean;
  }

  interface TelegramProfile {
    id: number;
    username?: string;
    name?: {
      givenName?: string;
      familyName?: string;
    };
    photos?: Array<{ value: string }>;
  }

  type VerifyCallback = (err: Error | null, user: unknown, info?: unknown) => void;
  type VerifyFunction = (
    req: unknown,
    profile: TelegramProfile,
    done: VerifyCallback,
  ) => void | Promise<void>;

  export class Strategy extends PassportStrategy {
    constructor(options: TelegramStrategyOptions, verify: VerifyFunction);
  }

  export default Strategy;
}
