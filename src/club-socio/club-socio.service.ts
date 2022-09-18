import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ClubSocioService {
    constructor(
       @InjectRepository(ClubEntity)
       private readonly clubRepository: Repository<ClubEntity>,
   
       @InjectRepository(SocioEntity)
       private readonly socioRepository: Repository<SocioEntity>
    ) {}

    async addMemberToClub(clubId: string, socioId: string): Promise<ClubEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});
        if (!socio)
            throw new BusinessLogicException("The member with the given id was not found", BusinessError.NOT_FOUND);
     
       const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]})
       if (!club)
         throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
   
       club.socios = [...club.socios, socio];
       return await this.clubRepository.save(club);
    }
   
   
    async findMembersFromClub(clubId: string): Promise<SocioEntity[]> {
       const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
       if (!club)
         throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
      
       return club.socios;
    }
   
  
   
   async deleteMemberFromClub(clubId: string, socioId: string){
       const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});
       if (!socio)
         throw new BusinessLogicException("The member with the given id was not found", BusinessError.NOT_FOUND)
   
       const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
       if (!club)
         throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
   
       const clubSocio: SocioEntity = club.socios.find(e => e.id === socio.id);
   
       if (!clubSocio)
           throw new BusinessLogicException("The member with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED)

       club.socios = club.socios.filter(e => e.id !== socioId);
       await this.clubRepository.save(club);
   }  
}