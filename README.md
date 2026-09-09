# VelvetChapters 

Cette version permet :
- de créer un chapitre ;
- de choisir son numéro ;
- de modifier un chapitre local existant ;
- de corriger un ancien chapitre ;
- de supprimer un chapitre local ;
- de lire les chapitres depuis le sommaire ;
- d'exporter les chapitres locaux en JSON.

## Limitation actuelle

VelvetChapters est actuellement déployé comme site statique avec GitHub Pages.
Les chapitres créés depuis l’éditeur sont enregistrés localement dans le navigateur via `localStorage`. Ils ne sont donc visibles que sur l’appareil et le navigateur où ils ont été créés.
Les chapitres publics sont chargés depuis `data/chapters.json`.
Une prochaine version pourra intégrer un backend ou une base de données afin de publier et synchroniser les chapitres en ligne.

JustineDev ♥
