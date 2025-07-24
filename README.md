# 📋 Fiters Todo App - Test Technique

Une application Todo moderne avec interface Kanban, développée pour le test technique Fiters. 

![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)
![Express](https://img.shields.io/badge/Express-4.19.2-green)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.13-cyan)

## 🚀 Fonctionnalités

- ✅ **Interface Kanban** moderne avec drag & drop
- 📝 **CRUD complet** pour les tâches
- 🎯 **Gestion des priorités** (Low, Medium, High)
- 📊 **Statistiques en temps réel**
- 🎨 **Interface responsive** avec Tailwind CSS
- ⚡ **API REST** performante avec validation
- 🔄 **États multiples** : Todo, Progress, Done

## 🛠️ Stack Technique

### Frontend
- **React 19** avec TypeScript
- **Vite** comme bundler
- **Tailwind CSS** pour le styling
- **@dnd-kit** pour le drag & drop
- **Axios** pour les appels API
- **Lucide React** pour les icônes

### Backend
- **Express.js** avec TypeScript
- **Express Validator** pour la validation
- **CORS** configuré
- **UUID** pour les identifiants
- **Nodemon** pour le développement

## 📁 Structure du Projet

```
Test_Technique_Fiters/
├── backend/                    # API Express
│   ├── src/
│   │   ├── models/
│   │   │   └── TodoModel.ts   # Modèle de données
│   │   ├── routes/
│   │   │   └── todos.ts       # Routes API
│   │   ├── types/
│   │   │   └── Todo.ts        # Types TypeScript
│   │   └── server.ts          # Serveur Express
│   └── package.json
├── frontend/                   # Application React
│   ├── src/
│   │   ├── api/
│   │   │   └── todoApi.ts     # Client API
│   │   ├── components/
│   │   │   ├── Header.tsx     # En-tête avec stats
│   │   │   ├── KanbanBoard.tsx # Board principal
│   │   │   ├── TodoCard.tsx   # Carte de tâche
│   │   │   └── TodoForm.tsx   # Formulaire
│   │   ├── types/
│   │   │   └── Todo.ts        # Types partagés
│   │   └── App.tsx
│   └── package.json
└── package.json               # Scripts globaux
```

## ⚡ Installation & Démarrage

### Prérequis
- Node.js (v18+)
- npm ou yarn

### Installation rapide
```bash
# Cloner le repo
git clone https://github.com/Samy951/Test_Technique_Fiters.git
cd Test_Technique_Fiters

# Installer les dépendances racine (concurrently)
npm install

# Installer toutes les dépendances
npm run install:all

# Démarrer en mode développement
npm run dev
```

### Installation manuelle
```bash
# Root (obligatoire en premier pour concurrently)
npm install

# Backend
cd backend && npm install

# Frontend 
cd ../frontend && npm install
```

### Démarrage
```bash
# Démarrage simultané (recommandé)
npm run dev

# Ou séparément :
npm run dev:backend  # Port 5000
npm run dev:frontend # Port 3000
```

## 🌐 URLs d'accès

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000
- **API Docs** : http://localhost:5000/api/todos

## 📡 API Endpoints

### Tâches
```http
GET    /api/todos           # Récupérer toutes les tâches
GET    /api/todos/:id       # Récupérer une tâche
POST   /api/todos           # Créer une tâche
PUT    /api/todos/:id       # Mettre à jour une tâche
PATCH  /api/todos/:id/status # Changer le statut
DELETE /api/todos/:id       # Supprimer une tâche
GET    /api/todos/stats     # Statistiques
```

### Format des données
```typescript
interface Todo {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Exemple de requête
```bash
# Créer une tâche
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nouvelle tâche",
    "description": "Description",
    "priority": "high",
    "status": "todo"
  }'
```

## 🎯 Utilisation

1. **Créer une tâche** : Utilisez le formulaire en haut
2. **Drag & Drop** : Glissez les cartes entre les colonnes
3. **Éditer** : Cliquez sur une carte pour l'éditer
4. **Supprimer** : Utilisez l'icône poubelle
5. **Statistiques** : Consultez l'en-tête pour les stats

## 🏗️ Architecture

### Backend
- **Modèle en mémoire** pour la persistance
- **Validation stricte** avec express-validator
- **Gestion d'erreurs** centralisée
- **Types TypeScript** partagés

### Frontend
- **Composants modulaires** React
- **State management** local avec useState
- **Responsive design** mobile-first
- **Optimistic updates** pour la fluidité

## 🔧 Scripts Disponibles

```bash
# Racine
npm run dev              # Démarre frontend + backend
npm run install:all      # Installe toutes les dépendances

# Backend
npm run dev              # Mode développement avec nodemon
npm run build            # Build TypeScript
npm run start            # Démarre le serveur compilé

# Frontend  
npm run dev              # Serveur de développement Vite
npm run build            # Build de production
npm run preview          # Prévisualisation du build
```

## 🎨 Fonctionnalités UI/UX

- **Design moderne** avec Tailwind CSS
- **Animations fluides** pour le drag & drop
- **Indicateurs visuels** de priorité (couleurs)
- **Responsive** sur tous les écrans
- **Feedback utilisateur** (loading, erreurs)
- **Mode sombre** compatible

## 🚧 Améliorations Futures

- [ ] Authentification utilisateur
- [ ] Base de données persistante
- [ ] WebSockets pour le temps réel
- [ ] Tests unitaires et e2e
- [ ] Docker pour le déploiement
- [ ] PWA avec notifications

## 👨‍💻 Développeur

**Samy** - Test technique Fiters

---

*Développé avec ❤️ en TypeScript* 