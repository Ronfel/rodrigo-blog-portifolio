import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  BlogPost,
  ContentState,
  FirestoreContentService,
} from '../../../firebase/firestore-content.service';

const INITIAL_POSTS_STATE: ContentState<BlogPost> = {
  items: [],
  loading: true,
  error: null,
};

@Component({
  imports: [RouterLink],
  selector: 'app-blog-post-detail',
  templateUrl: './blog-post-detail.html',
})
export class BlogPostDetail {
  private readonly content = inject(FirestoreContentService);
  private readonly route = inject(ActivatedRoute);
  protected readonly sanitizer = inject(DomSanitizer);

  protected readonly postId = this.route.snapshot.paramMap.get('id') ?? '';
  protected readonly postsState = toSignal(this.content.watchPosts(), {
    initialValue: INITIAL_POSTS_STATE,
  });

  protected safeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html ?? '');
  }

  protected readonly post = computed(() => {
    const state = this.postsState();
    if (state.loading || state.error) {
      return undefined;
    }
    return state.items.find((item) => item.id === this.postId);
  });
}
