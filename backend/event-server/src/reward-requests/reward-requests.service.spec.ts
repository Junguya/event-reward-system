//* 유저가 조건을 충족했을 때 보상 요청 생성 테스트

import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Event } from '../events/schemas/event.schema';
import { Reward } from '../rewards/schemas/reward.schema';
import { UserStatsService } from '../user-stats/user-stats.service';
import { RewardRequestsService } from './reward-requests.service';
import { RewardRequest } from './schemas/reward-request.schema';

describe('RewardRequestsService - requestReward()', () => {
  let service: RewardRequestsService;
  let rewardRequestModel: Model<RewardRequest>;
  let eventModel: Model<Event>;
  let rewardModel: Model<Reward>;
  let userStatsService: UserStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardRequestsService,
        {
          provide: getModelToken('RewardRequest'),
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken('Event'),
          useValue: {
            findOne: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue({
                _id: 'eventId',
                status: 'ACTIVE',
                deletedAt: null,
                condition: { type: 'LOGIN_DAYS', value: 3 },
              }),
            }),
          },
        },
        {
          provide: getModelToken('Reward'),
          useValue: {
            findOne: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue({
                _id: 'rewardId',
                type: 'POINT',
                deletedAt: null,
              }),
            }),
          },
        },
        {
          provide: UserStatsService,
          useValue: {
            getStats: jest.fn().mockResolvedValue({
              loginDays: 5,
              point: 0,
            }),
          },
        },
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RewardRequestsService>(RewardRequestsService);
    rewardRequestModel = module.get(getModelToken('RewardRequest'));
    eventModel = module.get(getModelToken('Event'));
    rewardModel = module.get(getModelToken('Reward'));
    userStatsService = module.get<UserStatsService>(UserStatsService);
  });

  it('should create a reward request when user meets the condition', async () => {
    const createRewardRequestReq = {
      eventId: 'eventId',
      rewardId: 'rewardId',
    };

    const userTokenPayload = {
      _id: 'userId',
    };

    const mockCreatedRewardRequest = {
      _id: 'reqId',
      event: 'eventId',
      reward: 'rewardId',
      user: 'userId',
      status: 'SUCCESS',
      createdAt: new Date(),
    };

    jest.spyOn(rewardRequestModel, 'create').mockResolvedValue(mockCreatedRewardRequest as any);

    const result = await service.requestReward(createRewardRequestReq, userTokenPayload);

    expect(result).toBeDefined();
    expect(result.id).toEqual('reqId');
    expect(result.status).toEqual('SUCCESS');
  });
});
