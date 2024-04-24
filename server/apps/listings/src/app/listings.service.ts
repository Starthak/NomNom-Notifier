import { Injectable, NotFoundException, BadRequestException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaClient, Listing as PrismaListing, Category as PrismaCategory } from '../../node_modules/.prisma/client';
import { Category, GetBasicUsersResponse, GetFavIdsResponse, GetPremiumUsersResponse, Listing } from './interface/listings.interface';
import { CreateCategoryDto, CreateListingDto } from './dto/create_listing.dto';
import { HttpModule, HttpService } from '@nestjs/axios';
import { LimitedUserData } from './types/listings.types';
import { catchError, firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaClient, private readonly httpService: HttpService) { }
  //////////////////////////////////Category//////////////////////////////////////////////////
  async getCategories(): Promise<Category[]> {
    try {
      const categories: PrismaCategory[] = await this.prisma.category.findMany();
      return categories.map(this.convertToCategoryDto);
    } catch (error) {
      throw new BadRequestException(`Could not fetch Category: ${error.message}`);
    }
  }
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const createdCategory: PrismaCategory = await this.prisma.category.create({
        data: {
          label: createCategoryDto.label,
          description: createCategoryDto.description,
          icon: createCategoryDto.icon,
        },
      });
      return this.convertToCategoryDto(createdCategory);
    } catch (error) {
      throw new BadRequestException(`Could not create Category: ${error.message}`);
    }
  }

  async updateCategory(label: string, updateCategoryDto: Partial<CreateCategoryDto>): Promise<Category> {
    try {
      const categoryToUpdate: PrismaCategory | null = await this.prisma.category.findUnique({ where: { label } });

      if (!categoryToUpdate) {
        throw new NotFoundException(`Category with label ${label} not found`);
      }

      const updatedCategory: PrismaCategory = await this.prisma.category.update({ where: { label }, data: updateCategoryDto });

      return this.convertToCategoryDto(updatedCategory);
    } catch (error) {
      throw new BadRequestException(`Could not update category: ${error.message}`);
    }
  }

  async removeCategory(label: string): Promise<void> {
    try {
      const categoryToDelete: PrismaCategory | null = await this.prisma.category.findUnique({ where: { label } });

      if (!categoryToDelete) {
        throw new NotFoundException(`Category with label ${label} not found`);
      }

      await this.prisma.category.delete({ where: { label } });
    } catch (error) {
      throw new BadRequestException(`Could not delete category: ${error.message}`);
    }
  }




  //////////////////////////////////Category//////////////////////////////////////////////////

  async findAll(): Promise<Listing[]> {
    try {
      const listings: PrismaListing[] = await this.prisma.listing.findMany();
      return listings.map(this.convertToDto);
    } catch (error) {
      throw new BadRequestException(`Could not fetch listings: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<Listing> {
    try {
      const listing: PrismaListing | null = await this.prisma.listing.findUnique({
        where: { id },
      });

      if (!listing) {
        throw new NotFoundException(`Listing with ID ${id} not found`);
      }

      return this.convertToDto(listing);
    } catch (error) {
      throw new BadRequestException(`Could not fetch listing: ${error.message}`);
    }
  }

  async create(createListingDto: CreateListingDto): Promise<Listing> {
    try {
      Logger.log('In create method');

      // const listingCount = await this.prisma.listing.count({
      //   where: {
      //     userId: createListingDto.userId,
      //   }
      // })

      // // If the user has 3 or more listings, throw an exception
      // if (listingCount >= 3) {
      //   throw new BadRequestException('you are limited to 3 listings.')
      // }

      const createdListing: PrismaListing = await this.prisma.listing.create({
        data: {
          title: createListingDto.title,
          description: createListingDto.description,
          category: createListingDto.category,
          subCategory: createListingDto.subCategory,
          condition: createListingDto.condition,
          price: createListingDto.price,
          city: createListingDto.city,
          state: createListingDto.state,
          imageUrls: createListingDto.imageUrls,
          userId: createListingDto.userId,
          postedAt: new Date().toISOString(),
          rating: createListingDto.rating,
          discount: createListingDto.discount,
          delivery: createListingDto.delivery,
          quantity: createListingDto.quantity,
        },
      });
      return this.convertToDto(createdListing);
    } catch (error) {
      throw new BadRequestException(`Could not create listing: ${error.message}`);
    }
  }

  async update(id: string, updateListingDto: Partial<CreateListingDto>): Promise<Listing> {
    try {
      const listingToUpdate: PrismaListing | null = await this.prisma.listing.findUnique({ where: { id } });

      if (!listingToUpdate) {
        throw new NotFoundException(`Listing with ID ${id} not found`);
      }

      const updatedListing: PrismaListing = await this.prisma.listing.update({ where: { id }, data: updateListingDto });

      return this.convertToDto(updatedListing);
    } catch (error) {
      throw new BadRequestException(`Could not update listing: ${error.message}`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const listingToDelete: PrismaListing | null = await this.prisma.listing.findUnique({ where: { id } });

      if (!listingToDelete) {
        throw new NotFoundException(`Listing with ID ${id} not found`);
      }

      await this.prisma.listing.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(`Could not delete listing: ${error.message}`);
    }
  }

  async findListingsByCategory(category: string, subCategory?: string): Promise<Listing[]> {
    try {
      if (!category) {
        throw new BadRequestException('Category is required');
      }

      // if (isNaN(limit) || limit <= 0) {
      //   throw new BadRequestException('Limit must be a positive number');
      // }

      const listingsQuery = {
        where: {
          category,
        },
        // take: limit,
      };

      if (subCategory) {
        listingsQuery['where']['subCategory'] = subCategory;
      }

      const listings: PrismaListing[] = await this.prisma.listing.findMany(listingsQuery);
      return listings.map(this.convertToDto);
    } catch (error) {
      throw new BadRequestException(`Could not fetch listings: ${error.message}`);
    }
  }
  async getPremiumUsers(): Promise<LimitedUserData[]> {
    try {
      Logger.log('fetching premium users in service:');
      const { data } = await this.httpService
        .post<GetPremiumUsersResponse>("http://localhost:4001/graphql", {
          query: `query GetPremiumUsers {
          getPremiumUsers {
            id
            isPremium
          }
        }
        `,
        })
        .toPromise();
      Logger.log('fetching premium users in service22:', data.data.getPremiumUsers);
      const getPremiumUsers = data.data.getPremiumUsers;
      return getPremiumUsers;
    } catch (error) {
      throw new BadRequestException(`Could not fetch premium listings: ${error.message}`);
    }
  }
  async getBasicUsers(): Promise<LimitedUserData[]> {
    try {
      Logger.log('fetching basic users in service:');
      const { data } = await this.httpService
        .post<GetBasicUsersResponse>("http://localhost:4003/graphql", {
          query: `query GetSeller {
          getSeller{
            id
          }
        }
        `,
        })
        .toPromise();
      Logger.log('fetching basic users in service22:', data.data.getSeller);
      const getBasicUsers = data.data.getSeller;
      return getBasicUsers;
    } catch (error) {
      throw new BadRequestException(`Could not fetch premium listings: ${error.message}`);
    }
  }
  async getFavoriteIds(id: string): Promise<string[]> {
    try {
      Logger.log('fetching favIds in service:');
      const { data } = await this.httpService
        .post<GetFavIdsResponse>("http://localhost:4001/graphql", {
          query: `query getFavoriteIds {
                    getFavoriteIds(userId: "${id}")
                  }        `,
        })
        .toPromise();
      Logger.log('fetching favIds in service22:', data.data.getFavoriteIds);
      const favIds = data.data.getFavoriteIds;
      return favIds;
    } catch (error) {
      throw new BadRequestException(`Could not fetch premium listings: ${error.message}`);
    }
  }
  async getFavoriteListings(id: string): Promise<Listing[]> {
    try {
      const favIdsObjs = await this.getFavoriteIds(id);
      const favIds = favIdsObjs.map((user) => user);

      const userListings = await this.prisma.listing.findMany({
        where: { id: { in: favIds } },
      });
      Logger.log(`Listing ${userListings.length} found`);
      Logger.log(`Listings are: ${userListings}`);
      const filteredListings = userListings;
      // const filteredListings = userListings;
      // Logger.log(`${limit}`)
      filteredListings.sort((a, b) => b.rating - a.rating);
      const limitedListings = filteredListings;
      Logger.log(`${filteredListings.length}`)
      return limitedListings;
    } catch (error) {
      throw new BadRequestException(`Could not fetch fav listings: ${error.message}`);
    }
  }
  async getPremiumListings(limit = 5, category?: string, subCategory?: string): Promise<Listing[]> {
    try {
      const premiumUsers = await this.getPremiumUsers();
      const premiumUserIds = premiumUsers.map((user) => user.id);

      const userListings = await this.prisma.listing.findMany({
        where: { userId: { in: premiumUserIds } },
      });
      Logger.log(`Listing ${userListings.length} found`);
      Logger.log(`Listings are: ${userListings}`);
      const filteredListings = category && subCategory
        ? userListings.filter(
          (listing) => listing.category === category && listing.subCategory === subCategory
        )
        : userListings;
      // const filteredListings = userListings;
      // Logger.log(`${limit}`)
      filteredListings.sort((a, b) => b.rating - a.rating);
      const limitedListings = filteredListings.slice(0, limit);
      Logger.log(`${filteredListings.length}`)
      return limitedListings;
    } catch (error) {
      throw new BadRequestException(`Could not fetch premium listings: ${error.message}`);
    }
  }
  async getListings(limit = 5, category?: string, subCategory?: string): Promise<Listing[]> {
    try {
      const basicUsers = await this.getBasicUsers();
      const basicUserIds = basicUsers.map((user) => user.id);

      const userListings = await this.prisma.listing.findMany({
        where: { userId: { in: basicUserIds } },
      });
      Logger.log(`Listing ${userListings.length} found`);
      Logger.log(`Listings are: ${userListings}`);
      const filteredListings = category && subCategory
        ? userListings.filter(
          (listing) => listing.category === category && listing.subCategory === subCategory
        )
        : userListings;
      // Sort and limit the listings as necessary
      if (limit != 1 && filteredListings.length != 1)
        filteredListings.sort((a, b) => b.rating - a.rating);
      const limitedListings = filteredListings.slice(0, limit);
      Logger.log(`filtered listings = ${filteredListings.length}`);
      // Convert each item to match the Listing type
      return limitedListings.map(this.convertToDto);
    } catch (error) {
      throw new BadRequestException(`Could not fetch basic listings: ${error.message}`);
    }
  }
  async getListingsByUserId(userId: string): Promise<Listing[]> {
    try {
      //const basicUsers = await this.getBasicUsers();
      //const basicUsersIds = basicUsers.map((user) => user.id);

      const userListings = await this.prisma.listing.findMany({
        where: { userId },
      });
      Logger.log(`Listing ${userListings.length} found`);
      Logger.log(`Listings are: ${userListings}`);
      // Convert each PrismaListing object to Listing object
      const limitedListings = userListings.map(this.convertToDto);
      Logger.log(`userListings = ${userListings.length}`);
      Logger.log(`filtered listings = ${limitedListings.length}`);
      return limitedListings;
    } catch (error) {
      throw new BadRequestException(`Could not fetch listings By User ID: ${error.message}`);
    }
  }

  private convertToDto(listing: PrismaListing): Listing {
    return {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      category: listing.category,
      subCategory: listing.subCategory,
      condition: listing.condition,
      price: listing.price,
      city: listing.city,
      state: listing.state,
      imageUrls: listing.imageUrls,
      userId: listing.userId,
      postedAt: listing.postedAt,
      rating: listing.rating,
      discount: listing.discount,
      delivery: listing.delivery,
      quantity: listing.quantity,
    };
  }
  private convertToCategoryDto(category: PrismaCategory): Category {
    return {
      label: category.label,
      description: category.description,
      icon: category.icon
    };
  }
}

interface UserPartial {
  id: string;
  name: string;
}

interface User {
  id: string;
  isPremium: boolean;
}