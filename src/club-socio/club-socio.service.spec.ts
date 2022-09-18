/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { SocioEntity } from '../socio/socio.entity';
import { Repository } from 'typeorm';
import { ClubEntity } from '../club/club.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClubSocioService } from './club-socio.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let club: ClubEntity;
  let sociosList : SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    socioRepository.clear();
    clubRepository.clear();

    sociosList = [];
    for(let i = 0; i < 5; i++){
        const socio: SocioEntity = await socioRepository.save({
          usuario: faker.internet.userName(), 
          email: faker.internet.email(),
          fecha_nacimiento: faker.date.birthdate(), 
        })
        sociosList.push(socio);
    }

    club = await clubRepository.save({
      nombre: faker.company.name(), 
      fecha_fundacion: faker.date.birthdate(), 
      imagen: faker.image.imageUrl(), 
      descripcion: faker.lorem.sentence(), 
      socios: sociosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMemberToClub should add an socio to a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.internet.userName(), 
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.birthdate(), 
    });

    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(), 
      fecha_fundacion: faker.date.birthdate(), 
      imagen: faker.image.imageUrl(), 
      descripcion: faker.lorem.sentence(), 
    })

    const result: ClubEntity = await service.addMemberToClub(newClub.id, newSocio.id);
    
    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].usuario).toBe(newSocio.usuario)
    expect(result.socios[0].email).toBe(newSocio.email)
    expect(result.socios[0].fecha_nacimiento).toStrictEqual(newSocio.fecha_nacimiento)
  });

  it('addMemberToClub should thrown exception for an invalid socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(), 
      fecha_fundacion: faker.date.birthdate(), 
      imagen: faker.image.imageUrl(), 
      descripcion: faker.lorem.sentence(), 
    })

    await expect(() => service.addMemberToClub(newClub.id, "0")).rejects.toHaveProperty("message", "The member with the given id was not found");
  });

  it('addMemberToClub should throw an exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.internet.userName(), 
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.birthdate(), 
    });

    await expect(() => service.addMemberToClub("0", newSocio.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('findMembersFromClub should return socios by club', async ()=>{
    const socios: SocioEntity[] = await service.findMembersFromClub(club.id);
    expect(socios.length).toBe(5)
  });

  it('findMembersFromClub should throw an exception for an invalid club', async () => {
    await expect(()=> service.findMembersFromClub("0")).rejects.toHaveProperty("message", "The club with the given id was not found"); 
  });

  it('findMemberFromClub should return socios by club', async ()=>{

    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.internet.userName(), 
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.birthdate(), 
    });

    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(), 
      fecha_fundacion: faker.date.birthdate(), 
      imagen: faker.image.imageUrl(), 
      descripcion: faker.lorem.sentence(), 
    })

    const result: ClubEntity = await service.addMemberToClub(newClub.id, newSocio.id);
    const socio: SocioEntity = await service.findMemberFromClub(newClub.id, newSocio.id);
    expect(socio.id == newClub.id)
  });


  it('deleteMemberFromClub should remove an socio from a club', async () => {
    const socio: SocioEntity = sociosList[0];
    
    await service.deleteMemberFromClub(club.id, socio.id);

    const storedClub: ClubEntity = await clubRepository.findOne({where: {id: club.id}, relations: ["socios"]});
    const deletedSocio: SocioEntity = storedClub.socios.find(a => a.id === socio.id);

    expect(deletedSocio).toBeUndefined();

  });

  it('deleteMemberFromClub should thrown an exception for an invalid socio', async () => {
    await expect(()=> service.deleteMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "The member with the given id was not found"); 
  });

  it('deleteMemberFromClub should thrown an exception for an invalid club', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(()=> service.deleteMemberFromClub("0", socio.id)).rejects.toHaveProperty("message", "The club with the given id was not found"); 
  });

  it('deleteMemberFromClub should thrown an exception for an non asocciated socio', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.internet.userName(), 
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.birthdate(), 
    });

    await expect(()=> service.deleteMemberFromClub(club.id, newSocio.id)).rejects.toHaveProperty("message", "The member with the given id is not associated to the club"); 
  }); 

});
