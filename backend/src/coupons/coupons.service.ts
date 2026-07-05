import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon, DiscountType } from './entities/coupon.entity';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from './dto/coupon.dto';
import { AuthenticatedUser } from '../common/guards/supabase-auth.guard';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
  ) {}

  async create(dto: CreateCouponDto, user: AuthenticatedUser) {
    const companyId = user.role === 'provider' ? user.companyId : null;
    const existing = await this.couponRepo.findOne({ where: { code: dto.code.toUpperCase(), companyId: companyId as any } });
    if (existing) throw new BadRequestException('Coupon code already exists for this company');

    const coupon = this.couponRepo.create({
      ...dto,
      code: dto.code.toUpperCase(),
      companyId,
    });
    return this.couponRepo.save(coupon);
  }

  async findAll(user: AuthenticatedUser) {
    const query: any = {};
    if (user.role === 'provider') query.companyId = user.companyId;
    return this.couponRepo.find({ where: query, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string, user: AuthenticatedUser) {
    const query: any = { id };
    if (user.role === 'provider') query.companyId = user.companyId;
    const coupon = await this.couponRepo.findOne({ where: query });
    if (!coupon) throw new NotFoundException(`Coupon with ID ${id} not found`);
    return coupon;
  }

  async update(id: string, dto: UpdateCouponDto, user: AuthenticatedUser) {
    const coupon = await this.findOne(id, user);
    if (dto.code) {
      dto.code = dto.code.toUpperCase();
      const companyId = user.role === 'provider' ? user.companyId : null;
      const existing = await this.couponRepo.findOne({ where: { code: dto.code, companyId: companyId as any } });
      if (existing && existing.id !== id) throw new BadRequestException('Coupon code already exists');
    }
    Object.assign(coupon, dto);
    return this.couponRepo.save(coupon);
  }

  async remove(id: string, user: AuthenticatedUser) {
    const coupon = await this.findOne(id, user);
    await this.couponRepo.remove(coupon);
    return { success: true };
  }

  async validate(dto: ValidateCouponDto, user: AuthenticatedUser) {
    const query: any = { code: dto.code.toUpperCase(), isActive: true };
    if (user.role === 'provider') query.companyId = user.companyId;
    const coupon = await this.couponRepo.findOne({ where: query });

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
