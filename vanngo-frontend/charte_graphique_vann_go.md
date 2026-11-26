# Charte Graphique — Vann'Go
**Application mobile de covoiturage universitaire (Campus de Tohannic — UBS / ENSIBS, Vannes)**

---

## 1. Positionnement et identité de marque

**Vann'Go** incarne une mobilité quotidienne **locale, solidaire et écoresponsable**, pensée spécifiquement pour la communauté universitaire vannetaise (étudiants et personnel). 

### Valeurs visuelles
* **Écologie & Engagement :** L'impact environnemental positif (économie de $\text{CO}_2$) est au cœur de l'identité, symbolisé par le vert forêt et la feuille.
* **Confiance & Sérieux académique :** Le bleu nuit apporte une structure rassurante et institutionnelle, adaptée au cadre universitaire de l'UBS.
* **Clarté & Efficacité :** Une interface aérée, contrastée et intuitive, conçue pour une prise en main immédiate aux heures de pointe.

---

## 2. Logotype et déclinaisons

### Composition du logo
Le logo **Vann'Go** associe un pictogramme et une typographie :
* **Symbole :** Une feuille stylisée blanche inscrite dans un carré aux coins arrondis (`border-radius: 14px`) rempli en **Vert Vann'Go** (`#15803D`).
* **Typographie du nom :** « Vann' » en **Bleu Nuit** (`#0F172A`) et « Go » en **Vert Vann'Go** (`#15803D`), en graisse **Bold / ExtraBold**.

### Règles d'utilisation
* **Zone de protection :** Conserver une marge minimale équivalente à la hauteur de la lettre « V » tout autour du logo.
* **Version monochrome :** Sur fond sombre (`#0F172A`), utiliser le pictogramme vert avec le texte « Vann' » en blanc (`#FFFFFF`) et « Go » en vert clair (`#4ADE80`).

---

## 3. Palette de couleurs

La palette s'articule autour d'un duo principal (Vert Forêt et Bleu Nuit) soutenu par des nuances neutres très claires pour maximiser la lisibilité sur écran mobile.

### Couleurs principales (Identité & Actions)

| Rôle | Nom | Code Hexadécimal | RGB | Classe NativeWind | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primaire** | **Vert Vann'Go** | `#15803D` | `rgb(21, 128, 61)` | `bg-primary` / `text-primary` | Boutons d'action principaux (« Rechercher », « Réserver »), icônes actives, indicateurs $\text{CO}_2$. |
| **Secondaire** | **Bleu Nuit (Navy)** | `#0F172A` | `rgb(15, 23, 42)` | `bg-navy` / `text-navy` | Carte principale de recherche, boutons de validation (« Créer mon compte »), titres majeurs. |
| **Accent clair** | **Vert Menthe Pâle** | `#DCFCE7` / `#F0FDF4` | `rgb(220, 252, 231)` | `bg-green-100` / `bg-green-50` | Arrière-plan des badges (initiales profil, rôle sélectionné), surbrillance douce. |

### Couleurs neutres (Surfaces & Textes)

| Rôle | Nom | Code Hexadécimal | Classe NativeWind | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Fond d'écran** | **Blanc Cassé / Ardoise 50** | `#F8FAFC` | `bg-bgLight` / `bg-slate-50` | Fond général des écrans pour éviter l'éblouissement du blanc pur. |
| **Surface / Carte** | **Blanc Pur** | `#FFFFFF` | `bg-white` | Cartes de trajets, champs de formulaire, barre de navigation inférieure. |
| **Bordures** | **Gris Perle** | `#E2E8F0` | `border-slate-200` | Séparateurs fins, contours des inputs et des cartes. |
| **Texte secondaire** | **Gris Ardoise** | `#64748B` | `text-slate-500` | Sous-titres, libellés (« DÉPART », « DESTINATION »), informations secondaires. |

### Couleurs sémantiques (États)
* **Succès / Impact positif :** `#16A34A` (Confirmation de réservation, grammes de $\text{CO}_2$ économisés).
* **Alerte / Places limitées :** `#D97706` (Dernière place disponible).
* **Erreur / Déconnexion :** `#EF4444` (Messages d'erreur d'authentification, bouton de déconnexion).

---

## 4. Typographie

L'application utilise la police système native pour garantir une intégration fluide sur **iOS (San Francisco)** et **Android (Roboto)**, ou **Plus Jakarta Sans / Inter** pour une identité géométrique moderne.

### Hiérarchie typographique

| Style | Taille | Graisse | Interlignage | Couleur | Exemple d'usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Titre H1 (Hero)** | `28px` – `32px` | ExtraBold (`800`) | `34px` | `#0F172A` | « Rejoignez le mouvement. » |
| **Titre H2 (Écran)** | `22px` – `24px` | ExtraBold (`800`) | `28px` | `#0F172A` | « Manon », « Mon Impact Écologique » |
| **Titre H3 (Section)** | `18px` | Bold (`700`) | `24px` | `#0F172A` | « Trajets disponibles », « Domicile ou UBS ? » |
| **Corps (Body)** | `15px` – `16px` | Regular (`400`) / Medium (`500`) | `22px` | `#0F172A` | Noms des conducteurs, adresses, champs de saisie. |
| **Micro-label / Tag** | `11px` – `12px` | Bold (`700`) — Majuscules | `16px` | `#15803D` ou `#64748B` | « VOTRE PROCHAIN TRAJET », « AUJOURD'HUI » |

---

## 5. Iconographie et composants UI

### Style des icônes
* **Bibliothèque :** `Lucide React Native` (trait fin et régulier, épaisseur `2px`, extrémités arrondies).
* **Icônes clés :** Feuille (`Leaf` pour l'impact $\text{CO}_2$), Maison (`Home`), Voiture (`Car`), Passager (`User`), Épingle (`MapPin`), Loupe (`Search`).

### Formes et arrondis (Border Radius)
L'interface privilégie des formes douces et accueillantes :
* **Grandes cartes (Recherche, Bilan $\text{CO}_2$) :** `rounded-3xl` (`24px`).
* **Cartes de trajets et conteneurs :** `rounded-2xl` (`16px`).
* **Boutons principaux et champs de texte :** `rounded-xl` (`12px`).
* **Badges et avatars (initiales) :** `rounded-xl` (`12px`) ou circulaire (`rounded-full`).

### Composants signatures
1. **La Carte de Recherche (Hero Card) :** Fond `#0F172A`, encart blanc interne regroupant le départ (point vert) et la destination (carré bleu nuit) avec bouton d'inversion rapide, surmontant le bouton pleine largeur `#15803D`.
2. **La Carte de Trajet (`OffreCard`) :** Fond `#FFFFFF`, avatar carré à initiales (ex. `LM` sur fond bleu/vert pastel), horaire mis en valeur à droite en `18px Bold`, itinéraire synthétique et bouton d'action compact `#15803D` en bas à droite.
3. **La Barre de Navigation (Tab Bar) :** 4 onglets fixes (*Accueil*, *Impact*, *Proposer*, *Profil*), avec mise en avant de l'action centrale « Proposer » via un bouton carré sombre (`#0F172A`) à icône blanche `+`.