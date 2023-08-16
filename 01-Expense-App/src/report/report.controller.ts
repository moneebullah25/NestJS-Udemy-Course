import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  ParseUUIDPipe,
  ParseEnumPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
} from '@nestjs/common';
// Logger instead of console.log
import { Logger } from '@nestjs/common';
import { ReportType } from 'src/data';
import {
  CreateReportDto,
  ReportResponseDto,
  UpdateReportDto,
} from 'src/dtos/report.dto';

import { ReportService } from './report.service';

// :type is the variable which refers to the following breakpoints in the url:
// http://localhost:3000/report/absd
// http://localhost:3000/report/absd123
// http://localhost:3000/report/sgdfhrtgh....
// http://localhost:3000/report/...

@Controller('report/:type')
export class ReportController {
  // Alternate way
  // rService: ReportService;
  // constructor (rService: ReportService) {
  //   this.rService = rService;
  // }

  // best way to initialize 
  constructor(private readonly reportService: ReportService) {
    // Inside
  }

  // Inside any method in the class we can call the report functions as shown below
  // get() {
  //   this.reportService.createReport();
  //   this.reportService.deleteReport()
  //   this.reportService.updateReport()
  // }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getAllReports( // Parameters to be passed 
    //The ParseEnumPipe is a custom pipe that ensures the type parameter matches one of the values defined in the ReportType enum.
    @Param('type', new ParseEnumPipe(ReportType)) type: string,
  ): ReportResponseDto[] {
    const reportType =
      type === 'income' ? ReportType.INCOME : ReportType.EXPENSE;
    return this.reportService.getAllReports(reportType);
  }

  @Get(':id')
  getReportById(
    @Param('type', new ParseEnumPipe(ReportType)) type: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): ReportResponseDto {
    const reportType =
      type === 'income' ? ReportType.INCOME : ReportType.EXPENSE;
    console.log("id: ", id);
    return this.reportService.getReportById(reportType, id);
  }

  // When the data is being sent back to the user NEST JS will automatically figure out the type in the Content-Type: application/json, ... etc
  // excluding all properties that begin with the _ prefix
  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  @Post()
  createReport(
    @Body() body: CreateReportDto,
    // @Body() {amount, source}: CreateReportDto,
    @Param('type', new ParseEnumPipe(ReportType)) type: string,
  ): ReportResponseDto {
    const reportType =
      type === 'income' ? ReportType.INCOME : ReportType.EXPENSE;
    return this.reportService.createReport(reportType, body);
    // return this.reportService.createReport(reportType, {amount, source}); 
  }

  @Put(':id')
  updateReport(
    @Param('type', new ParseEnumPipe(ReportType)) type: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateReportDto,
  ): ReportResponseDto {
    const reportType =
      type === 'income' ? ReportType.INCOME : ReportType.EXPENSE;
    return this.reportService.updateReport(reportType, id, body);
  }

  @HttpCode(204) // No content if delete succesful
  @Delete(':id')
  deleteReport(@Param('id', ParseUUIDPipe) id: string) {
    return this.reportService.deleteReport(id);
  }
}
