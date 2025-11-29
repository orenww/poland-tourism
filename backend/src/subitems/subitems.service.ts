import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubItemDto } from './dto/create-subitem.dto';
import { UpdateSubItemDto } from './dto/update-subitem.dto';

@Injectable()
export class SubitemsService {
  constructor(private prisma: PrismaService) {}

  create(createSubitemDto: CreateSubItemDto) {
    return this.prisma.subItem.create({
      data: createSubitemDto,
    });
  }

  findAll() {
    return this.prisma.subItem.findMany({
      include: {
        item: true,
      },
    });
  }

  findByItem(itemId: number) {
    return this.prisma.subItem.findMany({
      where: { itemId },
    });
  }

  findOne(id: number) {
    return this.prisma.subItem.findUnique({
      where: { id },
    });
  }

  update(id: number, updateSubitemDto: UpdateSubItemDto) {
    return this.prisma.subItem.update({
      where: { id },
      data: updateSubitemDto,
    });
  }

  remove(id: number) {
    return this.prisma.subItem.delete({
      where: { id },
    });
  }
}
