export const story = {
  start: 'intro_village',
  initialVars: {
    // Stats principales
    HP: 10,
    FOR: 0,
    DEX: 0,
    INT: 0,

    // État du monde et inventaire
    inventory: [],
    mamiaAlive: true,
    necklaceState: 'glowing', // 'glowing', 'fading', 'dead'

    // Flags d'histoire
    wolfCompanion: false, // Si on sauve le loup
    injured: false, // Malus si on échoue un combat
    griffinRespect: false,
  },
  nodes: {
    // ------------------------------------------------------------------
    // ACTE I : LE DÉPART ET L'ENTRAÎNEMENT
    // ------------------------------------------------------------------

    intro_village: {
      id: 'intro_village',
      text:
        'Vous êtes Yuna. Dehors, le vent chante dans la vallée de Val-Clair.\n\n' +
        "Dans la pénombre de la chaumière, votre grand-mère, Mamia, respire difficilement. Elle vous tend un collier argenté orné d'une pierre en forme de goutte. La pierre pulse d'une lumière chaude.",
      choices: [
        {
          text: 'Prendre le collier avec délicatesse',
          to: 'mamia_mission',
          effects: [
            { var: 'inventory', op: 'push', value: 'necklace' },
            { var: 'inventory', op: 'push', value: 'necklace' },
            { var: 'inventory', op: 'push', value: 'necklace' },
            { var: 'inventory', op: 'push', value: 'necklace' },
            { var: 'inventory', op: 'push', value: 'necklace' },
            { var: 'inventory', op: 'push', value: 'necklace' },
            { var: 'inventory', op: 'push', value: 'necklace' },
            { var: 'inventory', op: 'push', value: 'necklace' },
            { var: 'inventory', op: 'push', value: 'necklace' },
            { var: 'INT', op: 'add', value: 1 },
          ],
        },
        {
          text: 'Serrer sa main fermement',
          to: 'mamia_mission',
          effects: [
            { var: 'FOR', op: 'add', value: 1 },
            { var: 'inventory', op: 'push', value: 'necklace' },
          ],
        },
      ],
    },

    mamia_mission: {
      id: 'mamia_mission',
      text:
        "« Tant que cette goutte brille, je suis là », murmure-t-elle. « Va à la Cime des Géants. Trouve la Fleur de Brume. C'est mon seul espoir... ou le tien. »\n\n" +
        'Vous sortez. Kael, le forgeron, vous attend pour vous remettre votre équipement avant le grand départ.',
      choices: [{ text: 'Rejoindre Kael à la forge', to: 'kael_training' }],
    },

    kael_training: {
      id: 'kael_training',
      text: 'Kael vous tend votre lance à double lame. « La route sera dure, Yuna. Quelle leçon as-tu le mieux retenue de nos entraînements ? »',
      choices: [
        {
          text: '« Frapper fort pour briser la garde » (+FOR)',
          to: 'supply_choice',
          effects: [
            { var: 'FOR', op: 'add', value: 2 },
            { var: 'inventory', op: 'push', value: 'lance' },
          ],
        },
        {
          text: '« Bouger vite pour ne jamais être touchée » (+DEX)',
          to: 'supply_choice',
          effects: [
            { var: 'DEX', op: 'add', value: 2 },
            { var: 'inventory', op: 'push', value: 'lance' },
          ],
        },
        {
          text: "« Observer l'ennemi pour trouver la faille » (+INT)",
          to: 'supply_choice',
          effects: [
            { var: 'INT', op: 'add', value: 2 },
            { var: 'inventory', op: 'push', value: 'lance' },
          ],
        },
      ],
    },

    supply_choice: {
      id: 'supply_choice',
      text: 'Avant de franchir la porte du village, vous pouvez emporter un objet supplémentaire dans votre sac.',
      choices: [
        {
          text: 'Une corde solide',
          to: 'crossroads',
          effects: [{ var: 'inventory', op: 'push', value: 'corde' }],
        },
        {
          text: 'Des herbes de soin',
          to: 'crossroads',
          effects: [{ var: 'inventory', op: 'push', value: 'herbes' }],
        },
        {
          text: 'Un vieux grimoire sur la faune',
          to: 'crossroads',
          effects: [{ var: 'inventory', op: 'push', value: 'grimoire' }],
        },
      ],
    },

    crossroads: {
      id: 'crossroads',
      text: "Vous quittez Val-Clair. La montagne se dresse au loin, immense. Deux chemins s'offrent à vous pour atteindre le pied des falaises.",
      choices: [
        { text: 'La Forêt des Ombres', to: 'forest_entry' },
        { text: 'Le Sentier des Vents', to: 'cliffs_entry' },
      ],
    },

    // ------------------------------------------------------------------
    // ACTE II - BRANCHE A : LA FORÊT DES OMBRES (Combat / Force / Nature)
    // ------------------------------------------------------------------

    forest_entry: {
      id: 'forest_entry',
      text: "La forêt est dense. Des champignons bioluminescents éclairent le chemin. Vous entendez des gémissements venant d'un fourré. Un louveteau de pierre est coincé sous un tronc.",
      choices: [
        {
          text: 'Soulever le tronc',
          to: 'save_wolf',
          require: [{ var: 'FOR', op: '>=', value: 1 }],
        },
        {
          text: 'Utiliser la lance comme levier',
          to: 'save_wolf',
          require: [{ var: 'INT', op: '>=', value: 1 }],
        },
        { text: "L'ignorer et continuer", to: 'wolf_ambush' },
      ],
    },

    save_wolf: {
      id: 'save_wolf',
      text: "Vous libérez le louveteau. Il vous regarde avec reconnaissance avant de s'enfuir. Vous vous sentez en harmonie avec la forêt.",
      choices: [
        {
          text: 'Continuer',
          to: 'wolf_ambush',
          effects: [{ var: 'wolfCompanion', op: 'set', value: true }],
        },
      ],
    },

    wolf_ambush: {
      id: 'wolf_ambush',
      text: "Plus loin, une meute de Loups de Pierre surgit des ombres ! Ils grognent, prêts à bondir. L'Alpha est énorme.",
      choices: [
        {
          text: "Affronter l'Alpha en duel",
          to: 'combat_victory',
          require: [{ var: 'FOR', op: '>=', value: 3 }],
        },
        {
          text: "Grimper à un arbre et les piquer d'en haut",
          to: 'combat_victory',
          require: [{ var: 'DEX', op: '>=', value: 2 }],
        },
        {
          text: 'Lire leur comportement et les intimider',
          to: 'combat_victory',
          require: [{ var: 'inventory', op: 'includes', value: 'grimoire' }],
        },
        {
          text: 'Se battre désespérément',
          to: 'combat_injured',
        },
      ],
    },

    // ------------------------------------------------------------------
    // ACTE II - BRANCHE B : LE SENTIER DES VENTS (Agilité / Dex)
    // ------------------------------------------------------------------

    cliffs_entry: {
      id: 'cliffs_entry',
      text: 'Le vent souffle fort. Le chemin est étroit. Devant vous, un ravin de dix mètres. Le pont a été détruit.',
      choices: [
        {
          text: 'Sauter par-dessus le vide',
          to: 'ravine_success',
          require: [{ var: 'DEX', op: '>=', value: 3 }],
        },
        {
          text: 'Lancer la corde et se balancer',
          to: 'ravine_success',
          require: [{ var: 'inventory', op: 'includes', value: 'corde' }],
        },
        {
          text: 'Chercher un autre passage',
          to: 'ravine_detour',
          require: [{ var: 'INT', op: '>=', value: 2 }],
        },
        { text: "Tenter l'escalade à mains nues (Risqué)", to: 'ravine_fail' },
      ],
    },

    ravine_success: {
      id: 'ravine_success',
      text: "Vous atterrissez avec souplesse de l'autre côté. Quelle sensation de liberté !",
      choices: [
        {
          text: "Continuer l'ascension",
          to: 'cave_shelter',
          effects: [{ var: 'DEX', op: 'add', value: 1 }],
        },
      ],
    },

    ravine_detour: {
      id: 'ravine_detour',
      text: "Vous trouvez un passage secret derrière une cascade. C'est plus long, mais sûr.",
      choices: [
        {
          text: "Continuer l'ascension",
          to: 'cave_shelter',
          effects: [{ var: 'INT', op: 'add', value: 1 }],
        },
      ],
    },

    ravine_fail: {
      id: 'ravine_fail',
      text: 'Vous glissez ! Vous vous rattrapez de justesse, mais vous vous tordez la cheville et perdez du temps.',
      choices: [
        {
          text: "Boiter jusqu'au refuge",
          to: 'cave_shelter',
          effects: [{ var: 'injured', op: 'set', value: true }],
        },
      ],
    },

    combat_victory: {
      id: 'combat_victory',
      text: "Vous avez vaincu l'obstacle sans une égratignure. Vous vous sentez puissante.",
      choices: [{ text: 'Avancer vers les neiges', to: 'cave_shelter' }],
    },

    combat_injured: {
      id: 'combat_injured',
      text: 'Vous survivez, mais à quel prix... Vous saignez et votre corps est douloureux.',
      choices: [
        {
          text: 'Utiliser les herbes pour se soigner',
          to: 'cave_shelter',
          require: [{ var: 'inventory', op: 'includes', value: 'herbes' }],
          effects: [{ var: 'inventory', op: 'remove', value: 'herbes' }],
        },
        {
          text: 'Avancer en serrant les dents (Blessée)',
          to: 'cave_shelter',
          effects: [{ var: 'injured', op: 'set', value: true }],
        },
      ],
    },

    // ------------------------------------------------------------------
    // ACTE III : LE TOURNANT DRAMATIQUE
    // ------------------------------------------------------------------

    cave_shelter: {
      id: 'cave_shelter',
      text: 'Vous atteignez la zone des Neiges Éternelles. Une tempête de blizzard vous force à vous abriter dans une grotte glacée. Vous tremblez de froid.',
      choices: [{ text: 'Sortir le collier pour se réchauffer le cœur', to: 'necklace_event' }],
    },

    necklace_event: {
      id: 'necklace_event',
      text: "Vous tenez la pierre. Elle pulse... Boum... Boum... \n\nSoudain, la lumière vacille. Une fois. Deux fois. Et s'éteint. La pierre devient froide et grise, comme morte.",
      choices: [
        {
          text: 'Hurler de rage et frapper le mur',
          to: 'grief_anger',
          effects: [
            { var: 'FOR', op: 'add', value: 1 },
            { var: 'mamiaAlive', op: 'set', value: false },
          ],
        },
        {
          text: 'Pleurer en silence',
          to: 'grief_sadness',
          effects: [
            { var: 'INT', op: 'add', value: 1 },
            { var: 'mamiaAlive', op: 'set', value: false },
          ],
        },
      ],
    },

    grief_anger: {
      id: 'grief_anger',
      text: 'La colère vous envahit. Pourquoi continuer ? Elle est partie ! Vous avez envie de tout casser.',
      choices: [{ text: 'Canaliser cette colère pour atteindre le sommet', to: 'final_ascent' }],
    },

    grief_sadness: {
      id: 'grief_sadness',
      text: "La tristesse vous submerge. Vous comprenez que vous êtes seule désormais. Mais vous vous souvenez de sa promesse : 'Voir le monde'.",
      choices: [{ text: 'Se lever pour honorer sa mémoire', to: 'final_ascent' }],
    },

    // ------------------------------------------------------------------
    // ACTE IV : LE GARDIEN ET LA FIN
    // ------------------------------------------------------------------

    final_ascent: {
      id: 'final_ascent',
      text: "Vous sortez de la grotte. Le sommet est là. Mais un Griffon Cendré garde l'accès. Il est gigantesque.",
      choices: [
        {
          text: 'Attaquer frontalement',
          to: 'griffin_fight',
          require: [{ var: 'FOR', op: '>=', value: 4 }],
        },
        {
          text: "Utiliser l'environnement pour l'aveugler",
          to: 'griffin_smart',
          require: [{ var: 'INT', op: '>=', value: 4 }],
        },
        {
          text: 'Esquiver ses coups et courir',
          to: 'griffin_dodge',
          require: [{ var: 'DEX', op: '>=', value: 4 }],
        },
        {
          text: 'Montrer le collier éteint',
          to: 'griffin_peace',
          require: [{ var: 'wolfCompanion', op: 'truthy' }],
        },
        {
          text: 'Tenter le tout pour le tout',
          to: 'griffin_struggle',
        },
      ],
    },

    griffin_fight: {
      id: 'griffin_fight',
      text: "Votre rage décuple vos forces. Vous repoussez la bête qui, impressionnée par votre puissance, s'incline et vous laisse passer.",
      choices: [{ text: 'Atteindre la Cime', to: 'summit' }],
    },

    griffin_smart: {
      id: 'griffin_smart',
      text: 'Vous provoquez une avalanche mineure qui bloque le Griffon sans le blesser. La voie est libre.',
      choices: [{ text: 'Atteindre la Cime', to: 'summit' }],
    },

    griffin_dodge: {
      id: 'griffin_dodge',
      text: "Vous êtes insaisissable. Le Griffon s'épuise à frapper le vide. Vous filez entre ses serres vers le sommet.",
      choices: [{ text: 'Atteindre la Cime', to: 'summit' }],
    },

    griffin_peace: {
      id: 'griffin_peace',
      text: "Le louveteau que vous avez sauvé sort de votre sac et hurle. Le Griffon reconnaît l'odeur de la forêt. Il voit votre collier éteint et comprend votre deuil. Il s'écarte.",
      choices: [{ text: 'Atteindre la Cime', to: 'summit' }],
    },

    griffin_struggle: {
      id: 'griffin_struggle',
      text: 'Le combat est terrible. Vous êtes gravement blessée, votre lance est brisée. Le Griffon vous laisse passer par pitié, voyant votre détermination suicidaire.',
      choices: [
        {
          text: "Ramper jusqu'à la Cime",
          to: 'summit',
          effects: [{ var: 'injured', op: 'set', value: true }],
        },
      ],
    },

    summit: {
      id: 'summit',
      text: "Le toit du monde. Le ciel est violet. Au centre d'un lac miroir, la Fleur de Brume brille éternellement.",
      choices: [{ text: "S'approcher de la fleur", to: 'flower_choice' }],
    },

    flower_choice: {
      id: 'flower_choice',
      text: 'Vous comprenez que la fleur ne ramènera pas les morts. Elle préserve le souvenir. Que faites-vous ?',
      choices: [
        {
          text: 'Cueillir la fleur pour la tombe',
          to: 'ending_tradition',
        },
        {
          text: 'Laisser la fleur et déposer le collier ici',
          to: 'ending_acceptance',
        },
      ],
    },

    ending_tradition: {
      id: 'ending_tradition',
      text: 'Vous redescendez avec la fleur. Au village, vous la plantez sur la tombe de Mamia. Elle ne fanera jamais. Vous devenez la gardienne du village, forte et protectrice.\n\nFIN (La Gardienne)',
      choices: [],
    },

    ending_acceptance: {
      id: 'ending_acceptance',
      text: "Vous laissez le collier au sommet, offert au ciel. Vous redescendez les mains vides, mais le cœur léger. Vous n'avez pas besoin d'objet pour vous souvenir. Vous parcourez le monde pour raconter votre histoire.\n\nFIN (L'Exploratrice)",
      choices: [],
    },
  },
}
