import { ID } from '../../app/types/types';

export class CreateRequest {
  readonly author: ID;
  readonly text: string;

  constructor(author: string, text: string) {
    this.author = author;
    this.text = text;
  }
}
