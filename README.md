# Projet étudiant

## Prérequis

Vous devez disposer d’au moins : 

- NodeJS v16 / v17 (https://nodejs.org/en/)
- MySQL (https://dev.mysql.com/downloads/workbench/)
- Git (https://git-scm.com/downloads)

## Installation 

```jsx
git clone https://github.com/DevNono/PE_P22

cd ./PE_P22

copy .env.exemple .env 

npm install

npx sequelize-cli db:migrate // Migration de la base de donnée

npx sequelize-cli db:seed:all // Seeding de la base de donnée

npm start // Démarrage du projet
```
