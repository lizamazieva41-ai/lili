import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/config/prisma.service';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'DATABASE_URL') return 'postgresql://user:pass@localhost:5432/db';
              if (key === 'NODE_ENV') return 'development';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should extend PrismaClient', () => {
    expect(service).toBeInstanceOf(PrismaClient);
  });

  describe('onModuleInit', () => {
    it('should connect to database', async () => {
      const connectSpy = jest.spyOn(service, '$connect').mockResolvedValue(undefined as any);
      jest
        .spyOn(service, '$queryRaw')
        .mockResolvedValue([{ version: 'PostgreSQL 15.0' }] as any);
      
      await service.onModuleInit();

      expect(connectSpy).toHaveBeenCalled();
    });

    it('should handle connection errors', async () => {
      const connectSpy = jest
        .spyOn(service, '$connect')
        .mockRejectedValue(new Error('Connection failed'));

      await expect(service.onModuleInit()).rejects.toThrow('Connection failed');

      expect(connectSpy).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect from database', async () => {
      const disconnectSpy = jest.spyOn(service, '$disconnect').mockResolvedValue(undefined as any);
      
      await service.onModuleDestroy();

      expect(disconnectSpy).toHaveBeenCalled();
    });

    it('should handle disconnection errors', async () => {
      const disconnectSpy = jest
        .spyOn(service, '$disconnect')
        .mockRejectedValue(new Error('Disconnection failed'));

      await expect(service.onModuleDestroy()).resolves.toBeUndefined();

      expect(disconnectSpy).toHaveBeenCalled();
    });
  });

  describe('database operations', () => {
    it('should have access to PrismaClient methods', () => {
      expect(service.$connect).toBeDefined();
      expect(service.$disconnect).toBeDefined();
      expect(service.$transaction).toBeDefined();
      expect(service.$executeRaw).toBeDefined();
      expect(service.$queryRaw).toBeDefined();
    });

    it('should have access to Prisma models', () => {
      expect(service.user).toBeDefined();
      expect(service.license).toBeDefined();
      expect(service.apiKey).toBeDefined();
      expect(service.telegramAccount).toBeDefined();
      expect(service.campaign).toBeDefined();
      expect(service.message).toBeDefined();
      expect(service.proxy).toBeDefined();
      expect(service.job).toBeDefined();
      expect(service.webhook).toBeDefined();
      expect(service.webhookDelivery).toBeDefined();
    });
  });
});