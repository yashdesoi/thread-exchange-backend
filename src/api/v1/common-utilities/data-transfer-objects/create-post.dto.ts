import { PostDataInterface } from '../../data-access-layer';
import { Visibility } from '../enums';

export class CreatePostDto implements Partial<PostDataInterface> {
  title: string;
  content: string;
  visibility: Visibility;
  constructor(reqBody: Record<string, any>) {
    this.title = reqBody?.title || '';
    this.content = reqBody?.content || '';
    this.visibility = reqBody?.visibility || Visibility.public;
  }
}
