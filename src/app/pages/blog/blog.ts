import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BlogPost, ContentState, FirestoreContentService } from '../../firebase/firestore-content.service';

const INITIAL_POSTS_STATE: ContentState<BlogPost> = {
  items: [],
  loading: true,
  error: null,
};

@Component({
  selector: 'app-blog',
  templateUrl: './blog.html',
})
export class Blog {
  private readonly content = inject(FirestoreContentService);
  protected readonly postsState = toSignal(this.content.watchPosts(), {
    initialValue: INITIAL_POSTS_STATE,
  });
}
