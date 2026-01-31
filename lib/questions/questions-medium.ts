/*
 * Copyright (c) 2025–2026 Paul Viandier
 * All rights reserved.
 *
 * This source code is proprietary.
 * Commercial use, redistribution, or modification is strictly prohibited
 * without prior written permission.
 *
 * See the LICENSE file in the project root for full license terms.
 */

import { QuizQuestion } from '../quiz-data';

export const mediumQuestions: QuizQuestion[] = [
    {
        id: 'medium-1',
        type: 'qcm',
        question: {
            fr: 'Quelle est la différence principale entre let et var en JavaScript ?',
            en: 'What is the main difference between let and var in JavaScript?'
        },
        options: {
            fr: [
                'let a un scope de bloc, var a un scope de fonction', 'let est plus rapide que var', 'var est obsolète',
                'Aucune différence'
            ],
            en: [
                'let has block scope, var has function scope', 'let is faster than var', 'var is deprecated',
                'No difference'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'let a un scope de bloc, ce qui signifie qu\'il est accessible uniquement dans le bloc où il est déclaré, tandis que var a un scope de fonction.',
            en: 'let has block scope, meaning it is only accessible within the block where it is declared, while var has function scope.'
        }
    },
    {
        id: 'medium-2',
        type: 'true-false',
        question: {
            fr: 'Les hooks React ne peuvent être utilisés que dans des composants fonctionnels.',
            en: 'React hooks can only be used in functional components.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les hooks React (useState, useEffect, etc.) ne peuvent être utilisés que dans des composants fonctionnels ou des hooks personnalisés.',
            en: 'Yes, React hooks (useState, useEffect, etc.) can only be used in functional components or custom hooks.'
        }
    },
    {
        id: 'medium-3',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce qu\'une injection SQL ?',
            en: 'What is SQL injection?'
        },
        options: {
            fr: [
                'Une attaque qui injecte du code SQL malveillant', 'Une méthode d\'optimisation SQL',
                'Un type de base de données', 'Une fonction SQL'
            ],
            en: [
                'An attack that injects malicious SQL code', 'A SQL optimization method', 'A database type',
                'A SQL function'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'L\'injection SQL est une vulnérabilité de sécurité qui permet à un attaquant d\'exécuter des commandes SQL malveillantes.',
            en: 'SQL injection is a security vulnerability that allows an attacker to execute malicious SQL commands.'
        }
    },
    {
        id: 'medium-4',
        type: 'qcm',
        question: {
            fr: 'Quelle est la méthode recommandée pour stocker des mots de passe ?',
            en: 'What is the recommended method for storing passwords?'
        },
        options: {
            fr: [
                'Hachage avec un algorithme adapté (bcrypt, argon2)', 'Chiffrement symétrique', 'Stockage en clair',
                'Compression'
            ],
            en: [
                'Hashing with an appropriate algorithm (bcrypt, argon2)', 'Symmetric encryption', 'Plain text storage',
                'Compression'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Les mots de passe doivent être hachés avec des algorithmes adaptés comme bcrypt ou argon2, jamais stockés en clair.',
            en: 'Passwords should be hashed with appropriate algorithms like bcrypt or argon2, never stored in plain text.'
        }
    },
    {
        id: 'medium-5',
        type: 'true-false',
        question: {
            fr: 'Le CORS (Cross-Origin Resource Sharing) est un mécanisme de sécurité du navigateur.',
            en: 'CORS (Cross-Origin Resource Sharing) is a browser security mechanism.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, CORS est un mécanisme de sécurité qui contrôle les requêtes entre différentes origines.',
            en: 'Yes, CORS is a security mechanism that controls requests between different origins.'
        }
    },
    {
        id: 'medium-6',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le SSR (Server-Side Rendering) ?',
            en: 'What is SSR (Server-Side Rendering)?'
        },
        options: {
            fr: [
                'Le rendu des pages côté serveur avant l\'envoi au client', 'Le rendu uniquement côté client',
                'Une méthode de cache', 'Un protocole réseau'
            ],
            en: [
                'Rendering pages on the server before sending to client', 'Client-side only rendering',
                'A caching method', 'A network protocol'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le SSR consiste à générer le HTML des pages côté serveur avant de les envoyer au navigateur.',
            en: 'SSR involves generating page HTML on the server before sending it to the browser.'
        }
    },
    {
        id: 'medium-7',
        type: 'qcm',
        question: {
            fr: 'Quelle est la différence entre == et === en JavaScript ?',
            en: 'What is the difference between == and === in JavaScript?'
        },
        options: {
            fr: [
                '=== compare valeur et type, == compare seulement la valeur', '== est plus rapide', '=== est obsolète',
                'Aucune différence'
            ],
            en: [
                '=== compares value and type, == compares only value', '== is faster', '=== is deprecated',
                'No difference'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: '=== (strict equality) compare à la fois la valeur et le type, tandis que == (loose equality) effectue une conversion de type avant la comparaison.',
            en: '=== (strict equality) compares both value and type, while == (loose equality) performs type coercion before comparison.'
        }
    },
    {
        id: 'medium-8',
        type: 'true-false',
        question: {
            fr: 'Les tokens JWT (JSON Web Tokens) peuvent être décodés mais pas modifiés sans la clé secrète.',
            en: 'JWT (JSON Web Tokens) can be decoded but not modified without the secret key.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les JWT peuvent être décodés (ils sont en base64), mais la signature empêche la modification sans la clé secrète.',
            en: 'Yes, JWTs can be decoded (they are base64), but the signature prevents modification without the secret key.'
        }
    },
    {
        id: 'medium-9',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce qu\'une attaque XSS (Cross-Site Scripting) ?',
            en: 'What is an XSS (Cross-Site Scripting) attack?'
        },
        options: {
            fr: [
                'L\'injection de code JavaScript malveillant dans une page web', 'Une attaque sur les serveurs',
                'Un type de virus', 'Une méthode de compression'
            ],
            en: [
                'Injection of malicious JavaScript code into a web page', 'An attack on servers', 'A type of virus',
                'A compression method'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'XSS est une vulnérabilité qui permet d\'injecter du code JavaScript malveillant qui s\'exécute dans le navigateur de la victime.',
            en: 'XSS is a vulnerability that allows injecting malicious JavaScript code that executes in the victim\'s browser.'
        }
    },
    {
        id: 'medium-10',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode React permet de mémoriser une valeur calculée ?',
            en: 'Which React method allows memoizing a computed value?'
        },
        options: {
            fr: ['useMemo', 'useState', 'useEffect', 'useCallback'],
            en: ['useMemo', 'useState', 'useEffect', 'useCallback']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'useMemo permet de mémoriser le résultat d\'un calcul coûteux et de ne le recalculer que si les dépendances changent.',
            en: 'useMemo allows memoizing the result of an expensive calculation and only recalculating it if dependencies change.'
        }
    },
    {
        id: 'medium-11',
        type: 'true-false',
        question: {
            fr: 'PostgreSQL est une base de données NoSQL.',
            en: 'PostgreSQL is a NoSQL database.'
        },
        correctAnswer: 1,
        explanation: {
            fr: 'Non, PostgreSQL est une base de données relationnelle (SQL), pas NoSQL.',
            en: 'No, PostgreSQL is a relational (SQL) database, not NoSQL.'
        }
    },
    {
        id: 'medium-12',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le CSRF (Cross-Site Request Forgery) ?',
            en: 'What is CSRF (Cross-Site Request Forgery)?'
        },
        options: {
            fr: [
                'Une attaque qui force un utilisateur à exécuter des actions non désirées',
                'Une méthode d\'optimisation', 'Un type de cookie', 'Une fonction JavaScript'
            ],
            en: [
                'An attack that forces a user to execute unwanted actions', 'An optimization method', 'A cookie type',
                'A JavaScript function'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'CSRF est une attaque qui force un utilisateur authentifié à exécuter des actions non désirées sur une application web.',
            en: 'CSRF is an attack that forces an authenticated user to execute unwanted actions on a web application.'
        }
    },
    {
        id: 'medium-13',
        type: 'qcm',
        question: {
            fr: 'Quelle est la complexité temporelle moyenne d\'une recherche dans un tableau non trié ?',
            en: 'What is the average time complexity of searching in an unsorted array?'
        },
        options: {
            fr: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
            en: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Dans un tableau non trié, il faut parcourir tous les éléments dans le pire des cas, donc O(n).',
            en: 'In an unsorted array, you need to traverse all elements in the worst case, so O(n).'
        }
    },
    {
        id: 'medium-14',
        type: 'true-false',
        question: {
            fr: 'Les Promises en JavaScript peuvent être chaînées avec .then() et .catch().',
            en: 'JavaScript Promises can be chained with .then() and .catch().'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les Promises peuvent être chaînées pour gérer des opérations asynchrones de manière séquentielle.',
            en: 'Yes, Promises can be chained to handle asynchronous operations sequentially.'
        }
    },
    {
        id: 'medium-15',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce qu\'un middleware dans Express.js ?',
            en: 'What is a middleware in Express.js?'
        },
        options: {
            fr: [
                'Une fonction qui s\'exécute entre la requête et la réponse', 'Un type de route', 'Une méthode HTTP',
                'Un protocole'
            ],
            en: [
                'A function that executes between request and response', 'A route type', 'An HTTP method', 'A protocol'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Un middleware est une fonction qui a accès à l\'objet requête, l\'objet réponse et la fonction next dans le cycle requête-réponse.',
            en: 'A middleware is a function that has access to the request object, response object, and next function in the request-response cycle.'
        }
    },
    {
        id: 'medium-16',
        type: 'true-false',
        question: {
            fr: 'Le HTTPS utilise le port 80 par défaut.',
            en: 'HTTPS uses port 80 by default.'
        },
        correctAnswer: 1,
        explanation: {
            fr: 'Non, HTTPS utilise le port 443 par défaut. Le port 80 est utilisé par HTTP.',
            en: 'No, HTTPS uses port 443 by default. Port 80 is used by HTTP.'
        }
    },
    {
        id: 'medium-17',
        type: 'qcm',
        question: {
            fr: 'Quelle est la différence entre const et let en JavaScript ?',
            en: 'What is the difference between const and let in JavaScript?'
        },
        options: {
            fr: [
                'const ne peut pas être réassigné, let peut l\'être', 'const est plus rapide', 'let est obsolète',
                'Aucune différence'
            ],
            en: ['const cannot be reassigned, let can be', 'const is faster', 'let is deprecated', 'No difference']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'const déclare une constante qui ne peut pas être réassignée, tandis que let permet la réassignation.',
            en: 'const declares a constant that cannot be reassigned, while let allows reassignment.'
        }
    },
    {
        id: 'medium-18',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le lazy loading ?',
            en: 'What is lazy loading?'
        },
        options: {
            fr: [
                'Charger des ressources uniquement quand elles sont nécessaires', 'Charger tout en une fois',
                'Une méthode de cache', 'Un type de base de données'
            ],
            en: [
                'Loading resources only when they are needed', 'Loading everything at once', 'A caching method',
                'A database type'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le lazy loading consiste à charger des ressources (images, composants) uniquement lorsqu\'elles sont nécessaires, améliorant les performances.',
            en: 'Lazy loading involves loading resources (images, components) only when needed, improving performance.'
        }
    },
    {
        id: 'medium-19',
        type: 'true-false',
        question: {
            fr: 'Les cookies HTTP peuvent être sécurisés avec l\'attribut Secure et HttpOnly.',
            en: 'HTTP cookies can be secured with the Secure and HttpOnly attributes.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, Secure force HTTPS et HttpOnly empêche l\'accès JavaScript aux cookies, réduisant les risques XSS.',
            en: 'Yes, Secure enforces HTTPS and HttpOnly prevents JavaScript access to cookies, reducing XSS risks.'
        }
    },
    {
        id: 'medium-20',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce qu\'un hook personnalisé en React ?',
            en: 'What is a custom hook in React?'
        },
        options: {
            fr: [
                'Une fonction qui commence par "use" et peut utiliser d\'autres hooks', 'Un composant React',
                'Une méthode de rendu', 'Un type de state'
            ],
            en: [
                'A function that starts with "use" and can use other hooks', 'A React component', 'A rendering method',
                'A state type'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Un hook personnalisé est une fonction JavaScript qui commence par "use" et peut appeler d\'autres hooks React.',
            en: 'A custom hook is a JavaScript function that starts with "use" and can call other React hooks.'
        }
    },
    {
        id: 'medium-21',
        type: 'true-false',
        question: {
            fr: 'Le Content Security Policy (CSP) permet de prévenir les attaques XSS.',
            en: 'Content Security Policy (CSP) helps prevent XSS attacks.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, CSP est un mécanisme de sécurité qui permet de contrôler quelles ressources peuvent être chargées et exécutées.',
            en: 'Yes, CSP is a security mechanism that controls which resources can be loaded and executed.'
        }
    },
    {
        id: 'medium-22',
        type: 'qcm',
        question: {
            fr: 'Quelle est la méthode pour créer une copie superficielle (shallow copy) d\'un objet en JavaScript ?',
            en: 'What is the method to create a shallow copy of an object in JavaScript?'
        },
        options: {
            fr: ['Object.assign() ou spread operator', 'Object.clone()', 'Object.copy()', 'Object.duplicate()'],
            en: ['Object.assign() or spread operator', 'Object.clone()', 'Object.copy()', 'Object.duplicate()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Object.assign({}, obj) ou {...obj} créent une copie superficielle d\'un objet.',
            en: 'Object.assign({}, obj) or {...obj} create a shallow copy of an object.'
        }
    },
    {
        id: 'medium-23',
        type: 'true-false',
        question: {
            fr: 'Les WebSockets permettent une communication bidirectionnelle en temps réel.',
            en: 'WebSockets allow bidirectional real-time communication.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les WebSockets établissent une connexion TCP persistante permettant la communication bidirectionnelle en temps réel.',
            en: 'Yes, WebSockets establish a persistent TCP connection allowing bidirectional real-time communication.'
        }
    },
    {
        id: 'medium-24',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le debouncing ?',
            en: 'What is debouncing?'
        },
        options: {
            fr: [
                'Retarder l\'exécution d\'une fonction jusqu\'à ce qu\'un délai soit écoulé', 'Accélérer une fonction',
                'Une méthode de cache', 'Un type d\'événement'
            ],
            en: [
                'Delaying function execution until a delay has passed', 'Speeding up a function', 'A caching method',
                'An event type'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le debouncing retarde l\'exécution d\'une fonction jusqu\'à ce qu\'un certain temps s\'écoule sans nouveaux appels, utile pour les recherches en temps réel.',
            en: 'Debouncing delays function execution until a certain time passes without new calls, useful for real-time searches.'
        }
    },
    {
        id: 'medium-25',
        type: 'true-false',
        question: {
            fr: 'Le localStorage persiste même après la fermeture du navigateur.',
            en: 'localStorage persists even after closing the browser.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, localStorage stocke les données de manière persistante dans le navigateur, même après sa fermeture.',
            en: 'Yes, localStorage stores data persistently in the browser, even after closing it.'
        }
    },
    {
        id: 'medium-26',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le hoisting en JavaScript ?',
            en: 'What is hoisting in JavaScript?'
        },
        options: {
            fr: [
                'Le déplacement des déclarations en haut de leur scope', 'Une méthode de tri', 'Un type de variable',
                'Une erreur de syntaxe'
            ],
            en: [
                'Moving declarations to the top of their scope', 'A sorting method', 'A variable type', 'A syntax error'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le hoisting est le comportement JavaScript qui déplace les déclarations de variables et fonctions en haut de leur scope.',
            en: 'Hoisting is JavaScript behavior that moves variable and function declarations to the top of their scope.'
        }
    },
    {
        id: 'medium-27',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce qu\'un callback en JavaScript ?',
            en: 'What is a callback in JavaScript?'
        },
        options: {
            fr: [
                'Une fonction passée en argument à une autre fonction', 'Un type de boucle', 'Une méthode de tableau',
                'Un opérateur'
            ],
            en: [
                'A function passed as an argument to another function', 'A loop type', 'An array method', 'An operator'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Un callback est une fonction passée en argument à une autre fonction et exécutée plus tard.',
            en: 'A callback is a function passed as an argument to another function and executed later.'
        }
    },
    {
        id: 'medium-28',
        type: 'true-false',
        question: {
            fr: 'Les tableaux JavaScript sont des objets.',
            en: 'JavaScript arrays are objects.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les tableaux JavaScript sont un type spécial d\'objet avec des méthodes et propriétés spécifiques.',
            en: 'Yes, JavaScript arrays are a special type of object with specific methods and properties.'
        }
    },
    {
        id: 'medium-29',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le spread operator (...) en JavaScript ?',
            en: 'What is the spread operator (...) in JavaScript?'
        },
        options: {
            fr: [
                'Un opérateur qui étend un itérable en éléments individuels', 'Un opérateur mathématique',
                'Une méthode de tableau', 'Un type de fonction'
            ],
            en: [
                'An operator that expands an iterable into individual elements', 'A mathematical operator',
                'An array method', 'A function type'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le spread operator (...) permet d\'étendre un itérable (tableau, objet) en éléments individuels.',
            en: 'The spread operator (...) allows expanding an iterable (array, object) into individual elements.'
        }
    },
    {
        id: 'medium-30',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le destructuring en JavaScript ?',
            en: 'What is destructuring in JavaScript?'
        },
        options: {
            fr: [
                'Extraire des valeurs d\'objets ou tableaux dans des variables', 'Détruire un objet',
                'Une méthode de suppression', 'Un type de variable'
            ],
            en: [
                'Extracting values from objects or arrays into variables', 'Destroying an object', 'A deletion method',
                'A variable type'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le destructuring permet d\'extraire des valeurs d\'objets ou tableaux dans des variables distinctes.',
            en: 'Destructuring allows extracting values from objects or arrays into separate variables.'
        }
    },
    {
        id: 'medium-31',
        type: 'true-false',
        question: {
            fr: 'Les fonctions async/await en JavaScript simplifient le code asynchrone.',
            en: 'Async/await functions in JavaScript simplify asynchronous code.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, async/await permet d\'écrire du code asynchrone de manière synchrone et plus lisible.',
            en: 'Yes, async/await allows writing asynchronous code in a synchronous and more readable way.'
        }
    },
    {
        id: 'medium-32',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "pure function" en programmation ?',
            en: 'What is the concept of "pure function" in programming?'
        },
        options: {
            fr: [
                'Une fonction qui retourne toujours le même résultat pour les mêmes entrées', 'Une fonction rapide',
                'Une fonction sans paramètres', 'Une fonction globale'
            ],
            en: [
                'A function that always returns the same result for the same inputs', 'A fast function',
                'A function without parameters', 'A global function'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Une pure function retourne toujours le même résultat pour les mêmes entrées et n\'a pas d\'effets de bord.',
            en: 'A pure function always returns the same result for the same inputs and has no side effects.'
        }
    },
    {
        id: 'medium-33',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "currying" en programmation fonctionnelle ?',
            en: 'What is the concept of "currying" in functional programming?'
        },
        options: {
            fr: [
                'Transformer une fonction à plusieurs arguments en une série de fonctions à un argument',
                'Une méthode de tri', 'Un type de boucle', 'Une erreur'
            ],
            en: [
                'Transforming a multi-argument function into a series of single-argument functions', 'A sorting method',
                'A loop type', 'An error'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le currying transforme une fonction prenant plusieurs arguments en une série de fonctions prenant un argument chacune.',
            en: 'Currying transforms a function taking multiple arguments into a series of functions each taking one argument.'
        }
    },
    {
        id: 'medium-34',
        type: 'true-false',
        question: {
            fr: 'Le sessionStorage stocke les données uniquement pour la session du navigateur.',
            en: 'sessionStorage stores data only for the browser session.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, sessionStorage stocke les données uniquement pour la session actuelle et les supprime à la fermeture de l\'onglet.',
            en: 'Yes, sessionStorage stores data only for the current session and deletes it when the tab closes.'
        }
    },
    {
        id: 'medium-35',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "immutability" en programmation ?',
            en: 'What is the concept of "immutability" in programming?'
        },
        options: {
            fr: [
                'L\'état ne peut pas être modifié après sa création', 'Un état qui change souvent',
                'Une méthode de mutation', 'Un type de variable'
            ],
            en: [
                'State cannot be modified after creation', 'A state that changes often', 'A mutation method',
                'A variable type'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'L\'immutabilité signifie qu\'un objet ne peut pas être modifié après sa création, on crée plutôt de nouveaux objets.',
            en: 'Immutability means an object cannot be modified after creation, instead new objects are created.'
        }
    },
    {
        id: 'medium-36',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "composition" en React ?',
            en: 'What is the concept of "composition" in React?'
        },
        options: {
            fr: [
                'Combiner de petits composants pour créer des composants plus complexes', 'Un type de rendu',
                'Une méthode de state', 'Un hook'
            ],
            en: [
                'Combining small components to create more complex components', 'A rendering type', 'A state method',
                'A hook'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La composition consiste à combiner de petits composants réutilisables pour créer des composants plus complexes.',
            en: 'Composition involves combining small reusable components to create more complex components.'
        }
    },
    {
        id: 'medium-37',
        type: 'true-false',
        question: {
            fr: 'Les props en React sont en lecture seule (read-only).',
            en: 'Props in React are read-only.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les props sont immutables et ne doivent pas être modifiées par le composant enfant.',
            en: 'Yes, props are immutable and should not be modified by the child component.'
        }
    },
    {
        id: 'medium-38',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "higher-order component" (HOC) en React ?',
            en: 'What is the concept of "higher-order component" (HOC) in React?'
        },
        options: {
            fr: [
                'Une fonction qui prend un composant et retourne un nouveau composant', 'Un composant de haut niveau',
                'Un type de hook', 'Une méthode de rendu'
            ],
            en: [
                'A function that takes a component and returns a new component', 'A high-level component',
                'A hook type', 'A rendering method'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Un HOC est une fonction qui prend un composant et retourne un nouveau composant avec des fonctionnalités supplémentaires.',
            en: 'An HOC is a function that takes a component and returns a new component with additional features.'
        }
    },
    {
        id: 'medium-39',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "render props" en React ?',
            en: 'What is the concept of "render props" in React?'
        },
        options: {
            fr: [
                'Une technique où un composant accepte une fonction comme prop pour le rendu', 'Un type de prop',
                'Une méthode de state', 'Un hook'
            ],
            en: [
                'A technique where a component accepts a function as a prop for rendering', 'A prop type',
                'A state method', 'A hook'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Les render props sont une technique où un composant accepte une fonction comme prop pour déterminer ce qu\'il doit rendre.',
            en: 'Render props is a technique where a component accepts a function as a prop to determine what to render.'
        }
    },
    {
        id: 'medium-40',
        type: 'true-false',
        question: {
            fr: 'Le hook useEffect en React peut remplacer componentDidMount, componentDidUpdate et componentWillUnmount.',
            en: 'The useEffect hook in React can replace componentDidMount, componentDidUpdate, and componentWillUnmount.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, useEffect combine les fonctionnalités de ces trois méthodes de cycle de vie des composants de classe.',
            en: 'Yes, useEffect combines the functionality of these three class component lifecycle methods.'
        }
    },
    {
        id: 'medium-41',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "controlled component" en React ?',
            en: 'What is the concept of "controlled component" in React?'
        },
        options: {
            fr: [
                'Un composant dont la valeur est contrôlée par le state React', 'Un composant non contrôlé',
                'Un type de hook', 'Une méthode de rendu'
            ],
            en: [
                'A component whose value is controlled by React state', 'An uncontrolled component', 'A hook type',
                'A rendering method'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Un controlled component est un composant dont la valeur est contrôlée par le state React via des props.',
            en: 'A controlled component is a component whose value is controlled by React state through props.'
        }
    },
    {
        id: 'medium-42',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "uncontrolled component" en React ?',
            en: 'What is the concept of "uncontrolled component" in React?'
        },
        options: {
            fr: [
                'Un composant qui stocke son état dans le DOM plutôt que dans React', 'Un composant sans state',
                'Un type de hook', 'Une erreur'
            ],
            en: [
                'A component that stores its state in the DOM rather than in React', 'A component without state',
                'A hook type', 'An error'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Un uncontrolled component stocke son état dans le DOM et utilise des refs pour accéder aux valeurs.',
            en: 'An uncontrolled component stores its state in the DOM and uses refs to access values.'
        }
    },
    {
        id: 'medium-43',
        type: 'true-false',
        question: {
            fr: 'Le hook useRef en React permet de créer une référence mutable qui persiste entre les renders.',
            en: 'The useRef hook in React allows creating a mutable reference that persists between renders.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, useRef retourne un objet mutable dont la propriété .current peut être modifiée sans déclencher de re-render.',
            en: 'Yes, useRef returns a mutable object whose .current property can be modified without triggering a re-render.'
        }
    },
    {
        id: 'medium-44',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "key prop" en React ?',
            en: 'What is the concept of "key prop" in React?'
        },
        options: {
            fr: [
                'Un identifiant unique pour aider React à identifier les éléments dans une liste',
                'Une clé de chiffrement', 'Un type de prop', 'Une méthode'
            ],
            en: [
                'A unique identifier to help React identify elements in a list', 'An encryption key', 'A prop type',
                'A method'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La key prop aide React à identifier quels éléments ont changé, été ajoutés ou supprimés dans une liste.',
            en: 'The key prop helps React identify which items have changed, been added, or removed in a list.'
        }
    },
    {
        id: 'medium-45',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "reconciliation" en React ?',
            en: 'What is the concept of "reconciliation" in React?'
        },
        options: {
            fr: [
                'Le processus par lequel React met à jour le DOM de manière efficace', 'Un type de rendu',
                'Une méthode de state', 'Un hook'
            ],
            en: [
                'The process by which React updates the DOM efficiently', 'A rendering type', 'A state method', 'A hook'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La reconciliation est le processus par lequel React compare le Virtual DOM avec le DOM réel et applique les changements nécessaires.',
            en: 'Reconciliation is the process by which React compares the Virtual DOM with the real DOM and applies necessary changes.'
        }
    },
    {
        id: 'medium-46',
        type: 'true-false',
        question: {
            fr: 'Le hook useContext en React permet d\'accéder à un contexte sans utiliser de Consumer.',
            en: 'The useContext hook in React allows accessing a context without using a Consumer.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, useContext simplifie l\'accès au contexte en évitant d\'utiliser le pattern Consumer.',
            en: 'Yes, useContext simplifies context access by avoiding the Consumer pattern.'
        }
    },
    {
        id: 'medium-47',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "code splitting" dans les applications web ?',
            en: 'What is the concept of "code splitting" in web applications?'
        },
        options: {
            fr: [
                'Diviser le code en chunks chargés à la demande', 'Diviser le code en fichiers',
                'Une méthode de compression', 'Un type de rendu'
            ],
            en: [
                'Splitting code into chunks loaded on demand', 'Splitting code into files', 'A compression method',
                'A rendering type'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le code splitting permet de diviser le bundle en chunks plus petits, chargés uniquement quand nécessaire.',
            en: 'Code splitting allows dividing the bundle into smaller chunks, loaded only when needed.'
        }
    },
    {
        id: 'medium-48',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "lazy loading" pour les images ?',
            en: 'What is the concept of "lazy loading" for images?'
        },
        options: {
            fr: [
                'Charger les images uniquement quand elles sont sur le point d\'être visibles',
                'Charger toutes les images en une fois', 'Une méthode de compression', 'Un type d\'image'
            ],
            en: [
                'Loading images only when they are about to be visible', 'Loading all images at once',
                'A compression method', 'An image type'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le lazy loading charge les images uniquement quand elles sont sur le point d\'entrer dans le viewport, améliorant les performances.',
            en: 'Lazy loading loads images only when they are about to enter the viewport, improving performance.'
        }
    },
    {
        id: 'medium-49',
        type: 'true-false',
        question: {
            fr: 'Le concept de "single page application" (SPA) charge une seule page HTML et met à jour le contenu dynamiquement.',
            en: 'The concept of "single page application" (SPA) loads a single HTML page and updates content dynamically.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, une SPA charge une seule page HTML et utilise JavaScript pour mettre à jour le contenu sans recharger la page.',
            en: 'Yes, a SPA loads a single HTML page and uses JavaScript to update content without reloading the page.'
        }
    },
    {
        id: 'medium-50',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "progressive enhancement" en développement web ?',
            en: 'What is the concept of "progressive enhancement" in web development?'
        },
        options: {
            fr: [
                'Créer une base fonctionnelle puis ajouter des fonctionnalités avancées', 'Améliorer progressivement',
                'Une méthode de test', 'Un type de framework'
            ],
            en: [
                'Creating a functional base then adding advanced features', 'Progressively improving',
                'A testing method', 'A framework type'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le progressive enhancement consiste à créer une base fonctionnelle accessible, puis ajouter des fonctionnalités avancées.',
            en: 'Progressive enhancement involves creating an accessible functional base, then adding advanced features.'
        }
    },
    {
        id: 'medium-51',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "memoization" en programmation ?',
            en: 'What is the concept of "memoization" in programming?'
        },
        options: {
            fr: [
                'Stocker les résultats de fonctions coûteuses pour éviter de les recalculer', 'Une méthode de tri',
                'Un type de cache', 'Une erreur'
            ],
            en: [
                'Storing results of expensive functions to avoid recalculating them', 'A sorting method',
                'A cache type', 'An error'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La memoization consiste à mettre en cache les résultats de fonctions coûteuses pour améliorer les performances.',
            en: 'Memoization involves caching results of expensive functions to improve performance.'
        }
    },
    {
        id: 'medium-52',
        type: 'true-false',
        question: {
            fr: 'Le hook useMemo en React permet de mémoriser des valeurs calculées.',
            en: 'The useMemo hook in React allows memoizing calculated values.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, useMemo mémorise le résultat d\'un calcul et ne le recalcule que si ses dépendances changent.',
            en: 'Yes, useMemo memoizes the result of a calculation and only recalculates if its dependencies change.'
        }
    },
    {
        id: 'medium-53',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "closure" en JavaScript ?',
            en: 'What is the concept of "closure" in JavaScript?'
        },
        options: {
            fr: [
                'Une fonction qui a accès aux variables de son scope externe', 'Une méthode de fermeture',
                'Un type de variable', 'Une erreur'
            ],
            en: [
                'A function that has access to variables from its outer scope', 'A closing method', 'A variable type',
                'An error'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Une closure est une fonction qui a accès aux variables de son scope externe même après que ce scope soit fermé.',
            en: 'A closure is a function that has access to variables from its outer scope even after that scope is closed.'
        }
    },
    {
        id: 'medium-54',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "event delegation" en JavaScript ?',
            en: 'What is the concept of "event delegation" in JavaScript?'
        },
        options: {
            fr: [
                'Attacher un gestionnaire d\'événement à un parent plutôt qu\'aux enfants', 'Déléguer des événements',
                'Un type d\'événement', 'Une méthode'
            ],
            en: [
                'Attaching an event handler to a parent rather than children', 'Delegating events', 'An event type',
                'A method'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'L\'event delegation consiste à attacher un gestionnaire d\'événement à un élément parent pour gérer les événements de ses enfants.',
            en: 'Event delegation involves attaching an event handler to a parent element to handle events from its children.'
        }
    },
    {
        id: 'medium-55',
        type: 'true-false',
        question: {
            fr: 'Le hook useCallback en React permet de mémoriser des fonctions.',
            en: 'The useCallback hook in React allows memoizing functions.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, useCallback retourne une version mémorisée d\'une fonction qui ne change que si ses dépendances changent.',
            en: 'Yes, useCallback returns a memoized version of a function that only changes if its dependencies change.'
        }
    },
    {
        id: 'medium-56',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "throttling" en JavaScript ?',
            en: 'What is the concept of "throttling" in JavaScript?'
        },
        options: {
            fr: [
                'Limiter l\'exécution d\'une fonction à une fois par période de temps', 'Accélérer une fonction',
                'Un type de boucle', 'Une méthode'
            ],
            en: [
                'Limiting function execution to once per time period', 'Speeding up a function', 'A loop type',
                'A method'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le throttling limite l\'exécution d\'une fonction à une fois par période de temps, utile pour les événements fréquents.',
            en: 'Throttling limits function execution to once per time period, useful for frequent events.'
        }
    },
    {
        id: 'medium-57',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "prototype chain" en JavaScript ?',
            en: 'What is the concept of "prototype chain" in JavaScript?'
        },
        options: {
            fr: [
                'La chaîne de prototypes permettant l\'héritage en JavaScript', 'Une méthode de chaînage',
                'Un type d\'objet', 'Une erreur'
            ],
            en: [
                'The chain of prototypes enabling inheritance in JavaScript', 'A chaining method', 'An object type',
                'An error'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La prototype chain permet à un objet d\'hériter des propriétés et méthodes de son prototype et des prototypes parents.',
            en: 'The prototype chain allows an object to inherit properties and methods from its prototype and parent prototypes.'
        }
    },
    {
        id: 'medium-58',
        type: 'true-false',
        question: {
            fr: 'Les classes ES6 en JavaScript sont du sucre syntaxique sur le système de prototypes.',
            en: 'ES6 classes in JavaScript are syntactic sugar over the prototype system.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les classes ES6 sont une syntaxe plus claire mais utilisent toujours le système de prototypes sous le capot.',
            en: 'Yes, ES6 classes are clearer syntax but still use the prototype system under the hood.'
        }
    },
    {
        id: 'medium-59',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "virtual DOM" en React ?',
            en: 'What is the concept of "virtual DOM" in React?'
        },
        options: {
            fr: [
                'Une représentation JavaScript en mémoire du DOM réel', 'Le DOM réel', 'Un type de DOM', 'Une méthode'
            ],
            en: ['A JavaScript in-memory representation of the real DOM', 'The real DOM', 'A DOM type', 'A method']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le Virtual DOM est une représentation JavaScript légère du DOM réel, permettant des mises à jour efficaces.',
            en: 'The Virtual DOM is a lightweight JavaScript representation of the real DOM, enabling efficient updates.'
        }
    },
    {
        id: 'medium-60',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "server-side rendering" (SSR) ?',
            en: 'What is the concept of "server-side rendering" (SSR)?'
        },
        options: {
            fr: [
                'Rendre le HTML sur le serveur avant de l\'envoyer au client', 'Rendre sur le client',
                'Un type de rendu', 'Une méthode'
            ],
            en: [
                'Rendering HTML on the server before sending it to the client', 'Rendering on the client',
                'A rendering type', 'A method'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le SSR consiste à générer le HTML sur le serveur, améliorant le SEO et le temps de chargement initial.',
            en: 'SSR involves generating HTML on the server, improving SEO and initial load time.'
        }
    },
    {
        id: 'medium-61',
        type: 'true-false',
        question: {
            fr: 'Le concept de "static site generation" (SSG) génère le HTML au moment du build.',
            en: 'The concept of "static site generation" (SSG) generates HTML at build time.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, le SSG génère toutes les pages HTML au moment du build, créant un site statique ultra-rapide.',
            en: 'Yes, SSG generates all HTML pages at build time, creating an ultra-fast static site.'
        }
    },
    {
        id: 'medium-62',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "hydration" en React ?',
            en: 'What is the concept of "hydration" in React?'
        },
        options: {
            fr: [
                'Attacher les gestionnaires d\'événements au HTML pré-rendu', 'Ajouter de l\'eau', 'Un type de rendu',
                'Une méthode'
            ],
            en: ['Attaching event handlers to pre-rendered HTML', 'Adding water', 'A rendering type', 'A method']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'L\'hydration est le processus d\'attachement des gestionnaires d\'événements React au HTML pré-rendu côté serveur.',
            en: 'Hydration is the process of attaching React event handlers to server-side pre-rendered HTML.'
        }
    },
    {
        id: 'medium-63',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "tree shaking" en JavaScript ?',
            en: 'What is the concept of "tree shaking" in JavaScript?'
        },
        options: {
            fr: [
                'Éliminer le code mort lors du bundling', 'Secouer un arbre', 'Une méthode de tri', 'Un type de bundle'
            ],
            en: ['Eliminating dead code during bundling', 'Shaking a tree', 'A sorting method', 'A bundle type']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le tree shaking élimine le code non utilisé lors du bundling, réduisant la taille du bundle final.',
            en: 'Tree shaking eliminates unused code during bundling, reducing the final bundle size.'
        }
    },
    {
        id: 'medium-64',
        type: 'true-false',
        question: {
            fr: 'Le concept de "polyfill" permet d\'ajouter des fonctionnalités manquantes dans les anciens navigateurs.',
            en: 'The concept of "polyfill" allows adding missing features in older browsers.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, un polyfill est un code qui implémente une fonctionnalité manquante dans un navigateur plus ancien.',
            en: 'Yes, a polyfill is code that implements a missing feature in an older browser.'
        }
    },
    {
        id: 'medium-65',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "transpilation" en JavaScript ?',
            en: 'What is the concept of "transpilation" in JavaScript?'
        },
        options: {
            fr: [
                'Convertir du code d\'un langage à un autre de même niveau d\'abstraction', 'Compiler du code',
                'Traduire du code', 'Une méthode'
            ],
            en: [
                'Converting code from one language to another at the same abstraction level', 'Compiling code',
                'Translating code', 'A method'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La transpilation convertit du code d\'un langage à un autre de même niveau (ex: TypeScript vers JavaScript).',
            en: 'Transpilation converts code from one language to another at the same level (e.g., TypeScript to JavaScript).'
        }
    },
    {
        id: 'medium-66',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "middleware" dans les frameworks web ?',
            en: 'What is the concept of "middleware" in web frameworks?'
        },
        options: {
            fr: [
                'Une fonction qui s\'exécute entre la requête et la réponse', 'Un type de route', 'Une méthode',
                'Une erreur'
            ],
            en: ['A function that executes between request and response', 'A route type', 'A method', 'An error']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Un middleware est une fonction qui intercepte les requêtes et réponses, permettant d\'ajouter des fonctionnalités.',
            en: 'Middleware is a function that intercepts requests and responses, allowing adding features.'
        }
    },
    {
        id: 'medium-67',
        type: 'true-false',
        question: {
            fr: 'Le concept de "REST" (Representational State Transfer) est un style d\'architecture pour les APIs.',
            en: 'The concept of "REST" (Representational State Transfer) is an architectural style for APIs.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, REST est un style d\'architecture qui utilise les méthodes HTTP standard pour les opérations CRUD.',
            en: 'Yes, REST is an architectural style that uses standard HTTP methods for CRUD operations.'
        }
    },
    {
        id: 'medium-68',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "GraphQL" ?',
            en: 'What is the concept of "GraphQL"?'
        },
        options: {
            fr: [
                'Un langage de requête pour les APIs qui permet de demander exactement les données nécessaires',
                'Un type de base de données', 'Une méthode HTTP', 'Un framework'
            ],
            en: [
                'A query language for APIs that allows requesting exactly the needed data', 'A database type',
                'An HTTP method', 'A framework'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'GraphQL est un langage de requête qui permet aux clients de demander exactement les données dont ils ont besoin.',
            en: 'GraphQL is a query language that allows clients to request exactly the data they need.'
        }
    },
    {
        id: 'medium-69',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "WebSocket" ?',
            en: 'What is the concept of "WebSocket"?'
        },
        options: {
            fr: [
                'Un protocole de communication bidirectionnel en temps réel', 'Un type de socket', 'Une méthode HTTP',
                'Un framework'
            ],
            en: ['A bidirectional real-time communication protocol', 'A socket type', 'An HTTP method', 'A framework']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'WebSocket est un protocole qui permet une communication bidirectionnelle en temps réel entre client et serveur.',
            en: 'WebSocket is a protocol that enables bidirectional real-time communication between client and server.'
        }
    },
    {
        id: 'medium-70',
        type: 'true-false',
        question: {
            fr: 'Le concept de "Service Worker" permet de créer des applications web hors ligne.',
            en: 'The concept of "Service Worker" allows creating offline web applications.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les Service Workers permettent de mettre en cache des ressources et de créer des applications web hors ligne.',
            en: 'Yes, Service Workers allow caching resources and creating offline web applications.'
        }
    },
    {
        id: 'medium-71',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "Progressive Web App" (PWA) ?',
            en: 'What is the concept of "Progressive Web App" (PWA)?'
        },
        options: {
            fr: [
                'Une application web qui fonctionne comme une application native', 'Un type d\'application',
                'Une méthode', 'Un framework'
            ],
            en: ['A web application that works like a native app', 'An application type', 'A method', 'A framework']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Une PWA combine les meilleures fonctionnalités web et mobiles : installation, hors ligne, notifications push.',
            en: 'A PWA combines the best web and mobile features: installation, offline, push notifications.'
        }
    },
    {
        id: 'medium-72',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "dependency injection" en programmation ?',
            en: 'What is the concept of "dependency injection" in programming?'
        },
        options: {
            fr: [
                'Fournir les dépendances d\'un objet depuis l\'extérieur plutôt que de les créer à l\'intérieur',
                'Injecter du code', 'Un type de dépendance', 'Une méthode'
            ],
            en: [
                'Providing an object\'s dependencies from outside rather than creating them inside', 'Injecting code',
                'A dependency type', 'A method'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La dependency injection permet de rendre le code plus testable et modulaire en fournissant les dépendances depuis l\'extérieur.',
            en: 'Dependency injection makes code more testable and modular by providing dependencies from outside.'
        }
    },
    {
        id: 'medium-73',
        type: 'true-false',
        question: {
            fr: 'Le concept de "unit testing" teste des unités individuelles de code en isolation.',
            en: 'The concept of "unit testing" tests individual units of code in isolation.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les tests unitaires testent de petites unités de code (fonctions, composants) de manière isolée.',
            en: 'Yes, unit tests test small units of code (functions, components) in isolation.'
        }
    },
    {
        id: 'medium-74',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "integration testing" ?',
            en: 'What is the concept of "integration testing"?'
        },
        options: {
            fr: [
                'Tester l\'interaction entre plusieurs composants ou modules', 'Tester un seul composant',
                'Un type de test', 'Une méthode'
            ],
            en: [
                'Testing the interaction between multiple components or modules', 'Testing a single component',
                'A test type', 'A method'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Les tests d\'intégration vérifient que plusieurs composants fonctionnent correctement ensemble.',
            en: 'Integration tests verify that multiple components work correctly together.'
        }
    },
    {
        id: 'medium-75',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "end-to-end testing" (E2E) ?',
            en: 'What is the concept of "end-to-end testing" (E2E)?'
        },
        options: {
            fr: [
                'Tester l\'application complète du début à la fin comme un utilisateur réel', 'Tester une fonction',
                'Un type de test', 'Une méthode'
            ],
            en: [
                'Testing the complete application from start to end like a real user', 'Testing a function',
                'A test type', 'A method'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Les tests E2E simulent un utilisateur réel et testent l\'application complète du début à la fin.',
            en: 'E2E tests simulate a real user and test the complete application from start to end.'
        }
    },
    {
        id: 'medium-76',
        type: 'true-false',
        question: {
            fr: 'Le concept de "mocking" en tests permet de simuler des dépendances externes.',
            en: 'The concept of "mocking" in tests allows simulating external dependencies.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, le mocking permet de remplacer des dépendances par des versions simulées pour isoler les tests.',
            en: 'Yes, mocking allows replacing dependencies with simulated versions to isolate tests.'
        }
    },
    {
        id: 'medium-77',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "continuous integration" (CI) ?',
            en: 'What is the concept of "continuous integration" (CI)?'
        },
        options: {
            fr: [
                'Automatiser les tests et builds à chaque commit', 'Intégrer continuellement', 'Un type de déploiement',
                'Une méthode'
            ],
            en: [
                'Automating tests and builds on each commit', 'Continuously integrating', 'A deployment type',
                'A method'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La CI automatise les tests et builds à chaque commit pour détecter les problèmes rapidement.',
            en: 'CI automates tests and builds on each commit to detect issues quickly.'
        }
    },
    {
        id: 'medium-78',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "continuous deployment" (CD) ?',
            en: 'What is the concept of "continuous deployment" (CD)?'
        },
        options: {
            fr: [
                'Déployer automatiquement le code en production après les tests', 'Déployer continuellement',
                'Un type de test', 'Une méthode'
            ],
            en: [
                'Automatically deploying code to production after tests', 'Continuously deploying', 'A test type',
                'A method'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La CD déploie automatiquement le code en production après que tous les tests soient passés.',
            en: 'CD automatically deploys code to production after all tests pass.'
        }
    },
    {
        id: 'medium-79',
        type: 'true-false',
        question: {
            fr: 'Le concept de "version control" permet de suivre les changements dans le code au fil du temps.',
            en: 'The concept of "version control" allows tracking code changes over time.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, le contrôle de version (comme Git) permet de suivre, gérer et collaborer sur les changements de code.',
            en: 'Yes, version control (like Git) allows tracking, managing, and collaborating on code changes.'
        }
    },
    {
        id: 'medium-80',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "branch" en Git ?',
            en: 'What is the concept of "branch" in Git?'
        },
        options: {
            fr: [
                'Une ligne de développement indépendante dans un dépôt', 'Une branche d\'arbre', 'Un type de commit',
                'Une méthode'
            ],
            en: ['An independent line of development in a repository', 'A tree branch', 'A commit type', 'A method']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Une branche Git est une ligne de développement indépendante qui permet de travailler sur des fonctionnalités séparément.',
            en: 'A Git branch is an independent line of development that allows working on features separately.'
        }
    }
];

