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

export const hardQuestions: QuizQuestion[] = [
    {
        id: 'hard-1',
        type: 'qcm',
        question: {
            fr: 'Quelle est la différence entre une deep copy et une shallow copy en JavaScript ?',
            en: 'What is the difference between a deep copy and a shallow copy in JavaScript?'
        },
        options: {
            fr: [
                'Deep copy copie tous les niveaux, shallow copy seulement le premier niveau',
                'Shallow copy est plus rapide', 'Aucune différence', 'Deep copy est obsolète'
            ],
            en: [
                'Deep copy copies all levels, shallow copy only the first level', 'Shallow copy is faster',
                'No difference', 'Deep copy is deprecated'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Une shallow copy copie seulement le premier niveau, tandis qu\'une deep copy copie récursivement tous les niveaux imbriqués.',
            en: 'A shallow copy copies only the first level, while a deep copy recursively copies all nested levels.'
        }
    },
    {
        id: 'hard-2',
        type: 'true-false',
        question: {
            fr: 'Le protocole OAuth 2.0 utilise uniquement des tokens d\'accès, pas de tokens de rafraîchissement.',
            en: 'OAuth 2.0 protocol uses only access tokens, not refresh tokens.'
        },
        correctAnswer: 1,
        explanation: {
            fr: 'Non, OAuth 2.0 utilise à la fois des access tokens (courte durée) et des refresh tokens (longue durée) pour renouveler les access tokens.',
            en: 'No, OAuth 2.0 uses both access tokens (short-lived) and refresh tokens (long-lived) to renew access tokens.'
        }
    },
    {
        id: 'hard-3',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le time complexity d\'un algorithme de tri par fusion (merge sort) ?',
            en: 'What is the time complexity of merge sort algorithm?'
        },
        options: {
            fr: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
            en: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le tri par fusion a une complexité temporelle de O(n log n) dans tous les cas (meilleur, moyen et pire).',
            en: 'Merge sort has a time complexity of O(n log n) in all cases (best, average, and worst).'
        }
    },
    {
        id: 'hard-4',
        type: 'qcm',
        question: {
            fr: 'Quelle est la principale vulnérabilité du mode ECB (Electronic Codebook) en chiffrement ?',
            en: 'What is the main vulnerability of ECB (Electronic Codebook) mode in encryption?'
        },
        options: {
            fr: [
                'Les blocs identiques produisent le même chiffrement', 'Il est trop lent',
                'Il nécessite trop de mémoire', 'Il n\'est pas sécurisé du tout'
            ],
            en: [
                'Identical blocks produce the same ciphertext', 'It is too slow', 'It requires too much memory',
                'It is not secure at all'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'ECB produit le même chiffrement pour des blocs identiques, révélant des patterns dans les données, ce qui est une faille de sécurité majeure.',
            en: 'ECB produces the same ciphertext for identical blocks, revealing patterns in data, which is a major security flaw.'
        }
    },
    {
        id: 'hard-5',
        type: 'true-false',
        question: {
            fr: 'Les Service Workers peuvent intercepter et modifier les requêtes réseau.',
            en: 'Service Workers can intercept and modify network requests.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les Service Workers agissent comme un proxy entre l\'application et le réseau, permettant d\'intercepter et modifier les requêtes.',
            en: 'Yes, Service Workers act as a proxy between the application and network, allowing interception and modification of requests.'
        }
    },
    {
        id: 'hard-6',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le principe de moindre privilège (principle of least privilege) en sécurité ?',
            en: 'What is the principle of least privilege in security?'
        },
        options: {
            fr: [
                'Accorder uniquement les permissions minimales nécessaires', 'Donner tous les droits par défaut',
                'Une méthode de chiffrement', 'Un protocole réseau'
            ],
            en: [
                'Grant only the minimum permissions necessary', 'Give all rights by default', 'An encryption method',
                'A network protocol'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le principe de moindre privilège consiste à accorder aux utilisateurs et processus uniquement les permissions minimales nécessaires pour accomplir leurs tâches.',
            en: 'The principle of least privilege is to grant users and processes only the minimum permissions necessary to accomplish their tasks.'
        }
    },
    {
        id: 'hard-7',
        type: 'qcm',
        question: {
            fr: 'Quelle est la différence entre useMemo et useCallback en React ?',
            en: 'What is the difference between useMemo and useCallback in React?'
        },
        options: {
            fr: [
                'useMemo mémorise une valeur, useCallback mémorise une fonction', 'useCallback est plus rapide',
                'Aucune différence', 'useMemo est obsolète'
            ],
            en: [
                'useMemo memoizes a value, useCallback memoizes a function', 'useCallback is faster', 'No difference',
                'useMemo is deprecated'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'useMemo retourne une valeur mémorisée, tandis que useCallback retourne une fonction mémorisée.',
            en: 'useMemo returns a memoized value, while useCallback returns a memoized function.'
        }
    },
    {
        id: 'hard-8',
        type: 'true-false',
        question: {
            fr: 'Le hash SHA-256 est réversible, on peut retrouver le texte original à partir du hash.',
            en: 'SHA-256 hash is reversible, you can retrieve the original text from the hash.'
        },
        correctAnswer: 1,
        explanation: {
            fr: 'Non, SHA-256 est une fonction de hachage à sens unique (one-way), il est mathématiquement impossible de retrouver le texte original.',
            en: 'No, SHA-256 is a one-way hash function, it is mathematically impossible to retrieve the original text.'
        }
    },
    {
        id: 'hard-9',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le code splitting dans les applications React ?',
            en: 'What is code splitting in React applications?'
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
            fr: 'Le code splitting permet de diviser le bundle JavaScript en chunks plus petits, chargés uniquement quand nécessaire, améliorant les performances.',
            en: 'Code splitting allows dividing the JavaScript bundle into smaller chunks, loaded only when needed, improving performance.'
        }
    },
    {
        id: 'hard-10',
        type: 'qcm',
        question: {
            fr: 'Quelle est la différence entre authentication et authorization ?',
            en: 'What is the difference between authentication and authorization?'
        },
        options: {
            fr: [
                'Authentication vérifie l\'identité, authorization vérifie les permissions', 'Aucune différence',
                'Authorization est plus sécurisé', 'Authentication est obsolète'
            ],
            en: [
                'Authentication verifies identity, authorization verifies permissions', 'No difference',
                'Authorization is more secure', 'Authentication is deprecated'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Authentication vérifie qui vous êtes (identité), tandis qu\'authorization vérifie ce que vous êtes autorisé à faire (permissions).',
            en: 'Authentication verifies who you are (identity), while authorization verifies what you are allowed to do (permissions).'
        }
    },
    {
        id: 'hard-11',
        type: 'true-false',
        question: {
            fr: 'Les mutations directes du state React sont autorisées et recommandées.',
            en: 'Direct mutations of React state are allowed and recommended.'
        },
        correctAnswer: 1,
        explanation: {
            fr: 'Non, React nécessite des mises à jour immutables du state. Les mutations directes ne déclenchent pas de re-render.',
            en: 'No, React requires immutable state updates. Direct mutations do not trigger re-renders.'
        }
    },
    {
        id: 'hard-12',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce qu\'une race condition dans la programmation asynchrone ?',
            en: 'What is a race condition in asynchronous programming?'
        },
        options: {
            fr: [
                'Un comportement imprévisible lorsque l\'ordre d\'exécution dépend du timing', 'Une erreur de syntaxe',
                'Un type de boucle', 'Une méthode de cache'
            ],
            en: [
                'Unpredictable behavior when execution order depends on timing', 'A syntax error', 'A loop type',
                'A caching method'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Une race condition survient lorsque le résultat dépend de l\'ordre d\'exécution de processus asynchrones, créant un comportement imprévisible.',
            en: 'A race condition occurs when the result depends on the execution order of asynchronous processes, creating unpredictable behavior.'
        }
    },
    {
        id: 'hard-13',
        type: 'qcm',
        question: {
            fr: 'Quelle est la complexité spatiale d\'un algorithme de tri en place (in-place) ?',
            en: 'What is the space complexity of an in-place sorting algorithm?'
        },
        options: {
            fr: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
            en: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Un algorithme de tri en place utilise un espace mémoire constant O(1), modifiant le tableau directement sans créer de copie.',
            en: 'An in-place sorting algorithm uses constant space O(1), modifying the array directly without creating a copy.'
        }
    },
    {
        id: 'hard-14',
        type: 'true-false',
        question: {
            fr: 'Le Same-Origin Policy empêche les scripts d\'un domaine d\'accéder aux données d\'un autre domaine.',
            en: 'Same-Origin Policy prevents scripts from one domain from accessing data from another domain.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, la Same-Origin Policy est un mécanisme de sécurité qui restreint l\'accès aux ressources entre différentes origines.',
            en: 'Yes, Same-Origin Policy is a security mechanism that restricts access to resources between different origins.'
        }
    },
    {
        id: 'hard-15',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le Virtual DOM en React ?',
            en: 'What is the Virtual DOM in React?'
        },
        options: {
            fr: [
                'Une représentation JavaScript en mémoire du DOM réel', 'Le DOM réel du navigateur',
                'Une méthode de cache', 'Un type de composant'
            ],
            en: [
                'A JavaScript in-memory representation of the real DOM', 'The browser\'s real DOM', 'A caching method',
                'A component type'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le Virtual DOM est une représentation JavaScript légère du DOM réel, permettant à React d\'optimiser les mises à jour.',
            en: 'The Virtual DOM is a lightweight JavaScript representation of the real DOM, allowing React to optimize updates.'
        }
    },
    {
        id: 'hard-16',
        type: 'qcm',
        question: {
            fr: 'Quelle est la différence entre un salt et un pepper en cryptographie ?',
            en: 'What is the difference between a salt and a pepper in cryptography?'
        },
        options: {
            fr: [
                'Salt est unique par utilisateur, pepper est partagé et secret', 'Pepper est plus long',
                'Aucune différence', 'Salt est obsolète'
            ],
            en: [
                'Salt is unique per user, pepper is shared and secret', 'Pepper is longer', 'No difference',
                'Salt is deprecated'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Un salt est unique par utilisateur et stocké avec le hash, tandis qu\'un pepper est un secret partagé stocké séparément.',
            en: 'A salt is unique per user and stored with the hash, while a pepper is a shared secret stored separately.'
        }
    },
    {
        id: 'hard-17',
        type: 'true-false',
        question: {
            fr: 'Les closures en JavaScript permettent à une fonction d\'accéder aux variables de sa portée externe même après que cette portée soit fermée.',
            en: 'Closures in JavaScript allow a function to access variables from its outer scope even after that scope is closed.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les closures permettent à une fonction interne d\'accéder aux variables de la fonction externe même après son exécution.',
            en: 'Yes, closures allow an inner function to access variables from the outer function even after it has executed.'
        }
    },
    {
        id: 'hard-18',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le double spending dans le contexte de la blockchain ?',
            en: 'What is double spending in the context of blockchain?'
        },
        options: {
            fr: [
                'Dépenser la même unité de valeur deux fois', 'Une méthode de chiffrement', 'Un type de transaction',
                'Une erreur de calcul'
            ],
            en: [
                'Spending the same unit of value twice', 'An encryption method', 'A transaction type',
                'A calculation error'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le double spending est le problème de dépenser la même unité de valeur numérique deux fois, résolu par la blockchain via le consensus.',
            en: 'Double spending is the problem of spending the same unit of digital value twice, solved by blockchain through consensus.'
        }
    },
    {
        id: 'hard-19',
        type: 'qcm',
        question: {
            fr: 'Quelle est la différence entre un WeakMap et un Map en JavaScript ?',
            en: 'What is the difference between a WeakMap and a Map in JavaScript?'
        },
        options: {
            fr: [
                'WeakMap a des clés faibles et ne peut pas être itéré', 'Map est plus rapide', 'Aucune différence',
                'WeakMap est obsolète'
            ],
            en: [
                'WeakMap has weak keys and cannot be iterated', 'Map is faster', 'No difference',
                'WeakMap is deprecated'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'WeakMap utilise des références faibles pour les clés (permettant le garbage collection) et ne peut pas être itéré, contrairement à Map.',
            en: 'WeakMap uses weak references for keys (allowing garbage collection) and cannot be iterated, unlike Map.'
        }
    },
    {
        id: 'hard-20',
        type: 'true-false',
        question: {
            fr: 'Le protocole HTTP/2 permet le multiplexing, permettant plusieurs requêtes sur une seule connexion TCP.',
            en: 'HTTP/2 protocol allows multiplexing, enabling multiple requests over a single TCP connection.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, HTTP/2 introduit le multiplexing qui permet d\'envoyer plusieurs requêtes simultanément sur une seule connexion TCP.',
            en: 'Yes, HTTP/2 introduces multiplexing which allows sending multiple requests simultaneously over a single TCP connection.'
        }
    },
    {
        id: 'hard-21',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "lifting state up" en React ?',
            en: 'What is the concept of "lifting state up" in React?'
        },
        options: {
            fr: [
                'Déplacer le state vers le composant parent commun', 'Élever le state vers le DOM',
                'Une méthode de cache', 'Un type de hook'
            ],
            en: [
                'Moving state up to the common parent component', 'Lifting state to the DOM', 'A caching method',
                'A hook type'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Lifting state up consiste à déplacer le state partagé vers le composant parent commun le plus proche.',
            en: 'Lifting state up involves moving shared state to the closest common parent component.'
        }
    },
    {
        id: 'hard-22',
        type: 'qcm',
        question: {
            fr: 'Quelle est la principale différence entre AES-128 et AES-256 ?',
            en: 'What is the main difference between AES-128 and AES-256?'
        },
        options: {
            fr: [
                'La longueur de la clé (128 bits vs 256 bits)', 'La vitesse d\'exécution', 'Le type de chiffrement',
                'Aucune différence'
            ],
            en: ['The key length (128 bits vs 256 bits)', 'The execution speed', 'The encryption type', 'No difference']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'AES-128 utilise une clé de 128 bits tandis qu\'AES-256 utilise une clé de 256 bits, offrant une sécurité renforcée.',
            en: 'AES-128 uses a 128-bit key while AES-256 uses a 256-bit key, offering enhanced security.'
        }
    },
    {
        id: 'hard-23',
        type: 'true-false',
        question: {
            fr: 'Les Server Components dans Next.js 13+ s\'exécutent uniquement côté serveur et ne sont pas inclus dans le bundle client.',
            en: 'Server Components in Next.js 13+ run only on the server and are not included in the client bundle.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les Server Components s\'exécutent uniquement côté serveur, réduisant la taille du bundle JavaScript client.',
            en: 'Yes, Server Components run only on the server, reducing the client JavaScript bundle size.'
        }
    },
    {
        id: 'hard-24',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "event delegation" en JavaScript ?',
            en: 'What is the concept of "event delegation" in JavaScript?'
        },
        options: {
            fr: [
                'Attacher un listener sur un parent pour gérer les événements des enfants',
                'Déléguer les événements au serveur', 'Une méthode de cache', 'Un type d\'événement'
            ],
            en: [
                'Attaching a listener on a parent to handle children events', 'Delegating events to server',
                'A caching method', 'An event type'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'L\'event delegation consiste à attacher un listener sur un élément parent pour gérer les événements de ses enfants, améliorant les performances.',
            en: 'Event delegation involves attaching a listener on a parent element to handle its children\'s events, improving performance.'
        }
    },
    {
        id: 'hard-25',
        type: 'qcm',
        question: {
            fr: 'Quelle est la complexité temporelle de la recherche dans un arbre binaire de recherche équilibré ?',
            en: 'What is the time complexity of searching in a balanced binary search tree?'
        },
        options: {
            fr: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'],
            en: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Dans un arbre binaire de recherche équilibré, la recherche a une complexité de O(log n) car on divise l\'espace de recherche par deux à chaque niveau.',
            en: 'In a balanced binary search tree, search has O(log n) complexity because we divide the search space by two at each level.'
        }
    },
    {
        id: 'hard-26',
        type: 'true-false',
        question: {
            fr: 'Le protocole WebSocket utilise le même port que HTTP (80) ou HTTPS (443).',
            en: 'WebSocket protocol uses the same port as HTTP (80) or HTTPS (443).'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, WebSocket commence par une connexion HTTP/HTTPS normale puis upgrade vers WebSocket, utilisant les mêmes ports.',
            en: 'Yes, WebSocket starts with a normal HTTP/HTTPS connection then upgrades to WebSocket, using the same ports.'
        }
    },
    {
        id: 'hard-27',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "memoization" en programmation ?',
            en: 'What is the concept of "memoization" in programming?'
        },
        options: {
            fr: [
                'Stocker les résultats de calculs coûteux pour éviter de les recalculer', 'Une méthode de compression',
                'Un type de cache', 'Une erreur de mémoire'
            ],
            en: [
                'Storing results of expensive calculations to avoid recalculating', 'A compression method',
                'A cache type', 'A memory error'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La mémorisation consiste à stocker les résultats de calculs coûteux dans un cache pour éviter de les recalculer avec les mêmes entrées.',
            en: 'Memoization involves storing results of expensive calculations in a cache to avoid recalculating with the same inputs.'
        }
    },
    {
        id: 'hard-28',
        type: 'qcm',
        question: {
            fr: 'Quelle est la différence entre un certificat SSL auto-signé et un certificat signé par une autorité de certification ?',
            en: 'What is the difference between a self-signed SSL certificate and one signed by a certificate authority?'
        },
        options: {
            fr: [
                'Un certificat signé par une CA est vérifié et approuvé par les navigateurs', 'Aucune différence',
                'Les auto-signés sont plus sécurisés', 'Les CA sont obsolètes'
            ],
            en: [
                'A CA-signed certificate is verified and trusted by browsers', 'No difference',
                'Self-signed are more secure', 'CAs are deprecated'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Un certificat signé par une CA est vérifié et approuvé par les navigateurs, tandis qu\'un auto-signé génère un avertissement de sécurité.',
            en: 'A CA-signed certificate is verified and trusted by browsers, while a self-signed one generates a security warning.'
        }
    },
    {
        id: 'hard-29',
        type: 'true-false',
        question: {
            fr: 'Les Generators en JavaScript permettent de créer des fonctions itérables avec yield.',
            en: 'Generators in JavaScript allow creating iterable functions with yield.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les Generators sont des fonctions spéciales qui peuvent être mises en pause et reprises, utilisant yield pour produire des valeurs.',
            en: 'Yes, Generators are special functions that can be paused and resumed, using yield to produce values.'
        }
    },
    {
        id: 'hard-30',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "defense in depth" en cybersécurité ?',
            en: 'What is the concept of "defense in depth" in cybersecurity?'
        },
        options: {
            fr: [
                'Utiliser plusieurs couches de sécurité pour protéger un système',
                'Une seule couche de sécurité maximale', 'Une méthode de chiffrement', 'Un type de firewall'
            ],
            en: [
                'Using multiple layers of security to protect a system', 'A single maximum security layer',
                'An encryption method', 'A firewall type'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La défense en profondeur consiste à utiliser plusieurs couches de sécurité indépendantes pour protéger un système, réduisant le risque de compromission.',
            en: 'Defense in depth involves using multiple independent security layers to protect a system, reducing the risk of compromise.'
        }
    },
    {
        id: 'hard-31',
        type: 'qcm',
        question: {
            fr: 'Quelle est la différence entre un thunk et un middleware dans Redux ?',
            en: 'What is the difference between a thunk and a middleware in Redux?'
        },
        options: {
            fr: [
                'Un thunk est un middleware spécifique pour les actions asynchrones',
                'Un middleware est un type de thunk', 'Aucune différence', 'Les thunks sont obsolètes'
            ],
            en: [
                'A thunk is a specific middleware for asynchronous actions', 'A middleware is a type of thunk',
                'No difference', 'Thunks are deprecated'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Un thunk est un middleware Redux qui permet de dispatcher des fonctions au lieu d\'actions simples, utile pour les opérations asynchrones.',
            en: 'A thunk is a Redux middleware that allows dispatching functions instead of plain actions, useful for asynchronous operations.'
        }
    },
    {
        id: 'hard-32',
        type: 'true-false',
        question: {
            fr: 'Le protocole QUIC utilise UDP au lieu de TCP pour améliorer les performances.',
            en: 'QUIC protocol uses UDP instead of TCP to improve performance.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, QUIC (Quick UDP Internet Connections) utilise UDP avec des fonctionnalités de fiabilité et sécurité intégrées, améliorant les performances.',
            en: 'Yes, QUIC (Quick UDP Internet Connections) uses UDP with built-in reliability and security features, improving performance.'
        }
    },
    {
        id: 'hard-33',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "single source of truth" dans la gestion d\'état ?',
            en: 'What is the concept of "single source of truth" in state management?'
        },
        options: {
            fr: [
                'Avoir une seule source fiable pour l\'état de l\'application', 'Avoir plusieurs sources d\'état',
                'Une méthode de cache', 'Un type de base de données'
            ],
            en: [
                'Having a single reliable source for application state', 'Having multiple state sources',
                'A caching method', 'A database type'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le single source of truth consiste à avoir une seule source fiable pour l\'état de l\'application, évitant les incohérences.',
            en: 'Single source of truth involves having a single reliable source for application state, avoiding inconsistencies.'
        }
    },
    {
        id: 'hard-34',
        type: 'qcm',
        question: {
            fr: 'Quelle est la différence entre un hash et un HMAC (Hash-based Message Authentication Code) ?',
            en: 'What is the difference between a hash and an HMAC (Hash-based Message Authentication Code)?'
        },
        options: {
            fr: [
                'HMAC utilise une clé secrète pour authentifier le message', 'Hash est plus sécurisé',
                'Aucune différence', 'HMAC est obsolète'
            ],
            en: [
                'HMAC uses a secret key to authenticate the message', 'Hash is more secure', 'No difference',
                'HMAC is deprecated'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'HMAC combine un hash avec une clé secrète, permettant de vérifier à la fois l\'intégrité et l\'authenticité d\'un message.',
            en: 'HMAC combines a hash with a secret key, allowing verification of both integrity and authenticity of a message.'
        }
    },
    {
        id: 'hard-35',
        type: 'true-false',
        question: {
            fr: 'Les Web Workers permettent d\'exécuter du JavaScript dans un thread séparé du thread principal.',
            en: 'Web Workers allow executing JavaScript in a thread separate from the main thread.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les Web Workers permettent d\'exécuter du code JavaScript dans un thread séparé, évitant de bloquer le thread principal.',
            en: 'Yes, Web Workers allow executing JavaScript code in a separate thread, avoiding blocking the main thread.'
        }
    },
    {
        id: 'hard-36',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "idempotence" dans les API REST ?',
            en: 'What is the concept of "idempotence" in REST APIs?'
        },
        options: {
            fr: [
                'Effectuer la même requête plusieurs fois produit le même résultat', 'Une méthode de cache',
                'Un type de requête', 'Une erreur de requête'
            ],
            en: [
                'Performing the same request multiple times produces the same result', 'A caching method',
                'A request type', 'A request error'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'L\'idempotence signifie qu\'effectuer la même requête plusieurs fois produit le même résultat, importante pour les méthodes PUT et DELETE.',
            en: 'Idempotence means performing the same request multiple times produces the same result, important for PUT and DELETE methods.'
        }
    },
    {
        id: 'hard-37',
        type: 'qcm',
        question: {
            fr: 'Quelle est la différence entre un JWT (JSON Web Token) et un session token classique ?',
            en: 'What is the difference between a JWT (JSON Web Token) and a classic session token?'
        },
        options: {
            fr: [
                'JWT est stateless et contient les données, session token nécessite un stockage serveur',
                'Session token est plus sécurisé', 'Aucune différence', 'JWT est obsolète'
            ],
            en: [
                'JWT is stateless and contains data, session token requires server storage',
                'Session token is more secure', 'No difference', 'JWT is deprecated'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'JWT est stateless et contient les données dans le token, tandis qu\'un session token nécessite un stockage côté serveur pour les données de session.',
            en: 'JWT is stateless and contains data in the token, while a session token requires server-side storage for session data.'
        }
    },
    {
        id: 'hard-38',
        type: 'true-false',
        question: {
            fr: 'Le protocole TLS 1.3 réduit le nombre de round-trips nécessaires pour établir une connexion sécurisée.',
            en: 'TLS 1.3 protocol reduces the number of round-trips needed to establish a secure connection.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, TLS 1.3 réduit le handshake de 2 round-trips à 1, améliorant les performances et la sécurité.',
            en: 'Yes, TLS 1.3 reduces the handshake from 2 round-trips to 1, improving performance and security.'
        }
    },
    {
        id: 'hard-39',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "dependency injection" en programmation ?',
            en: 'What is the concept of "dependency injection" in programming?'
        },
        options: {
            fr: [
                'Fournir les dépendances d\'un objet de l\'extérieur plutôt que de les créer à l\'intérieur',
                'Créer toutes les dépendances à l\'intérieur', 'Une méthode de cache', 'Un type de fonction'
            ],
            en: [
                'Providing an object\'s dependencies from outside rather than creating them inside',
                'Creating all dependencies inside', 'A caching method', 'A function type'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'L\'injection de dépendances consiste à fournir les dépendances d\'un objet de l\'extérieur, améliorant la testabilité et la flexibilité.',
            en: 'Dependency injection involves providing an object\'s dependencies from outside, improving testability and flexibility.'
        }
    },
    {
        id: 'hard-40',
        type: 'qcm',
        question: {
            fr: 'Quelle est la différence entre un CSRF token et un JWT token ?',
            en: 'What is the difference between a CSRF token and a JWT token?'
        },
        options: {
            fr: [
                'CSRF token protège contre CSRF, JWT est pour l\'authentification', 'JWT protège contre CSRF',
                'Aucune différence', 'CSRF token est obsolète'
            ],
            en: [
                'CSRF token protects against CSRF, JWT is for authentication', 'JWT protects against CSRF',
                'No difference', 'CSRF token is deprecated'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Un CSRF token protège contre les attaques CSRF en validant l\'origine des requêtes, tandis qu\'un JWT est utilisé pour l\'authentification et l\'authorization.',
            en: 'A CSRF token protects against CSRF attacks by validating request origin, while a JWT is used for authentication and authorization.'
        }
    },
    {
        id: 'hard-41',
        type: 'true-false',
        question: {
            fr: 'Les React Server Components peuvent utiliser des hooks comme useState et useEffect.',
            en: 'React Server Components can use hooks like useState and useEffect.'
        },
        correctAnswer: 1,
        explanation: {
            fr: 'Non, les Server Components s\'exécutent uniquement côté serveur et ne peuvent pas utiliser de hooks qui nécessitent un état client.',
            en: 'No, Server Components run only on the server and cannot use hooks that require client state.'
        }
    },
    {
        id: 'hard-42',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "event loop" en JavaScript ?',
            en: 'What is the concept of "event loop" in JavaScript?'
        },
        options: {
            fr: [
                'Un mécanisme qui gère l\'exécution asynchrone en JavaScript', 'Une boucle de code',
                'Une méthode de cache', 'Un type de fonction'
            ],
            en: [
                'A mechanism that manages asynchronous execution in JavaScript', 'A code loop', 'A caching method',
                'A function type'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'L\'event loop est le mécanisme qui gère l\'exécution asynchrone en JavaScript, gérant la pile d\'exécution et la file d\'attente des callbacks.',
            en: 'The event loop is the mechanism that manages asynchronous execution in JavaScript, managing the execution stack and callback queue.'
        }
    },
    {
        id: 'hard-43',
        type: 'qcm',
        question: {
            fr: 'Quelle est la différence entre un certificat wildcard et un certificat SAN (Subject Alternative Name) ?',
            en: 'What is the difference between a wildcard certificate and a SAN (Subject Alternative Name) certificate?'
        },
        options: {
            fr: [
                'Wildcard couvre *.domain.com, SAN liste plusieurs domaines spécifiques', 'SAN est plus sécurisé',
                'Aucune différence', 'Wildcard est obsolète'
            ],
            en: [
                'Wildcard covers *.domain.com, SAN lists multiple specific domains', 'SAN is more secure',
                'No difference', 'Wildcard is deprecated'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Un certificat wildcard couvre tous les sous-domaines (*.domain.com), tandis qu\'un SAN liste plusieurs domaines spécifiques.',
            en: 'A wildcard certificate covers all subdomains (*.domain.com), while a SAN lists multiple specific domains.'
        }
    },
    {
        id: 'hard-44',
        type: 'true-false',
        question: {
            fr: 'Le protocole HTTP/3 utilise QUIC au lieu de TCP comme protocole de transport.',
            en: 'HTTP/3 protocol uses QUIC instead of TCP as the transport protocol.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, HTTP/3 utilise QUIC qui est basé sur UDP, offrant de meilleures performances que HTTP/2 basé sur TCP.',
            en: 'Yes, HTTP/3 uses QUIC which is based on UDP, offering better performance than HTTP/2 based on TCP.'
        }
    },
    {
        id: 'hard-45',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "tree shaking" dans le bundling JavaScript ?',
            en: 'What is the concept of "tree shaking" in JavaScript bundling?'
        },
        options: {
            fr: [
                'Éliminer le code mort non utilisé du bundle final', 'Ajouter du code supplémentaire',
                'Une méthode de compression', 'Un type de cache'
            ],
            en: [
                'Eliminating unused dead code from the final bundle', 'Adding additional code', 'A compression method',
                'A cache type'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le tree shaking est une technique d\'optimisation qui élimine le code mort (non utilisé) du bundle final, réduisant sa taille.',
            en: 'Tree shaking is an optimization technique that eliminates dead (unused) code from the final bundle, reducing its size.'
        }
    },
    {
        id: 'hard-46',
        type: 'qcm',
        question: {
            fr: 'Quelle est la différence entre un rate limiting basé sur IP et un rate limiting basé sur token ?',
            en: 'What is the difference between IP-based rate limiting and token-based rate limiting?'
        },
        options: {
            fr: [
                'IP-based limite par adresse, token-based limite par utilisateur authentifié',
                'Token-based est plus rapide', 'Aucune différence', 'IP-based est obsolète'
            ],
            en: [
                'IP-based limits by address, token-based limits by authenticated user', 'Token-based is faster',
                'No difference', 'IP-based is deprecated'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le rate limiting basé sur IP limite les requêtes par adresse IP, tandis que le token-based limite par utilisateur authentifié, plus précis.',
            en: 'IP-based rate limiting limits requests by IP address, while token-based limits by authenticated user, more precise.'
        }
    },
    {
        id: 'hard-47',
        type: 'true-false',
        question: {
            fr: 'Les Proxies en JavaScript permettent d\'intercepter et personnaliser les opérations sur les objets.',
            en: 'Proxies in JavaScript allow intercepting and customizing operations on objects.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les Proxies permettent de créer un objet qui intercepte et personnalise les opérations fondamentales (lecture, écriture, etc.).',
            en: 'Yes, Proxies allow creating an object that intercepts and customizes fundamental operations (reading, writing, etc.).'
        }
    },
    {
        id: 'hard-48',
        type: 'qcm',
        question: {
            fr: 'Qu\'est-ce que le concept de "zero trust" en cybersécurité ?',
            en: 'What is the concept of "zero trust" in cybersecurity?'
        },
        options: {
            fr: [
                'Ne faire confiance à aucun utilisateur ou appareil par défaut',
                'Faire confiance à tous les utilisateurs', 'Une méthode de chiffrement', 'Un type de firewall'
            ],
            en: ['Trust no user or device by default', 'Trust all users', 'An encryption method', 'A firewall type']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Le zero trust est un modèle de sécurité qui ne fait confiance à aucun utilisateur ou appareil par défaut, vérifiant chaque accès.',
            en: 'Zero trust is a security model that trusts no user or device by default, verifying every access.'
        }
    },
    {
        id: 'hard-49',
        type: 'qcm',
        question: {
            fr: 'Quelle est la différence entre un polyfill et un transpiler ?',
            en: 'What is the difference between a polyfill and a transpiler?'
        },
        options: {
            fr: [
                'Polyfill ajoute des fonctionnalités manquantes, transpiler convertit le code',
                'Transpiler est plus rapide', 'Aucune différence', 'Polyfill est obsolète'
            ],
            en: [
                'Polyfill adds missing features, transpiler converts code', 'Transpiler is faster', 'No difference',
                'Polyfill is deprecated'
            ]
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Un polyfill ajoute des fonctionnalités manquantes dans un environnement, tandis qu\'un transpiler convertit le code d\'un langage à un autre.',
            en: 'A polyfill adds missing features in an environment, while a transpiler converts code from one language to another.'
        }
    },
    {
        id: 'hard-50',
        type: 'true-false',
        question: {
            fr: 'Le protocole gRPC utilise Protocol Buffers pour la sérialisation des données.',
            en: 'gRPC protocol uses Protocol Buffers for data serialization.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, gRPC utilise Protocol Buffers (protobuf) comme format de sérialisation par défaut, offrant une sérialisation binaire efficace.',
            en: 'Yes, gRPC uses Protocol Buffers (protobuf) as the default serialization format, offering efficient binary serialization.'
        }
    }
];
