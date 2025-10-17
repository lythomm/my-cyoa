// ...existing code...
export const story = {
  start: 'office',
  initialVars: {
    memory: 0,
    courage: 0,
    inventory: ['desk-key'],
    path: [],
    objectFound: false,
    officeVisited: false,
    paradoxBreak: false,
    secretRevealed: false,
    keyUsed: false,
    computerUsed: false,
    windowOpened: false,
    authorAware: false,
    glitch: false,
    freed: false,
    narratorAlly: false,
  },
  nodes: {
    // --- point de départ ---
    office: {
      id: 'office',
      text:
        'Vous êtes dans un bureau, assis à un bureau, dans un fauteuil confortable. Il y a une clé sur votre bureau, mais elle ne semble servir à rien. Vous êtes seul.\n\n' +
        "Le narrateur vous observe… ou peut-être pas. Vous n'êtes pas sûr de ce que vous devez faire.",
      choices: [
        { text: 'Regarder la clé', to: 'look_at_key', effects: [{ var: 'memory', op: 'inc' }] },
        { text: 'Sortir du bureau', to: 'door' },
        { text: 'Attendre que le narrateur parle', to: 'wait_for_narrator' },
        {
          text: 'Allumer l’ordinateur',
          to: 'computer_on',
          effects: [
            { var: 'path', op: 'push', value: 'computer' },
            { var: 'computerUsed', op: 'set', value: true },
          ],
        },
        { text: 'Vérifier la fenêtre', to: 'window' },
        { text: 'Explorer l’armoire à côté', to: 'cabinet' },
        { text: 'Fouiller sous le tapis', to: 'under_mat' },
      ],
    },

    // --- clés/objets ---
    look_at_key: {
      id: 'look_at_key',
      text: "Vous observez la clé, mais elle ne fait rien. C'est une simple clé, probablement sans utilité. Peut-être un vestige d'un bureau abandonné ?",
      choices: [
        {
          text: 'Mettre la clé dans votre inventaire',
          to: 'take_key',
          effects: [{ var: 'inventory', op: 'push', value: 'desk-key' }],
        },
        { text: 'Laisser la clé et quitter le bureau', to: 'door' },
        { text: 'Regarder sous le bureau', to: 'under_desk' },
      ],
    },

    take_key: {
      id: 'take_key',
      text: "Vous mettez la clé dans votre inventaire. Vous n'êtes pas sûr de ce que vous allez en faire, mais elle y est maintenant.",
      choices: [
        { text: 'Quitter le bureau et essayer la porte', to: 'door' },
        { text: 'Explorer l’armoire à côté', to: 'cabinet' },
        { text: 'Retourner au bureau pour chercher autre chose', to: 'office' },
      ],
    },

    under_desk: {
      id: 'under_desk',
      text: 'Sous le bureau, vous trouvez un petit interrupteur caché. Vous l’actionnez. La pièce se met à vibrer légèrement, et un bruit sourd se fait entendre venant du plafond.',
      choices: [
        { text: 'Chercher une trappe au plafond', to: 'trap_in_ceiling' },
        { text: 'Retourner au bureau et continuer', to: 'office' },
        { text: "Vous ignorez l'interrupteur et regardez la moquette", to: 'under_mat' },
      ],
    },

    trap_in_ceiling: {
      id: 'trap_in_ceiling',
      text: 'Vous trouvez une trappe discrète dans le plafond. Elle est verrouillée, mais vous avez une clé. Vous tentez de l’ouvrir.',
      choices: [
        {
          text: 'Utiliser la clé pour ouvrir la trappe',
          to: 'use_key_on_trap',
          require: [{ var: 'inventory', op: 'includes', value: 'desk-key' }],
        },
        { text: 'Retourner au bureau', to: 'office' },
      ],
    },

    use_key_on_trap: {
      id: 'use_key_on_trap',
      text: 'Vous insérez la clé dans la serrure et ouvrez la trappe. Un escalier en colimaçon mène à un sous-sol sombre. Vous hésitez un instant.',
      choices: [
        {
          text: 'Descendre dans le sous-sol',
          to: 'secret_room',
          effects: [{ var: 'secretRevealed', op: 'set', value: true }],
        },
        { text: 'Fermer la trappe et revenir au bureau', to: 'office' },
      ],
    },

    secret_room: {
      id: 'secret_room',
      text: 'La pièce secrète est poussiéreuse, mais elle contient des livres anciens et des objets mystérieux. Un grand coffre en bois trône au centre de la pièce.',
      choices: [
        {
          text: 'Ouvrir le coffre',
          to: 'open_chest',
          effects: [{ var: 'objectFound', op: 'set', value: true }],
        },
        { text: 'Explorer les livres', to: 'explore_books' },
        { text: 'Retourner à l’escalier', to: 'trap_in_ceiling' },
      ],
    },

    open_chest: {
      id: 'open_chest',
      text: 'Le coffre contient un étrange artefact, une petite boîte métallique ornée de symboles inconnus. Vous la tenez dans vos mains. C’est cela, l’objet mystérieux.',
      choices: [
        {
          text: 'Prendre l’objet et repartir',
          to: 'office',
          effects: [{ var: 'inventory', op: 'push', value: 'mysterious-object' }],
        },
        { text: 'Examiner l’objet de plus près', to: 'examine_object' },
        { text: 'Laisser l’objet dans le coffre', to: 'secret_room' },
      ],
    },

    examine_object: {
      id: 'examine_object',
      text: "L'objet émet une faible lueur. Quand vous le regardez de près, il vous semble que des mots s'agencent dans votre tête : 'Tu peux changer le récit.'",
      choices: [
        {
          text: 'Appuyer sur le petit bouton caché',
          to: 'meta_room',
          effects: [{ var: 'authorAware', op: 'set', value: true }],
        },
        {
          text: "Cacher l'objet dans votre poche",
          to: 'office',
          effects: [{ var: 'inventory', op: 'push', value: 'mysterious-object' }],
        },
        {
          text: "Jeter l'objet à terre",
          to: 'break_object',
          effects: [{ var: 'objectFound', op: 'set', value: false }],
        },
      ],
    },

    break_object: {
      id: 'break_object',
      text: 'La boîte se brise en émettant un bourdonnement dissonant. Pour un instant, le monde semble vaciller, puis revient à la normale, mais quelque chose a changé.',
      choices: [
        {
          text: "Monter l'escalier et retourner au bureau",
          to: 'office',
          effects: [{ var: 'glitch', op: 'set', value: true }],
        },
      ],
    },

    meta_room: {
      id: 'meta_room',
      text:
        "Vous êtes aspiré par une page blanche. Des lignes de texte se forment autour de vous — c'est presque comme si quelqu'un écrivait votre vie en même temps.\n\n" +
        "Une voix, différente du narrateur habituel, vous parle d'un auteur qui a cessé d'écrire. Vous avez le choix d'utiliser cette connaissance.",
      choices: [
        {
          text: "Lire la 'main de l'auteur' et apprendre",
          to: 'read_author',
          effects: [{ var: 'authorAware', op: 'set', value: true }],
        },
        { text: 'Fermer les yeux et retourner', to: 'office' },
        { text: "Tenter d'écrire vous-même une ligne", to: 'write_line' },
      ],
    },

    read_author: {
      id: 'read_author',
      text: 'Vous lisez et comprenez que le monde est une fiction. Vous gagnez en liberté intérieure — mais le narrateur remarque votre mouvement.',
      choices: [
        {
          text: 'Utiliser cette connaissance pour négocier avec le narrateur',
          to: 'negotiate_narrator',
          effects: [{ var: 'narratorAlly', op: 'set', value: true }],
        },
        {
          text: 'Cacher ce savoir et continuer discrètement',
          to: 'office',
          effects: [{ var: 'memory', op: 'inc' }],
        },
      ],
    },

    write_line: {
      id: 'write_line',
      text: "Vos mots s'inscrivent dans l'air et l'environnement change légèrement. Vous avez maintenant la preuve que vous pouvez influer sur la narration.",
      choices: [
        {
          text: "Écrire 'libérez-moi'",
          to: 'attempt_free',
          effects: [{ var: 'freed', op: 'set', value: true }],
        },
        { text: "Ne rien écrire d'autre", to: 'office' },
      ],
    },

    attempt_free: {
      id: 'attempt_free',
      text: "Vous écrivez la ligne. Pour un instant, tout est silencieux, puis le narrateur rit. 'C'était naïf', dit-il, mais quelque chose dans l'architecture du récit a faibli.",
      choices: [
        {
          text: 'Profiter de la faille et partir',
          to: 'true_escape',
          require: [{ var: 'freed', op: 'truthy' }],
        },
        {
          text: 'Rester et explorer la faille',
          to: 'paradox_break',
          effects: [{ var: 'paradoxBreak', op: 'set', value: true }],
        },
      ],
    },

    // --- ordinateur ---
    computer_on: {
      id: 'computer_on',
      text: "L'ordinateur s'allume. L'écran montre un bureau virtuel avec quelques fenêtres ouvertes : un client e‑mail, un navigateur et une application 'LOGS'.",
      choices: [
        { text: 'Ouvrir le navigateur', to: 'browser' },
        { text: 'Regarder les e‑mails', to: 'emails' },
        { text: 'Ouvrir LOGS', to: 'logs' },
        { text: "Éteindre l'ordinateur", to: 'office' },
      ],
    },

    browser: {
      id: 'browser',
      text: "Le navigateur affiche des pages sur 'Bureaux identiques' et 'Boucles narratives'. Un lien étrange propose 'Contacter l'auteur'.",
      choices: [
        { text: "Cliquer 'Contacter l'auteur'", to: 'contact_author' },
        { text: 'Fermer le navigateur', to: 'computer_on' },
      ],
    },

    contact_author: {
      id: 'contact_author',
      text: "Un formulaire s'ouvre. Si vous envoyez un message, vous pourriez attirer l'attention de l'auteur… ou la colère du narrateur.",
      choices: [
        {
          text: 'Envoyer un message suppliant',
          to: 'author_response',
          effects: [{ var: 'authorAware', op: 'set', value: true }],
        },
        { text: 'Ne rien envoyer', to: 'computer_on' },
      ],
    },

    author_response: {
      id: 'author_response',
      text: "Il y a une réponse automatique : 'Je vous entends. Mais serai-je prêt à écrire votre sortie ?' Le monde tremble légèrement.",
      choices: [
        { text: "Prier l'auteur de vous libérer", to: 'negotiate_narrator' },
        { text: "Menacer l'auteur", to: 'threaten_author' },
      ],
    },

    threaten_author: {
      id: 'threaten_author',
      text: "Menacer l'auteur déclenche une réaction : la narration se durcit, le narrateur devient agressif. Le jeu menace de se refermer.",
      choices: [
        { text: "Regretter et s'excuser", to: 'computer_on' },
        {
          text: 'Persister',
          to: 'glitch_end',
          effects: [{ var: 'glitch', op: 'set', value: true }],
        },
      ],
    },

    logs: {
      id: 'logs',
      text: "Les journaux révèlent des entrées répétitives : 'Le joueur a choisi office', 'Le joueur a choisi door'... Vous voyez votre propre historique enregistré.",
      choices: [
        { text: 'Supprimer quelques lignes', to: 'erase_history' },
        { text: 'Télécharger les logs', to: 'download_logs' },
        { text: 'Fermer les logs', to: 'computer_on' },
      ],
    },

    erase_history: {
      id: 'erase_history',
      text: 'Vous supprimez quelques lignes. La mémoire du récit vacille et certains choix deviennent instables.',
      choices: [
        {
          text: "Profiter de l'instabilité pour créer un nouveau chemin",
          to: 'paradox_break',
          effects: [{ var: 'paradoxBreak', op: 'set', value: true }],
        },
        { text: 'Annuler et revenir', to: 'computer_on' },
      ],
    },

    download_logs: {
      id: 'download_logs',
      text: "Vous téléchargez un fichier étrange qui contient, au format texte, des instructions pour 'déverrouiller la fin secrète'.",
      choices: [
        { text: 'Suivre les instructions', to: 'secret_ending_instructions' },
        { text: 'Ignorer et revenir', to: 'computer_on' },
      ],
    },

    secret_ending_instructions: {
      id: 'secret_ending_instructions',
      text: 'Les instructions indiquent une séquence de choix à reproduire, exactement. Cela semble artificiel, mais possible.',
      choices: [
        { text: 'Suivre la séquence (risqué)', to: 'sequence_path' },
        { text: "Ne pas suivre (préserver l'imprévu)", to: 'computer_on' },
      ],
    },

    sequence_path: {
      id: 'sequence_path',
      text: 'Vous reproduisez la séquence. Le récit vous pousse dans une salle blanche, sans retour évident. Vous avez peut-être trouvé une fin secrète.',
      choices: [
        { text: 'Avancer', to: 'museum_ending' },
        { text: 'Reculer', to: 'office' },
      ],
    },

    // --- armoire ---
    cabinet: {
      id: 'cabinet',
      text: "L'armoire contient des dossiers et un petit tiroir verrouillé. Un post‑it indique 'Ne pas ouvrir'.",
      choices: [
        { text: 'Forcer le tiroir', to: 'drawer', effects: [{ var: 'courage', op: 'inc' }] },
        { text: 'Lire les dossiers', to: 'read_files' },
        { text: "Refermer l'armoire", to: 'office' },
      ],
    },

    drawer: {
      id: 'drawer',
      text: 'Vous trouvez un tournevis et une vieille photo montrant un couloir sans fin. La photo vous paraît familière.',
      choices: [
        {
          text: 'Prendre le tournevis',
          to: 'office',
          effects: [{ var: 'inventory', op: 'push', value: 'screwdriver' }],
        },
        {
          text: 'Garder la photo',
          to: 'office',
          effects: [{ var: 'path', op: 'push', value: 'photo' }],
        },
      ],
    },

    read_files: {
      id: 'read_files',
      text: "Les dossiers décrivent des tests sur 'sujets' forcés à répéter des choix. Le terme 'protocole narratif' revient souvent.",
      choices: [
        { text: 'Chercher des preuves supplémentaires', to: 'secret_room' },
        { text: 'Retourner au bureau', to: 'office' },
      ],
    },

    // --- fenêtre / tapis ---
    window: {
      id: 'window',
      text: "La fenêtre donne sur un couloir infini fait de bureaux identiques. On dirait que l'extérieur est la même boucle.",
      choices: [
        {
          text: 'Ouvrir la fenêtre',
          to: 'open_window',
          effects: [{ var: 'windowOpened', op: 'set', value: true }],
        },
        { text: 'Tenter de sauter', to: 'jump', require: [{ var: 'courage', op: '>=', value: 1 }] },
        { text: 'Regarder le couloir', to: 'hall_view' },
        { text: 'Retourner', to: 'office' },
      ],
    },

    open_window: {
      id: 'open_window',
      text: "Vous ouvrez la fenêtre et une brise fraîche passe. Vous entendez une voix lointaine dire : 'Vous n'avez jamais su où aller.'",
      choices: [
        { text: 'Appeler la voix', to: 'call_voice' },
        { text: 'Fermer la fenêtre et partir', to: 'office' },
      ],
    },

    jump: {
      id: 'jump',
      text: "Vous sautez. Le récit flanche, puis vous vous retrouvez à l'intérieur d'un autre bureau — identique mais légèrement décalé.",
      choices: [
        { text: 'Explorer ce nouveau bureau', to: 'shifted_office' },
        { text: "Tenter d'en sortir encore", to: 'finale' },
      ],
    },

    hall_view: {
      id: 'hall_view',
      text: 'Au loin, vous voyez une porte différente, lumineuse, comme si elle menait hors du cycle.',
      choices: [
        { text: "Essayer d'y aller", to: 'corridor_to_light' },
        { text: 'Retourner au bureau', to: 'office' },
      ],
    },

    under_mat: {
      id: 'under_mat',
      text: 'Sous le tapis, une petite pièce métallique est cousue : une pièce avec un symbole. Elle pourrait servir à quelque chose…',
      choices: [
        {
          text: 'Garder la pièce',
          to: 'office',
          effects: [{ var: 'inventory', op: 'push', value: 'strange-coin' }],
        },
        { text: 'Jeter la pièce', to: 'office' },
      ],
    },

    // --- portes et sorties ---
    door: {
      id: 'door',
      text: "La porte est juste là. Vous pourriez l'ouvrir et sortir, mais vous avez aussi cette clé dans votre inventaire. Peut-être que la clé ouvre la porte ?",
      choices: [
        {
          text: 'Essayer la clé dans la porte',
          to: 'use_key_on_door',
          require: [{ var: 'inventory', op: 'includes', value: 'desk-key' }],
        },
        { text: 'Ouvrir la porte sans la clé', to: 'open_door_without_key' },
        { text: 'S’asseoir et attendre', to: 'wait_for_narrator' },
        { text: 'Vérifier sous le tapis', to: 'under_mat' },
      ],
    },

    use_key_on_door: {
      id: 'use_key_on_door',
      text: "La clé tourne facilement. La porte s'ouvre sur un couloir que vous ne connaissiez pas auparavant.",
      choices: [
        {
          text: 'Suivre le couloir',
          to: 'outside_hall',
          effects: [{ var: 'keyUsed', op: 'set', value: true }],
        },
        { text: 'Refermer la porte et rester', to: 'office' },
      ],
    },

    open_door_without_key: {
      id: 'open_door_without_key',
      text: "Vous ouvrez la porte sans problème, et de l'autre côté, vous êtes de retour dans le même bureau. L'illusion se brise. Un miroir reflète ce que vous voyez : le même choix infini.",
      choices: [
        { text: 'Reprendre votre place dans le bureau', to: 'office' },
        { text: 'Sortir définitivement', to: 'finale' },
      ],
    },

    outside_hall: {
      id: 'outside_hall',
      text: "Le couloir est bordé de portes aux étiquettes incompréhensibles. Certaines sont verrouillées, d'autres s'ouvrent sur des scènes impossibles.",
      choices: [
        { text: "Entrer dans une porte marquée 'Vérité'", to: 'truth_room' },
        { text: 'Aller vers la porte lumineuse au loin', to: 'corridor_to_light' },
        { text: 'Retourner au bureau', to: 'office' },
      ],
    },

    truth_room: {
      id: 'truth_room',
      text: "La salle 'Vérité' contient un écran montrant l'éditeur de texte qui a écrit votre histoire. Vous voyez des lignes inachevées.",
      choices: [
        {
          text: 'Corriger une ligne (changer un mot)',
          to: 'tweak_text',
          effects: [{ var: 'authorAware', op: 'set', value: true }],
        },
        { text: "Fermer l'écran", to: 'outside_hall' },
      ],
    },

    tweak_text: {
      id: 'tweak_text',
      text: "Vous changez un mot. La réalité s'ajuste. Parfois, ces petits changements ouvrent de nouvelles possibilités, parfois ils provoquent des régressions.",
      choices: [
        {
          text: "Remplacer 'bureau' par 'porte' dans une ligne vitale",
          to: 'glitch_end',
          effects: [{ var: 'glitch', op: 'set', value: true }],
        },
        { text: 'Faire une petite correction inoffensive', to: 'outside_hall' },
      ],
    },

    corridor_to_light: {
      id: 'corridor_to_light',
      text: "La lumière est aveuglante. Au bout, une porte marquée 'FIN' semble exister hors du récit.",
      choices: [
        { text: "Ouvrir la porte 'FIN'", to: 'final_choice' },
        { text: 'Hésiter et revenir', to: 'outside_hall' },
      ],
    },

    final_choice: {
      id: 'final_choice',
      text: 'La porte propose plusieurs sorties possibles : la fin calme, la fin dramatique, la fin secrète, et la fin meta.',
      choices: [
        { text: 'Choisir la fin calme', to: 'calm_end' },
        { text: 'Choisir la fin dramatique', to: 'dramatic_end' },
        { text: 'Chercher la fin secrète', to: 'sequence_path' },
        { text: 'Demander au narrateur', to: 'ask_narrator' },
      ],
    },

    calm_end: {
      id: 'calm_end',
      text: "Vous sortez dans un champ tranquille. Les bureaux et le narrateur demeurent derrière vous comme un mauvais rêve. Vous vous asseyez et respirez. C'est apaisant.",
      choices: [],
    },

    dramatic_end: {
      id: 'dramatic_end',
      text: "La porte s'ouvre sur un grand vide. Vous marchez en avant et vous dissolvez lentement — fin tragique mais nette.",
      choices: [],
    },

    // --- interactions avec le narrateur ---
    wait_for_narrator: {
      id: 'wait_for_narrator',
      text: "Le narrateur semble désireux de vous guider, mais vous décidez d'attendre. Le silence est lourd. Finalement, la voix du narrateur se fait entendre : « Peut-être qu'il est temps de vous lever. »",
      choices: [
        { text: 'Obéir au narrateur et sortir', to: 'door' },
        { text: 'Ignorer le narrateur et rester dans le bureau', to: 'office' },
        { text: 'Répondre au narrateur (dialogue)', to: 'talk_narrator' },
      ],
    },

    talk_narrator: {
      id: 'talk_narrator',
      text: 'Vous parlez au narrateur. Pour la première fois, il hésite. Vous sentez que vos mots ont un poids.',
      choices: [
        { text: "L'implorer de partir", to: 'negotiate_narrator' },
        { text: "L'accuser d'être cruel", to: 'rebel_against_narrator' },
        { text: 'Suggérer une autre histoire', to: 'offer_story' },
      ],
    },

    negotiate_narrator: {
      id: 'negotiate_narrator',
      text: "Le narrateur vous écoute. Après un long silence il murmure : 'Peut-être que si tu coopères…' Il propose un marché.",
      choices: [
        {
          text: 'Accepter le marché et suivre ses instructions',
          to: 'narrator_help',
          effects: [{ var: 'narratorAlly', op: 'set', value: true }],
        },
        { text: 'Refuser et le défier', to: 'rebel_against_narrator' },
      ],
    },

    narrator_help: {
      id: 'narrator_help',
      text: "Le narrateur vous guide vers une suite de portes qui semblaient absentes auparavant. Il promet de vous guider vers une 'vraie' sortie… mais à quel prix ?",
      choices: [
        {
          text: 'Suivre et faire confiance',
          to: 'true_escape',
          effects: [{ var: 'freed', op: 'set', value: true }],
        },
        { text: 'Trahir le narrateur et partir seul', to: 'paradox_break' },
      ],
    },

    rebel_against_narrator: {
      id: 'rebel_against_narrator',
      text: "Vous défiez le narrateur. Il rit et l'environnement devient instable : les couleurs se décalent, les choix se fissurent.",
      choices: [
        { text: 'Profiter de la fissure', to: 'paradox_break' },
        { text: 'Regretter et reculer', to: 'office' },
      ],
    },

    offer_story: {
      id: 'offer_story',
      text: "Vous proposez au narrateur une autre histoire. Il vous demande un nom pour cette histoire. Si vous le donnez, il s'engage à la raconter.",
      choices: [
        { text: 'Donner un nom simple', to: 'narrator_story_told' },
        { text: "Refuser d'en fournir un", to: 'office' },
      ],
    },

    narrator_story_told: {
      id: 'narrator_story_told',
      text: "Le narrateur commence votre histoire. Pour un instant, vous êtes le sujet et l'auteur à la fois.",
      choices: [
        { text: 'Laisser la narration vous emporter', to: 'museum_ending' },
        { text: 'Insérer votre propre tournant', to: 'write_line' },
      ],
    },

    // --- fins secrètes / méta ---
    museum_ending: {
      id: 'museum_ending',
      text: "Vous entrez dans une grande salle pleine d'objets : des fragments de versions de vous-même. Un panneau indique : 'Exposition des joueuses et joueurs.' Vous devenez une relique.",
      choices: [],
    },

    true_escape: {
      id: 'true_escape',
      text: "Une porte minuscule s'ouvre sur une route réelle. Vous ressentez l'air vrai et vous marchez loin du bruit. Vous avez réussi à vous extraire du récit — ou c'est ainsi que cela se sent.",
      choices: [],
    },

    glitch_end_placeholder: {
      id: 'glitch_end',
      text: ' ',
      choices: [],
    },

    glitch_fix: {
      id: 'glitch_end',
      text: "Le monde se brise en pixels. Des lignes de code tombent comme de la neige. Vous perdez votre forme. Peut-être que c'est une fin… ou une transition.",
      choices: [],
    },

    // Correction: une clé pour le glitch_end unique
    glitch_end: {
      id: 'glitch_end',
      text: 'Le monde se fragmente. Les mots se répètent, et la narration court en boucle infinie — vous êtes figé dans le bug.',
      choices: [],
    },

    // --- autres branches / petits embranchements ---
    shifted_office: {
      id: 'shifted_office',
      text: "Ce bureau est presque identique au vôtre, sauf qu'un écran affiche : 'Ne jamais refaire'. Un tiroir est rempli d'autres clés.",
      choices: [
        {
          text: 'Prendre une autre clé',
          to: 'office',
          effects: [{ var: 'inventory', op: 'push', value: 'duplicate-key' }],
        },
        {
          text: "Détruire l'écran",
          to: 'screen_destroy',
          effects: [{ var: 'glitch', op: 'set', value: true }],
        },
      ],
    },

    screen_destroy: {
      id: 'screen_destroy',
      text: "L'écran se fissure et le narrateur crie. La pièce perd de sa cohérence.",
      choices: [
        { text: 'Profiter et courir vers la lumière', to: 'corridor_to_light' },
        { text: 'Fuir en arrière', to: 'office' },
      ],
    },

    // --- fin alternative de confrontation avec 'auteur' ---
    ask_narrator: {
      id: 'ask_narrator',
      text: "Vous demandez au narrateur s'il veut réellement vous donner une fin. Il hésite et révèle une faiblesse : il n'aime pas les choix sans sens.",
      choices: [
        { text: 'Proposer un sacrifice narratif pour la liberté', to: 'sacrifice_end' },
        { text: 'Demander une fin digne (narrator choisit)', to: 'narrator_chosen_end' },
      ],
    },

    sacrifice_end: {
      id: 'sacrifice_end',
      text: "Vous proposez d'effacer un souvenir important en échange de la liberté. Vous perdez un pan de vous-même mais gagnez l'accès à une sortie vraie.",
      choices: [
        {
          text: "Accepter l'effacement",
          to: 'true_escape',
          effects: [{ var: 'memory', op: 'dec' }],
        },
        { text: 'Refuser', to: 'office' },
      ],
    },

    narrator_chosen_end: {
      id: 'narrator_chosen_end',
      text: "Le narrateur écrit une fin pour vous. Elle est belle mais incomplète. Vous la vivez et puis l'écran s'éteint.",
      choices: [],
    },

    // --- petites fins de sécurité / fallback ---
    finale: {
      id: 'finale',
      text: 'Vous quittez définitivement le bureau, mais vous vous retrouvez dans un autre bureau identique. La boucle continue, vous vous demandez si vous avez vraiment quitté ou si vous êtes piégé dans cette réalité.',
      choices: [],
    },

    escape: {
      id: 'escape',
      text: 'Vous franchissez la porte, mais tout disparaît. Vous vous réveillez de nouveau dans le bureau. Le narrateur semble déçu.',
      choices: [{ text: 'Continuer à avancer', to: 'finale' }],
    },
  },
}
