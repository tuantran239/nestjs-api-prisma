export interface ResponseData {
  message: 'success' | 'error';
  data: any | null;
  error: any | null;
  statusCode: number;
}
