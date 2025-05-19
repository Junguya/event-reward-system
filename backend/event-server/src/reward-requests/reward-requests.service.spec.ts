import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UserRewardsService } from 'src/user-rewards/user-rewards.service';
import { UserStatsDocument } from 'src/user-stats/schemas/user-stats.schema';
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
  let userStatsModel: Model<UserStatsDocument>;

  const rewardRequestModelMock = jest.fn().mockImplementation(dto => ({
    ...dto,
    save: jest.fn().mockResolvedValue({
      _id: 'reqId',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  })) as any;
  rewardRequestModelMock.create = jest.fn();
  rewardRequestModelMock.findOne = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(null),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardRequestsService,
        {
          provide: getModelToken('RewardRequest'),
          useValue: rewardRequestModelMock,
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
                period: {
                  start: new Date('2020-01-01').toISOString(),
                  end: new Date('2099-12-31').toISOString(),
                },
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
          provide: getModelToken('UserStats'),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getModelToken('Coupon'),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: UserRewardsService,
          useValue: {
            grantReward: jest.fn(),
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
          useValue: {
            axiosRef: {
              get: jest.fn().mockResolvedValue({
                data: {
                  id: 'userId',
                  name: 'Test User',
                  email: 'test@example.com',
                  roles: [{ name: 'USER' }],
                },
              }),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('http://auth-service'),
          },
        },
      ],
    }).compile();

    service = module.get<RewardRequestsService>(RewardRequestsService);
    rewardRequestModel = module.get(getModelToken('RewardRequest'));
    eventModel = module.get(getModelToken('Event'));
    rewardModel = module.get(getModelToken('Reward'));
    userStatsService = module.get<UserStatsService>(UserStatsService);
    userStatsModel = module.get(getModelToken('UserStats'));
  });

  //* 유저가 조건을 충족했을 때 보상 요청 생성 테스트
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

    // 추가: 유저 통계 mock (조건 충족)
    jest.spyOn(userStatsModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        loginDays: 5,
        point: 0,
      }),
    } as any);

    // 추가: 유저 정보 mock
    const mockUser = {
      id: 'userId',
      name: 'Test User',
      email: 'test@example.com',
      roles: [{ name: 'USER' }],
    };
    (service as any).httpService = {
      axiosRef: {
        get: jest.fn().mockResolvedValue({ data: mockUser }),
      },
    };

    // 추가: 중복 요청 없음
    jest.spyOn(rewardRequestModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    // 추가: userRewardsService.grantReward mock
    (service as any).userRewardsService = {
      grantReward: jest.fn().mockResolvedValue({ coupons: [] }),
    };

    // 수정: 요청 이력 생성 → save() 포함해야 함
    jest.spyOn(rewardRequestModel, 'create').mockImplementation((dto: any) => ({
      ...dto,
      save: jest.fn().mockResolvedValue({
        _id: 'reqId',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    }));

    const result = await service.requestReward(createRewardRequestReq, userTokenPayload);

    expect(result).toBeDefined();
    expect(result.id).toEqual('reqId');
    expect(result.status).toEqual('SUCCESS');
  });

  //* 조건 미충족 시 FAILED 상태로 기록
  it('should record a FAILED reward request if user does not meet the condition', async () => {
    const createRewardRequestReq = {
      eventId: 'eventId',
      rewardId: 'rewardId',
    };

    const userTokenPayload = {
      _id: 'userId',
    };

    // 유저 통계 조건 불충족(mock): loginDays가 1일뿐
    jest.spyOn(userStatsModel, 'findOne').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue({
        loginDays: 1,
        point: 0,
      }),
    } as any);

    // rewardRequestModel.create mock
    const rewardRequestCreateMock = jest.spyOn(rewardRequestModel, 'create').mockResolvedValue({
      _id: 'reqId',
      status: 'FAILED',
      reason: '조건 불충족',
    } as any);

    await expect(service.requestReward(createRewardRequestReq, userTokenPayload)).rejects.toThrow(
      '이벤트 조건을 충족하지 않았습니다.',
    );

    expect(rewardRequestCreateMock).toBeCalledWith(
      expect.objectContaining({
        user: 'userId',
        event: 'eventId',
        reward: 'rewardId',
        status: 'FAILED',
      }),
    );
  });

  //* 보상 타입이 COUPON일 때, 응답에 쿠폰 코드 포함되는지 확인
  it('should return coupon codes when reward type is COUPON', async () => {
    const createRewardRequestReq = {
      eventId: 'eventId',
      rewardId: 'rewardId',
    };

    const userTokenPayload = {
      _id: 'userId',
    };

    // 유저 정보 API mock (httpService.axiosRef.get)
    const mockUser = {
      id: 'userId',
      name: 'Test User',
      email: 'test@example.com',
      roles: [{ name: 'USER' }],
    };

    // @nestjs/axios에서 제공하는 httpService의 axiosRef mock
    const axiosRefGetMock = jest.fn().mockResolvedValue({ data: mockUser });
    (service as any).httpService = {
      axiosRef: {
        get: axiosRefGetMock,
      },
    };

    // 중복 요청 없도록 처리
    jest.spyOn(rewardRequestModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    // reward.type === 'COUPON'으로 설정
    jest.spyOn(rewardModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        _id: 'rewardId',
        type: 'COUPON',
        amount: 1,
        deletedAt: null,
      }),
    } as any);

    // 이벤트 정상 상태
    jest.spyOn(eventModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        _id: 'eventId',
        status: 'ACTIVE',
        deletedAt: null,
        period: {
          start: new Date('2020-01-01').toISOString(),
          end: new Date('2099-12-31').toISOString(),
        },
        condition: { type: 'LOGIN_DAYS', value: 1 },
      }),
    } as any);

    // 유저 통계 충족
    jest.spyOn(userStatsModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        loginDays: 10,
        point: 1000,
      }),
    } as any);

    // 쿠폰 보상 반환 mock
    const mockCoupons = [{ code: 'ABC123', expiresAt: '2099-12-31T00:00:00.000Z' }];
    const userRewardsServiceMock = {
      grantReward: jest.fn().mockResolvedValue({ coupons: mockCoupons }),
    };
    (service as any).userRewardsService = userRewardsServiceMock;

    // 요청 이력 저장 mock
    jest.spyOn(rewardRequestModel, 'create').mockImplementation((dto: any) => ({
      ...dto,
      save: jest.fn().mockResolvedValue({
        _id: 'reqId',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    }));

    const result = await service.requestReward(createRewardRequestReq, userTokenPayload);

    expect(result.reward.coupons).toEqual(mockCoupons);
  });
});
