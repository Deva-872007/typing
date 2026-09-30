/**
 * Touch Typing Resources, Ergonomics, and Educational Guides Data
 * Complete reference center to make learning accessible, healthy, and fast.
 */

const RESOURCES_DATA = {
  posture: {
    title: "Ergonomics & Healthy Posture Guide",
    subtitle: "Protect your wrists, neck, and back while maximizing typing endurance.",
    sections: [
      {
        heading: "1. The Neutral Wrist Position (Avoid Carpal Tunnel)",
        badge: "Crucial for Health",
        content: `Your wrists should float in a neutral, straight line with your forearms. Never rest your wrists on the desk while typing or bend them backwards or sideways. Resting wrists compresses the median nerve in the carpal tunnel, causing numbness and chronic strain.`
      },
      {
        heading: "2. The 90-90-90 Seating Rule",
        badge: "Desk Setup",
        content: `Adjust your chair and desk so that:
- Your elbows rest at an open angle of 90° to 100°.
- Your hips and knees are bent at approximately 90°.
- Your feet rest flat on the floor or on an ergonomic footrest.`
      },
      {
        heading: "3. Monitor Alignment & Eye Level",
        badge: "Neck Protection",
        content: `The top third of your computer screen should align directly with your eye level at an arm's length (about 20-30 inches away). Looking down strains cervical vertebrae and causes forward head posture ("tech neck").`
      },
      {
        heading: "4. The 20-20-20 Rule for Eye Strain",
        badge: "Eye Care",
        content: `Every 20 minutes of continuous typing, look away at an object at least 20 feet away for 20 seconds. This relaxes your ciliary eye muscles and prevents digital fatigue and headaches.`
      }
    ]
  },

  goldenRules: [
    {
      num: "01",
      title: "Never Look at the Keyboard",
      desc: "Looking down delays muscle memory. If you make a mistake, rely on your fingers to locate the home keys using the tactile bumps on F and J."
    },
    {
      num: "02",
      title: "Accuracy Always Precedes Speed",
      desc: "Speed is merely a natural byproduct of accuracy. If you type with 98%+ accuracy, high speed will follow automatically within weeks."
    },
    {
      num: "03",
      title: "Keep a Steady, Metronomic Rhythm",
      desc: "Avoid sprinting through easy words and slamming the brakes on hard words. Consistent cadence trains your brain to process letters seamlessly."
    },
    {
      num: "04",
      title: "Always Return to Home Row",
      desc: "After striking any key on the top or bottom row, immediately bring your fingers back to ASDF and JKL;. This ensures your hands never lose their coordinates."
    },
    {
      num: "05",
      title: "Opposite Shift Key Rule",
      desc: "Always press the Shift key with the hand opposite to the letter you are typing. Capitalizing 'A' uses Right Shift; capitalizing 'P' uses Left Shift."
    },
    {
      num: "06",
      title: "Feather-Light Keystrokes",
      desc: "Modern keyboards require very little actuation force. Don't bottom out aggressively or smash the keys; tap lightly to reduce tendon stress and increase speed."
    },
    {
      num: "07",
      title: "Daily Micro-Sessions (15-20 Mins)",
      desc: "Typing 15 minutes every single day builds neural pathways 3x faster than doing a grueling 2-hour session once a week."
    }
  ],

  plateaus: [
    {
      range: "Stuck at 20 - 40 WPM",
      obstacle: "Hunting & pecking habit, visual glances at keys, lack of home row anchors.",
      solution: "Place a small sheet of paper over your hands or look strictly at the screen. Practice Stage 1 lessons until F and J become automatic second nature."
    },
    {
      range: "Stuck at 40 - 60 WPM",
      obstacle: "Letter-by-letter thinking rather than whole-word muscle memory; frequent backspacing.",
      solution: "Stop correcting every tiny error during flow drills. Practice the Top 100 English Words and common digraphs ('th', 'ing', 'tion') until your fingers fire entire words as single motor bursts."
    },
    {
      range: "Stuck at 60 - 80 WPM",
      obstacle: "Eye fixated on the active letter; no look-ahead buffer.",
      solution: "Train your eyes to look 2 to 3 words ahead in the text. Your eyes should be reading the next phrase while your hands finish typing the previous word."
    },
    {
      range: "80 - 100+ WPM Mastery",
      obstacle: "Finger tension, physical fatigue, awkward finger transitions on uncommon symbols.",
      solution: "Loosen your shoulders and forearms. Warm up with stretching exercises and practice specialized code/symbol drills and high-speed endurance marathons."
    }
  ],

  glossary: [
    {
      term: "WPM (Words Per Minute)",
      definition: "The standardized metric for typing speed. In computing, 1 standard word is defined as exactly 5 keystrokes (including letters, numbers, punctuation, and spaces). Formula: (Correct Characters / 5) / Minutes."
    },
    {
      term: "Net WPM vs Raw WPM",
      definition: "Raw WPM measures your total typing output including errors. Net WPM deducts an error penalty (uncorrected mistakes) from your speed, representing true productive output."
    },
    {
      term: "CPM (Characters Per Minute)",
      definition: "The exact number of characters typed in one minute. Often preferred in multilingual environments and code entry where word lengths vary drastically."
    },
    {
      term: "Home Row",
      definition: "The central row on a standard keyboard (A-S-D-F for left hand, J-K-L-; for right hand) where fingers rest naturally between keystrokes."
    },
    {
      term: "Tactile Bumps (Homing Bars)",
      definition: "Small raised horizontal lines or bumps on the 'F' and 'J' keys that allow touch typists to identify the home position entirely by touch without looking."
    },
    {
      term: "N-Key Rollover (NKRO)",
      definition: "A hardware keyboard capability that allows every single pressed key to be registered simultaneously without ghosting or dropped inputs."
    },
    {
      term: "Digraphs & Trigraphs",
      definition: "Two-letter ('th', 'in', 'er') and three-letter ('the', 'ing', 'ion') combinations that occur with high statistical frequency in English."
    },
    {
      term: "RSI (Repetitive Strain Injury)",
      definition: "A condition resulting from repetitive finger motions, excessive key force, or bent wrist posture. Prevented by proper ergonomics and floating wrist mechanics."
    }
  ]
};

window.RESOURCES_DATA = RESOURCES_DATA;
