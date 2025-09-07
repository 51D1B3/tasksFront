# 📋 Gestionnaire de Tâches - Frontend React

Une application moderne de gestion de tâches développée avec React.js, offrant une interface intuitive et responsive pour organiser efficacement vos projets.

## 🚀 Fonctionnalités

- ✅ **Gestion complète des tâches** : Créer, modifier, supprimer et marquer comme terminé
- 🎯 **Système de priorités** : Haute, moyenne, basse
- 📊 **Statuts de suivi** : À faire, en cours, terminé
- 📅 **Dates d'échéance** : Planification et suivi temporel
- 🔍 **Filtres avancés** : Par statut, priorité
- 📈 **Tableau de bord** : Statistiques et aperçu des tâches
- 🔐 **Authentification sécurisée** : Connexion et inscription
- 📱 **Design responsive** : Compatible mobile et desktop
- ⚡ **Performance optimisée** : Hooks React optimisés (useCallback, useMemo, React.memo)

## 🛠️ Technologies utilisées

- **React 18** - Framework frontend
- **React Router 6** - Navigation et routing
- **Tailwind CSS** - Framework CSS utilitaire
- **Axios** - Client HTTP pour les API
- **Jest & React Testing Library** - Tests unitaires
- **Context API** - Gestion d'état global

## 📦 Installation

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn
- Backend API en cours d'exécution sur le port 5001

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd GestionTasks/Frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
Créer un fichier `.env` à la racine du projet :
```env
VITE_API_URL=http://localhost:5001/api
```

4. **Démarrer l'application**
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🏗️ Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── Layout/         # Composants de mise en page
│   ├── Tasks/          # Composants liés aux tâches
│   └── UI/             # Composants d'interface utilisateur
├── contexts/           # Contextes React (AuthContext)
├── hooks/              # Hooks personnalisés (useTasks)
├── pages/              # Pages de l'application
├── services/           # Services API
├── __tests__/          # Tests unitaires
├── App.js              # Composant principal
└── index.js            # Point d'entrée
```

## 🧪 Tests

Exécuter les tests unitaires :
```bash
npm test
```

Exécuter les tests avec couverture :
```bash
npm test -- --coverage
```

## 📱 Utilisation

### 1. Authentification
- Créez un compte ou connectez-vous avec vos identifiants
- L'authentification utilise des tokens JWT sécurisés

### 2. Tableau de bord
- Vue d'ensemble de vos tâches
- Statistiques en temps réel
- Tâches récentes et échéances à venir

### 3. Gestion des tâches
- **Créer** : Cliquez sur "Nouvelle tâche"
- **Modifier** : Cliquez sur l'icône ✏️ d'une tâche
- **Supprimer** : Cliquez sur l'icône 🗑️ (avec confirmation)
- **Changer de statut** : Utilisez les boutons de progression

### 4. Filtres et organisation
- Filtrez par statut (À faire, En cours, Terminé)
- Filtrez par priorité (Haute, Moyenne, Basse)
- Visualisez les statistiques en temps réel

## 🎨 Design et UX

L'interface utilise un design moderne avec :
- **Palette de couleurs** cohérente et accessible
- **Animations fluides** pour les transitions
- **Feedback visuel** pour toutes les actions
- **Responsive design** pour tous les écrans
- **Iconographie** intuitive avec emojis

## ⚡ Optimisations

L'application est optimisée avec :
- **React.memo** pour éviter les re-rendus inutiles
- **useCallback** pour mémoriser les fonctions
- **useMemo** pour les calculs coûteux
- **Lazy loading** des composants
- **Gestion d'état** efficace avec Context API

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
npm run build
npx vercel --prod
```

### Netlify
```bash
npm run build
# Glissez-déposez le dossier build/ sur Netlify
```

### Variables d'environnement pour la production
```env
REACT_APP_API_URL=https://votre-api-backend.com/api
```

## 🔧 Scripts disponibles

- `npm start` - Démarre le serveur de développement
- `npm build` - Crée une version de production
- `npm test` - Lance les tests
- `npm run eject` - Éjecte la configuration (irréversible)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation de l'API backend
- Vérifiez que le backend est bien démarré sur le port 5001

## 🎯 Roadmap

- [ ] Notifications push
- [ ] Mode sombre
- [ ] Collaboration en équipe
- [ ] Export PDF des tâches
- [ ] Intégration calendrier
- [ ] Application mobile (React Native)

---

Développé avec ❤️ pour une gestion de tâches efficace et moderne.
