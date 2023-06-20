export type MultipartFile = {
  data: Buffer;
  filename: string;
  encoding: string;
  mimetype: string;
  limit: boolean;
};
