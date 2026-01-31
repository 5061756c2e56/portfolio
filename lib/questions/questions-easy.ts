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

export const easyQuestions: QuizQuestion[] = [
    {
        id: 'easy-1',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer un titre principal ?',
            en: 'Which HTML tag is used to create a main heading?'
        },
        options: {
            fr: ['<h1>', '<title>', '<header>', '<head>'],
            en: ['<h1>', '<title>', '<header>', '<head>']
        },
        correctAnswer: 0,
        explanation: {
            fr: '<h1> est la balise HTML utilisée pour créer un titre principal (heading level 1).',
            en: '<h1> is the HTML tag used to create a main heading (heading level 1).'
        }
    },
    {
        id: 'easy-2',
        type: 'true-false',
        question: {
            fr: 'CSS signifie "Cascading Style Sheets".',
            en: 'CSS stands for "Cascading Style Sheets".'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, CSS signifie bien "Cascading Style Sheets" (Feuilles de style en cascade).',
            en: 'Yes, CSS stands for "Cascading Style Sheets".'
        }
    },
    {
        id: 'easy-3',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet d\'ajouter un élément à la fin d\'un tableau ?',
            en: 'Which JavaScript method adds an element to the end of an array?'
        },
        options: {
            fr: ['push()', 'pop()', 'shift()', 'unshift()'],
            en: ['push()', 'pop()', 'shift()', 'unshift()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode push() ajoute un ou plusieurs éléments à la fin d\'un tableau.',
            en: 'The push() method adds one or more elements to the end of an array.'
        }
    },
    {
        id: 'easy-4',
        type: 'true-false',
        question: {
            fr: 'React est une bibliothèque JavaScript développée par Facebook.',
            en: 'React is a JavaScript library developed by Facebook.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, React a été créé par Facebook (maintenant Meta) en 2013.',
            en: 'Yes, React was created by Facebook (now Meta) in 2013.'
        }
    },
    {
        id: 'easy-5',
        type: 'qcm',
        question: {
            fr: 'Quelle propriété CSS est utilisée pour changer la couleur du texte ?',
            en: 'Which CSS property is used to change the text color?'
        },
        options: {
            fr: ['color', 'text-color', 'font-color', 'text-style'],
            en: ['color', 'text-color', 'font-color', 'text-style']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La propriété CSS "color" est utilisée pour définir la couleur du texte.',
            en: 'The CSS "color" property is used to set the text color.'
        }
    },
    {
        id: 'easy-6',
        type: 'true-false',
        question: {
            fr: 'TypeScript est un sur-ensemble de JavaScript qui ajoute le typage statique.',
            en: 'TypeScript is a superset of JavaScript that adds static typing.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, TypeScript étend JavaScript en ajoutant des types statiques optionnels.',
            en: 'Yes, TypeScript extends JavaScript by adding optional static types.'
        }
    },
    {
        id: 'easy-7',
        type: 'qcm',
        question: {
            fr: 'Quel protocole est utilisé pour sécuriser les connexions web (HTTPS) ?',
            en: 'Which protocol is used to secure web connections (HTTPS)?'
        },
        options: {
            fr: ['TLS/SSL', 'FTP', 'HTTP', 'SMTP'],
            en: ['TLS/SSL', 'FTP', 'HTTP', 'SMTP']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'TLS (Transport Layer Security) ou SSL (Secure Sockets Layer) sécurise les connexions HTTPS.',
            en: 'TLS (Transport Layer Security) or SSL (Secure Sockets Layer) secures HTTPS connections.'
        }
    },
    {
        id: 'easy-8',
        type: 'true-false',
        question: {
            fr: 'Git est un système de contrôle de version distribué.',
            en: 'Git is a distributed version control system.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, Git est un système de contrôle de version distribué créé par Linus Torvalds.',
            en: 'Yes, Git is a distributed version control system created by Linus Torvalds.'
        }
    },
    {
        id: 'easy-9',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode HTTP est utilisée pour récupérer des données depuis un serveur ?',
            en: 'Which HTTP method is used to retrieve data from a server?'
        },
        options: {
            fr: ['GET', 'POST', 'PUT', 'DELETE'],
            en: ['GET', 'POST', 'PUT', 'DELETE']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode GET est utilisée pour récupérer des données depuis un serveur.',
            en: 'The GET method is used to retrieve data from a server.'
        }
    },
    {
        id: 'easy-10',
        type: 'true-false',
        question: {
            fr: 'Next.js est un framework React pour la production.',
            en: 'Next.js is a React framework for production.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, Next.js est un framework React qui offre le rendu côté serveur et de nombreuses optimisations.',
            en: 'Yes, Next.js is a React framework that offers server-side rendering and many optimizations.'
        }
    },
    {
        id: 'easy-11',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer un lien ?',
            en: 'Which HTML tag is used to create a link?'
        },
        options: {
            fr: ['<a>', '<link>', '<url>', '<href>'],
            en: ['<a>', '<link>', '<url>', '<href>']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La balise <a> (anchor) est utilisée pour créer des liens hypertextes en HTML.',
            en: 'The <a> (anchor) tag is used to create hyperlinks in HTML.'
        }
    },
    {
        id: 'easy-12',
        type: 'true-false',
        question: {
            fr: 'JavaScript est un langage de programmation côté client uniquement.',
            en: 'JavaScript is a client-side only programming language.'
        },
        correctAnswer: 1,
        explanation: {
            fr: 'Non, JavaScript peut également être exécuté côté serveur avec Node.js.',
            en: 'No, JavaScript can also be executed on the server side with Node.js.'
        }
    },
    {
        id: 'easy-13',
        type: 'qcm',
        question: {
            fr: 'Quelle propriété CSS est utilisée pour centrer un élément horizontalement ?',
            en: 'Which CSS property is used to center an element horizontally?'
        },
        options: {
            fr: ['margin: auto', 'center: true', 'align: center', 'position: center'],
            en: ['margin: auto', 'center: true', 'align: center', 'position: center']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'margin: auto centre un élément horizontalement lorsqu\'il a une largeur définie.',
            en: 'margin: auto centers an element horizontally when it has a defined width.'
        }
    },
    {
        id: 'easy-14',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de retirer le dernier élément d\'un tableau ?',
            en: 'Which JavaScript method removes the last element from an array?'
        },
        options: {
            fr: ['pop()', 'push()', 'shift()', 'unshift()'],
            en: ['pop()', 'push()', 'shift()', 'unshift()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode pop() retire et retourne le dernier élément d\'un tableau.',
            en: 'The pop() method removes and returns the last element of an array.'
        }
    },
    {
        id: 'easy-15',
        type: 'true-false',
        question: {
            fr: 'HTML signifie "HyperText Markup Language".',
            en: 'HTML stands for "HyperText Markup Language".'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, HTML signifie "HyperText Markup Language" (Langage de balisage hypertexte).',
            en: 'Yes, HTML stands for "HyperText Markup Language".'
        }
    },
    {
        id: 'easy-16',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer une liste non ordonnée ?',
            en: 'Which HTML tag is used to create an unordered list?'
        },
        options: {
            fr: ['<ul>', '<ol>', '<li>', '<list>'],
            en: ['<ul>', '<ol>', '<li>', '<list>']
        },
        correctAnswer: 0,
        explanation: {
            fr: '<ul> (unordered list) crée une liste à puces non ordonnée.',
            en: '<ul> (unordered list) creates an unordered bulleted list.'
        }
    },
    {
        id: 'easy-17',
        type: 'qcm',
        question: {
            fr: 'Quelle propriété CSS est utilisée pour définir la taille de la police ?',
            en: 'Which CSS property is used to set the font size?'
        },
        options: {
            fr: ['font-size', 'text-size', 'size', 'font'],
            en: ['font-size', 'text-size', 'size', 'font']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La propriété font-size définit la taille de la police de caractères.',
            en: 'The font-size property sets the size of the font.'
        }
    },
    {
        id: 'easy-18',
        type: 'true-false',
        question: {
            fr: 'Les variables en JavaScript sont sensibles à la casse.',
            en: 'Variables in JavaScript are case-sensitive.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, JavaScript est sensible à la casse, donc "myVar" et "myvar" sont deux variables différentes.',
            en: 'Yes, JavaScript is case-sensitive, so "myVar" and "myvar" are two different variables.'
        }
    },
    {
        id: 'easy-19',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour insérer une image ?',
            en: 'Which HTML tag is used to insert an image?'
        },
        options: {
            fr: ['<img>', '<image>', '<picture>', '<photo>'],
            en: ['<img>', '<image>', '<picture>', '<photo>']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La balise <img> est utilisée pour insérer une image dans une page HTML.',
            en: 'The <img> tag is used to insert an image into an HTML page.'
        }
    },
    {
        id: 'easy-20',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de convertir une chaîne en nombre ?',
            en: 'Which JavaScript method converts a string to a number?'
        },
        options: {
            fr: ['Number() ou parseInt()', 'String()', 'toString()', 'convert()'],
            en: ['Number() or parseInt()', 'String()', 'toString()', 'convert()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Number() et parseInt() permettent de convertir une chaîne en nombre.',
            en: 'Number() and parseInt() allow converting a string to a number.'
        }
    },
    {
        id: 'easy-21',
        type: 'true-false',
        question: {
            fr: 'Le DOM signifie "Document Object Model".',
            en: 'DOM stands for "Document Object Model".'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, le DOM (Document Object Model) représente la structure d\'un document HTML.',
            en: 'Yes, the DOM (Document Object Model) represents the structure of an HTML document.'
        }
    },
    {
        id: 'easy-22',
        type: 'qcm',
        question: {
            fr: 'Quelle propriété CSS est utilisée pour ajouter de l\'espace entre les bordures d\'un élément ?',
            en: 'Which CSS property is used to add space between an element\'s borders?'
        },
        options: {
            fr: ['padding', 'margin', 'spacing', 'gap'],
            en: ['padding', 'margin', 'spacing', 'gap']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'padding ajoute de l\'espace à l\'intérieur de l\'élément, entre le contenu et la bordure.',
            en: 'padding adds space inside the element, between the content and the border.'
        }
    },
    {
        id: 'easy-23',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer un paragraphe ?',
            en: 'Which HTML tag is used to create a paragraph?'
        },
        options: {
            fr: ['<p>', '<para>', '<text>', '<paragraph>'],
            en: ['<p>', '<para>', '<text>', '<paragraph>']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La balise <p> est utilisée pour créer un paragraphe en HTML.',
            en: 'The <p> tag is used to create a paragraph in HTML.'
        }
    },
    {
        id: 'easy-24',
        type: 'true-false',
        question: {
            fr: 'Les fonctions fléchées (arrow functions) en JavaScript ont leur propre contexte "this".',
            en: 'Arrow functions in JavaScript have their own "this" context.'
        },
        correctAnswer: 1,
        explanation: {
            fr: 'Non, les fonctions fléchées héritent du contexte "this" de leur portée parente.',
            en: 'No, arrow functions inherit the "this" context from their parent scope.'
        }
    },
    {
        id: 'easy-25',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de trouver un élément dans un tableau ?',
            en: 'Which JavaScript method finds an element in an array?'
        },
        options: {
            fr: ['find()', 'search()', 'locate()', 'get()'],
            en: ['find()', 'search()', 'locate()', 'get()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode find() retourne le premier élément d\'un tableau qui satisfait une condition.',
            en: 'The find() method returns the first element in an array that satisfies a condition.'
        }
    },
    {
        id: 'easy-26',
        type: 'qcm',
        question: {
            fr: 'Quelle propriété CSS est utilisée pour changer la couleur de fond ?',
            en: 'Which CSS property is used to change the background color?'
        },
        options: {
            fr: ['background-color', 'bg-color', 'background', 'color-background'],
            en: ['background-color', 'bg-color', 'background', 'color-background']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La propriété background-color définit la couleur de fond d\'un élément.',
            en: 'The background-color property sets the background color of an element.'
        }
    },
    {
        id: 'easy-27',
        type: 'true-false',
        question: {
            fr: 'JSON signifie "JavaScript Object Notation".',
            en: 'JSON stands for "JavaScript Object Notation".'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, JSON est un format de données basé sur la notation d\'objets JavaScript.',
            en: 'Yes, JSON is a data format based on JavaScript object notation.'
        }
    },
    {
        id: 'easy-28',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer un formulaire ?',
            en: 'Which HTML tag is used to create a form?'
        },
        options: {
            fr: ['<form>', '<input>', '<fieldset>', '<formset>'],
            en: ['<form>', '<input>', '<fieldset>', '<formset>']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La balise <form> est utilisée pour créer un formulaire HTML.',
            en: 'The <form> tag is used to create an HTML form.'
        }
    },
    {
        id: 'easy-29',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de créer un nouveau tableau à partir d\'un autre ?',
            en: 'Which JavaScript method creates a new array from another one?'
        },
        options: {
            fr: ['map()', 'copy()', 'duplicate()', 'clone()'],
            en: ['map()', 'copy()', 'duplicate()', 'clone()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode map() crée un nouveau tableau en appliquant une fonction à chaque élément.',
            en: 'The map() method creates a new array by applying a function to each element.'
        }
    },
    {
        id: 'easy-30',
        type: 'true-false',
        question: {
            fr: 'Les commentaires en JavaScript commencent par // pour une ligne ou /* */ pour plusieurs lignes.',
            en: 'JavaScript comments start with // for a line or /* */ for multiple lines.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, // pour les commentaires d\'une ligne et /* */ pour les commentaires multi-lignes.',
            en: 'Yes, // for single-line comments and /* */ for multi-line comments.'
        }
    },
    {
        id: 'easy-31',
        type: 'qcm',
        question: {
            fr: 'Quelle propriété CSS est utilisée pour rendre un élément invisible ?',
            en: 'Which CSS property is used to make an element invisible?'
        },
        options: {
            fr: ['display: none ou visibility: hidden', 'hide: true', 'visible: false', 'opacity: 0'],
            en: ['display: none or visibility: hidden', 'hide: true', 'visible: false', 'opacity: 0']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'display: none retire l\'élément du flux, visibility: hidden le cache mais garde l\'espace.',
            en: 'display: none removes the element from the flow, visibility: hidden hides it but keeps the space.'
        }
    },
    {
        id: 'easy-32',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer un bouton ?',
            en: 'Which HTML tag is used to create a button?'
        },
        options: {
            fr: ['<button>', '<btn>', '<click>', '<input type="button">'],
            en: ['<button>', '<btn>', '<click>', '<input type="button">']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La balise <button> est utilisée pour créer un bouton cliquable en HTML.',
            en: 'The <button> tag is used to create a clickable button in HTML.'
        }
    },
    {
        id: 'easy-33',
        type: 'true-false',
        question: {
            fr: 'Les tableaux en JavaScript commencent à l\'index 0.',
            en: 'Arrays in JavaScript start at index 0.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les tableaux JavaScript sont indexés à partir de 0, pas de 1.',
            en: 'Yes, JavaScript arrays are indexed starting from 0, not 1.'
        }
    },
    {
        id: 'easy-34',
        type: 'qcm',
        question: {
            fr: 'Quelle propriété CSS est utilisée pour définir la largeur d\'un élément ?',
            en: 'Which CSS property is used to set the width of an element?'
        },
        options: {
            fr: ['width', 'w', 'size', 'dimension'],
            en: ['width', 'w', 'size', 'dimension']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La propriété width définit la largeur d\'un élément.',
            en: 'The width property sets the width of an element.'
        }
    },
    {
        id: 'easy-35',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de vérifier si un élément existe dans un tableau ?',
            en: 'Which JavaScript method checks if an element exists in an array?'
        },
        options: {
            fr: ['includes()', 'contains()', 'has()', 'exists()'],
            en: ['includes()', 'contains()', 'has()', 'exists()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode includes() vérifie si un tableau contient un élément spécifique.',
            en: 'The includes() method checks if an array contains a specific element.'
        }
    },
    {
        id: 'easy-36',
        type: 'true-false',
        question: {
            fr: 'Le localStorage permet de stocker des données dans le navigateur de manière persistante.',
            en: 'localStorage allows storing data in the browser persistently.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, localStorage stocke les données de manière persistante même après la fermeture du navigateur.',
            en: 'Yes, localStorage stores data persistently even after closing the browser.'
        }
    },
    {
        id: 'easy-37',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer un tableau ?',
            en: 'Which HTML tag is used to create a table?'
        },
        options: {
            fr: ['<table>', '<tab>', '<grid>', '<data>'],
            en: ['<table>', '<tab>', '<grid>', '<data>']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La balise <table> est utilisée pour créer un tableau en HTML.',
            en: 'The <table> tag is used to create a table in HTML.'
        }
    },
    {
        id: 'easy-38',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de joindre les éléments d\'un tableau en une chaîne ?',
            en: 'Which JavaScript method joins array elements into a string?'
        },
        options: {
            fr: ['join()', 'concat()', 'merge()', 'combine()'],
            en: ['join()', 'concat()', 'merge()', 'combine()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode join() joint tous les éléments d\'un tableau en une chaîne de caractères.',
            en: 'The join() method joins all elements of an array into a string.'
        }
    },
    {
        id: 'easy-39',
        type: 'true-false',
        question: {
            fr: 'Les fonctions en JavaScript sont des objets de première classe.',
            en: 'Functions in JavaScript are first-class objects.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les fonctions JavaScript peuvent être assignées à des variables, passées en paramètres, etc.',
            en: 'Yes, JavaScript functions can be assigned to variables, passed as parameters, etc.'
        }
    },
    {
        id: 'easy-40',
        type: 'qcm',
        question: {
            fr: 'Quelle propriété CSS est utilisée pour ajouter de l\'espace autour d\'un élément ?',
            en: 'Which CSS property is used to add space around an element?'
        },
        options: {
            fr: ['margin', 'padding', 'spacing', 'gap'],
            en: ['margin', 'padding', 'spacing', 'gap']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'margin ajoute de l\'espace à l\'extérieur de l\'élément, entre l\'élément et les autres éléments.',
            en: 'margin adds space outside the element, between the element and other elements.'
        }
    },
    {
        id: 'easy-41',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer une liste ordonnée ?',
            en: 'Which HTML tag is used to create an ordered list?'
        },
        options: {
            fr: ['<ol>', '<ul>', '<li>', '<list>'],
            en: ['<ol>', '<ul>', '<li>', '<list>']
        },
        correctAnswer: 0,
        explanation: {
            fr: '<ol> (ordered list) crée une liste numérotée.',
            en: '<ol> (ordered list) creates a numbered list.'
        }
    },
    {
        id: 'easy-42',
        type: 'true-false',
        question: {
            fr: 'Le mot-clé "const" en JavaScript permet de déclarer une constante qui ne peut pas être réassignée.',
            en: 'The "const" keyword in JavaScript declares a constant that cannot be reassigned.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, const déclare une constante qui ne peut pas être réassignée après sa déclaration initiale.',
            en: 'Yes, const declares a constant that cannot be reassigned after its initial declaration.'
        }
    },
    {
        id: 'easy-43',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de filtrer les éléments d\'un tableau ?',
            en: 'Which JavaScript method filters elements in an array?'
        },
        options: {
            fr: ['filter()', 'select()', 'find()', 'search()'],
            en: ['filter()', 'select()', 'find()', 'search()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode filter() crée un nouveau tableau avec les éléments qui passent un test.',
            en: 'The filter() method creates a new array with elements that pass a test.'
        }
    },
    {
        id: 'easy-44',
        type: 'qcm',
        question: {
            fr: 'Quelle propriété CSS est utilisée pour aligner le texte ?',
            en: 'Which CSS property is used to align text?'
        },
        options: {
            fr: ['text-align', 'align', 'text-position', 'alignment'],
            en: ['text-align', 'align', 'text-position', 'alignment']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La propriété text-align définit l\'alignement horizontal du texte.',
            en: 'The text-align property sets the horizontal alignment of text.'
        }
    },
    {
        id: 'easy-45',
        type: 'true-false',
        question: {
            fr: 'Les promesses (Promises) en JavaScript permettent de gérer le code asynchrone.',
            en: 'Promises in JavaScript allow handling asynchronous code.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les Promises permettent de gérer les opérations asynchrones de manière plus lisible que les callbacks.',
            en: 'Yes, Promises allow handling asynchronous operations more readably than callbacks.'
        }
    },
    {
        id: 'easy-46',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer un champ de saisie texte ?',
            en: 'Which HTML tag is used to create a text input field?'
        },
        options: {
            fr: ['<input type="text">', '<text>', '<input>', '<field>'],
            en: ['<input type="text">', '<text>', '<input>', '<field>']
        },
        correctAnswer: 0,
        explanation: {
            fr: '<input type="text"> crée un champ de saisie texte dans un formulaire.',
            en: '<input type="text"> creates a text input field in a form.'
        }
    },
    {
        id: 'easy-47',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de retirer le premier élément d\'un tableau ?',
            en: 'Which JavaScript method removes the first element from an array?'
        },
        options: {
            fr: ['shift()', 'pop()', 'unshift()', 'remove()'],
            en: ['shift()', 'pop()', 'unshift()', 'push()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode shift() retire et retourne le premier élément d\'un tableau.',
            en: 'The shift() method removes and returns the first element of an array.'
        }
    },
    {
        id: 'easy-48',
        type: 'true-false',
        question: {
            fr: 'Le mot-clé "let" en JavaScript permet de déclarer une variable avec un scope de bloc.',
            en: 'The "let" keyword in JavaScript declares a variable with block scope.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, let déclare une variable avec un scope de bloc, contrairement à var qui a un scope de fonction.',
            en: 'Yes, let declares a variable with block scope, unlike var which has function scope.'
        }
    },
    {
        id: 'easy-49',
        type: 'qcm',
        question: {
            fr: 'Quelle propriété CSS est utilisée pour définir la hauteur d\'un élément ?',
            en: 'Which CSS property is used to set the height of an element?'
        },
        options: {
            fr: ['height', 'h', 'size', 'dimension'],
            en: ['height', 'h', 'size', 'dimension']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La propriété height définit la hauteur d\'un élément.',
            en: 'The height property sets the height of an element.'
        }
    },
    {
        id: 'easy-50',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de convertir un tableau en chaîne de caractères ?',
            en: 'Which JavaScript method converts an array to a string?'
        },
        options: {
            fr: ['toString()', 'toText()', 'stringify()', 'convert()'],
            en: ['toString()', 'toText()', 'stringify()', 'convert()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode toString() convertit un tableau en une chaîne de caractères.',
            en: 'The toString() method converts an array to a string.'
        }
    },
    {
        id: 'easy-51',
        type: 'true-false',
        question: {
            fr: 'Les classes CSS peuvent être appliquées à plusieurs éléments HTML.',
            en: 'CSS classes can be applied to multiple HTML elements.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, une classe CSS peut être utilisée sur plusieurs éléments pour appliquer le même style.',
            en: 'Yes, a CSS class can be used on multiple elements to apply the same style.'
        }
    },
    {
        id: 'easy-52',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer une division ou section ?',
            en: 'Which HTML tag is used to create a division or section?'
        },
        options: {
            fr: ['<div>', '<section>', '<container>', '<box>'],
            en: ['<div>', '<section>', '<container>', '<box>']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La balise <div> est utilisée pour créer un conteneur générique ou une section.',
            en: 'The <div> tag is used to create a generic container or section.'
        }
    },
    {
        id: 'easy-53',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet d\'ajouter un élément au début d\'un tableau ?',
            en: 'Which JavaScript method adds an element to the beginning of an array?'
        },
        options: {
            fr: ['unshift()', 'push()', 'shift()', 'prepend()'],
            en: ['unshift()', 'push()', 'shift()', 'prepend()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode unshift() ajoute un ou plusieurs éléments au début d\'un tableau.',
            en: 'The unshift() method adds one or more elements to the beginning of an array.'
        }
    },
    {
        id: 'easy-54',
        type: 'true-false',
        question: {
            fr: 'Les IDs en HTML doivent être uniques sur une page.',
            en: 'IDs in HTML must be unique on a page.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, chaque ID doit être unique sur une page HTML pour un fonctionnement correct.',
            en: 'Yes, each ID must be unique on an HTML page for proper functionality.'
        }
    },
    {
        id: 'easy-55',
        type: 'qcm',
        question: {
            fr: 'Quelle propriété CSS est utilisée pour définir le style de la bordure ?',
            en: 'Which CSS property is used to set the border style?'
        },
        options: {
            fr: ['border-style', 'border', 'border-type', 'border-design'],
            en: ['border-style', 'border', 'border-type', 'border-design']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La propriété border-style définit le style de la bordure (solid, dashed, etc.).',
            en: 'The border-style property sets the border style (solid, dashed, etc.).'
        }
    },
    {
        id: 'easy-56',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de vérifier le type d\'une variable ?',
            en: 'Which JavaScript method checks the type of a variable?'
        },
        options: {
            fr: ['typeof', 'type()', 'getType()', 'checkType()'],
            en: ['typeof', 'type()', 'getType()', 'checkType()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'L\'opérateur typeof retourne une chaîne indiquant le type d\'une variable.',
            en: 'The typeof operator returns a string indicating the type of a variable.'
        }
    },
    {
        id: 'easy-57',
        type: 'true-false',
        question: {
            fr: 'Le sélecteur CSS "#id" cible un élément par son ID.',
            en: 'The CSS selector "#id" targets an element by its ID.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, le sélecteur # cible un élément par son ID en CSS.',
            en: 'Yes, the # selector targets an element by its ID in CSS.'
        }
    },
    {
        id: 'easy-58',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer un saut de ligne ?',
            en: 'Which HTML tag is used to create a line break?'
        },
        options: {
            fr: ['<br>', '<break>', '<lb>', '<newline>'],
            en: ['<br>', '<break>', '<lb>', '<newline>']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La balise <br> crée un saut de ligne dans le texte.',
            en: 'The <br> tag creates a line break in text.'
        }
    },
    {
        id: 'easy-59',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de trier les éléments d\'un tableau ?',
            en: 'Which JavaScript method sorts the elements of an array?'
        },
        options: {
            fr: ['sort()', 'order()', 'arrange()', 'organize()'],
            en: ['sort()', 'order()', 'arrange()', 'organize()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode sort() trie les éléments d\'un tableau en place.',
            en: 'The sort() method sorts the elements of an array in place.'
        }
    },
    {
        id: 'easy-60',
        type: 'true-false',
        question: {
            fr: 'Le sélecteur CSS ".class" cible les éléments par leur classe.',
            en: 'The CSS selector ".class" targets elements by their class.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, le sélecteur . cible les éléments par leur classe en CSS.',
            en: 'Yes, the . selector targets elements by their class in CSS.'
        }
    },
    {
        id: 'easy-61',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer un en-tête de section ?',
            en: 'Which HTML tag is used to create a section header?'
        },
        options: {
            fr: ['<header>', '<head>', '<title>', '<h1>'],
            en: ['<header>', '<head>', '<title>', '<h1>']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La balise <header> représente l\'en-tête d\'une section ou d\'une page.',
            en: 'The <header> tag represents the header of a section or page.'
        }
    },
    {
        id: 'easy-62',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de réduire un tableau à une seule valeur ?',
            en: 'Which JavaScript method reduces an array to a single value?'
        },
        options: {
            fr: ['reduce()', 'sum()', 'total()', 'aggregate()'],
            en: ['reduce()', 'sum()', 'total()', 'aggregate()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode reduce() réduit un tableau à une seule valeur en appliquant une fonction.',
            en: 'The reduce() method reduces an array to a single value by applying a function.'
        }
    },
    {
        id: 'easy-63',
        type: 'true-false',
        question: {
            fr: 'Les media queries en CSS permettent d\'appliquer des styles selon la taille de l\'écran.',
            en: 'Media queries in CSS allow applying styles based on screen size.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les media queries permettent de créer des designs responsives adaptés à différentes tailles d\'écran.',
            en: 'Yes, media queries allow creating responsive designs adapted to different screen sizes.'
        }
    },
    {
        id: 'easy-64',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer un pied de page ?',
            en: 'Which HTML tag is used to create a footer?'
        },
        options: {
            fr: ['<footer>', '<foot>', '<bottom>', '<end>'],
            en: ['<footer>', '<foot>', '<bottom>', '<end>']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La balise <footer> représente le pied de page d\'une section ou d\'une page.',
            en: 'The <footer> tag represents the footer of a section or page.'
        }
    },
    {
        id: 'easy-65',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de vérifier si tous les éléments d\'un tableau passent un test ?',
            en: 'Which JavaScript method checks if all array elements pass a test?'
        },
        options: {
            fr: ['every()', 'all()', 'checkAll()', 'verifyAll()'],
            en: ['every()', 'all()', 'checkAll()', 'verifyAll()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode every() teste si tous les éléments d\'un tableau passent un test.',
            en: 'The every() method tests if all elements in an array pass a test.'
        }
    },
    {
        id: 'easy-66',
        type: 'true-false',
        question: {
            fr: 'Flexbox en CSS permet de créer des layouts flexibles et responsives.',
            en: 'Flexbox in CSS allows creating flexible and responsive layouts.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, Flexbox est un modèle de layout CSS qui facilite la création de designs flexibles.',
            en: 'Yes, Flexbox is a CSS layout model that makes it easier to create flexible designs.'
        }
    },
    {
        id: 'easy-67',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer une section de navigation ?',
            en: 'Which HTML tag is used to create a navigation section?'
        },
        options: {
            fr: ['<nav>', '<navigation>', '<menu>', '<navbar>'],
            en: ['<nav>', '<navigation>', '<menu>', '<navbar>']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La balise <nav> représente une section de navigation avec des liens.',
            en: 'The <nav> tag represents a navigation section with links.'
        }
    },
    {
        id: 'easy-68',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de vérifier si au moins un élément d\'un tableau passe un test ?',
            en: 'Which JavaScript method checks if at least one array element passes a test?'
        },
        options: {
            fr: ['some()', 'any()', 'one()', 'checkOne()'],
            en: ['some()', 'any()', 'one()', 'checkOne()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode some() teste si au moins un élément d\'un tableau passe un test.',
            en: 'The some() method tests if at least one element in an array passes a test.'
        }
    },
    {
        id: 'easy-69',
        type: 'true-false',
        question: {
            fr: 'Les variables déclarées avec "var" en JavaScript sont hoisted (remontées) en haut de leur scope.',
            en: 'Variables declared with "var" in JavaScript are hoisted to the top of their scope.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les déclarations var sont hoisted, ce qui signifie qu\'elles sont déplacées en haut de leur scope.',
            en: 'Yes, var declarations are hoisted, meaning they are moved to the top of their scope.'
        }
    },
    {
        id: 'easy-70',
        type: 'qcm',
        question: {
            fr: 'Quelle propriété CSS est utilisée pour définir la famille de police ?',
            en: 'Which CSS property is used to set the font family?'
        },
        options: {
            fr: ['font-family', 'font', 'font-type', 'font-style'],
            en: ['font-family', 'font', 'font-type', 'font-style']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La propriété font-family définit la famille de police à utiliser.',
            en: 'The font-family property sets the font family to use.'
        }
    },
    {
        id: 'easy-71',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de créer une copie superficielle d\'un tableau ?',
            en: 'Which JavaScript method creates a shallow copy of an array?'
        },
        options: {
            fr: ['slice()', 'copy()', 'clone()', 'duplicate()'],
            en: ['slice()', 'copy()', 'clone()', 'duplicate()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode slice() crée une copie superficielle d\'un tableau sans modifier l\'original.',
            en: 'The slice() method creates a shallow copy of an array without modifying the original.'
        }
    },
    {
        id: 'easy-72',
        type: 'true-false',
        question: {
            fr: 'Le sélecteur CSS "element" cible tous les éléments d\'un type spécifique.',
            en: 'The CSS selector "element" targets all elements of a specific type.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, le sélecteur d\'élément cible tous les éléments de ce type sur la page.',
            en: 'Yes, the element selector targets all elements of that type on the page.'
        }
    },
    {
        id: 'easy-73',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer un champ de texte multiligne ?',
            en: 'Which HTML tag is used to create a multiline text field?'
        },
        options: {
            fr: ['<textarea>', '<text>', '<input type="textarea">', '<multiline>'],
            en: ['<textarea>', '<text>', '<input type="textarea">', '<multiline>']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La balise <textarea> crée un champ de texte multiligne dans un formulaire.',
            en: 'The <textarea> tag creates a multiline text field in a form.'
        }
    },
    {
        id: 'easy-74',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de concaténer deux tableaux ?',
            en: 'Which JavaScript method concatenates two arrays?'
        },
        options: {
            fr: ['concat()', 'merge()', 'join()', 'combine()'],
            en: ['concat()', 'merge()', 'join()', 'combine()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode concat() combine deux ou plusieurs tableaux en un nouveau tableau.',
            en: 'The concat() method combines two or more arrays into a new array.'
        }
    },
    {
        id: 'easy-75',
        type: 'true-false',
        question: {
            fr: 'Les attributs HTML "class" et "id" servent à identifier et styliser des éléments.',
            en: 'HTML attributes "class" and "id" are used to identify and style elements.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, class et id permettent d\'identifier des éléments pour le CSS et JavaScript.',
            en: 'Yes, class and id allow identifying elements for CSS and JavaScript.'
        }
    },
    {
        id: 'easy-76',
        type: 'qcm',
        question: {
            fr: 'Quelle propriété CSS est utilisée pour définir l\'espacement entre les lettres ?',
            en: 'Which CSS property is used to set the spacing between letters?'
        },
        options: {
            fr: ['letter-spacing', 'text-spacing', 'char-spacing', 'spacing'],
            en: ['letter-spacing', 'text-spacing', 'char-spacing', 'spacing']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La propriété letter-spacing définit l\'espacement entre les caractères.',
            en: 'The letter-spacing property sets the spacing between characters.'
        }
    },
    {
        id: 'easy-77',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de diviser une chaîne en tableau ?',
            en: 'Which JavaScript method splits a string into an array?'
        },
        options: {
            fr: ['split()', 'divide()', 'separate()', 'break()'],
            en: ['split()', 'divide()', 'separate()', 'break()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode split() divise une chaîne en un tableau de sous-chaînes.',
            en: 'The split() method splits a string into an array of substrings.'
        }
    },
    {
        id: 'easy-78',
        type: 'true-false',
        question: {
            fr: 'Les événements JavaScript permettent d\'interagir avec les actions de l\'utilisateur.',
            en: 'JavaScript events allow interacting with user actions.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les événements comme click, mouseover, etc. permettent de réagir aux actions utilisateur.',
            en: 'Yes, events like click, mouseover, etc. allow reacting to user actions.'
        }
    },
    {
        id: 'easy-79',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer un élément de liste ?',
            en: 'Which HTML tag is used to create a list item?'
        },
        options: {
            fr: ['<li>', '<item>', '<list-item>', '<element>'],
            en: ['<li>', '<item>', '<list-item>', '<element>']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La balise <li> représente un élément de liste dans <ul> ou <ol>.',
            en: 'The <li> tag represents a list item in <ul> or <ol>.'
        }
    },
    {
        id: 'easy-80',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de rechercher un élément dans un tableau et retourner son index ?',
            en: 'Which JavaScript method searches for an element in an array and returns its index?'
        },
        options: {
            fr: ['indexOf()', 'findIndex()', 'search()', 'locate()'],
            en: ['indexOf()', 'findIndex()', 'search()', 'locate()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode indexOf() retourne le premier index auquel un élément peut être trouvé dans un tableau.',
            en: 'The indexOf() method returns the first index at which an element can be found in an array.'
        }
    },
    {
        id: 'easy-81',
        type: 'true-false',
        question: {
            fr: 'Les sélecteurs CSS peuvent être combinés pour cibler des éléments spécifiques.',
            en: 'CSS selectors can be combined to target specific elements.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, on peut combiner des sélecteurs (descendant, enfant, adjacent, etc.) pour un ciblage précis.',
            en: 'Yes, selectors can be combined (descendant, child, adjacent, etc.) for precise targeting.'
        }
    },
    {
        id: 'easy-82',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer un champ de case à cocher ?',
            en: 'Which HTML tag is used to create a checkbox field?'
        },
        options: {
            fr: ['<input type="checkbox">', '<checkbox>', '<check>', '<input type="check">'],
            en: ['<input type="checkbox">', '<checkbox>', '<check>', '<input type="check">']
        },
        correctAnswer: 0,
        explanation: {
            fr: '<input type="checkbox"> crée une case à cocher dans un formulaire.',
            en: '<input type="checkbox"> creates a checkbox in a form.'
        }
    },
    {
        id: 'easy-83',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet d\'inverser l\'ordre des éléments d\'un tableau ?',
            en: 'Which JavaScript method reverses the order of array elements?'
        },
        options: {
            fr: ['reverse()', 'invert()', 'flip()', 'backward()'],
            en: ['reverse()', 'invert()', 'flip()', 'backward()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode reverse() inverse l\'ordre des éléments d\'un tableau en place.',
            en: 'The reverse() method reverses the order of array elements in place.'
        }
    },
    {
        id: 'easy-84',
        type: 'true-false',
        question: {
            fr: 'Les pseudo-classes CSS comme :hover permettent de styliser des éléments dans un état spécifique.',
            en: 'CSS pseudo-classes like :hover allow styling elements in a specific state.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, les pseudo-classes comme :hover, :focus, :active permettent de styliser des états d\'éléments.',
            en: 'Yes, pseudo-classes like :hover, :focus, :active allow styling element states.'
        }
    },
    {
        id: 'easy-85',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer un champ de sélection (dropdown) ?',
            en: 'Which HTML tag is used to create a dropdown selection field?'
        },
        options: {
            fr: ['<select>', '<dropdown>', '<option>', '<choice>'],
            en: ['<select>', '<dropdown>', '<option>', '<choice>']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La balise <select> crée un menu déroulant dans un formulaire.',
            en: 'The <select> tag creates a dropdown menu in a form.'
        }
    },
    {
        id: 'easy-86',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de vérifier si une chaîne contient un sous-texte ?',
            en: 'Which JavaScript method checks if a string contains a substring?'
        },
        options: {
            fr: ['includes()', 'contains()', 'has()', 'find()'],
            en: ['includes()', 'contains()', 'has()', 'find()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode includes() vérifie si une chaîne contient une sous-chaîne spécifiée.',
            en: 'The includes() method checks if a string contains a specified substring.'
        }
    },
    {
        id: 'easy-87',
        type: 'true-false',
        question: {
            fr: 'Les variables en JavaScript peuvent contenir différents types de données (nombres, chaînes, objets, etc.).',
            en: 'Variables in JavaScript can contain different types of data (numbers, strings, objects, etc.).'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, JavaScript est un langage à typage dynamique, les variables peuvent changer de type.',
            en: 'Yes, JavaScript is a dynamically typed language, variables can change type.'
        }
    },
    {
        id: 'easy-88',
        type: 'qcm',
        question: {
            fr: 'Quelle propriété CSS est utilisée pour définir l\'opacité d\'un élément ?',
            en: 'Which CSS property is used to set the opacity of an element?'
        },
        options: {
            fr: ['opacity', 'transparency', 'alpha', 'visibility'],
            en: ['opacity', 'transparency', 'alpha', 'visibility']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La propriété opacity définit le niveau d\'opacité d\'un élément (0 = transparent, 1 = opaque).',
            en: 'The opacity property sets the opacity level of an element (0 = transparent, 1 = opaque).'
        }
    },
    {
        id: 'easy-89',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de convertir une chaîne en majuscules ?',
            en: 'Which JavaScript method converts a string to uppercase?'
        },
        options: {
            fr: ['toUpperCase()', 'upper()', 'toUpper()', 'uppercase()'],
            en: ['toUpperCase()', 'upper()', 'toUpper()', 'uppercase()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode toUpperCase() convertit tous les caractères d\'une chaîne en majuscules.',
            en: 'The toUpperCase() method converts all characters in a string to uppercase.'
        }
    },
    {
        id: 'easy-90',
        type: 'true-false',
        question: {
            fr: 'Les attributs HTML "required" et "disabled" peuvent être utilisés dans les formulaires.',
            en: 'HTML attributes "required" and "disabled" can be used in forms.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, required rend un champ obligatoire et disabled le désactive.',
            en: 'Yes, required makes a field mandatory and disabled disables it.'
        }
    },
    {
        id: 'easy-91',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer un élément de citation ?',
            en: 'Which HTML tag is used to create a quote element?'
        },
        options: {
            fr: ['<blockquote>', '<quote>', '<cite>', '<q>'],
            en: ['<blockquote>', '<quote>', '<cite>', '<q>']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La balise <blockquote> est utilisée pour créer une citation longue.',
            en: 'The <blockquote> tag is used to create a long quotation.'
        }
    },
    {
        id: 'easy-92',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de convertir une chaîne en minuscules ?',
            en: 'Which JavaScript method converts a string to lowercase?'
        },
        options: {
            fr: ['toLowerCase()', 'lower()', 'toLower()', 'lowercase()'],
            en: ['toLowerCase()', 'lower()', 'toLower()', 'lowercase()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode toLowerCase() convertit tous les caractères d\'une chaîne en minuscules.',
            en: 'The toLowerCase() method converts all characters in a string to lowercase.'
        }
    },
    {
        id: 'easy-93',
        type: 'true-false',
        question: {
            fr: 'Les tableaux en JavaScript peuvent contenir des éléments de types différents.',
            en: 'Arrays in JavaScript can contain elements of different types.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, un tableau JavaScript peut contenir des nombres, chaînes, objets, etc. mélangés.',
            en: 'Yes, a JavaScript array can contain numbers, strings, objects, etc. mixed together.'
        }
    },
    {
        id: 'easy-94',
        type: 'qcm',
        question: {
            fr: 'Quelle propriété CSS est utilisée pour définir l\'espacement entre les lignes de texte ?',
            en: 'Which CSS property is used to set the spacing between lines of text?'
        },
        options: {
            fr: ['line-height', 'text-height', 'line-spacing', 'spacing'],
            en: ['line-height', 'text-height', 'line-spacing', 'spacing']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La propriété line-height définit la hauteur d\'une ligne de texte.',
            en: 'The line-height property sets the height of a line of text.'
        }
    },
    {
        id: 'easy-95',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet de remplacer du texte dans une chaîne ?',
            en: 'Which JavaScript method replaces text in a string?'
        },
        options: {
            fr: ['replace()', 'substitute()', 'change()', 'swap()'],
            en: ['replace()', 'substitute()', 'change()', 'swap()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La méthode replace() remplace une sous-chaîne par une autre dans une chaîne.',
            en: 'The replace() method replaces a substring with another in a string.'
        }
    },
    {
        id: 'easy-96',
        type: 'true-false',
        question: {
            fr: 'Les attributs HTML "alt" dans les images améliorent l\'accessibilité.',
            en: 'HTML "alt" attributes in images improve accessibility.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, l\'attribut alt fournit un texte alternatif pour les lecteurs d\'écran et les images cassées.',
            en: 'Yes, the alt attribute provides alternative text for screen readers and broken images.'
        }
    },
    {
        id: 'easy-97',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer un élément de code ?',
            en: 'Which HTML tag is used to create a code element?'
        },
        options: {
            fr: ['<code>', '<programming>', '<script>', '<snippet>'],
            en: ['<code>', '<programming>', '<script>', '<snippet>']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La balise <code> est utilisée pour afficher du code informatique.',
            en: 'The <code> tag is used to display computer code.'
        }
    },
    {
        id: 'easy-98',
        type: 'qcm',
        question: {
            fr: 'Quelle méthode JavaScript permet d\'extraire une partie d\'une chaîne ?',
            en: 'Which JavaScript method extracts a portion of a string?'
        },
        options: {
            fr: ['substring() ou slice()', 'extract()', 'cut()', 'part()'],
            en: ['substring() or slice()', 'extract()', 'cut()', 'part()']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Les méthodes substring() et slice() extraient une partie d\'une chaîne.',
            en: 'The substring() and slice() methods extract a portion of a string.'
        }
    },
    {
        id: 'easy-99',
        type: 'true-false',
        question: {
            fr: 'Les sélecteurs CSS peuvent cibler des éléments selon leur position dans le DOM.',
            en: 'CSS selectors can target elements based on their position in the DOM.'
        },
        correctAnswer: 0,
        explanation: {
            fr: 'Oui, on peut utiliser :first-child, :last-child, :nth-child() pour cibler par position.',
            en: 'Yes, you can use :first-child, :last-child, :nth-child() to target by position.'
        }
    },
    {
        id: 'easy-100',
        type: 'qcm',
        question: {
            fr: 'Quelle balise HTML est utilisée pour créer un élément de texte préformaté ?',
            en: 'Which HTML tag is used to create a preformatted text element?'
        },
        options: {
            fr: ['<pre>', '<format>', '<text>', '<preserve>'],
            en: ['<pre>', '<format>', '<text>', '<preserve>']
        },
        correctAnswer: 0,
        explanation: {
            fr: 'La balise <pre> préserve les espaces et les sauts de ligne dans le texte.',
            en: 'The <pre> tag preserves spaces and line breaks in text.'
        }
    }
];

