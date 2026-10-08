# Rodrigo — portfólio e blog

Aplicação Angular para apresentar projetos, publicar posts e compartilhar
informações profissionais.

## Desenvolvimento local

```bash
npm install
npm start
```

A aplicação fica disponível em `http://localhost:4200/`.

## Firebase e Firestore

O Firebase Web SDK já está configurado em
[`src/app/firebase/firebase.config.ts`](./src/app/firebase/firebase.config.ts)
para o projeto `app-explorar`. A configuração Web é incluída no cliente Angular;
as regras do Firestore, e não a chave de configuração, controlam o acesso aos
dados.

1. No Firebase Console, habilite o Cloud Firestore no projeto `app-explorar`.
2. Publique as regras do arquivo [`firestore.rules`](./firestore.rules) no
   console ou pelo Firebase CLI (`firebase deploy --project app-explorar --only firestore:rules`).
   Somente documentos com `published: true` podem ser lidos pelo site. Escritas
   pelo cliente ficam bloqueadas.
3. Crie as coleções `projects` e `posts` no Firestore, incluindo os documentos
   publicados com os campos abaixo.

### Coleção `projects`

Cada documento deve conter:

```json
{
  "published": true,
  "order": 1,
  "number": "01",
  "name": "Nome do projeto",
  "description": "Descrição breve do projeto.",
  "technologies": ["Python", "Django"]
}
```

### Coleção `posts`

Cada documento deve conter:

```json
{
  "published": true,
  "order": 1,
  "category": "DESENVOLVIMENTO",
  "title": "Título do post",
  "description": "Resumo do artigo.",
  "date": "8 out. 2026",
  "readingTime": "5 min de leitura"
}
```

As páginas inicial e Blog acompanham as alterações publicadas no Firestore em
tempo real. Enquanto não houver documentos publicados, exibem uma mensagem de
conteúdo vazio. O formulário de contato continua usando `mailto:` e não grava
mensagens no Firestore.

## Build e testes

```bash
npm run build
npx ng test --watch=false
```
