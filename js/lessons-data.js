/**
 * Touch Typing Academy Curriculum Data
 * Comprehensive beginner to advanced lessons with pedagogical notes,
 * target keys, target WPM, min accuracy, and progressive drills.
 */

const LESSONS_DATA = [
  // ================= STAGE 1: BEGINNER FOUNDATIONS =================
  {
    id: 'lesson-1',
    stage: 'beginner',
    stageNumber: 1,
    lessonNumber: 1,
    title: 'Home Row: F and J Anchors',
    description: 'Feel the small raised bumps on the F and J keys with your index fingers. These are your home anchors. Rest your fingers naturally curved over ASDF and JKL; without looking down.',
    newKeys: ['f', 'j', ' '],
    fingerGuide: 'Left Index: F | Right Index: J | Thumbs: Space',
    targetWpm: 15,
    minAccuracy: 90,
    exercises: [
      'f j f j ff jj fff jjj fj jf',
      'f j fj jf ff jj fjf jfj fjj jff',
      'f j f j fj jf fff jjj fj fj jf jf',
      'f j f j fj jf f f j j ff jj fj jf'
    ]
  },
  {
    id: 'lesson-2',
    stage: 'beginner',
    stageNumber: 1,
    lessonNumber: 2,
    title: 'Home Row: D and K Keys',
    description: 'Use your middle fingers. Your left middle finger rests on D, and your right middle finger rests on K.',
    newKeys: ['d', 'k'],
    fingerGuide: 'Left Middle: D | Right Middle: K',
    targetWpm: 15,
    minAccuracy: 90,
    exercises: [
      'd k d k dd kk ddd kkk dk kd',
      'f d j k fd jk df kj fdf jkj',
      'd f k j dk fj df jk kf jd fdk',
      'dk dk fj fj fdk fjk kjd jdf dkfj'
    ]
  },
  {
    id: 'lesson-3',
    stage: 'beginner',
    stageNumber: 1,
    lessonNumber: 3,
    title: 'Home Row: S and L Keys',
    description: 'Use your ring fingers. Your left ring finger rests on S, and your right ring finger rests on L.',
    newKeys: ['s', 'l'],
    fingerGuide: 'Left Ring: S | Right Ring: L',
    targetWpm: 16,
    minAccuracy: 90,
    exercises: [
      's l s l ss ll sss lll sl ls',
      's d f j k l sdf jkl fds lkj',
      'asdf jkl; sad lad fall dads flak',
      'sl ls dk kd fj jf sk ld sf jl'
    ]
  },
  {
    id: 'lesson-4',
    stage: 'beginner',
    stageNumber: 1,
    lessonNumber: 4,
    title: 'Home Row: A and Semicolon (;)',
    description: 'Your pinky fingers rest on the edges of the home row: A for the left pinky and Semicolon (;) for the right pinky.',
    newKeys: ['a', ';'],
    fingerGuide: 'Left Pinky: A | Right Pinky: ;',
    targetWpm: 18,
    minAccuracy: 92,
    exercises: [
      'a ; a ; aa ;; aaa ;;; a; ;a',
      'asdf jkl; asdf jkl; fdsa ;lkj',
      'a fad a lad a salad a flask fall',
      'all alas ask add dads lads flash salsa'
    ]
  },
  {
    id: 'lesson-5',
    stage: 'beginner',
    stageNumber: 1,
    lessonNumber: 5,
    title: 'Home Row: G and H Center Reaches',
    description: 'Reach inwards from your anchor keys: Left index reaches right to G; Right index reaches left to H. Always return immediately to F and J.',
    newKeys: ['g', 'h'],
    fingerGuide: 'Left Index reach: G | Right Index reach: H',
    targetWpm: 20,
    minAccuracy: 92,
    exercises: [
      'f g f j h j fg jh gf hj fgh jhg',
      'had has half glad flag flash dash',
      'gas glass grass flash dash half fall',
      'a sad lad had a glad dad ask half glass'
    ]
  },
  {
    id: 'lesson-6',
    stage: 'beginner',
    stageNumber: 1,
    lessonNumber: 6,
    title: 'Top Row: E and I Keys',
    description: 'Reach up from D to E with your left middle finger. Reach up from K to I with your right middle finger. E and I are two of the most common vowels in English!',
    newKeys: ['e', 'i'],
    fingerGuide: 'Left Middle reach up: E | Right Middle reach up: I',
    targetWpm: 20,
    minAccuracy: 92,
    exercises: [
      'd e d k i k de ki ed ik ded kik',
      'see ski kid die fed lie side life',
      'like feel file idea sail fail lead seal',
      'he said she did file a safe deal indeed'
    ]
  },
  {
    id: 'lesson-7',
    stage: 'beginner',
    stageNumber: 1,
    lessonNumber: 7,
    title: 'Top Row: R, T, U, and Y Keys',
    description: 'Both index fingers control two top-row keys each: Left index reaches up to R and diagonally to T; Right index reaches up to U and diagonally to Y.',
    newKeys: ['r', 't', 'u', 'y'],
    fingerGuide: 'Left Index: R, T | Right Index: U, Y',
    targetWpm: 22,
    minAccuracy: 92,
    exercises: [
      'f r f f t f j u j j y j fr ft ju jy',
      'try rust fury yurt true hurt stay',
      'they tell that truth just after you start',
      'your great day will start right here today'
    ]
  },
  {
    id: 'lesson-8',
    stage: 'beginner',
    stageNumber: 1,
    lessonNumber: 8,
    title: 'Top Row: Q, W, O, and P Keys',
    description: 'Left pinky reaches up to Q, left ring reaches to W. Right ring reaches to O, right pinky reaches to P.',
    newKeys: ['q', 'w', 'o', 'p'],
    fingerGuide: 'Left: Q (pinky), W (ring) | Right: O (ring), P (pinky)',
    targetWpm: 22,
    minAccuracy: 92,
    exercises: [
      'a q a s w s l o l ; p ; aq sw lo ;p',
      'quit power paper hope loop world work',
      'we will write poetry with pure joy',
      'quick work will open poor people loop'
    ]
  },
  {
    id: 'lesson-9',
    stage: 'beginner',
    stageNumber: 1,
    lessonNumber: 9,
    title: 'Bottom Row: C, V, B, N, and M',
    description: 'Left hand drops down: middle finger reaches C, index reaches V and B. Right hand drops down: index reaches N and M.',
    newKeys: ['c', 'v', 'b', 'n', 'm'],
    fingerGuide: 'Left: C (middle), V/B (index) | Right: N/M (index)',
    targetWpm: 24,
    minAccuracy: 92,
    exercises: [
      'd c d f v f f b f j n j j m j',
      'can come back vine move man name brown',
      'many brave men can come back by evening',
      'never combine bad habits with vim or move'
    ]
  },
  {
    id: 'lesson-10',
    stage: 'beginner',
    stageNumber: 1,
    lessonNumber: 10,
    title: 'Bottom Row: Z, X, Comma, Period',
    description: 'Complete the alphabet! Left pinky drops to Z, ring drops to X. Right middle drops to comma (,), ring drops to period (.).',
    newKeys: ['z', 'x', ',', '.'],
    fingerGuide: 'Left: Z (pinky), X (ring) | Right: , (middle), . (ring)',
    targetWpm: 25,
    minAccuracy: 92,
    exercises: [
      'a z a s x s k , k l . l az sx k, l.',
      'size, next, extra, zebra, zone, exact.',
      'relax, fix, mix, zero, six, text.',
      'the quick brown fox jumps over the lazy dog.'
    ]
  },

  // ================= STAGE 2: INTERMEDIATE FLOW & SPEED =================
  {
    id: 'lesson-11',
    stage: 'intermediate',
    stageNumber: 2,
    lessonNumber: 11,
    title: 'Shift Keys & Capitalization Mastery',
    description: 'The Golden Rule of Shift: Use the OPPOSITE hand for Shift! Hold Left Shift with your left pinky when capitalizing letters typed by your right hand, and vice versa.',
    newKeys: ['ShiftLeft', 'ShiftRight', 'Capital Letters'],
    fingerGuide: 'Opposite Pinky on Shift Key',
    targetWpm: 28,
    minAccuracy: 94,
    exercises: [
      'Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm',
      'Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz',
      'London, Paris, Tokyo, New York, Rome, Berlin.',
      'Albert Einstein and Isaac Newton loved Mathematics and Physics.'
    ]
  },
  {
    id: 'lesson-12',
    stage: 'intermediate',
    stageNumber: 2,
    lessonNumber: 12,
    title: 'Common English Digraphs & Trigraphs',
    description: 'In English, certain letter combinations appear over and over (th, he, in, er, an, the, and, ing, ion). Typing these as single fluid muscle reflexes dramatically boosts your WPM.',
    newKeys: ['th', 'he', 'in', 'er', 'ing', 'tion'],
    fingerGuide: 'Fluid finger transitions without hesitation',
    targetWpm: 32,
    minAccuracy: 94,
    exercises: [
      'th he in er an re on at en nd st ed',
      'the and ing ion tio ent for ter ate that with',
      'thinking something standing running learning working',
      'the action and condition of learning brings great satisfaction'
    ]
  },
  {
    id: 'lesson-13',
    stage: 'intermediate',
    stageNumber: 2,
    lessonNumber: 13,
    title: 'Punctuation & Sentences',
    description: 'Master apostrophes (\'), quotation marks ("), question marks (?), exclamation marks (!), and hyphens (-). Keep your eyes strictly on the screen.',
    newKeys: ['\'', '"', '?', '!', '-'],
    fingerGuide: 'Right Pinky: \' " ? - | Left Pinky: !',
    targetWpm: 32,
    minAccuracy: 94,
    exercises: [
      'it\'s don\'t can\'t won\'t they\'re we\'ll who\'s',
      '"Hello!" she said. "Did you hear the news?"',
      'well-known, up-to-date, first-class, world-wide.',
      'Why wait? If not now, when? Think twice, type once!'
    ]
  },
  {
    id: 'lesson-14',
    stage: 'intermediate',
    stageNumber: 2,
    lessonNumber: 14,
    title: 'Top 100 Most Frequent English Words',
    description: 'The top 100 English words make up over 50% of everything written in the language. Mastering them builds instant, subconscious typing speed.',
    newKeys: ['Top 100 Words'],
    fingerGuide: 'Type full words as single thought units',
    targetWpm: 35,
    minAccuracy: 95,
    exercises: [
      'the of and to a in that is was he for it with as his on be',
      'at by i this had not are but from or have an they which one you',
      'were her all she there would their we him been has when who more',
      'no will my one all would there their what so up out if about who get'
    ]
  },
  {
    id: 'lesson-15',
    stage: 'intermediate',
    stageNumber: 2,
    lessonNumber: 15,
    title: 'Metronomic Rhythm & Flow Training',
    description: 'Speed is not about typing bursts then stopping; true speed comes from continuous, steady rhythm like a metronome. Keep your tempo steady without pausing.',
    newKeys: ['Rhythm Cadence'],
    fingerGuide: 'Steady pace, light key taps',
    targetWpm: 40,
    minAccuracy: 95,
    exercises: [
      'keep a smooth and steady cadence as you move across the keys',
      'do not rush fast words or stop on slow words maintain your calm flow',
      'accuracy always creates genuine speed so never sacrifice accuracy for haste',
      'consistent practice every day builds permanent muscle memory and confidence'
    ]
  },

  // ================= STAGE 3: ADVANCED MASTERY =================
  {
    id: 'lesson-16',
    stage: 'advanced',
    stageNumber: 3,
    lessonNumber: 16,
    title: 'Number Row Fluency (1-0)',
    description: 'Reach up from the top row to strike numbers without looking down. Reach with the same finger assigned to each column: 1 (pinky), 2 (ring), 3 (middle), 4 & 5 (index), 6 & 7 (index), 8 (middle), 9 (ring), 0 (pinky).',
    newKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    fingerGuide: 'Follow standard column reaches to top number row',
    targetWpm: 35,
    minAccuracy: 92,
    exercises: [
      '1 2 3 4 5 6 7 8 9 0 10 20 50 100',
      'item 42 costs 15 dollars while order 89 is 370 dollars',
      'in 1995, over 250 servers handled 3480 daily visitors',
      'call 555-0199 or office 404 between 9am and 5pm daily'
    ]
  },
  {
    id: 'lesson-17',
    stage: 'advanced',
    stageNumber: 3,
    lessonNumber: 17,
    title: 'Code Syntax & Programming Symbols',
    description: 'Essential for programmers and power users: curly brackets {}, square brackets [], parentheses (), arrows =>, and logical operators.',
    newKeys: ['{', '}', '[', ']', '<', '>', '=', '+', '_', '|', '&'],
    fingerGuide: 'Shifted symbols on top row and bracket keys',
    targetWpm: 38,
    minAccuracy: 93,
    exercises: [
      'arr[0] = { id: 1, name: "item", active: true };',
      'const filter = (items) => items.filter(x => x.score >= 90);',
      'if (x > 0 && y <= 100 || status !== null) { return true; }',
      'function computeHash(key = "default") { return `key_${key}`; }'
    ]
  },
  {
    id: 'lesson-18',
    stage: 'advanced',
    stageNumber: 3,
    lessonNumber: 18,
    title: 'Difficult Finger Stretches & Awkward Jumps',
    description: 'Certain finger transitions are naturally awkward: B to Y, P to Q, Z to X, and T to C. This drill unlocks supreme flexibility in your fingers.',
    newKeys: ['Awkward reaches: B, Y, P, Q, Z, X'],
    fingerGuide: 'Keep wrists floating slightly above desk',
    targetWpm: 42,
    minAccuracy: 94,
    exercises: [
      'byte by byte qualify zebra puzzle oxygen dynamic bypass',
      'equip antique analyze synchronize cryptography typography exquisite',
      'hyperlink labyrinth juxtaposition symbolize jeopardize hypothesize',
      'the puzzling behavior of the exotic lynx quickly amazed viewers'
    ]
  },
  {
    id: 'lesson-19',
    stage: 'advanced',
    stageNumber: 3,
    lessonNumber: 19,
    title: 'High-Speed Sprint Drill (50+ WPM)',
    description: 'Fast burst typing! Push your fingers to fly across the keys while keeping your eyes focused 2 to 3 words ahead of what your fingers are currently striking.',
    newKeys: ['Speed Acceleration'],
    fingerGuide: 'Look ahead 2-3 words ahead in the stream',
    targetWpm: 50,
    minAccuracy: 95,
    exercises: [
      'speed comes naturally when your fingers know where to go without hesitation',
      'read ahead so your brain processes upcoming words while your hands finish the current one',
      'relax your shoulders breathe gently and let your fingertips tap like rain on the keys',
      'you have now transformed from a beginner searching for keys into a skilled touch typist'
    ]
  },
  {
    id: 'lesson-20',
    stage: 'advanced',
    stageNumber: 3,
    lessonNumber: 20,
    title: 'Grandmaster Typing Endurance & Graduation',
    description: 'The ultimate graduation test! A sustained, multi-sentence paragraph combining numbers, capitalization, quotes, and rapid English flow. Reach 55+ WPM with 96%+ accuracy to earn your Grandmaster badge!',
    newKeys: ['Complete Mastery'],
    fingerGuide: 'Sustained focus, zero visual checking of keyboard',
    targetWpm: 55,
    minAccuracy: 96,
    exercises: [
      'Mastering the keyboard is one of the highest leverage skills of modern computing. When your fingers become an effortless extension of your mind, your thoughts flow directly into the computer at 60 words per minute or more. Congratulations on reaching the advanced graduation test!'
    ]
  }
];

window.LESSONS_DATA = LESSONS_DATA;
