import {IsDateString, IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class ClubDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
    
    @IsDateString()
    @IsNotEmpty()
    readonly fecha_fundacion: Date;

    @IsUrl()
    @IsNotEmpty()
    readonly imagen: string;
    
    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;
 


}
