# Reste a faire :
- Lobby : 
    - [x] Deconnexion User
    - [x]Room broadcaast
    - [x] Gestion des erreur Front End 
    - [x] empecher obsevable complete lobby on error
    - [x] Rediriger sur le game component
    - [] Rediriger les events dans le lobby service
    - [] Suppression du timer quand game fini (bug)
    - [] Déconnecter User quand Server died
- Game
    - [x] Calculer bon ratio
    - [x] creation character dans le server
    - [x] mouvement V0
    - [x] Revoir le calcul pour les diagonales
    - [] Stocker les collisons dans un quadTree
    - [] Collision
    - [] Dash
    - [] attaque
    - Client side prediction
- Tech
    - Simuler du lag


- Art
    - Aseprite Tutorial
    - Design une piece japonaise ( *Weeb* )

- Game Design
    - Plein de chose

- Bonus : Dire a Sao que je l'aime


const averageFPS = (delta: number) => {
  fps.push(1000 / delta)
  if (fps.length > frameTrack) fps.shift()
  let sum = 0
  for (const r of fps) sum += r
  return sum / fps.length
}