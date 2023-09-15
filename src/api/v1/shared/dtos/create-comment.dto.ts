import { CommentInterface } from '../../data-access-layer';
import { Visibility } from '../enums';

export class CreateCommentDto implements Partial<CommentInterface> {
  content: string;
  constructor(reqBody: Record<string, any>) {
    this.content = reqBody?.content || '';
  }
}
