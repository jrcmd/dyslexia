# 🧠 Dyslexia Quest

**Application web éducative pour adolescents dyslexiques et dysorthographiques (12-17 ans)**

Un jeu de progression type RPG avec 6 modules pédagogiques, 99 niveaux par module, et un système de récompenses motivant — conçu spécifiquement pour les contraintes d'accessibilité de la dyslexie.

---

## 🎯 Objectif

Aider les adolescents dyslexiques et dysorthographiques à progresser en lecture, écriture, phonologie, mémoire visuelle et grammaire — sans pression, avec du contenu mature et une progression ludique jusqu'au niveau 99.

---

## ✨ Fonctionnalités principales

### 🎮 6 modules de jeu (99 niveaux chacun)

| Module | Icône | Compétence |
|--------|-------|-----------|
| **Décodeur** | 📖 | Lecture fluide & Décodage |
| **Syllabator** | 🔊 | Phonologie avancée |
| **Memory Pro** | 🧠 | Reconnaissance visuelle & Mémoire de travail |
| **Clavier Tactique** | ⌨️ | Dysorthographie & Dactylographie |
| **Mission Syntaxe** | 📝 | Grammaire & Compréhension |
| **Boss Final** | 👑 | Intégration & Compréhension approfondie |

### 📊 Système de progression RPG

- **99 niveaux** par module
- **11 paliers** de difficulté croissante
- **Courbe XP exponentielle douce** (100 XP → 15 000 XP)
- **Titres évolutifs** : Novice → Apprenti → Étudiant → Adepte → Expert → Maître → Légende
- **Badges uniques** débloqués à chaque palier
- **Boss Ultime** au niveau 99 de chaque module

### ♿ Accessibilité dyslexie (obligatoire)

