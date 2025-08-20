# Optimisation du Ferraillage des Poutres  
### Outil pour Choisir le Diamètre et le Nombre de Barres selon l’Eurocode 2

Cet outil open source, conforme à **l’Eurocode 2 (EN 1992-1-1)**, permet de choisir automatiquement le diamètre et le nombre de barres d’acier nécessaires pour le ferraillage des poutres en béton armé.  
Il simplifie le processus de dimensionnement, garantit la conformité aux normes européennes EC2 et fournit des résultats fiables en quelques clics.

---

## 🚀 Fonctionnalités
- Sélection automatique du diamètre et du nombre de barres en fonction de la section d’acier As (mm²).  
- Vérification de l’enrobage du béton selon EC2.  
- Calcul multi-couches (jusqu’à 5 lits d’armatures longitudinales).  
- Contrôle du pourcentage maximal d’ajustement de la section d’acier (%As_max).  

---

## 🛠️ Utilisation

1. **Entrer la section d’acier (As)** en mm² obtenue lors du calcul des aciers longitudinaux.  
2. **Indiquer la largeur (b)** et la **hauteur (h)** de la poutre (prédimensionnement).  
3. **Déterminer l’enrobage réel (c)** et l’enrobage minimal (c_min) avec notre outil dédié.  
4. **Spécifier le diamètre maximal du granulat (Dmax)** selon EC2.  
5. **Entrer le diamètre des cadres transversaux (∅w,cad)** selon tableau normatif.  
6. (Optionnel) **Ajuster %As_max** pour approcher la section théorique souhaitée.  

### Résultats obtenus :
- Diamètre et nombre de barres d’acier par lit (jusqu’à 5 lits).  
- Espacement horizontal (a) et vertical (a1) des armatures.  
- Conformité à **l’Eurocode 2 (EN 1992-1-1)**.  

---

## 📖 Références normatives
- **EN 1990** — Bases de calcul des structures.  
- **EN 1991** — Actions sur les structures.  
- **EN 1992-1-1** — Calcul des structures en béton (Eurocode 2).  

---

## ⚠️ Avertissement
Cet outil est fourni **à des fins éducatives et de pré-dimensionnement**.  
Les résultats doivent être validés par un **bureau d’étude structure qualifié** avant toute mise en œuvre.  

---

## 📜 Licence
Ce projet est distribué sous licence **AGPLv3** afin de garantir son caractère libre et ouvert.  
Vous pouvez l’utiliser, le modifier et le partager dans l’esprit du **bien commun**.  

👉 Voir le fichier [LICENSE](./LICENSE) pour plus de détails.  

---

## 🌍 English Summary

This open-source tool helps **optimize beam reinforcement** according to **Eurocode 2 (EN 1992-1-1)**.  
It automatically selects the bar diameter and quantity required for reinforced concrete beams based on the steel area As.  
The tool ensures compliance with EC2, supports multi-layer reinforcement layouts, and exports interoperable results.  

⚠️ **Disclaimer:** Results are for educational and preliminary design purposes only.  
Final designs must always be verified by a licensed structural engineer.  

Licensed under **MIT License**.  
