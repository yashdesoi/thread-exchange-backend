import { UserInterface } from '../../data-access-layer';

export class AuthCredentialsDto implements Partial<UserInterface> {
  email: string;
  password:  string;
  name: string;
  constructor(reqBody: Record<string, string>) {
    this.email = reqBody?.email || '';
    this.password = reqBody?.password || '';
    this.name = reqBody?.name || '';
  }
}