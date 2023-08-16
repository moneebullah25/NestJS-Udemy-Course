import { UserType } from '.prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsEmail,
  MinLength,
  // Matches, // To use regular expression
  IsEnum,
  IsOptional,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // @Matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
  //   message: 'phone must be a valid phone number',
  // })
  @IsPhoneNumber('PK')
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  productKey?: string;
}

export class SigninDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class GenerateProductKeyDto {
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}
