# La Prairie des rois

## Objectifs
- Cartographier le royaume
- Trouver le chemin le plus court vers l'entrée du labyrinthe
- Trouver le chemin le plus court de l'entrée du labyrinthe au trésor


## Installation du repository
Pour que le projet Prairie fonctionne après avoir cloné le dépôt, vos développeurs doivent suivre ces étapes :

1. Installer Node.js et npm si ce n'est pas déjà fait

2. Naviguer jusqu'à la racine du repository du projet (allez dans le dossier Prairie) 

3. FACULTATIF : Installer TypeScript globalement si non fait : Installe le compilateur TypeScript, qui est nécessaire pour compiler les fichiers .ts en fichiers .js.
```bash
npm install -g typescript
```

4. FACULTATIF : Installer les définitions de types Node.js : Cette étape installe les définitions de types nécessaires pour Node.js, ce qui résout certaines erreurs de compilation TypeScript liées aux types globaux.
```bash
npm install --save-dev @types/node
```
5. Installer les packages du package.json :
```
npm i
```

6. Vérifier la configuration de tsconfig.json : Assurez-vous que le fichier tsconfig.json situé dans le répertoire CDA-Prairie/Prairie contient les compilerOptions suivantes pour assurer une résolution de module et une compilation appropriées pour un environnement de navigateur :

```JSON
{
  "compilerOptions": {
    "moduleResolution": "nodenext",
    "module": "NodeNext",
    "target": "ES2020",
    "esModuleInterop": true
  }
}
```

6. Compiler et servir les fichiers TypeScript : Exécutez le script appelant le compilateur TypeScript puis le serveur, depuis le répertoire CDA-Prairie.

```bash
npm run compile_serve
```
OU

```bash
tsc -p 

```
7. FACULTATIF : Si vous ne pouvez pas utiliser le script, compilez avec :
```bash
cd Prairie
tsc -p 

```
8. FACULTATIF : Si vous ne pouvez pas utiliser le script, servez les fichiers avec :
```bash
serve

```

9.
Depuis le répertoire CDA-Prairie/Prairie/front, démarrez le serveur web serve.

```bash
serve
```

Le serveur démarrera généralement sur http://localhost:3000. Ouvrez cette URL dans un navigateur web pour afficher l'application.

## Ressources
- Liens Cours Graphes :
https://www.programiz.com/dsa/graph
https://ricardoborges.dev/blog/data-structures-in-typescript-graph
https://www.codingame.com/playgrounds/15657/notions-de-bases-de-la-theorie-des-graphes/notions-de-base


- Djikistra :
https://www.geeksforgeeks.org/dsa/dijkstras-shortest-path-algorithm-greedy-algo-7/


- A Star :
https://www.datacamp.com/tutorial/a-star-algorithm
https://www.geeksforgeeks.org/dsa/a-search-algorithm/

# Troubleshooting (en cas de problème)
Si la compilation rencontre des problèmes, supprimez les fichiers .js transpilés (ou le dossier dist si vous avez choisi ce dossier pour recevoir les fichiers compilés), corrigez l'éventuel problème, et re-compilez/servez.
```bash
npm run clean
npm run compile_serve
```

Si prairie.ts ne compile pas (mais les autres oui) :
cd Prairie; npx tsc front/prairie.ts --outDir front/dist 
OU
cd Prairie; npx tsc front/prairie.ts --outDir front\dist 
