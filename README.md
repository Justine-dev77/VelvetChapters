# VelvetChapters 

Cette version permet :
- de créer un chapitre ;
- de choisir son numéro ;
- de modifier un chapitre local existant ;
- de corriger un ancien chapitre ;
- de supprimer un chapitre local ;
- de lire les chapitres depuis le sommaire ;
- d'exporter les chapitres locaux en JSON.


→ **Limitation actuelle**

- VelvetChapters est actuellement déployé comme site statique avec GitHub Pages.
- Les chapitres publics sont chargés depuis `data/chapters.json`.
- Les chapitres créés depuis l’éditeur ne sont pas publiés automatiquement en ligne.
- Une prochaine version pourra intégrer un backend ou une base de données afin de permettre la publication et la synchronisation des chapitres.

→ **Chapitres locaux**

- Les chapitres créés depuis l’éditeur intégré sont enregistrés localement dans le navigateur grâce à `localStorage`.
- Ils sont identifiés par un badge **« Local uniquement — non publié »**.
- Ils ne sont visibles que dans le navigateur et sur l’appareil où ils ont été créés.
- Les chapitres publics sont chargés depuis `data/chapters.json` et visibles par tous les visiteurs.
- Cette distinction permet d’utiliser VelvetChapters comme espace de brouillon local avant publication.


JustineDev ♥
