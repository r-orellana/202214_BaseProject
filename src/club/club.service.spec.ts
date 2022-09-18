/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';

import { faker } from '@faker-js/faker';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubesList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    clubesList = [];
    for(let i = 0; i < 5; i++){
        const club: ClubEntity = await repository.save({
        nombre: faker.company.name(), 
        fecha_fundacion: faker.date.birthdate(), 
        imagen: faker.image.imageUrl(), 
        descripcion: faker.lorem.sentence(), 
        })
        clubesList.push(club);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all clubes', async () => {
    const clubes: ClubEntity[] = await service.findAll();
    expect(clubes).not.toBeNull();
    expect(clubes).toHaveLength(clubesList.length);
  });

  it('findOne should return a club by id', async () => {
    const storedClub: ClubEntity = clubesList[0];
    const club: ClubEntity = await service.findOne(storedClub.id);
    expect(club).not.toBeNull();
    expect(club.nombre).toEqual(storedClub.nombre)
    expect(club.fecha_fundacion).toEqual(storedClub.fecha_fundacion)
    expect(club.imagen).toEqual(storedClub.imagen)
    expect(club.descripcion).toEqual(storedClub.descripcion)
  });

  it('findOne should throw an exception for an invalid club', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The club with the given id was not found")
  });

  it('create should return a new club', async () => {
    const club: ClubEntity = {
      id: "",
      nombre: faker.company.name(), 
      fecha_fundacion: faker.date.birthdate(), 
      imagen: faker.image.imageUrl(), 
      descripcion: faker.lorem.sentence(), 
      socios: []
    }

    const newClub: ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();

    const storedClub: ClubEntity = await repository.findOne({where: {id: newClub.id}})
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(newClub.nombre)
    expect(storedClub.fecha_fundacion).toEqual(newClub.fecha_fundacion)
    expect(storedClub.imagen).toEqual(newClub.imagen)
    expect(storedClub.descripcion).toEqual(newClub.descripcion)
  });

  it('update should modify a club', async () => {
    const club: ClubEntity = clubesList[0];
    club.nombre = "New name";
    club.descripcion = "New desc";
  
    const updatedClub: ClubEntity = await service.update(club.id, club);
    expect(updatedClub).not.toBeNull();
  
    const storedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(club.nombre)
    expect(storedClub.descripcion).toEqual(club.descripcion)
  });
 
  it('update should throw an exception for an invalid club', async () => {
    let club: ClubEntity = clubesList[0];
    club = {
      ...club, nombre: "New name", descripcion: "New desc"
    }
    await expect(() => service.update("0", club)).rejects.toHaveProperty("message", "The club with the given id was not found")
  });

  it('delete should remove a club', async () => {
    const club: ClubEntity = clubesList[0];
    await service.delete(club.id);
  
    const deletedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(deletedClub).toBeNull();
  });

  it('delete should throw an exception for an invalid club', async () => {
    const club: ClubEntity = clubesList[0];
    await service.delete(club.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The club with the given id was not found")
  });
 
});
