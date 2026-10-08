import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ContentState, FirestoreContentService, Project } from '../../firebase/firestore-content.service';

const INITIAL_PROJECTS_STATE: ContentState<Project> = {
  items: [],
  loading: true,
  error: null,
};

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  templateUrl: './home.html',
})
export class Home {
  private readonly content = inject(FirestoreContentService);
  protected readonly projectsState = toSignal(this.content.watchProjects(), {
    initialValue: INITIAL_PROJECTS_STATE,
  });
}
