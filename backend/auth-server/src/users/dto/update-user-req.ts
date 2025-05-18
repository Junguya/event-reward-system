import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateUserReq {
  @ApiProperty({ example: '홍길순', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'F', enum: ['M', 'F', 'O'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['M', 'F', 'O'])
  gender?: string;
}
