import { PartialType } from '@nestjs/swagger';
import { CreateEventReq } from './create-event.req';

export class UpdateEventReq extends PartialType(CreateEventReq) {}
