# WebGL-DAWIN-cup

Comment lancer la scène ?

Se rendre dans le dossier où se trouve "script.js" depuis un terminal de commandes
Entrer la commande "npx http-server"
Choisir une des adresses IP données et l'entrer dans le champs d'URL d'un navigateur
Voilà


Qu'est-ce que je peux faire une fois la scène sur mon écran ?

1)
Pointer sa souris sur la statuette du centre active une animation qui sépare les différents éléments la composant
Retirer le pointeur de la statuette fait revenir chaque élément à sa position initiale

2)
Ajouter "#/" suivi d'un texte à la fin de l'URL permet de changer le texte "DAWIN" sur la statuette
Par exemple, ajouter "#/bigornot" à la fin de l'URL changera le texte sur la statuette en "bigornot"

3)
Cliquer sur le bouton au centre le fait se presser
Les statuettes changent d'apparence
La statuette du centre garde son animation et son costume la suit
La lumière au plafond s'éteint et les trois lumières en face des statuettes changent de couleur
Ces trois lumières clignotent pendant 8 secondes
Une fois ces 8 secondes écoulées, tout redevient comme avant l'activation du bouton
Le bouton revient à sa position initiale
L'opération est répétable, mais il faut attendre que le bouton soit réactivable
