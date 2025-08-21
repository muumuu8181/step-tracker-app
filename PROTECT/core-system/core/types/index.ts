export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface AppConfig {
  apiUrl: string;
  version: string;
  debug: boolean;
}