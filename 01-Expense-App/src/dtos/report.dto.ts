import {
  IsNumber,
  IsPositive,
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ReportType } from 'src/data';

// DTO's will only be represented in the class not interface
export class CreateReportDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  source: string;
}

// The @IsOptional() decorator indicates that these properties are not required when updating the report. If provided, the class-validator decorators validate the values similar to CreateReportDto.
export class UpdateReportDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  source: string;
}

export class ReportResponseDto {
  id: string;
  source: string;
  amount: number;

  @Expose({ name: 'createdAt' })
  transformCreatedAt() {
    return this.created_at;
  }

  @Expose({name: 'updatedAt'})
  transformUpdatedAt() {
    return this.updated_at;
  }

  // @Expose() decorator to provide alias names for properties, or to execute a function to calculate a property value
  @Expose()
  _remarks() : string {
    return this.source === "Amazon" ? "Have a LLC in Delaware" : "Salary Income";
  }

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  type: ReportType;

  constructor(partial: Partial<ReportResponseDto>) {
    Object.assign(this, partial);
  }
}
