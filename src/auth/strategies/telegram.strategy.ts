import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-telegram';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramStrategy extends PassportStrategy(Strategy, 'telegram') {
  constructor(private configService: ConfigService) {
    const isTest = configService.get<string>('NODE_ENV') === 'test';

    const botToken =
      configService.get<string>('TELEGRAM_BOT_TOKEN') || (isTest ? 'test-bot-token' : undefined);
    const callbackURL =
      configService.get<string>('TELEGRAM_OAUTH_REDIRECT_URI') ||
      (isTest ? 'http://localhost/test/callback' : undefined);

    super({
      // passport-telegram internally extends OAuth2Strategy which requires clientID
      // Provide safe defaults in test environment so the Nest app can bootstrap in CI.
      clientID: configService.get<string>('TELEGRAM_OAUTH_CLIENT_ID') || botToken || 'test-client-id',
      clientSecret:
        configService.get<string>('TELEGRAM_OAUTH_CLIENT_SECRET') || botToken || 'test-client-secret',
      botToken,
      callbackURL,
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    profile: any,
    done: (err: any, user: any, info?: any) => void
  ) {
    try {
      const user = {
        telegramId: profile.id,
        username: profile.username,
        firstName: profile.name?.givenName,
        lastName: profile.name?.familyName,
        avatar: profile.photos?.[0]?.value,
      };

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}