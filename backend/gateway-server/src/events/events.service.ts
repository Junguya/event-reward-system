import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { handleAxiosError } from 'src/common/utils/http-error.util';
import { CreateEventReq } from './dto/create-event.req';
import { EventRes } from './dto/event.res';
import { UpdateEventReq } from './dto/update-event.req';

@Injectable()
export class EventsService {
  private readonly baseUrl = process.env.EVENT_SERVICE_URL;

  constructor(private readonly http: HttpService) {}

  async create(createEventReq: CreateEventReq, accessToken: string): Promise<EventRes> {
    try {
      const { data } = await lastValueFrom(
        this.http.post<EventRes>(`${this.baseUrl}/events`, createEventReq, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async findAll(accessToken: string): Promise<EventRes[]> {
    try {
      const { data } = await lastValueFrom(
        this.http.get<EventRes[]>(`${this.baseUrl}/events`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async findById(id: string, accessToken: string): Promise<EventRes> {
    try {
      const { data } = await lastValueFrom(
        this.http.get<EventRes>(`${this.baseUrl}/events/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async update(id: string, updateEventReq: UpdateEventReq, accessToken: string): Promise<EventRes> {
    try {
      const { data } = await lastValueFrom(
        this.http.patch<EventRes>(`${this.baseUrl}/events/${id}`, updateEventReq, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async delete(id: string, accessToken: string): Promise<boolean> {
    try {
      const { data } = await lastValueFrom(
        this.http.delete<boolean>(`${this.baseUrl}/events/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
    }
  }
}
