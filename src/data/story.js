// src/data/story.js
// Histoire médiévale héroïque-fantasy — “La Porte Écarlate”
// Schéma compatible avec le starter (Vue 3 + Vuex + Tailwind):
// - initialVars: variables globales (inventaire en array de strings pour `includes`)
// - nodes: chaque nœud possède { id, text, choices[] }
// - choice: { text, to, require?: [{var, op, value}], effects?: [{var, op, value}] }

export const story = {
  start: 'wheatfield',
  initialVars: {
    name: '???',
    memory: 0, // jauge de souvenirs
    courage: 0,
    inventory: ['red-artifact'], // l’artéfact écarlate tenu en main
    shardAwake: false, // l’artéfact réagit
    oathWithRanger: false, // serment prêté au rôdeur
    markOfBloom: false, // marque protectrice
    path: [], // trace narrative légère
  },
  nodes: {
    wheatfield: {
      id: 'wheatfield',
      text:
        "La chaleur du soleil <b>caresse</b> un champ de blé ondoyant. Tu te redresses, l'esprit brumeux. Dans ta main, un petit artéfact rouge pulse faiblement, comme un cœur lointain.\n\n" +
        'Aucun souvenir. Seulement ton souffle, la mer d’épis dorés… et ce mystérieux objet.' +
        'Aucun souvenir. Seulement ton souffle, la mer d’épis dorés… et ce mystérieux objet.' +
        'Aucun souvenir. Seulement ton souffle, la mer d’épis dorés… et ce mystérieux objet.' +
        'Aucun souvenir. Seulement ton souffle, la mer d’épis dorés… et ce mystérieux objet.' +
        'Aucun souvenir. Seulement ton souffle, la mer d’épis dorés… et ce mystérieux objet.' +
        'Aucun souvenir. Seulement ton souffle, la mer d’épis dorés… et ce mystérieux objet.' +
        'Aucun souvenir. Seulement ton souffle, la mer d’épis dorés… et ce mystérieux objet.' +
        'Aucun souvenir. Seulement ton souffle, la mer d’épis dorés… et ce mystérieux objet.' +
        'Aucun souvenir. Seulement ton souffle, la mer d’épis dorés… et ce mystérieux objet.',
      choices: [
        {
          text: 'Examiner l’artéfact rouge',
          to: 'artifact_glimpse',
          effects: [
            { var: 'memory', op: 'inc' },
            { var: 'path', op: 'push', value: 'look-artifact' },
          ],
        },
        {
          text: 'Marcher vers la lisière de la forêt au nord',
          // to: 'forest_edge',
          effects: [{ var: 'courage', op: 'inc' }],
        },
        {
          text: 'Chercher un chemin vers le village au sud',
          to: 'village_gate',
        },
      ],
    },

    artifact_glimpse: {
      id: 'artifact_glimpse',
      text:
        'Tu soulèves l’artéfact. Sa surface écarlate est gravée de fines veines lumineuses. Le monde s’assombrit autour de toi, un chuchotis traverse ton crâne : « Réveille-moi… »\n\n' +
        'Une image furtive éclate — une tour brisée, une porte rouge scellée par des runes.',
      choices: [
        {
          text: 'Tenter d’éveiller l’artéfact',
          // to: 'spark',
          effects: [
            { var: 'shardAwake', op: 'set', value: true },
            { var: 'memory', op: 'inc' },
          ],
        },
        {
          text: 'Revenir à toi et avancer vers la forêt',
          to: 'forest_edge',
        },
        {
          text: 'Revenir à toi et avancer vers le village',
          to: 'village_gate',
        },
      ],
    },

    forest_edge: {
      id: 'forest_edge',
      text:
        'La lisière te salue de son haleine de sève et d’ombre. Un sentier étroit s’enfonce entre les troncs. Un rôdeur sort du couvert, arc à la main, sans hostilité.\n\n' +
        '« Les champs t’ont recrachée, étrangère. Ce que tu portes brille trop fort pour rester seule. »',
      choices: [
        {
          text: 'Parler au rôdeur',
          to: 'ranger_talk',
          effects: [{ var: 'courage', op: 'inc' }],
        },
        {
          text: 'Ignorer et continuer sur le sentier',
          // to: 'deep_forest',
        },
        { text: 'Repartir vers le village', to: 'village_gate' },
      ],
    },

    ranger_talk: {
      id: 'ranger_talk',
      text:
        'Le rôdeur s’incline. « Je me nomme Erdan. Ce talisman… je l’ai vu dans des traités. Une Porte Écarlate scelle la crypte de la Tour-Fendillée, à l’est. ' +
        'Si un souffle s’y agite, tu y trouveras ta mémoire… ou ta perte. »',
      choices: [
        {
          text: 'Prêter serment de lier vos routes (protection du rôdeur)',
          to: 'oath',
          effects: [
            { var: 'oathWithRanger', op: 'set', value: true },
            { var: 'memory', op: 'inc' },
            { var: 'path', op: 'push', value: 'oath-erdan' },
          ],
        },
        {
          text: 'Refuser poliment et poursuivre seule vers l’est',
          to: 'old_road',
        },
        {
          text: 'Demander un signe protecteur',
          to: 'bloom_mark',
        },
      ],
    },

    oath: {
      id: 'oath',
      text: 'Vous joignez vos mains sur l’artéfact. Une veine rouge tressaute ; le vent se tait. Erdan sourit : « Jusqu’à la Porte-Fendillée. »',
      choices: [
        { text: 'Prendre l’ancienne route vers l’est', to: 'old_road' },
        { text: 'Faire un détour par la clairière sacrée', to: 'shrine' },
      ],
    },

    bloom_mark: {
      id: 'bloom_mark',
      text:
        'Erdan écrase une feuille entre ses doigts et trace un symbole floral sur ton front. Une fraîcheur coule dans ta nuque.\n\n' +
        '« La Marque de Floraison détourne de menues malédictions… parfois. »',
      choices: [
        {
          text: 'Remercier et partir vers l’ancienne route',
          to: 'old_road',
          effects: [{ var: 'markOfBloom', op: 'set', value: true }],
        },
        { text: 'Visiter la clairière sacrée avant la route', to: 'shrine' },
      ],
    },

    shrine: {
      id: 'shrine',
      text: 'Une clairière baignée d’un rayon calme. Un autel moussu porte des offrandes desséchées. L’artéfact, dans ta paume, vibre d’une curiosité affamée.',
      choices: [
        {
          text: 'Déposer l’artéfact sur l’autel (risqué)',
          to: 'shrine_vision',
          effects: [{ var: 'courage', op: 'inc' }],
        },
        { text: 'Prier en silence', to: 'shrine_prayer' },
        { text: 'Revenir à la route', to: 'old_road' },
      ],
    },

    shrine_prayer: {
      id: 'shrine_prayer',
      text: 'Tu fermes les yeux. Une brise soulève les herbes ; des fragments de voix fredonnent. Tu ne comprends pas les mots mais ils apaisent la fièvre rouge.',
      choices: [
        {
          text: 'Tu gagnes un charme de fortune',
          to: 'old_road',
          effects: [{ var: 'inventory', op: 'push', value: 'lucky-charm' }],
        },
      ],
    },

    shrine_vision: {
      id: 'shrine_vision',
      text:
        'Lorsque l’artéfact touche la pierre, un cercle runique s’illumine. Le monde bascule — un souvenir éclate :\n\n' +
        'Tu étais **Archiviste de l’Aube**, gardienne des seuils. Une silhouette masquée te l’arrache des mains ; le rouge se fissure.\n\n' +
        'Tu halètes. L’autel s’éteint.',
      choices: [
        {
          text: 'Reprendre l’artéfact et repartir',
          to: 'old_road',
          effects: [
            { var: 'memory', op: 'inc' },
            { var: 'inventory', op: 'push', value: 'rune-splinter' }, // éclat de rune
          ],
        },
      ],
    },

    village_gate: {
      id: 'village_gate',
      text: 'Une palissade, des charrettes, l’odeur de pain. À la porte, une intendante te jauge. « Voyageuse ? Tu as l’air perdue… et ça, dans ta main, attire les ennuis. »',
      choices: [
        {
          text: 'Demander abri et informations',
          to: 'village_inn',
          effects: [{ var: 'path', op: 'push', value: 'inn' }],
        },
        {
          text: 'Vendre un objet pour des provisions',
          to: 'village_market',
          require: [{ var: 'inventory', op: 'includes', value: 'lucky-charm' }],
        },
        { text: 'Quitter le village pour l’est', to: 'old_road' },
      ],
    },

    village_inn: {
      id: 'village_inn',
      text:
        'À l’auberge, une conteuse écoute ton trouble. Elle parle alors d’une tour brisée, d’une porte rouge qui s’ouvre « au nom véritable ». \n\n' +
        '« Les noms ont du poids. Cherche un écho à l’est. »',
      choices: [
        {
          text: 'Tenter de te rappeler ton nom',
          to: 'name_recall',
          effects: [{ var: 'memory', op: 'inc' }],
        },
        { text: 'Partir pour l’est', to: 'old_road' },
      ],
    },

    name_recall: {
      id: 'name_recall',
      text:
        'Un murmure, au bord des lèvres : … **Élyra**. Le son s’accroche à tes os comme une promesse.\n\n' +
        'Lorsque tu prononces « Élyra », l’artéfact redouble de lumière.',
      choices: [
        {
          text: 'Adopter ce nom',
          to: 'old_road',
          effects: [
            { var: 'name', op: 'set', value: 'Élyra' },
            { var: 'memory', op: 'inc' },
          ],
        },
      ],
    },

    village_market: {
      id: 'village_market',
      text: 'Le marché cliquette. Tu échanges ton petit charme contre des vivres et une **lampe à huile**.',
      choices: [
        {
          text: 'Prendre la route de l’est',
          to: 'old_road',
          effects: [
            { var: 'inventory', op: 'remove', value: 'lucky-charm' },
            { var: 'inventory', op: 'push', value: 'oil-lamp' },
          ],
        },
      ],
    },

    old_road: {
      id: 'old_road',
      text: 'L’ancienne route fend collines et dolmens. Au crépuscule, une brume se tisse ; de pâles lanternes dansent entre les pierres.',
      choices: [
        {
          text: 'Allumer une lampe (si tu en as)',
          to: 'wisp_guard',
          require: [{ var: 'inventory', op: 'includes', value: 'oil-lamp' }],
        },
        {
          text: 'Suivre une lanterne spectrale',
          to: 'wisp_follow',
          effects: [{ var: 'courage', op: 'inc' }],
        },
        { text: 'Ignorer et presser le pas vers la tour', to: 'broken_tower' },
      ],
    },

    wisp_guard: {
      id: 'wisp_guard',
      text: 'Ta lampe tranche la brume. Les feux-follets s’éloignent, frustrés. Dans l’ombre, tu crois entendre : « Nom… Porte… Sang… »',
      choices: [{ text: 'Continuer vers la tour', to: 'broken_tower' }],
    },

    wisp_follow: {
      id: 'wisp_follow',
      text: 'Tu avances derrière la lueur flottante. Elle te mène à un tertre creux, révélation soudaine : une cache scellée. À l’intérieur, un **sceau runique** craquelé.',
      choices: [
        {
          text: 'Prendre le sceau et revenir à la route',
          to: 'broken_tower',
          effects: [{ var: 'inventory', op: 'push', value: 'cracked-seal' }],
        },
      ],
    },

    broken_tower: {
      id: 'broken_tower',
      text:
        'La **Tour-Fendillée** dresse sa carcasse contre le ciel. À sa base, une porte de pierre veinée de rouge — la **Porte Écarlate** — close par trois anneaux de rune.\n\n' +
        'L’artéfact chauffe, impatient.',
      choices: [
        {
          text: 'Présenter l’artéfact écarlate',
          to: 'gate_first',
          effects: [{ var: 'path', op: 'push', value: 'present-shard' }],
        },
        {
          text: 'Tenter d’invoquer ton nom (si retrouvé)',
          to: 'gate_name',
          require: [{ var: 'name', op: '==', value: 'Élyra' }],
        },
        {
          text: 'Utiliser le sceau runique (si possédé)',
          to: 'gate_seal',
          require: [{ var: 'inventory', op: 'includes', value: 'cracked-seal' }],
        },
      ],
    },

    gate_first: {
      id: 'gate_first',
      text: 'Tu dresses l’artéfact : un anneau se déverrouille dans un grincement de métal ancien. La pierre respire.',
      choices: [
        {
          text: 'Forcer l’ouverture (risqué)',
          to: 'bad_end_overreach',
          require: [{ var: 'courage', op: '>=', value: 2 }],
        },
        { text: 'Chercher une autre clé', to: 'search_keys' },
        {
          text: 'Invoquer un nom (si tu le connais)',
          to: 'gate_name',
          require: [{ var: 'name', op: '==', value: 'Élyra' }],
        },
      ],
    },

    gate_name: {
      id: 'gate_name',
      text: '« Par mon nom véritable, j’ordonne : ouvre. » Le deuxième anneau se libère. L’artéfact répond avec joie — souvenir : tu as juré de **garder** ce seuil, pas de l’abandonner.',
      choices: [
        {
          text: 'Achever le rituel avec le sceau (si possédé)',
          to: 'gate_seal',
          require: [{ var: 'inventory', op: 'includes', value: 'cracked-seal' }],
        },
        { text: 'Chercher encore autour', to: 'search_keys' },
      ],
    },

    gate_seal: {
      id: 'gate_seal',
      text: 'Tu poses le sceau contre la rune inférieure : il se répare dans une gerbe de glyphes — **le troisième anneau cède**. La Porte halète, entrouverte.',
      choices: [
        {
          text: 'Entrer seule dans la crypte',
          to: 'final_memory',
        },
        {
          text: 'Appeler le rôdeur (si serment prêté)',
          to: 'call_ranger',
          require: [{ var: 'oathWithRanger', op: 'truthy' }],
        },
      ],
    },

    search_keys: {
      id: 'search_keys',
      text: 'Tu fouilles les abords : racines, créneaux, niches effondrées. Un éclat rouge jumeau au tien pulse brièvement, puis s’éteint — trop profond pour l’atteindre sans outils.',
      choices: [
        {
          text: 'Revenir à la Porte et tenter l’ouverture malgré tout',
          to: 'bad_end_overreach',
        },
        {
          text: 'Revenir à la Porte et invoquer le nom (si possible)',
          to: 'gate_name',
          require: [{ var: 'name', op: '==', value: 'Élyra' }],
        },
        {
          text: 'Revenir à la Porte et utiliser le sceau (si possible)',
          to: 'gate_seal',
          require: [{ var: 'inventory', op: 'includes', value: 'cracked-seal' }],
        },
      ],
    },

    call_ranger: {
      id: 'call_ranger',
      text: 'Ton cri fend la tour. Erdan jaillit de l’ombre. « Tu n’iras pas seule. » Il te noue un talisman d’aubépine au poignet.',
      choices: [
        {
          text: 'Entrer ensemble',
          to: 'final_memory',
          effects: [{ var: 'inventory', op: 'push', value: 'hawthorn-talisman' }],
        },
      ],
    },

    final_memory: {
      id: 'final_memory',
      text:
        'La crypte palpite de lente lumière. Au centre, une dalle gravée t’attend. L’artéfact s’y emboîte parfaitement.\n\n' +
        'Les souvenirs affluent : **Élyra, Archiviste de l’Aube**, gardienne des seuils. Trahie par un masque sans nom. Tu as brisé l’artéfact pour qu’il ne tombe pas tout entier en de mauvaises mains.',
      choices: [
        {
          text: 'Restaurer le Sceau et reprendre ton serment',
          to: 'good_end_keeper',
          require: [{ var: 'memory', op: '>=', value: 3 }],
        },
        {
          text: 'Détourner la puissance pour réécrire ton destin',
          to: 'grey_end_wanderer',
        },
        {
          text: 'Forcer la Porte plus loin, coûte que coûte',
          to: 'bad_end_overreach',
        },
      ],
    },

    good_end_keeper: {
      id: 'good_end_keeper',
      text:
        'Tu lies ton nom, l’artéfact et la dalle. La Porte Écarlate se referme dans un soupir, scellée — mais **obéissante** à ta voix désormais. Les plaines te reconnaissent ; la Tour te salue.\n\n' +
        'Tu es **Élyra, Gardienne revenue**. Tes pas n’ont plus d’ombre.',
      choices: [],
    },

    grey_end_wanderer: {
      id: 'grey_end_wanderer',
      text:
        'Tu détournes le flux rouge. Le monde frémit. Ton passé reste incomplet, mais la Porte cède un passage vers des routes que nul n’a cartographiées.\n\n' +
        'Tu pars, **voyageuse aux souvenirs troués**, l’artéfact battant comme une boussole vers des ailleurs.',
      choices: [],
    },

    bad_end_overreach: {
      id: 'bad_end_overreach',
      text:
        'Tu exiges, tu tires, tu brises. La Porte rugit. Une marée rouge te traverse — trop vaste, trop ancienne. \n\n' +
        'Le monde se brouille. Lorsqu’il se calme, il ne reste que du blé au vent… et un murmure : « Réveille-moi… »',
      choices: [],
    },
  },
}
