import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { InjectRepository } from '@nestjs/typeorm';
import type { JwtPayload } from 'src/common/types/jwt-payload.type';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    private readonly userService: UsersService,
    private readonly productService: ProductsService,
  ) {}
  async create(createReviewDto: CreateReviewDto, userId: number) {
    await this.productService.exist(createReviewDto.productId);
    await this.userService.exist(userId);
    const review = this.reviewRepo.create({ ...createReviewDto, userId });
    const savedReview = await this.reviewRepo.save(review);
    return savedReview;
  }

  async findAll() {
    const reviews = await this.reviewRepo.find();
    return reviews;
  }

  async findAllForProduct(productId: number) {
    await this.productService.exist(productId);
    const reviews = await this.reviewRepo.find({ where: { productId } });
    return reviews;
  }

  async findAllForUser(userId: number) {
    await this.userService.exist(userId);
    const reviews = await this.reviewRepo.find({
      where: { userId },
    });
    return reviews;
  }

  async findOne(id: number) {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: { user: true, product: true },
    });
    if (!review) throw new NotFoundException(`review with id ${id} not found`);
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, user: JwtPayload) {
    const review = await this.findOne(id);
    if (review.userId != user.sub && user.role !== UserRole.ADMIN)
      throw new UnauthorizedException(
        `Review with id ${id} doesn't belong to user ${user.sub}`,
      );
    if (updateReviewDto.comment) review.comment = updateReviewDto.comment;
    if (updateReviewDto.rating) review.rating = updateReviewDto.rating;
    const updatedReview = await this.reviewRepo.save(review);
    return updatedReview;
  }

  async remove(id: number, user: JwtPayload) {
    const review = await this.findOne(id);
    if (review.userId != user.sub && user.role !== UserRole.ADMIN)
      throw new UnauthorizedException(
        `User ${user.sub} is unauthorized to remove this review`,
      );
    const deletedReview = await this.reviewRepo.delete(id);
    return deletedReview;
  }
  async exist(id: number) {
    const isExist = await this.reviewRepo.exists({ where: { id } });
    if (!isExist) throw new NotFoundException(`review with id ${id} not found`);
    return isExist;
  }
}
