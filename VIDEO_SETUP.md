# 🎥 Guide d'Intégration des Vidéos et Animations

Ce guide explique comment ajouter des vidéos et animations à vos exercices dans le fichier Excel.

## 📊 Structure Excel

### Feuille "Bibliothèque Exercices"

Colonnes importantes pour les médias :
- **Vidéo Demo** : URL de la vidéo (YouTube, Vimeo, etc.)
- **Image/GIF** : URL de l'animation ou chemin vers fichier Lottie JSON

## 🎬 Ajouter des Vidéos

### Vidéos YouTube

1. Trouvez une vidéo de démonstration sur YouTube
2. Copiez l'URL complète (ex: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
3. Collez dans la colonne **Vidéo Demo** de l'exercice

**Exemple :**
```
Exercice: Box Squat
Vidéo Demo: https://www.youtube.com/watch?v=POdzasJklao
```

### Vidéos Vimeo

Même processus avec une URL Vimeo :
```
Exercice: Trap Bar Deadlift
Vidéo Demo: https://vimeo.com/123456789
```

### Autres Sources

Toute URL vidéo accessible publiquement fonctionnera avec `react-player` :
- YouTube
- Vimeo
- Dailymotion
- Facebook
- Twitch
- SoundCloud (audio)
- Fichiers MP4/WebM directs

## 🎨 Ajouter des Animations

### Option 1 : GIF/Images

Pour des GIFs ou images statiques :
```
Image/GIF: https://example.com/box-squat-demo.gif
```

### Option 2 : Animations Lottie (Recommandé)

Les animations Lottie sont des fichiers JSON légers et de haute qualité.

**Où trouver des animations Lottie :**
- [LottieFiles](https://lottiefiles.com/) - Bibliothèque gratuite
- Recherchez "fitness", "workout", "exercise"
- Téléchargez le fichier JSON

**Héberger l'animation :**

1. **Option A - Hébergement local :**
   ```
   /frontend/public/animations/box-squat.json
   Image/GIF: /animations/box-squat.json
   ```

2. **Option B - Hébergement externe :**
   ```
   Image/GIF: https://assets.example.com/animations/box-squat.json
   ```

3. **Option C - LottieFiles direct :**
   ```
   Image/GIF: https://assets10.lottiefiles.com/packages/lf20_xxxxx.json
   ```

## 📝 Exemple Complet dans Excel

| Exercice | Catégorie | Équipement | Vidéo Demo | Image/GIF | Notes Technique |
|----------|-----------|------------|------------|-----------|-----------------|
| Box Squat | Max Effort Lower | Barbell + Box | https://youtube.com/watch?v=abc123 | https://lottiefiles.com/animations/squat.json | Pause complète sur box, explosion vers haut |
| Trap Bar Deadlift | Max Effort Lower | Trap Bar + Plates | https://vimeo.com/123456 | /animations/deadlift.json | Poignées hautes, départ mi-tibias |

## 🔄 Régénérer le Program.json

Après avoir modifié l'Excel, régénérez le fichier JSON :

```bash
cd backend
node scripts/convert.js --input ../Programme_Westside_Rugby_Masters_2025-2026.xlsx --output data/program.json
```

Puis redémarrez le backend :
```bash
npm start
# ou avec Docker
docker-compose restart backend
```

## 🎯 Comportement dans l'Application

### Avec Vidéo

Si vous ajoutez une vraie URL YouTube/Vimeo :
- ✅ Animation placeholder affichée par défaut
- ✅ Bouton "Voir la vidéo complète" visible
- ✅ Clic ouvre la vidéo dans un nouvel onglet

### Sans Vidéo

Si la colonne contient juste "▶ Voir vidéo" :
- ✅ Animation placeholder affichée
- ❌ Pas de bouton vidéo

### Avec Animation Lottie

Si vous ajoutez une URL JSON Lottie valide :
- ✅ Animation Lottie animée affichée
- ✅ Haute qualité, petite taille de fichier

## 🎨 Créer vos Propres Animations

### Avec Adobe After Effects

1. Créez votre animation dans After Effects
2. Installez le plugin Bodymovin
3. Exportez en JSON Lottie
4. Hébergez le fichier JSON

### Avec Blender

1. Créez votre animation 3D
2. Utilisez un plugin Lottie pour Blender
3. Exportez en JSON

### Avec des Outils en Ligne

- [Lottie Creator](https://lottiefiles.com/creator) - Éditeur en ligne
- [Haiku Animator](https://www.haikuforteams.com/)
- [Jitter](https://jitter.video/)

## 📱 Ressources Recommandées

### Vidéos d'Exercices

- **AthleanX** : [YouTube Channel](https://www.youtube.com/user/JDCav24)
- **Squat University** : [YouTube Channel](https://www.youtube.com/c/SquatUniversity)
- **Starting Strength** : [YouTube Channel](https://www.youtube.com/user/AasgaardCo)

### Animations Fitness

Recherche sur LottieFiles :
- "workout" : [Résultats](https://lottiefiles.com/search?q=workout)
- "fitness" : [Résultats](https://lottiefiles.com/search?q=fitness)
- "exercise" : [Résultats](https://lottiefiles.com/search?q=exercise)

## 🔍 Vérification

Pour vérifier que vos médias fonctionnent :

1. Ouvrez l'application
2. Allez sur "Today" un jour avec exercice
3. Vérifiez :
   - ✅ Animation visible (placeholder ou Lottie)
   - ✅ Bouton vidéo présent (si URL valide)
   - ✅ Notes techniques dépliables
   - ✅ Catégorie et équipement affichés

## 🐛 Dépannage

### La vidéo ne s'ouvre pas

- Vérifiez que l'URL commence par `http://` ou `https://`
- Testez l'URL dans votre navigateur
- Assurez-vous que la vidéo est publique

### L'animation Lottie ne s'affiche pas

- Vérifiez que le fichier JSON est valide
- Testez l'URL dans votre navigateur
- Vérifiez les CORS si hébergé externement

### Le bouton vidéo n'apparaît pas

- Vérifiez que la colonne contient une vraie URL
- Pas juste "▶ Voir vidéo"
- Doit commencer par `http`

---

**Note :** Les animations Lottie sont recommandées car elles sont :
- ✅ Légères (< 100KB typiquement)
- ✅ Vectorielles (qualité parfaite à toute taille)
- ✅ Animées (contrairement aux images statiques)
- ✅ Personnalisables (couleurs, vitesse, etc.)