- ✅ Police **Lexend** (optimisée pour la dyslexie)
- ✅ Taille de police minimum **16px**, interligne **1.7**
- ✅ **Mode sombre** par défaut (#1a1a2e), mode clair optionnel (#FFF8E7)
- ✅ Contraste modéré (évite le blanc pur sur noir pur)
- ✅ Texte aligné à gauche, **jamais justifié**
- ✅ Lignes courtes (max 70 caractères par ligne)
- ✅ Boutons larges (min 50px de haut)
- ✅ **Web Speech API** pour lecture vocale de tous les textes
- ✅ **Mode Zen** par défaut (pas de minuterie obligatoire)
- ✅ Feedback discret : vibrations visuelles subtiles, badges minimalistes

### 🏆 Système de récompenses

- 🔥 **Streak journalier** (jours consécutifs de pratique)
- 🏅 **Badges par palier** (Novice → Légende)
- 🎖️ **Badges Légende** uniques par module (niveau 99)
- 👑 **Récompense ultime** : "DYSLEXIE DOMPTÉE" si les 6 badges Légende sont obtenus

---

## 🚀 Installation

Aucune installation requise ! C'est une application **100% client-side**.

### Option 1 : Ouvrir directement

1. Télécharge les 3 fichiers (`index.html`, `styles.css`, `app.js`)
2. Place-les dans un même dossier
3. Double-clique sur `index.html`

### Option 2 : Serveur local (recommandé pour le développement)

```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js
npx serve .

# Avec VS Code
# Extension "Live Server" → clic droit sur index.html → "Open with Live Server"
```

Puis ouvre `http://localhost:8000` dans ton navigateur.

---

## 🛠️ Technologies

| Technologie | Usage |
|-------------|-------|
| **HTML5** | Structure sémantique |
| **CSS3** | Styles, animations, variables CSS, responsive design |
| **JavaScript Vanilla** | Logique de jeu, routing, state management |
| **Web Speech API** | Synthèse vocale (fr-FR) |
| **localStorage** | Sauvegarde locale des données |
| **Google Fonts (Lexend)** | Police optimisée pour la dyslexie |

**Aucune dépendance externe** (hors Google Fonts).

---

## 📁 Structure du projet

```
dyslexia-quest/
├── index.html          # Point d'entrée unique
├── styles.css          # Tous les styles (thèmes sombre/clair, animations)
├── app.js              # Logique complète (6 modules, progression, stockage)
└── README.md           # Ce fichier
```

---

## 🎮 Comment jouer

1. **Crée ton profil** : pseudo + choix du thème (sombre/clair)
2. **Choisis un module** parmi les 6 disponibles
3. **Sélectionne un niveau** sur la grille (débloqués progressivement)
4. **Complète l'exercice** :
   - 🎧 Utilise le bouton 🔊 pour écouter les textes
   - ✍️ Réponds aux questions ou reconstitue les mots/phrases
   - ❤️ Tu as 3 vies par niveau
5. **Gagne des XP** pour monter de niveau et débloquer du contenu

### Raccourcis clavier

| Touche | Action |
|--------|--------|
| `Enter` | Valider (quand applicable) |
| `Escape` | Quitter la partie (confirmation) |

---

## 📊 Données sauvegardées

Toutes les données sont stockées **localement** dans le navigateur via `localStorage` :

- 👤 Profil utilisateur (pseudo, préférences)
- 📈 Progression par module (niveau, XP, palier)
- 📊 Statistiques globales
- 🔥 Streak journalier
- 🏅 Badges débloqués

### Exporter / Importer

Dans **Paramètres → Données**, tu peux :
- 💾 **Exporter** tes données en JSON
- 🗑️ **Réinitialiser** complètement ta progression

---

## 🧪 Modules détaillés

### 📖 Décodeur (Lecture)
- Niveaux 1-18 : Mots fréquents, textes courts (30-50 mots)
- Niveaux 19-36 : Textes de 80-120 mots, homophones
- Niveaux 37-54 : Textes complexes (150-250 mots)
- Niveaux 55-72 : Articles de presse réels (300-500 mots)
- Niveaux 73-90 : Extraits littéraires (600-1000 mots)
- Niveaux 91-99 : **LÉGENDE** — Textes philosophiques, articles scientifiques

### 🔊 Syllabator (Phonologie)
- Syllabes simples → complexes → mots empruntés → logatomes → mots étrangers

### 🧠 Memory Pro (Mémoire)
- Grilles 3×4 → 6×6 avec paires identiques, homophones, mots de même famille, confusions visuelles

### ⌨️ Clavier Tactique (Écriture)
- Mots simples → phrases entières avec lettres mélangées progressivement
- Vitesse cible : 20 → 60 mots/minute

### 📝 Mission Syntaxe (Grammaire)
- Phrases S+V+C → subordonnées → propositions relatives → figures de style

### 👑 Boss Final (Intégration)
- Textes courts → extraits intégraux → articles scientifiques
- QCM + questions ouvertes + synthèse

---

## 🎨 Personnalisation

### Thèmes
- 🌙 **Sombre** (par défaut) : `#1a1a2e` / `#16213e`
- ☀️ **Clair** : `#FFF8E7` / `#FFF0D0`

### Voix
- 👩 **Féminine** (par défaut)
- 👨 **Masculine**

### Taille du texte
- **A-** : 16px
- **A** : 18px (défaut)
- **A+** : 22px

---

## 📱 Responsive

| Écran | Adaptations |
|-------|-------------|
| **Desktop** | Grille 9×11 niveaux, layout complet |
| **Tablette** | Grille 5 niveaux/ligne, cartes adaptées |
| **Mobile** | Grille 4 niveaux/ligne, boutons pleine largeur, navigation simplifiée |

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment participer :

1. **Fork** le projet
2. Crée une **branche** (`git checkout -b feature/ma-fonctionnalite`)
3. **Commit** tes changements (`git commit -m 'Ajout de...'`)
4. **Push** sur ta branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvre une **Pull Request**

### Idées d'amélioration

- [ ] Ajouter plus de contenu textuel par palier
- [ ] Mode "Challenge" avec minuterie (optionnel)
- [ ] Système de sons discrets (clics, succès)
- [ ] Mode multijoueur local (comparatif de scores)
- [ ] Export PDF du certificat "Dyslexie Domptée"
- [ ] Mode Infini (niveaux générés aléatoirement après le 99)

---

## 📜 Licence

Ce projet est sous licence **MIT**.

```
Copyright (c) 2026 Dyslexia Quest Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Remerciements

- **Police Lexend** — Google Fonts (optimisée pour la dyslexie)
- **Web Speech API** — Pour la synthèse vocale intégrée
- **Tous les testeurs** — Adolescents, orthophonistes et enseignants ayant participé aux retours

---

<div align="center">

**⭐ Si ce projet t'a aidé ou t'inspire, n'hésite pas à mettre une étoile ! ⭐**

*"On ne voit bien qu'avec le cœur. L'essentiel est invisible pour les yeux."*

🧠 **Dyslexia Quest** — *Maîtrise ta lecture, un niveau à la fois.*

</div>
