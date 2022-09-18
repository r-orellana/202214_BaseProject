import {IsDateString, IsNotEmpty, IsString, IsUrl, Length} from 'class-validator';
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
    @Length(1, 100)
    readonly descripcion: string;
 


}
