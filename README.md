<p align="center">
    <img alt="SAPEP" title="#SAPEP" src="https://drive.google.com/uc?id=155Wo8h5rB6Hp4IXqeB5KCx19vuutFqJO" width="250px" />
</p>

<p align="center">🏥 Sistema Aberto de Prontuário Eletrônico do Paciente - BACKEND🏥</p>

<div align="center">

![GitHub](https://img.shields.io/github/license/CC-UNIP-CAMPINAS/SAPEP-back)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/CC-UNIP-CAMPINAS/SAPEP-back)
![Version](https://img.shields.io/badge/version-1.0.1-green)

</div>

## Sumário

<!--ts-->

-   [Resumo 🚀](#resumo-)
-   [Programa em execução 💻](#programa-em-execução-)
-   [Funcionalidades 💡](#funcionalidades-)
-   [Tecnologias 👨‍💻](#tecnologias-)
-   [Como usar 🔧](#como-usar-)
    -   [Pré Requisitos](#pré-requisitos)
    -   [Prisma](#prisma-)
    -   [Para o desenvolvimento](#para-o-desenvolvimento)
    -   [Para a produção](#para-a-produção)
-   [Como contribuir? 🤜🤛](#como-contribuir-)
    <!--te-->

## Resumo 🚀

Repositório criado como trabalho de conclusão de curso para bacharelado em ciência da computação na Universidade Paulista.
O projeto consiste em um sistema para gerenciamento de prontuários eletrônicos de pacientes utilizando como tecnologia:

-   React
-   Node.JS
-   E Amor 💝

A ideia do projetos era criar um sistema que auxiliasse os profissionais de saúde em seu dia a dia, informatizando toda a parte de gerência dos profissionais e os prontuários dos pacientes, evitando erros e ajudando na saúde mental dos profissionais de saúde.

## Programa em execução 💻

[🎥 Playlist de vídeos do funcionamento 🎬](https://www.youtube.com/watch?v=XLMl-xBSD0Y&list=PLTdKWk6BdL7bPU56ZQ82tDiHYjUo38DXM&index=4)

## Funcionalidades 💡

-   Gerência de usuários (médicos, enfermeiros e administração) por uma interface administrativa;
-   Gerência de pacientes e seus prontuários;
-   Exportação em PDF dos prontuários;
-   Adição de prescrições e relatórios nos prontuários;
-   Reset de senha dos usuários;

## Tecnologias 👨‍💻

Todas as bibliotecas estão listadas no `package.json`, porém essas são as principais tecnologias utilizadas:

-   [Node](https://nodejs.org/en/)

## Como usar 🔧

* Caso não tenha vindo pelo repositório do frontend, após configurar o backend com os próximos passos, visite [este repositório](https://github.com/CC-UNIP-CAMPINAS/SAPEP-front) e siga os passos para ter seu frontend funcional.

### Pré-requisitos

Clone o repositório e então siga os seguintes passos:

Para as variáveis de ambiente pode ser utilizado um arquivo `.env` com o conteúdo:

```
# API
PORT=PORTA_DA_SUA_API
JWT_KEY=CHAVE_ALEATÓRIA

# PRISMA
DATABASE_URL=URL_UTILIZADO_PELO_ORM

# NODE
NODE_ENV=development ou production

# FRONT
FRONT_URL=URL_DO_SEU_FRONTEND

# EMAIL
USER_EMAIL=EMAIL_QUE_SERA_UTILIZADO
PASS_EMAIL=SENHA_DO_EMAIL
```

Ou adicionar os valor para os campos citados acima em sua plataforma de hospedagem.

### Prisma 🏳️‍🌈⃤

O projeto usa como ORM o [Prisma](https://www.prisma.io/) configurado para utilizar MySQL/MariaDB como padrão, porém fique livre para mudar o banco de dados principal levando sempre em consideração a documentação do [Prisma](https://www.prisma.io/).

Caso a situação acima não seja de seu interesse, pode pular essa parte, caso contrário, acesse o arquivo `prisma/schema.prisma` e mude o seguinte parâmetro baseado nos bancos suportados pelo [Prisma](https://www.prisma.io/):

```
datasource db {
  provider = MUDAR_AQUI
  url      = env("DATABASE_URL")
}
```

### Para o desenvolvimento

#### Usando yarn:

```sh
cd SAPEP-back
yarn
yarn migrate
yarn dev
```

#### Usando npm:

```sh
cd SAPEP-back
npm i
npm run migrate
npm run dev
```

Seu banco de dados será preenchido e o sistema irá iniciar.

### Para a produção

#### Usando yarn:

```sh
cd SAPEP-back
yarn
yarn prisma migrate deploy
yarn prisma db seed
yarn start
```

#### Usando npm:

```sh
cd SAPEP-back
npm i
npx prisma migrate deploy
npx prisma db seed
npm run start
```

Seu banco de dados será preenchido e o sistema irá iniciar.

## Como contribuir? 🤜🤛

O sistema foi pensado para ser gratuito e de livre modificação, fique a vontade para adaptar o sistema e disponibiliza-lo ao público! 😁

-   ⭐️ De uma estrela para o projeto;
-   🐛 Procure e reporte bugs;
-   📥 Realize PRs com suas implementações e melhorias;
-   ☕ Por fim, tome um café!
