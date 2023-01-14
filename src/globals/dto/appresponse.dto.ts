export class AppResponseDto {
  success: boolean = false;
  message?: string;
  errCode?: number;
  data?: any;
}