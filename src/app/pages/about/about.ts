import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
})
export class About {
  protected readonly skills = [
    'Python',
    'Delphi',
    'Django',
    'PySide6',
    'Selenium WebDriver',
    'SQL Server',
    'MySQL',
    'Oracle',
    'Git',
    'Scrum',
    'Jira',
  ];
}
