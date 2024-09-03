import { IsBoolean, IsEmail, IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from "class-validator";

export class ApproveReportDto {

    @IsBoolean()
    approved: boolean;
}