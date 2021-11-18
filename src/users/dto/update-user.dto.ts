import { PartialType } from '@nestjs/mapped-types';
import { Matches } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto){
   /* status: string;
    fcm_token: string;*/
    //updated_by: number;
}
