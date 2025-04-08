# TP noté BUT 2 - JS

## Introduction

Le but de ce TP est de créer une API REST.  
Le corps du projet est existant. Vous devez suivre les étapes et compléter les fonctions indiquées.

### Documentations:
- [Express](https://expressjs.com/en/starter/basic-routing.html)
- [Sequelize](https://sequelize.org/docs/v6/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

**Suivez bien les demandes concernant le nom des champs et données de réponses**

### Consignes

- Toutes les routes doivent être préfixées par **/api**.
- Les codes HTTP doivent être respectées.
- Les méthodes HTTP doivent être respectées.
- Aucune donnée sensible de doit apparaitre dans le code. (Utilisez les variables d’environnement).
- Les routes doivent être rangées dans le dossier [/src/routes]().
- Le code logique ne doit pas se trouver dans la route mais dans un contrôleur dédié.
- Les middlewares doivent se trouver dans le dossier [/src/middlewares]()
- Ne pas utiliser des **require** mais des **imports** :
```js
var jwt = require('jsonwebtoken'); ❌
import jwt from 'jsonwebtoken'; ✅
```

## Contenu à rendre

### Gestion des 404
Si une route n’existe pas, un middleware dédié doit l’intercepter.

- Créez un middleware dans le dossier [/src/middlewares]()
- L’inclure dans [/src/app.js]()
- Retourne une erreur 404
- Le body doit contenir une clé **message** qui a pour valeur '**Not found**'

### Gestion des 500
Une gestion globale des erreurs permet de contrôler l’information qui est renvoyée. C’est essentiel pour une sécurité de ne pas dévoiler d’information sur votre architecture d’API.

- Créer un middleware global qui traite les erreurs.


### Créer une BDD

Il faut instancier une connexion à une base de données et vérifier son bon fonctionnement.
- Créez un fichier **.env** à la racine du projet. Renseignez-y les identifiants de connexion à la BDD.
- Dans le fichier [/src/database/database.js](), complétez la fonction **initDb**. Appelez là au démarrage du serveur.
- Créez une fonction **testConnection** dont le but est de tester le bon fonctionnement de votre BDD.
- Créer une route **/api/database-connexion** qui retourne 200 si la BDD est fonctionnelle, 500 sinon.

### Users

Nous allons faire le CRUD (Create Read Update Delete) des utilisateurs.

#### Création du modèle

- Complétez le modèle de base de donnée User dans [src/database/models/user.model.js]().
  - id
  - firstName - requis
  - lastName - requis
  - birthDate - requis - date
  - email - champ unique | type email

#### Création des routes
- Crées les routes :
  - GET [/api/users]()
  - POST [/api/users]()
  - GET [/api/users/:id]()
  - PATCH [/api/users/:id]()
  - DELETE [/api/users/:id]()

#### Validations
Vous devez mettre en place des validations de données et retourner les erreurs.
##### format d’erreurs
En cas d’erreur, le body de votre réponse doit contenir la data dont voici un exemple.

```json
{
  "errors": [
    {
      "property": "firstName",
      "message": "This field is required."
    },
    {
      "property": "email",
      "message": "This email already exists."
    }
  ]
}
```

##### Validations:
- firstName -> required
- lastName -> required
- birthDate -> required | date valide au format **yyyy-mm-dd** | Valider la majorité.
- email -> required | unique | email valide

##### Limiter des données
Dans une API, il est nécessaire de ne pas divulguer toutes les informations. 
Seule les champs **id** **firstName**, **lastName** et **email** doivent êtres exposées.

> **Astuce :**
>- Il est préférable de créer un validateur générique pour le réutiliser sur toutes vos resources.
>- Vous pouvez l’utiliser dans vos contrôleurs ou directement dans vos routes sous la forme d’un middleware.
>- Dans tous les cas, faites une validation standard dans votre contrôleur et refactorisez ensuite.



### Authentification
Nous allons maintenant faire évoluer notre modèle User afin d’y intégrer un authentification.

#### Ajout d’un mot de passe
- La route POST [/api/users]() est la route qui permettra de s’inscrire.
- Ajoutez un champ password dans votre model et votre route POST
- Le mot de passe est obligatoire et doit contenir au **moins 8 caractères**.
- Hachez le mot de passe en bcrypt

#### JWT
Nous allons utiliser un [JWT](https://jwt.io/) pour authentifier les utilisateurs.

##### Créer une clé de sécurité

La commande suivante permet de générer une clé pour signer le JWT. Utilisez la valeur obtenu dans les variables d’environnement.


```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
- Créez une fonction utilitaire qui génère un token (jwt.sign) 
- Créez une route POST [/api/login]() dont le body contient un champ **email** et **password** et retourne une clé **token** d’authentification si les accès sont corrects.

> **Astuce :**
>- Utilisez le package [bcrypt](https://www.npmjs.com/package/bcrypt)
>- Utilisez le package [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

#### Authentification des requêtes

Le JWT obtenu dans [/login]() est un moyen d’indiquer qui fait la requête.  
Pour cela, il faut passer ce token dans toutes les requêtes API.  
Le header **Authorization** est fait pour ça.  
Dans *Postman*, un onglet **Authorization** est présent. Vous pouvez choisir **Bearer Token** dans le select **Auth type**.  
Saisissez le token dans le champ correspondant.

### Middleware
Un middleware d’authentification permet de connaitre quel est l’utilisateur associé à un token.  
Complétez le fichier [auth.middleware.js]() afin d’avoir un middleware qui requière la connexion et un qui est optionnel.  


> **Astuce :**
>- Utilisez req.header
>- Utilisez la méthode verify de JWT
>- ⚠️ Le token reçut dans le header est prefixé par le mot 'Bearer'


### Posts
Nous allons créer des articles qui seront liés à des utilisateurs.  

#### Création du modèle

##### Règles:
- Un utilisateur pourra créer des articles.  
- Un article est créé par un seul utilisateur.  
- Si l’utilisateur est supprimé, tous ses articles associés le sont aussi.
- La clé étrangère est **userId**.  

##### Champs:
- Complétez le modèle de base de donnée Post dans [src/database/models/post.model.js]().
  - id
  - title - requis | entre 3 et 100 caractères
  - content - requis
  - published - requis - boolean

#### Création des routes
- Créer les routes :
  - GET [/api/posts]()
  - POST [/api/posts]()
  - GET [/api/posts/:id]()
  - PATCH [/api/posts/:id]()
  - DELETE [/api/posts/:id]()

#### Restrictions

- Get
  - La route Get ne doit retourner que les posts dont le champ *published* vaut *true*
  - Si un utilisateur est connecté (token), alors il récupère *en plus* tous ses articles non publiés.
- Post
  - Cette route nécessite d’être connecté.
  - L’utilisateur identifié est automatiquement le créateur de l’article.
- Get (:id)
  - Si l’article est publié, n’importe qui peut le voir
  - Sinon, seul le créateur peut le récupérer, les autres obtiennent une réponse 404 (Permet de ne pas donner d’information sur l’existence ou non)
- Patch | Delete
  - Seul le créateur peut modifier et supprimer ses articles

> **Astuce :**
>- Utilisez des middlewares pour autoriser ou non les utilisateur à effectuer certaines actions

#### Filtrer le liste par utilisateur
Nous allons mettre en place un filtre de recherche par utilisateur.
- Ajoutez un paramètre optionnel **user_id** dans l’URL.
- Si le paramètre est envoyé, alors ne renvoyez que les posts publiés de cet utilisateur.

### Gestion des droits
Nous allons faire en sorte de pouvoir donner des droits différents à nos utilisateurs.  
- Faites évoluer votre modèle user pour y inclure le champ **roles** qui sera un tableau de droits.
- Ajoutez ```ROLE_USER``` par défaut à tous les utilisateurs.
- Dans votre base de donnée, ajouter ```ROLE_USER``` dans le tableau de role d’un utilisateur de votre choix.

Vous avez maintenant un utilisateur Admin dans votre base de donnée.  

- Faites en sorte que cet utilisateur puisse voir tous les posts même non publiés, voir, éditer et supprimer n’importe quel post sans restriction.  
- Bloquer également les routes User afin que:
  - La route POST soit public (inscription)
  - La route GET renvoie la liste en indiquant uniquement les champs firstName, lastName et Email
  - La route GET (:id) renvoie les mêmes info que pour la liste mais toutes les informations si l’utilisateur demandé est celui du token
  - La route DELETE est accessible uniquement par l’utilisateur concerné et l’admin 
> **Astuce :**
>- Utilisez DataType.Json

### Documentation
Nous allons mettre en place une documentation de notre API.  
Pour celà, vous devez utiliser [swagger](https://swagger.io).  

> **Astuce:**  
> - [structure](https://swagger.io/docs/specification/v3_0/basic-structure/)
> - Utilisez des [références](https://swagger.io/docs/specification/v3_0/using-ref/) pour séparer votre documentation en plusieurs fichiers.
