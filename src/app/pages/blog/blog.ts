import { Component, inject, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { BlogPost, ContentState, FirestoreContentService } from '../../firebase/firestore-content.service';

const INITIAL_POSTS_STATE: ContentState<BlogPost> = {
  items: [],
  loading: true,
  error: null,
};

@Component({
  imports: [RouterLink],
  selector: 'app-blog',
  templateUrl: './blog.html',
})
export class Blog {
  private readonly content = inject(FirestoreContentService);
  protected readonly postsState = toSignal(this.content.watchPosts(), {
    initialValue: INITIAL_POSTS_STATE,
  });

  protected readonly selectedCategory = signal<string | null>(null);

  protected readonly categories = computed(() => {
    const cats = new Set<string>();
    for (const post of this.postsState().items) {
      if (post.category) cats.add(post.category);
    }
    return Array.from(cats).sort();
  });

  protected readonly filteredPosts = computed(() => {
    const category = this.selectedCategory();
    const items = this.postsState().items;
    if (!category) return items;
    return items.filter((post) => post.category === category);
  });

  protected setCategory(category: string | null): void {
    this.selectedCategory.set(category);
  }
}
