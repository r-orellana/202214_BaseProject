import { ClubEntity } from '../club/club.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class SocioEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 usuario: string;
 
 @Column()
 email: string;
 
 @Column()
 fecha_nacimiento: Date;


 @ManyToMany(() => ClubEntity, club => club.socios)
 clubes: ClubEntity[];
 
}
