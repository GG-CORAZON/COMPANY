// ============================================================
//  CONFIG.JS — Fichier de configuration du LinkTree
//  Modifie CE fichier pour personnaliser tout le site !
//  Consulte le README.md pour les explications détaillées.
// ============================================================

const CONFIG = {

  // ----------------------------------------------------------
  // PROFIL
  // ----------------------------------------------------------
  streamer: {
    pseudo:       "GG_CORAZON",          // Ton pseudo affiché
    tagline:      "Rappelez-moi de ne jamais rien lâcher sous prétexte que c'est difficile.", // Phrase sous le pseudo
    avatar:       "avatar.jpg",          // Photo de profil (place le fichier à la racine)
    // Si tu n'as pas de photo, laisse "" pour afficher les initiales
  },

  // ----------------------------------------------------------
  // STATUT LIVE
  // Passe isLive à true quand tu stream, false sinon.
  // (Tu peux aussi utiliser l'API Twitch — voir README)
  // ----------------------------------------------------------
  live: {
    isLive:       false,                 // true = badge "EN LIVE" animé visible
    liveLabel:    "🔴 EN LIVE MAINTENANT",
    offlineLabel: "RETROUVEZ MOI SUR TWITCH",
    twitchChannel: "GG_CORAZON",         // Nom du channel Twitch (pour le lien live)
  },

  // ----------------------------------------------------------
  // LIENS RÉSEAUX SOCIAUX
  // Mets url: "" pour masquer un lien.
  // Réordonne les objets pour changer l'ordre d'affichage.
  // ----------------------------------------------------------
  links: [
    {
      id:       "twitch",
      label:    "Twitch",
      sublabel: "Viens me voir en live !",
      url:      "https://twitch.tv/gg_corazon",
      icon:     "twitch",               // Nom de l'icône (voir README)
      color:    "#9147ff",              // Couleur d'accentuation du bouton
    },
    {
      id:       "discord",
      label:    "Discord",
      sublabel: "Rejoins la communauté",
      url:      "https://discord.gg/QsUn7VQ8cE",
      icon:     "discord",
      color:    "#5865f2",
    },
    {
      id:       "youtube",
      label:    "YouTube",
      sublabel: "Highlights",
      url:      "https://www.youtube.com/@gg_corazon",
      icon:     "youtube",
      color:    "#ff0000",
    },
    {
      id:       "tiktok",
      label:    "TikTok",
      sublabel: "Clips & moments forts",
      url:      "https://www.tiktok.com/@gg_corazon",
      icon:     "tiktok",
      color:    "#ffee00",
    },
    {
      id:       "instagram",
      label:    "Instagram",
      sublabel: "",
      url:      "https://www.instagram.com/gg_corazon",
      icon:     "instagram",
      color:    "#c23c69",
    },
    {
      id:       "Letterboxd",
      label:    "Letterbox",
      sublabel: "",
      url:      "https://letterboxd.com/gg_corazon",
      icon:     "letterboxd",
      iconImg:  "logos/Letterboxd.png",
      color:    "#3fdd01",
    },
  ],

  // ----------------------------------------------------------
  // THÈME & COULEURS
  // ----------------------------------------------------------
  theme: {
    primaryColor:   "#00fff7",   // Cyan néon principal
    secondaryColor: "#bf00ff",   // Violet néon secondaire
    accentColor:    "#ff00aa",   // Rose néon accent
    bgColor:        "#06000f",   // Couleur de fond
    cardBg:         "rgba(255,255,255,0.03)", // Fond des cartes
    fontTitle:      "'Orbitron', sans-serif",  // Police du titre
    fontBody:       "'Rajdhani', sans-serif",  // Police du corps
  },

  // ----------------------------------------------------------
  // PARTICULES (fond animé)
  // ----------------------------------------------------------
  particles: {
    enabled:  true,
    count:    80,        // Nombre de particules (60–120 conseillé)
    speed:    0.4,       // Vitesse (0.2 = lent, 1 = rapide)
    size:     2,         // Taille max des particules en px
    color:    "#00fff7", // Couleur des particules
    linked:   true,      // Relier les particules proches par des lignes
    linkDist: 130,       // Distance max pour relier (en px)
  },

  // ----------------------------------------------------------
  // SEO & MÉTADONNÉES
  // ----------------------------------------------------------
  meta: {
    title:       "GG_CORAZON",
    description: "Tous mes liens en un seul endroit !",
    url:         "", // URL de ton GitHub Pages
    themeColor:  "#06000f",
  },

};
