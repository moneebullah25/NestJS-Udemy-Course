import { PropertyType } from '.prisma/client';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeService, homeSelect } from './home.service';

const mockGetHomes = [
  {
    id: 1,
    address: '2345 William Str',
    city: 'Toronto',
    price: 1500000,
    propertyType: PropertyType.RESIDENTIAL,
    image: 'img1',
    numberOfBedrooms: 3,
    numberOfBathrooms: 2.5,
    images: [
      {
        url: 'src1',
      },
    ],
  },
];

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue(mockGetHomes),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createHome', () => {
    it('should create a new home with images', async () => {
      const createHomeParams = {
        address: '123 Main St',
        numberOfBedrooms: 3,
        numberOfBathrooms: 2,
        city: 'New York',
        price: 500000,
        landSize: 2000,
        propertyType: PropertyType.RESIDENTIAL,
        images: [
          { url: 'https://example.com/image1.jpg' },
          { url: 'https://example.com/image2.jpg' },
        ],
      };

      const userId = 4;
      const expectedHomeResponse = {
        ...createHomeParams,
        id: 4,
      };

      const homeResponse = await service.createHome(createHomeParams, userId);

      expect(prismaService.home.create).toHaveBeenCalledWith({
        data: {
          address: createHomeParams.address,
          number_of_bedrooms: createHomeParams.numberOfBedrooms,
          number_of_bathrooms: createHomeParams.numberOfBathrooms,
          city: createHomeParams.city,
          price: createHomeParams.price,
          land_size: createHomeParams.landSize,
          propertyType: createHomeParams.propertyType,
          realtor_id: userId,
        },
      });

      expect(prismaService.image.createMany).toHaveBeenCalledWith({
        data: [
          { url: 'https://example.com/image1.jpg', home_id: 1 },
          { url: 'https://example.com/image2.jpg', home_id: 1 },
        ],
      });

      expect(homeResponse).toEqual(expectedHomeResponse);
    });
  });

  describe('getHomes', () => {
    const filters = {
      city: 'Toronto',
      price: {
        gte: 1000000,
        lte: 1500000,
      },
      propertyType: PropertyType.RESIDENTIAL,
    };

    it('should call prisma home.findMany with correct params', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockGetHomes);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await service.getHomes(filters);

      expect(mockPrismaFindManyHomes).toBeCalledWith({
        select: {
          ...homeSelect,
          images: {
            select: {
              url: true,
            },
            take: 1,
          },
        },
        where: filters,
      });
    });

    it('', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue([]);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await expect(service.getHomes(filters)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
