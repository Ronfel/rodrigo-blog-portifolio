import { Component } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.html',
})
export class Blog {
  protected readonly posts = [
    {
      category: 'DESENVOLVIMENTO',
      title: 'Como começo um projeto web do zero',
      description: 'Um roteiro prático para organizar ideias, definir prioridades e dar os primeiros passos com confiança.',
      date: 'Em breve',
      readingTime: '5 min de leitura',
    },
    {
      category: 'APRENDIZADO',
      title: 'Pequenos hábitos para escrever código melhor',
      description: 'Reflexões sobre consistência, legibilidade e como aprender um pouco a cada entrega.',
      date: 'Em breve',
      readingTime: '4 min de leitura',
    },
    {
      category: 'FRONT-END',
      title: 'Detalhes de interface que fazem diferença',
      description: 'Acessibilidade, estados e feedback: alguns cuidados que deixam produtos mais claros para todos.',
      date: 'Em breve',
      readingTime: '6 min de leitura',
    },
    {
      category: 'FERRAMENTAS',
      title: 'Meu fluxo de trabalho para aprender tecnologias',
      description: 'Como sair da documentação e chegar a uma pequena aplicação que transforma teoria em prática.',
      date: 'Em breve',
      readingTime: '3 min de leitura',
    },
  ];
}
