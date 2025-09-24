# La Prairie des rois

## Objectifs
- Cartographier le royaume
- Trouver le chemin le plus court vers l'entrée du labyrinthe
- Trouver le chemin le plus court de l'entrée du labyrinthe au trésor

# Installation du repository
Pour que le projet Prairie fonctionne après avoir cloné le dépôt, vos développeurs doivent suivre ces étapes :

1.
Installer Node.js et npm si ce n'est pas déjà fait
2.
Naviguer jusqu'à la racine du repository du projet (allez dans le dossier Prairie) 
3.
Installer TypeScript globalement : Cette commande installe le compilateur TypeScript, qui est nécessaire pour compiler les fichiers .ts en fichiers .js.
```bash
npm install -g typescript
```

4.
Installer les définitions de types Node.js : Cette étape installe les définitions de types nécessaires pour Node.js, ce qui résout certaines erreurs de compilation TypeScript liées aux types globaux.
```bash
npm install --save-dev @types/node
```

5.
Vérifier la configuration de tsconfig.json : Assurez-vous que le fichier tsconfig.json situé dans le répertoire CDA-Prairie/Prairie contient les compilerOptions suivantes pour assurer une résolution de module et une compilation appropriées pour un environnement de navigateur :

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

6.
Compiler les fichiers TypeScript : Exécutez le compilateur TypeScript depuis le répertoire CDA-Prairie/Prairie pour transpiler tous les fichiers .ts en fichiers .js.

```bash
tsc -p .
```
OU 
```bash
npm run compile
```


7.
Naviguer vers le répertoire frontend : Changez le répertoire pour le dossier front, où se trouve le fichier prairie.html.


```bash
cd front
```
8.
Installer serve globalement : serve est un utilitaire de ligne de commande simple qui vous permet de servir rapidement un site statique.

```bash
npm install -g serve
```
OU 
Revenir dans le dossier Prairie et :
OU 
```bash
npm run serve
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

# Issues
Si prairie.ts ne compile pas :
cd Prairie; npx tsc front/prairie.ts --outDir front/dist 
OU
cd Prairie; npx tsc front/prairie.ts --outDir front\dist 