import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SocioEntity } from 'src/socio/socio.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ClubSocioService } from './club-socio.service';
import { SocioDto } from 'src/socio/socio.dto';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubSocioController {
   constructor(private readonly clubSocioService: ClubSocioService){}

    @Post(':clubId/members/:memberId')
    async addMemberToClub(@Param('clubId') clubId: string, @Param('memberId') socioId: string){
       return await this.clubSocioService.addMemberToClub(clubId, socioId);
    }

    @Get(':clubId/members')
    async findMembersFromClub(@Param('clubId') clubId: string){
        return await this.clubSocioService.findMembersFromClub(clubId);
    }

    @Get(':clubId/members/:memberId')
    async findMemberFromClub(@Param('clubId') clubId: string, @Param('memberId') socioId: string){
       return await this.clubSocioService.findMemberFromClub(clubId,socioId);
    }

    @Delete(':clubId/members/:memberId')
    @HttpCode(204)
    async deleteMemberFromClub(@Param('clubId') clubId: string, @Param('memberId') socioId: string){
       return await this.clubSocioService.deleteMemberFromClub(clubId, socioId);
    }

    @Put(':clubId/members')
    @HttpCode(201)
    async updateMembersFromClub(@Body() sociosDto: SocioDto[], @Param('clubId') clubId: string,){
    const socios = plainToInstance(SocioEntity, sociosDto);
    return await this.clubSocioService.updateMembersFromClub(clubId, socios);
    }

}


