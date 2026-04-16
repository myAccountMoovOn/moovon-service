import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon, DiscountType } from './entities/coupon.entity';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
  ) {}

  async create(dto: CreateCouponDto) {
    const existing = await this.couponRepo.findOne({ where: { code: dto.code.toUpperCase() } });
    if (existing) throw new BadRequestException('Coupon code already exists');

    const coupon = this.couponRepo.create({
      ...dto,
      code: dto.code.toUpperCase(),
    });
    return this.couponRepo.save(coupon);
  }

  async findAll() {
    return this.couponRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const coupon = await this.couponRepo.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException(`Coupon with ID ${id} not found`);
    return coupon;
  }

  async update(id: string, dto: UpdateCouponDto) {
    const coupon = await this.findOne(id);
    if (dto.code) dto.code = dto.code.toUpperCase();
    Object.assign(coupon, dto);
    return this.couponRepo.save(coupon);
  }

  async remove(id: string) {
    const coupon = await this.findOne(id);
    await this.couponRepo.remove(coupon);
    return { success: true };
  }

  async validate(dto: ValidateCouponDto) {
    const coupon = await this.couponRepo.findOne({
      where: { code: dto.code.toUpperCase(), isActive: true }
    });

    if (!coupon) throw new BadRequestException('Invalid or inactive coupon code');

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      throw new BadRequestException('Coupon has expired');
    }

    if (dto.amount < Number(coupon.minPurchaseAmount)) {
      throw new BadRequestException(`Minimum purchase of ₹${coupon.minPurchaseAmount} required`);
    }

    let discountAmount = 0;
    if (coupon.type === DiscountType.PERCENTAGE) {
      discountAmount = (dto.amount * Number(coupon.value)) / 100;
    } else {
      discountAmount = Number(coupon.value);
    }

    // Ensure discount doesn't exceed amount
    discountAmount = Math.min(discountAmount, dto.amount);

    return {
      couponId: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discountAmount,
      finalAmount: Math.max(0, dto.amount - discountAmount),
    };
  }
}
