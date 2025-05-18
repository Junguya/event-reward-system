import { PartialType } from '@nestjs/swagger';
import { CreateRoleReq } from './create-role.req';

export class UpdateRoleReq extends PartialType(CreateRoleReq) {}
