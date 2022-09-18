import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ClubSocioService } from './club-socio.service';

@Controller('clubes')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubSocioController {
   constructor(private readonly clubSocioService: ClubSocioService){}

   @Post(':clubId/socios/:socioId')
   async addMemberToClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
       return await this.clubSocioService.addMemberToClub(clubId, socioId);
   }

   @Get(':clubId/socios')
   async findMembersFromClub(@Param('clubId') clubId: string){
       return await this.clubSocioService.findMembersFromClub(clubId);
   }

    @Delete(':clubId/socios/:socioId')
    @HttpCode(204)
    async deleteMemberFromClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
       return await this.clubSocioService.deleteMemberFromClub(clubId, socioId);
    }

}


