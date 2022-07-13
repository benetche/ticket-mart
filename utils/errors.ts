import { Error as MongooseError } from 'mongoose';

export class ClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClientError';
  }
}

export function getErrorMessage(errors: MongooseError.ValidationError) {
  return errors.errors[Object.keys(errors.errors)[0]].message;
}
