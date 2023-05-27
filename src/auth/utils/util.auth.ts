import * as bcrypt from 'bcryptjs';

export function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
}
