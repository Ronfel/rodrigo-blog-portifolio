import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  templateUrl: './home.html',
})
export class Home {
  protected readonly projects = [
    {
      number: '01',
      name: 'Nome do projeto',
      description: 'Conte em uma frase qual problema este projeto resolve e qual foi a sua contribuição.',
      technologies: ['Tecnologia 1', 'Tecnologia 2'],
    },
    {
      number: '02',
      name: 'Outro projeto',
      description: 'Descreva o objetivo, o resultado e o que você aprendeu durante o desenvolvimento.',
      technologies: ['Tecnologia 1', 'Tecnologia 2'],
    },
    {
      number: '03',
      name: 'Mais um trabalho',
      description: 'Adicione aqui um projeto de que você se orgulha e explique brevemente sua proposta.',
      technologies: ['Tecnologia 1', 'Tecnologia 2'],
    },
  ];
}
