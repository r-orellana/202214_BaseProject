import {IsDateString, IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class SocioDto {

    @IsString()
    @IsNotEmpty()
    readonly usuario: string;
    
    @IsString()
    @IsNotEmpty()
    readonly email: string;

    @IsDateString()
    @IsNotEmpty()
    readonly fecha_nacimiento: Date;
    
    
}

