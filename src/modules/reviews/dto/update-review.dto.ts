import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';
import { Exclude } from 'class-transformer';

export class UpdateReviewDto extends PartialType(
  OmitType(CreateReviewDto, ['productId'] as const),
) {}
