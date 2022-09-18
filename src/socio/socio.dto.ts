import {IsDateString, IsEmail, IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class SocioDto {

    @IsString()
    @IsNotEmpty()
    readonly usuario: string;
    
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsDateString()
    @IsNotEmpty()
    readonly fecha_nacimiento: Date;
    
    
}

