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
   Visitantes podem ler somente documentos com `published: true`; a conta
   administrativa autenticada pode ler rascunhos e criar documentos.
3. Para cadastrar conteúdo localmente, ative **Authentication → Sign-in method
   → Email/Password** e crie no Firebase Authentication o usuário
   `rodrigonflara@gmail.com`. A criação manual da conta no Console não envia
   automaticamente um e-mail de confirmação. Na primeira tentativa de login, o
   formulário do projeto envia o link de verificação e oferece opções para
   reenviá-lo ou conferir se a confirmação já foi feita. As regras permitem
   leituras administrativas e criação de documentos somente para esse usuário
   autenticado e verificado.
4. Execute `npm start` e acesse `/admin/login`. As páginas locais estão
   disponíveis em `/admin/projetos` e `/admin/posts`; os formulários criam os
   documentos e as coleções automaticamente. A gravação é no Firestore remoto
   do projeto `app-explorar`.
5. O build de produção substitui a lista de rotas administrativas por uma lista
   vazia (`src/app/admin.routes.production.ts`). Assim, os formulários e a rota
   de login não são incluídos no app servido em produção. A autenticação e as
   regras do Firestore continuam necessárias, pois esconder rotas não protege o
   banco.

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
  "date": "2026-10-08",
  "readingTime": "5 min de leitura"
}
```

As páginas inicial e Blog acompanham as alterações publicadas no Firestore em
tempo real. Enquanto não houver documentos publicados, exibem uma mensagem de
conteúdo vazio. O formulário de contato continua usando `mailto:` e não grava
mensagens no Firestore.

As regras atuais permitem que o público leia apenas documentos publicados.
Somente a conta administrativa verificada pode criar documentos; atualização
ou exclusão pelo cliente não estão habilitadas.

## Build e testes

```bash
npm run build
npx ng test --watch=false
```
