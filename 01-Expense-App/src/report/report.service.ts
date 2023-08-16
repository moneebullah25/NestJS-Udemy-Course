import { Injectable } from '@nestjs/common';
import { ReportType, data } from 'src/data';
import { v4 as uuid } from 'uuid';
import { ReportResponseDto } from 'src/dtos/report.dto';

interface Report {
  amount: number;
  source: string;
}

interface UpdateReport {
  amount?: number;
  source?: string;
}

// Injectable is imported from @nestjs/common to indicate that this class can be injected as a service into other classes.
// Injectable is used to create dependency as an injectable in the controller file rather than to create instance of the injectable class and make sure to handle it correctly in the controller file 
// const reportService = new ReportService(); ---> @Injectable keyword and rest of the logic is handled by the nest itself but we just need to declare it in the constructor ----> constructor(private readonly reportService: ReportService) {}
@Injectable()
export class ReportService {
  getAllReports(type: ReportType): ReportResponseDto[] {
    // Wherever data.report is used it shows that nestjs is making call to database to perform CRUD operation in real life scenario whereas now we are just checking in our json file.
    return data.report
      // It uses the filter method to find reports that match the specified type and then uses the map method to convert each report to a ReportResponseDto instance.
      .filter((report) => report.type === type)
      .map((report) => new ReportResponseDto(report));
  }

  getReportById(type: ReportType, id: string): ReportResponseDto {
    const report = data.report
      // filter based on type provided and then return the first object that matches the id
      .filter((report) => report.type === type) 
      .find((report) => report.id === id);

    if (!report) return;

    return new ReportResponseDto(report);
  }

  createReport(
    type: ReportType,
    body: Report, // Second Approach
    // {amount, source} : Report,
  ): ReportResponseDto {
    const newReport = {
      id: uuid(),
      ...body, // Second approach
      // amount,
      // source,
      created_at: new Date(),
      updated_at: new Date(),
      type,
    };
    data.report.push(newReport);
    return new ReportResponseDto(newReport);
  }

  updateReport(
    type: ReportType,
    id: string,
    body: UpdateReport,
  ): ReportResponseDto {
    const reportToUpdate = data.report
      .filter((report) => report.type === type)
      .find((report) => report.id === id);

    if (!reportToUpdate) return;

    const reportIndex = data.report.findIndex(
      (report) => report.id === reportToUpdate.id,
    );

    data.report[reportIndex] = {
      ...data.report[reportIndex],
      ...body,
      updated_at: new Date(),
    };

    return new ReportResponseDto(data.report[reportIndex]);
  }

  deleteReport(id: string) {
    const reportIndex = data.report.findIndex((report) => report.id === id);

    if (reportIndex === -1) return;

    data.report.splice(reportIndex, 1);

    return;
  }
}
