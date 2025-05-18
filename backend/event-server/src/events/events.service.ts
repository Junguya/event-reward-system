import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventReq } from './dto/create-event.req';
import { EventRes } from './dto/event.res';
import { UpdateEventReq } from './dto/update-event.req';
import { Event, EventDocument } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  private toEventRes(doc: EventDocument): EventRes {
    const { _id, __v, ...rest } = doc.toObject();
    return { id: _id.toString(), ...rest };
  }

  async create(createEventReq: CreateEventReq, userId: string): Promise<EventRes> {
    const createdEvent = new this.eventModel({
      ...createEventReq,
      period: {
        start: new Date(createEventReq.period.start),
        end: new Date(createEventReq.period.end),
      },
      createdBy: userId,
      updatedBy: userId,
    });

    const saved = await createdEvent.save();
    return this.toEventRes(saved);
  }

  async findAll(isUser: boolean): Promise<EventRes[]> {
    const query: Record<string, any> = { deletedAt: null };
    if (isUser) query.status = 'ACTIVE';

    const events = await this.eventModel.find(query).sort({ createdAt: -1 }).exec();
    return events.map(event => this.toEventRes(event));
  }

  async findById(id: string, isUser: boolean): Promise<EventRes> {
    const query: Record<string, any> = { _id: id, deletedAt: null };
    if (isUser) query.status = 'ACTIVE';

    const event = await this.eventModel.findOne(query);
    if (!event) throw new NotFoundException('이벤트를 찾을 수 없습니다.');

    return this.toEventRes(event);
  }

  async update(id: string, updateEventReq: UpdateEventReq, userId: string): Promise<EventRes> {
    const updated = await this.eventModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      {
        ...updateEventReq,
        ...(updateEventReq.period && {
          period: {
            start: new Date(updateEventReq.period.start),
            end: new Date(updateEventReq.period.end),
          },
        }),
        updatedBy: userId,
      },
      { new: true },
    );

    if (!updated) throw new NotFoundException('이벤트를 찾을 수 없습니다.');

    return this.toEventRes(updated);
  }

  async softDelete(id: string, userId: string): Promise<boolean> {
    const deleted = await this.eventModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      {
        deletedAt: new Date(),
        updatedBy: userId,
      },
    );

    if (!deleted) throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    return true;
  }
}
