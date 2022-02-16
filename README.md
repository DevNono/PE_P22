# Projet étudiant

## Prérequis

Vous devez disposer d’au moins : 

- NodeJS v16 / v17 (https://nodejs.org/en/)
- MySQL (https://laragon.org/download/index.html)
- Git (https://git-scm.com/downloads)

## Installation 

```jsx
git clone https://github.com/DevNono/PE_P22

cd ./PE_P22

copy .env.example .env 

npm install

npx sequelize-cli db:migrate // Migration de la base de donnée

npx sequelize-cli db:seed:all // Seeding de la base de donnée

npm run start // Démarrage du projet
```

## Extensions VSCode recommandées
```
ESLint
DotENV
Headwind
Json
Material icon theme
TailwindCSS IntelliSense
Tailwind Docs
Twig Language 2
```