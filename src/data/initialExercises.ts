import { Exercise } from '../types';

export const INITIAL_EXERCISES: Exercise[] = [
  // ===================== CHEST =====================
  {
    id: 'ex-barbell-bench',
    slug: 'barbell-bench-press',
    name: 'Barbell Flat Bench Press',
    category: 'Chest',
    targetMuscle: 'Pectoralis Major (Sternal Head)',
    secondaryMuscles: ['Anterior Deltoids', 'Triceps Brachii'],
    difficulty: 'intermediate',
    equipmentRequired: 'Barbell & Flat Bench',
    startingPosition: 'Lie flat on the bench with eyes positioned directly beneath the barbell. Plant both feet flat and firmly into the floor. Retract your shoulder blades and pinch them firmly into the bench pad, creating a slight natural arch in your lumbar spine. Grip the bar with a full overhand grip, slightly wider than shoulder-width.',
    stepByStepExecution: [
      'Unrack the barbell by extending arms fully and setting the weight directly over your upper chest.',
      'Take a deep breath into the abdomen, brace your core, and initiate the descent by tucking elbows at approximately 45 to 60 degrees from your torso.',
      'Lower the bar in a controlled, 2 to 3-second descent until it gently makes contact with the mid-sternum (lower chest line).',
      'Pause for a fraction of a second without bouncing the barbell off your ribcage.',
      'Drive your feet hard into the floor (leg drive) and press the barbell explosively upward and slightly back toward the eye line until your elbows reach full lockout.'
    ],
    breathingTechnique: 'Inhale deeply and hold your air (Valsalva brace) as you lower the bar to your chest. Exhale forcefully through the sticking point on the upward press.',
    recommendedSets: 4,
    recommendedReps: '6-8',
    restDurationSec: 120,
    commonMistakes: [
      'Flaring elbows out at 90 degrees, causing severe rotator cuff impingement.',
      'Bouncing the barbell off the sternum to gain momentum.',
      'Lifting your glutes off the bench during heavy presses.'
    ],
    safetyInstructions: [
      'Always utilize safety pins or train with an experienced spotter when handling near-maximal loads.',
      'Maintain wrist alignment directly above your forearms; do not let your wrists bend backward excessively.'
    ],
    animationType: 'push',
    isPublished: true,
    viewsCount: 3420,
    environment: 'gym',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-incline-dumbbell-press',
    slug: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    category: 'Chest',
    targetMuscle: 'Pectoralis Major (Clavicular Upper Head)',
    secondaryMuscles: ['Anterior Deltoids', 'Triceps Brachii'],
    difficulty: 'intermediate',
    equipmentRequired: 'Incline Bench (30-45 deg) & Dumbbells',
    startingPosition: 'Set an adjustable bench to a 30-degree incline. Sit back with dumbbells resting on your knees. Kick each dumbbell up to shoulder level one knee at a time. Pin shoulder blades back and down into the pad.',
    stepByStepExecution: [
      'Hold dumbbells with palms angled slightly inward (semi-neutral 45-degree angle).',
      'Lower the dumbbells steadily toward the upper chest until you feel a deep stretch in the upper pectorals.',
      'Keep forearms strictly vertical to the floor throughout the entire movement.',
      'Press the dumbbells upward in an arc toward the ceiling, converging slightly at the top without clanking the weights together.'
    ],
    breathingTechnique: 'Inhale on the controlled descent; exhale as you push the weights to the apex.',
    recommendedSets: 3,
    recommendedReps: '8-12',
    restDurationSec: 90,
    commonMistakes: [
      'Setting the bench too steep (>45 degrees), which transfers the workload to the front deltoids.',
      'Letting the elbows flare out perpendicular to the body.'
    ],
    safetyInstructions: [
      'Never drop heavy dumbbells carelessly to the floor from full extension; bring them back to your knees with control.'
    ],
    animationType: 'push',
    isPublished: true,
    viewsCount: 2890,
    environment: 'gym',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-cable-crossover-fly',
    slug: 'cable-crossover-fly',
    name: 'Standing Cable Fly Crossover',
    category: 'Chest',
    targetMuscle: 'Pectoralis Major (Sternal & Lower fibers)',
    secondaryMuscles: ['Anterior Deltoids', 'Serratus Anterior'],
    difficulty: 'beginner',
    equipmentRequired: 'Dual Cable Pulley Station',
    startingPosition: 'Position cable pulleys at shoulder height or high position. Grasp handles and take a staggered step forward. Maintain a slight forward torso lean with knees soft and elbows softly bent.',
    stepByStepExecution: [
      'Keep a fixed, gentle bend at your elbow joints throughout the movement.',
      'In a wide hugging arc motion, bring both hands forward and together across the midline of your chest.',
      'Squeeze your chest fibers intensely at the peak contraction for 1 full second.',
      'Slowly open your arms backward along the same arc until you feel a comfortable stretch across the pectorals.'
    ],
    breathingTechnique: 'Exhale during the closing hugging phase; inhale as your arms open wide.',
    recommendedSets: 3,
    recommendedReps: '12-15',
    restDurationSec: 60,
    commonMistakes: [
      'Turning the fly into a press by bending and straightening elbows during the rep.',
      'Using torso momentum to rock back and forth.'
    ],
    safetyInstructions: [
      'Do not allow the cables to pull your arms past the plane of your shoulders if you experience anterior shoulder discomfort.'
    ],
    animationType: 'push',
    isPublished: true,
    viewsCount: 1940,
    environment: 'gym',
    developmentLevel: 'beginner'
  },

  // ===================== HOME MODE: BASIC DEVELOPMENT =====================
  {
    id: 'ex-wall-pushup',
    slug: 'wall-pushup',
    name: 'Wall Push-Ups',
    category: 'Chest',
    targetMuscle: 'Pectoralis Major',
    secondaryMuscles: ['Anterior Deltoids', 'Triceps Brachii', 'Core'],
    difficulty: 'beginner',
    equipmentRequired: 'Clear Wall Space',
    startingPosition: 'Stand facing a flat wall approximately arms-length away. Place palms flat against the wall at shoulder height and shoulder-width apart.',
    stepByStepExecution: [
      'Brace your core and keep your head, neck, hips, and ankles in one unbroken straight line.',
      'Bend elbows to lower your chest toward the wall in a smooth, 2-second tempo until your nose almost brushes the surface.',
      'Keep elbows tracking back at a 45-degree angle rather than flaring out.',
      'Press firmly through your palms to return to the starting locked position.'
    ],
    breathingTechnique: 'Inhale as you lean toward the wall; exhale as you push away.',
    recommendedSets: 3,
    recommendedReps: '12-15',
    restDurationSec: 60,
    commonMistakes: [
      'Sagging the lower back or lifting hips backward away from the movement line.',
      'Looking up and straining the cervical neck vertebrae.'
    ],
    safetyInstructions: [
      'Ensure floor has firm grip without slippery socks.',
      'Step feet further back to increase resistance, or closer to reduce load.'
    ],
    animationType: 'push',
    isPublished: true,
    viewsCount: 1420,
    environment: 'home',
    developmentLevel: 'basic'
  },
  {
    id: 'ex-bodyweight-squat',
    slug: 'bodyweight-box-squat',
    name: 'Bodyweight Box Squats',
    category: 'Legs',
    targetMuscle: 'Quadriceps & Gluteus Maximus',
    secondaryMuscles: ['Hamstrings', 'Core', 'Calves'],
    difficulty: 'beginner',
    equipmentRequired: 'Sturdy Chair or Couch',
    startingPosition: 'Stand 4 inches in front of a sturdy chair or bench with feet shoulder-width apart, toes turned out 10-15 degrees. Arms extended forward for counter-balance.',
    stepByStepExecution: [
      'Inhale, brace the abdominal wall, and hinge back at hips as if sitting down.',
      'Lower under control until your glutes lightly tap the chair surface without dumping your weight.',
      'Pause for a split second on the box while keeping tension in thighs and core.',
      'Drive through your full foot to return to standing lockout.'
    ],
    breathingTechnique: 'Inhale on the descent; exhale forcefully upon standing up.',
    recommendedSets: 3,
    recommendedReps: '12-15',
    restDurationSec: 60,
    commonMistakes: [
      'Collapsing knees inward (knee valgus).',
      'Rocking backward on heels or completely relaxing on the chair.'
    ],
    safetyInstructions: [
      'Keep knees tracking in the exact direction of your middle toes.'
    ],
    animationType: 'squat',
    isPublished: true,
    viewsCount: 2120,
    environment: 'home',
    developmentLevel: 'basic'
  },
  {
    id: 'ex-assisted-lunge',
    slug: 'assisted-static-lunge',
    name: 'Assisted Static Split Squat',
    category: 'Legs',
    targetMuscle: 'Quadriceps & Gluteus Medius',
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    difficulty: 'beginner',
    equipmentRequired: 'Wall or Sturdy Chair for Support',
    startingPosition: 'Stand in a split stance with right foot 3 feet forward and left foot back resting on toes. Hold lightly onto a wall or sturdy chair for balance.',
    stepByStepExecution: [
      'Keep torso upright and pelvis tucked neutral.',
      'Lower your back knee straight down toward the floor until both knees reach approximately 90 degrees.',
      'Keep front knee stacked directly over the midfoot/ankle.',
      'Press through the front heel and midfoot to rise back to the top.'
    ],
    breathingTechnique: 'Inhale descending down; exhale as you press upward.',
    recommendedSets: 3,
    recommendedReps: '10-12 per leg',
    restDurationSec: 60,
    commonMistakes: [
      'Leaning the torso excessively forward onto the front thigh.',
      'Letting front heel lift off the ground.'
    ],
    safetyInstructions: [
      'Do not aggressively slam back knee into hard flooring; place a folded towel underneath.'
    ],
    animationType: 'lunge',
    isPublished: true,
    viewsCount: 1780,
    environment: 'home',
    developmentLevel: 'basic'
  },
  {
    id: 'ex-knee-plank',
    slug: 'incline-knee-plank',
    name: 'Incline Knee Plank',
    category: 'Abs',
    targetMuscle: 'Transverse Abdominis & Rectus Abdominis',
    secondaryMuscles: ['Anterior Deltoids', 'Glutes'],
    difficulty: 'beginner',
    equipmentRequired: 'Floor Mat or Carpet',
    startingPosition: 'Rest on forearms and knees on the floor. Elbows positioned directly below shoulders. Knees set back so hips form a flat line with torso.',
    stepByStepExecution: [
      'Tuck pelvis into a slight posterior pelvic tilt (belly button drawn toward spine).',
      'Actively push forearms into the floor to spread shoulder blades apart.',
      'Squeeze glutes and hold this rigid bridge position for the designated duration.',
      'Do not allow hips to sag downward or pike upward.'
    ],
    breathingTechnique: 'Maintain shallow, rhythmic diaphragmatic breaths while maintaining core tension.',
    recommendedSets: 3,
    recommendedReps: '20-30 sec hold',
    restDurationSec: 45,
    commonMistakes: [
      'Holding breath and creating intracranial pressure.',
      'Arching the lumbar spine and sinking lower belly.'
    ],
    safetyInstructions: [
      'Stop immediately if you experience pain in the lower spine.'
    ],
    animationType: 'core',
    isPublished: true,
    viewsCount: 1650,
    environment: 'home',
    developmentLevel: 'basic'
  },
  {
    id: 'ex-glute-bridge',
    slug: 'bodyweight-glute-bridge',
    name: 'Bodyweight Glute Bridge',
    category: 'Legs',
    targetMuscle: 'Gluteus Maximus',
    secondaryMuscles: ['Hamstrings', 'Erector Spinae', 'Core'],
    difficulty: 'beginner',
    equipmentRequired: 'Floor Mat',
    startingPosition: 'Lie flat on your back with knees bent at 90 degrees, feet flat on the floor hip-width apart. Arms resting at sides with palms down.',
    stepByStepExecution: [
      'Drive through your heels to raise your hips until knees, hips, and shoulders form a straight diagonal line.',
      'Squeeze your glutes forcefully at the top position for 2 full seconds.',
      'Avoid overextending through the lower back.',
      'Lower hips slowly back to the ground.'
    ],
    breathingTechnique: 'Exhale driving upward into extension; inhale lowering down.',
    recommendedSets: 3,
    recommendedReps: '15',
    restDurationSec: 45,
    commonMistakes: [
      'Arching the lower back instead of hinging from hip extension.',
      'Pushing through the toes instead of the heels.'
    ],
    safetyInstructions: [
      'Keep neck relaxed against the floor; do not strain neck upward.'
    ],
    animationType: 'hinge',
    isPublished: true,
    viewsCount: 1980,
    environment: 'home',
    developmentLevel: 'basic'
  },
  {
    id: 'ex-standing-mobility',
    slug: 'standing-thoracic-mobility',
    name: 'Standing Thoracic Rotations & Windmill',
    category: 'Mobility',
    targetMuscle: 'Thoracic Spine & Obliques',
    secondaryMuscles: ['Hip Flexors', 'Shoulders', 'Hamstrings'],
    difficulty: 'beginner',
    equipmentRequired: 'Bodyweight',
    startingPosition: 'Stand tall with feet wider than shoulder-width, arms spread out horizontally to sides at shoulder height.',
    stepByStepExecution: [
      'Hinge hips slightly back, rotating torso to reach right hand down toward left foot or shin.',
      'Keep left arm extended up toward the ceiling, eyes following top hand.',
      'Hold the bottom stretch for 1 second, then return to center and alternate to the opposite side.',
      'Move with fluid, controlled momentum.'
    ],
    breathingTechnique: 'Inhale at center; exhale as you rotate down into the stretch.',
    recommendedSets: 2,
    recommendedReps: '10 per side',
    restDurationSec: 30,
    commonMistakes: [
      'Bending the knees excessively instead of hinging hips.',
      'Rounding the upper spine instead of rotating through thoracic segments.'
    ],
    safetyInstructions: [
      'Only reach as far as your comfortable hamstring flexibility permits.'
    ],
    animationType: 'stretch',
    isPublished: true,
    viewsCount: 1340,
    environment: 'home',
    developmentLevel: 'basic'
  },

  // ===================== HOME MODE: BEGINNER DEVELOPMENT =====================
  {
    id: 'ex-floor-pushup',
    slug: 'standard-floor-pushup',
    name: 'Standard Floor Push-Ups',
    category: 'Chest',
    targetMuscle: 'Pectoralis Major',
    secondaryMuscles: ['Anterior Deltoids', 'Triceps Brachii', 'Core'],
    difficulty: 'beginner',
    equipmentRequired: 'Bodyweight Only',
    startingPosition: 'Plant hands slightly wider than shoulder-width on the floor. Extend legs back on toes, creating a straight plank line from heels to head. Lock core and glutes.',
    stepByStepExecution: [
      'Lower your entire body in a single rigid plane by bending elbows at roughly 45 degrees.',
      'Descend until your chest is approximately 2 inches off the floor or lightly touches.',
      'Pause for a fraction of a second without resting your weight on the floor.',
      'Push hard through your full palms and fingers to lock out elbows at the top.'
    ],
    breathingTechnique: 'Inhale on the descent; exhale powerfully pushing up.',
    recommendedSets: 4,
    recommendedReps: '10-15',
    restDurationSec: 60,
    commonMistakes: [
      'Sagging hips toward the floor.',
      'Flaring elbows out sideways perpendicular to torso.'
    ],
    safetyInstructions: [
      'If form breaks, finish remaining repetitions with knees on the floor rather than losing spinal alignment.'
    ],
    animationType: 'push',
    isPublished: true,
    viewsCount: 3820,
    environment: 'home',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-deep-squats',
    slug: 'deep-air-squats',
    name: 'Deep Bodyweight Air Squats',
    category: 'Legs',
    targetMuscle: 'Quadriceps, Adductors & Gluteus Maximus',
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    difficulty: 'beginner',
    equipmentRequired: 'Bodyweight Only',
    startingPosition: 'Stand with feet slightly wider than shoulder width, toes angled slightly out. Chest tall and hands held clasped at chest level.',
    stepByStepExecution: [
      'Inhale deeply into abdomen, initiate descent by pushing hips back and knees out.',
      'Sink down smoothly until the hip crease dips slightly below the top of the patella (below parallel).',
      'Keep torso upright and heels anchored flat on the floor.',
      'Drive straight up through the midfoot to full standing hip lockout.'
    ],
    breathingTechnique: 'Inhale descending into the hole; exhale driving back to standing.',
    recommendedSets: 4,
    recommendedReps: '15-20',
    restDurationSec: 60,
    commonMistakes: [
      'Heels lifting off the ground due to poor ankle dorsiflexion.',
      'Butt wink or rounding lower back at the bottom.'
    ],
    safetyInstructions: [
      'Only squat to the depth where you can maintain a neutral lumbar spine.'
    ],
    animationType: 'squat',
    isPublished: true,
    viewsCount: 2950,
    environment: 'home',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-reverse-lunge',
    slug: 'reverse-walking-lunge',
    name: 'Alternating Reverse Lunges',
    category: 'Legs',
    targetMuscle: 'Quadriceps & Gluteus Maximus',
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    difficulty: 'beginner',
    equipmentRequired: 'Bodyweight',
    startingPosition: 'Stand tall with feet hip-width apart and hands placed firmly on hips.',
    stepByStepExecution: [
      'Take a controlled, long step backward with your right leg.',
      'Lower hips until front thigh is parallel to the ground and back knee hovers an inch above the floor.',
      'Keep front shin nearly vertical and torso tall.',
      'Push through the front heel to return to the starting position, then alternate legs.'
    ],
    breathingTechnique: 'Inhale stepping back; exhale driving forward to standing.',
    recommendedSets: 3,
    recommendedReps: '12 per leg',
    restDurationSec: 60,
    commonMistakes: [
      'Short stepping causing front knee to push far past toes.',
      'Wobbling ankles and knees due to lack of foot engagement.'
    ],
    safetyInstructions: [
      'Step back along parallel railroad tracks rather than a tightrope to maintain lateral balance.'
    ],
    animationType: 'lunge',
    isPublished: true,
    viewsCount: 2410,
    environment: 'home',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-mountain-climbers',
    slug: 'high-knee-mountain-climbers',
    name: 'High-Knee Mountain Climbers',
    category: 'Cardio',
    targetMuscle: 'Core & Hip Flexors',
    secondaryMuscles: ['Shoulders', 'Chest', 'Quadriceps', 'Calves'],
    difficulty: 'beginner',
    equipmentRequired: 'Floor Space',
    startingPosition: 'Assume a strong high-plank position with hands directly beneath shoulders and core locked tight.',
    stepByStepExecution: [
      'Drive right knee forward toward chest without letting hips pike up.',
      'Quickly step right foot back while simultaneously driving left knee forward in a rhythmic running cadence.',
      'Maintain stable shoulder girdle and solid anti-rotation tension.',
      'Maintain brisk, steady pace for time or repetitions.'
    ],
    breathingTechnique: 'Maintain rapid, consistent cadence breathing in rhythm with steps.',
    recommendedSets: 3,
    recommendedReps: '30-45 sec',
    restDurationSec: 45,
    commonMistakes: [
      'Bouncing hips up and down toward the ceiling.',
      'Letting shoulders drift backward away from wrists.'
    ],
    safetyInstructions: [
      'Keep wrists stacked directly below shoulders to avoid joint strain.'
    ],
    animationType: 'cardio',
    isPublished: true,
    viewsCount: 2280,
    environment: 'home',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-pike-pushup',
    slug: 'incline-pike-pushup',
    name: 'Incline Pike Push-Ups',
    category: 'Shoulders',
    targetMuscle: 'Anterior & Lateral Deltoids',
    secondaryMuscles: ['Triceps Brachii', 'Upper Pectorals', 'Trapezius'],
    difficulty: 'intermediate',
    equipmentRequired: 'Bodyweight (Floor or Low Step)',
    startingPosition: 'Start in a downward dog or inverted V position with hips pushed high into the air, arms and legs straight, hands shoulder-width apart.',
    stepByStepExecution: [
      'Look toward feet or slightly in front of hands to maintain cervical alignment.',
      'Bend elbows backward at 45 degrees, lowering the crown of your head forward in a tripod trajectory toward the floor.',
      'Touch head lightly to floor in front of hands.',
      'Press through shoulders and palms backward along the diagonal back into the inverted V.'
    ],
    breathingTechnique: 'Inhale descending; exhale pushing back up.',
    recommendedSets: 3,
    recommendedReps: '8-12',
    restDurationSec: 60,
    commonMistakes: [
      'Flaring elbows out to sides like a flat push-up.',
      'Lowering straight down between hands instead of forward into a tripod angle.'
    ],
    safetyInstructions: [
      'Do not drop head onto the ground; place a cushion under forehead if needed.'
    ],
    animationType: 'push',
    isPublished: true,
    viewsCount: 2150,
    environment: 'home',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-side-plank',
    slug: 'forearm-side-plank',
    name: 'Forearm Side Plank & Rotations',
    category: 'Abs',
    targetMuscle: 'Obliques & Quadratus Lumborum',
    secondaryMuscles: ['Gluteus Medius', 'Deltoids', 'Transverse Abdominis'],
    difficulty: 'beginner',
    equipmentRequired: 'Floor Mat',
    startingPosition: 'Lie on right side with legs straight and left foot stacked on right foot. Prop upper body up on right forearm with elbow directly beneath shoulder.',
    stepByStepExecution: [
      'Lift hips off the floor until body forms a straight line from ankles to shoulders.',
      'Reach top left hand toward ceiling.',
      'Optionally thread left arm under torso in a gentle rotation and reach back up.',
      'Hold position with high hips, then switch sides.'
    ],
    breathingTechnique: 'Steady, controlled breathing while maintaining lateral trunk stiffness.',
    recommendedSets: 3,
    recommendedReps: '30-45 sec per side',
    restDurationSec: 45,
    commonMistakes: [
      'Letting hips drop toward the floor.',
      'Rolling hips forward or backward out of the coronal plane.'
    ],
    safetyInstructions: [
      'If shoulder pinches, check that elbow is directly below the shoulder joint.'
    ],
    animationType: 'core',
    isPublished: true,
    viewsCount: 1890,
    environment: 'home',
    developmentLevel: 'beginner'
  },

  // ===================== HOME MODE: ADVANCED DEVELOPMENT =====================
  {
    id: 'ex-diamond-pushup',
    slug: 'diamond-lockout-pushups',
    name: 'Diamond Lockout Push-Ups',
    category: 'Chest',
    targetMuscle: 'Triceps Brachii & Inner Pectorals',
    secondaryMuscles: ['Anterior Deltoids', 'Core'],
    difficulty: 'advanced',
    equipmentRequired: 'Bodyweight Only',
    startingPosition: 'Assume a push-up plank. Place hands directly beneath center chest with thumbs and index fingers touching to form a diamond or triangle shape.',
    stepByStepExecution: [
      'Maintain full-body tension from heels to shoulders.',
      'Lower chest toward the center of your diamond, tucking elbows tightly along ribs.',
      'Touch center of chest lightly to fingers.',
      'Drive explosively through palms, locking out triceps at the top.'
    ],
    breathingTechnique: 'Inhale on way down; exhale forcefully driving through triceps lockout.',
    recommendedSets: 4,
    recommendedReps: '12-15',
    restDurationSec: 75,
    commonMistakes: [
      'Flaring elbows out wide, creating wrist and elbow torque.',
      'Sagging hips to shorten range of motion.'
    ],
    safetyInstructions: [
      'If wrist discomfort occurs, slightly separate thumbs into a narrow parallel hand placement.'
    ],
    animationType: 'push',
    isPublished: true,
    viewsCount: 2750,
    environment: 'home',
    developmentLevel: 'advanced'
  },
  {
    id: 'ex-decline-pushup',
    slug: 'decline-feet-elevated-pushup',
    name: 'Decline Feet-Elevated Push-Ups',
    category: 'Chest',
    targetMuscle: 'Pectoralis Major (Clavicular Head) & Deltoids',
    secondaryMuscles: ['Triceps Brachii', 'Serratus Anterior', 'Core'],
    difficulty: 'advanced',
    equipmentRequired: 'Chair, Bed, or Bench to Elevate Feet',
    startingPosition: 'Place toes onto a chair, bench, or couch with hands planted firmly on the floor shoulder-width apart. Form a rigid decline plank.',
    stepByStepExecution: [
      'Brace core and glutes to avoid hyperextension.',
      'Lower chest toward the floor until nose hovers an inch above the carpet.',
      'Pause for a beat under strict tension.',
      'Press explosively upward until arms reach full extension.'
    ],
    breathingTechnique: 'Inhale descending; exhale driving away from the floor.',
    recommendedSets: 4,
    recommendedReps: '12-15',
    restDurationSec: 75,
    commonMistakes: [
      'Letting stomach dip and touch the floor first.',
      'Elevating feet too high, converting the movement into a vertical pike press.'
    ],
    safetyInstructions: [
      'Ensure the elevation surface is steady and does not slip backwards.'
    ],
    animationType: 'push',
    isPublished: true,
    viewsCount: 2640,
    environment: 'home',
    developmentLevel: 'advanced'
  },
  {
    id: 'ex-doorframe-row',
    slug: 'doorframe-towel-row',
    name: 'Doorframe Towel Row / Table Inverted Row',
    category: 'Back',
    targetMuscle: 'Latissimus Dorsi & Rhomboids',
    secondaryMuscles: ['Biceps Brachii', 'Rear Deltoids', 'Core', 'Forearms'],
    difficulty: 'intermediate',
    equipmentRequired: 'Doorframe + Bath Towel or Sturdy Table',
    startingPosition: 'Loop a heavy towel around a secure door handle or anchor to a closed door, or hang under a sturdy table. Lean back at a 45-degree angle with arms straight and heels planted.',
    stepByStepExecution: [
      'Keep body in a rigid straight plank line from shoulders to heels.',
      'Retract shoulder blades and pull chest vigorously toward the anchor point by driving elbows back.',
      'Squeeze mid-back and lats hard at top peak contraction for 1 second.',
      'Extend arms smoothly back to full hanging stretch.'
    ],
    breathingTechnique: 'Exhale during pulling phase; inhale during controlled lowering.',
    recommendedSets: 4,
    recommendedReps: '10-14',
    restDurationSec: 60,
    commonMistakes: [
      'Bending at hips ("broken bridge") instead of pulling full body weight.',
      'Using jerky momentum rather than controlled muscular pull.'
    ],
    safetyInstructions: [
      'Always test door closure and table stability with full bodyweight before starting sets.'
    ],
    animationType: 'pull',
    isPublished: true,
    viewsCount: 3100,
    environment: 'home',
    developmentLevel: 'advanced'
  },
  {
    id: 'ex-chair-dips',
    slug: 'chair-bench-dips',
    name: 'Elevated Chair / Bench Dips',
    category: 'Triceps',
    targetMuscle: 'Triceps Brachii',
    secondaryMuscles: ['Anterior Deltoids', 'Lower Pectorals'],
    difficulty: 'intermediate',
    equipmentRequired: 'Sturdy Chair or Coffee Table',
    startingPosition: 'Sit on the edge of a sturdy chair with hands placed beside hips, knuckles forward. Extend legs out in front (straight legs for advanced, knees bent for easier variation). Shift glutes off the edge.',
    stepByStepExecution: [
      'Keep back close to the chair edge throughout.',
      'Lower torso by bending elbows until upper arms are parallel to the floor (90 degrees).',
      'Do not descend below 90 degrees to avoid anterior shoulder impingement.',
      'Press through the heels of your palms to lock out triceps at the top.'
    ],
    breathingTechnique: 'Inhale descending; exhale pressing up to lockout.',
    recommendedSets: 3,
    recommendedReps: '12-15',
    restDurationSec: 60,
    commonMistakes: [
      'Drifting hips far away from the chair, creating anterior shoulder shear.',
      'Shrugging shoulders up toward ears.'
    ],
    safetyInstructions: [
      'Keep shoulder blades packed down and back throughout the full range of motion.'
    ],
    animationType: 'push',
    isPublished: true,
    viewsCount: 2850,
    environment: 'home',
    developmentLevel: 'advanced'
  },
  {
    id: 'ex-hollow-body-hold',
    slug: 'gymnastic-hollow-body-hold',
    name: 'Gymnastic Hollow Body Hold & Rocks',
    category: 'Abs',
    targetMuscle: 'Entire Anterior Core & Rectus Abdominis',
    secondaryMuscles: ['Transverse Abdominis', 'Hip Flexors', 'Quadriceps', 'Serratus'],
    difficulty: 'advanced',
    equipmentRequired: 'Floor Space',
    startingPosition: 'Lie flat on back. Extend arms overhead by ears, legs glued together with toes pointed forward. Flatten lower back completely against the floor.',
    stepByStepExecution: [
      'Lift legs and shoulder blades simultaneously 4 to 6 inches off the floor.',
      'Press lumbar spine into the floor so no space exists beneath lower back.',
      'Create a rigid, curved banana shape.',
      'Hold the position with continuous core tension, or rock gently back and forth without breaking the hollow arch.'
    ],
    breathingTechnique: 'Take shallow rhythmic breaths into upper ribcage while abdominal wall remains clamped.',
    recommendedSets: 4,
    recommendedReps: '30-45 sec hold',
    restDurationSec: 60,
    commonMistakes: [
      'Arching lower back off the floor, which shifts strain into lumbar discs.',
      'Bending knees or tucking chin into chest.'
    ],
    safetyInstructions: [
      'If lower back arches, lift legs higher toward ceiling to maintain spinal contact.'
    ],
    animationType: 'core',
    isPublished: true,
    viewsCount: 2490,
    environment: 'home',
    developmentLevel: 'advanced'
  },

  // ===================== GYM MODE: BASIC DEVELOPMENT (Guided Machines) =====================
  {
    id: 'ex-machine-chest-press',
    slug: 'machine-chest-press',
    name: 'Selectorized Machine Chest Press',
    category: 'Chest',
    targetMuscle: 'Pectoralis Major',
    secondaryMuscles: ['Anterior Deltoids', 'Triceps Brachii'],
    difficulty: 'beginner',
    equipmentRequired: 'Selectorized Chest Press Machine',
    startingPosition: 'Adjust seat height so handles align with mid-chest level. Sit with back and head firmly pressed against the pad. Grasp handles with palms facing down or neutral, elbows bent at 90 degrees.',
    stepByStepExecution: [
      'Retract shoulder blades and plant feet firmly on the floor.',
      'Press handles forward smoothly along the guided path until arms are almost fully extended without locking joints harshly.',
      'Pause for a fraction of a second at peak contraction.',
      'Control the return weight stack over 2 to 3 seconds until you feel a comfortable stretch in the chest.'
    ],
    breathingTechnique: 'Exhale pressing forward; inhale slowly on the return.',
    recommendedSets: 3,
    recommendedReps: '10-12',
    restDurationSec: 60,
    commonMistakes: [
      'Letting the weight stack slam down between repetitions.',
      'Letting shoulders shrug or roll forward away from the back pad.'
    ],
    safetyInstructions: [
      'Adjust seat height so the handles do not sit too high near neck or collarbone.'
    ],
    animationType: 'push',
    isPublished: true,
    viewsCount: 2310,
    environment: 'gym',
    developmentLevel: 'basic'
  },
  {
    id: 'ex-seated-cable-row',
    slug: 'seated-cable-row',
    name: 'Seated Cable Row (Close-Grip V-Bar)',
    category: 'Back',
    targetMuscle: 'Rhomboids & Latissimus Dorsi',
    secondaryMuscles: ['Biceps Brachii', 'Rear Deltoids', 'Spinal Erectors'],
    difficulty: 'beginner',
    equipmentRequired: 'Low Cable Row Station & V-Bar Handle',
    startingPosition: 'Sit facing the cable station with feet braced firmly on footpads. Knees softly bent. Grab V-bar handle with arms extended and sit tall with torso upright.',
    stepByStepExecution: [
      'Pull shoulders down and back, chest lifted high.',
      'Drive elbows backward past your torso, pulling the handle into your lower ribs/abdomen.',
      'Pinch shoulder blades hard together at peak contraction for 1 second.',
      'Slowly extend arms forward, feeling lats stretch without rounding your lower back.'
    ],
    breathingTechnique: 'Exhale as you pull the handle to torso; inhale extending arms forward.',
    recommendedSets: 3,
    recommendedReps: '10-12',
    restDurationSec: 60,
    commonMistakes: [
      'Excessive backward torso swinging to jerk the weight stack.',
      'Rounding lumbar spine at full arm extension.'
    ],
    safetyInstructions: [
      'Maintain an upright torso angle (within 10-15 degrees of vertical).'
    ],
    animationType: 'pull',
    isPublished: true,
    viewsCount: 2840,
    environment: 'gym',
    developmentLevel: 'basic'
  },
  {
    id: 'ex-lat-pulldown',
    slug: 'lat-pulldown-machine',
    name: 'Lat Pulldown Machine (Wide-Grip)',
    category: 'Back',
    targetMuscle: 'Latissimus Dorsi',
    secondaryMuscles: ['Biceps Brachii', 'Teres Major', 'Rhomboids'],
    difficulty: 'beginner',
    equipmentRequired: 'Lat Pulldown Cable Machine',
    startingPosition: 'Adjust thigh pad so legs are snugly secured. Grasp wide bar with an overhand grip slightly wider than shoulder-width. Sit with torso upright and slight 10-degree backward lean.',
    stepByStepExecution: [
      'Depress shoulder blades down before bending elbows.',
      'Drive elbows downward toward your hip pockets, bringing the bar smoothly down to touch upper chest / collarbone.',
      'Squeeze back muscles hard at the bottom.',
      'Resist the cable tension as the bar returns over 3 seconds to a full stretch overhead.'
    ],
    breathingTechnique: 'Exhale pulling bar down to chest; inhale riding the cable up.',
    recommendedSets: 3,
    recommendedReps: '10-12',
    restDurationSec: 60,
    commonMistakes: [
      'Pulling the bar behind the neck, causing cervical and rotator cuff injury.',
      'Swinging torso violently backward to move excessive poundage.'
    ],
    safetyInstructions: [
      'Always pull bar to the front of your chest, never behind the neck.'
    ],
    animationType: 'pull',
    isPublished: true,
    viewsCount: 3510,
    environment: 'gym',
    developmentLevel: 'basic'
  },
  {
    id: 'ex-leg-press',
    slug: 'machine-leg-press',
    name: '45-Degree Machine Leg Press',
    category: 'Legs',
    targetMuscle: 'Quadriceps & Gluteus Maximus',
    secondaryMuscles: ['Hamstrings', 'Adductors'],
    difficulty: 'beginner',
    equipmentRequired: '45-Degree Sled Leg Press Machine',
    startingPosition: 'Sit in the machine with lower back and sacrum firmly pinned against the back pad. Place feet shoulder-width apart in the center of the platform. Disengage safety handles.',
    stepByStepExecution: [
      'Inhale and brace core into pad.',
      'Lower the sled under control until knees reach 90 degrees.',
      'Do not let lower back or tailbone curl off the pad.',
      'Press through the midfoot and heels to drive the platform back up, stopping just short of hyperextending knees.'
    ],
    breathingTechnique: 'Inhale lowering the platform; exhale driving upward.',
    recommendedSets: 3,
    recommendedReps: '12-15',
    restDurationSec: 90,
    commonMistakes: [
      'Violently locking out knees at the top with heavy loads.',
      'Letting butt lift off pad at bottom, causing lumbar disc compression.'
    ],
    safetyInstructions: [
      'Never allow knees to lock completely straight under heavy load.',
      'Always keep safety stops properly set.'
    ],
    animationType: 'squat',
    isPublished: true,
    viewsCount: 3950,
    environment: 'gym',
    developmentLevel: 'basic'
  },
  {
    id: 'ex-leg-extension',
    slug: 'seated-leg-extension',
    name: 'Seated Leg Extension Machine',
    category: 'Legs',
    targetMuscle: 'Quadriceps (Rectus Femoris, Vastus Lateralis/Medialis)',
    secondaryMuscles: ['Patellar Tendon'],
    difficulty: 'beginner',
    equipmentRequired: 'Leg Extension Machine',
    startingPosition: 'Adjust backrest so knees align directly with machine pivot axis. Pad should rest comfortably on lower shins just above ankles. Grip side handles.',
    stepByStepExecution: [
      'Point toes slightly up (dorsiflexion).',
      'Extend knees smoothly to lift the padded lever until legs are straight.',
      'Squeeze quadriceps forcefully at the apex for 1 full second.',
      'Lower the weight stack under control over 2 seconds without letting plates crash.'
    ],
    breathingTechnique: 'Exhale extending legs straight; inhale controlling the descent.',
    recommendedSets: 3,
    recommendedReps: '12-15',
    restDurationSec: 60,
    commonMistakes: [
      'Kicking or using rapid momentum to throw the weight.',
      'Aligning knee joints forward or backward from the machine pivot.'
    ],
    safetyInstructions: [
      'Avoid hyperextending knees aggressively with excessive weight.'
    ],
    animationType: 'squat',
    isPublished: true,
    viewsCount: 2210,
    environment: 'gym',
    developmentLevel: 'basic'
  },
  {
    id: 'ex-leg-curl',
    slug: 'lying-hamstring-leg-curl',
    name: 'Lying Hamstring Leg Curl',
    category: 'Legs',
    targetMuscle: 'Hamstrings (Biceps Femoris, Semitendinosus)',
    secondaryMuscles: ['Gastrocnemius', 'Glutes'],
    difficulty: 'beginner',
    equipmentRequired: 'Lying Leg Curl Machine',
    startingPosition: 'Lie face down on the bench. Place roller pad against the back of calves just below calves and above heels. Grasp front handles and press hips into the pad.',
    stepByStepExecution: [
      'Keep hips pinned flat against the bench to isolate hamstrings.',
      'Curl the roller pad upward toward glutes in a smooth, continuous arc.',
      'Hold the peak hamstring contraction for 1 second.',
      'Slowly lower the roller pad back to the starting point over 3 seconds.'
    ],
    breathingTechnique: 'Exhale curling heels to glutes; inhale lowering legs.',
    recommendedSets: 3,
    recommendedReps: '12-15',
    restDurationSec: 60,
    commonMistakes: [
      'Lifting hips and pelvis off the bench to assist with hip flexors.',
      'Jerking weight stack at bottom.'
    ],
    safetyInstructions: [
      'Maintain continuous tension and controlled eccentric phase.'
    ],
    animationType: 'hinge',
    isPublished: true,
    viewsCount: 2130,
    environment: 'gym',
    developmentLevel: 'basic'
  },

  // ===================== COMPOUND FREE WEIGHTS & HYBRID EXERCISES =====================
  {
    id: 'ex-barbell-deadlift',
    slug: 'conventional-barbell-deadlift',
    name: 'Conventional Barbell Deadlift',
    category: 'Back',
    targetMuscle: 'Erector Spinae & Latissimus Dorsi',
    secondaryMuscles: ['Gluteus Maximus', 'Hamstrings', 'Trapezius', 'Forearms'],
    difficulty: 'advanced',
    equipmentRequired: 'Olympic Barbell & Bumper Plates',
    startingPosition: 'Stand with feet hip-width apart, barbell cutting directly over the middle of your shoelaces. Hinge at hips to grip the bar just outside your knees with an overhand or mixed grip. Pull your chest tall, drag your lats tight into your armpits ("protect your armpits"), and pull the slack out of the barbell.',
    stepByStepExecution: [
      'Engage 360-degree intra-abdominal pressure (Valsalva brace).',
      'Push the floor away through your mid-foot and heels, keeping the barbell dragged directly against your shins.',
      'As the bar passes the knees, drive hips forward to stand completely erect. Lock out glutes and knees simultaneously.',
      'Do not lean backward or hyperextend the lumbar spine at the top.',
      'Hinge back at the hips to lower the barbell along the thighs and shins back to a dead stop on the floor.'
    ],
    breathingTechnique: 'Big diaphragmatic breath and brace at the bottom. Exhale once hips lock out at the top.',
    recommendedSets: 4,
    recommendedReps: '4-6',
    restDurationSec: 150,
    commonMistakes: [
      'Allowing the lower back to round into flexion ("cat back").',
      'Starting with the barbell drifting forward away from the body.'
    ],
    safetyInstructions: [
      'Reset and pull the slack out of the bar before every single repetition; never "jerk" the bar off the floor.'
    ],
    animationType: 'hinge',
    isPublished: true,
    viewsCount: 4120,
    environment: 'gym',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-pullup',
    slug: 'strict-pullup',
    name: 'Strict Overhand Pull-Up',
    category: 'Back',
    targetMuscle: 'Latissimus Dorsi',
    secondaryMuscles: ['Biceps Brachii', 'Rhomboids', 'Middle Trapezius', 'Core'],
    difficulty: 'intermediate',
    equipmentRequired: 'Pull-Up Bar',
    startingPosition: 'Hang from a pull-up bar with an overhand grip slightly wider than shoulder width. Arms fully extended in a dead hang. Engage abs and glutes to avoid swinging.',
    stepByStepExecution: [
      'Initiate the movement by actively depressing your shoulder blades down and back.',
      'Drive your elbows down toward your back pockets, drawing your chest up toward the bar.',
      'Continue pulling until your collarbone or chin clears the top of the bar.',
      'Pause briefly, then lower yourself under complete muscular control over 3 seconds back into a full dead hang.'
    ],
    breathingTechnique: 'Exhale during the upward pull; inhale smoothly on the controlled descent.',
    recommendedSets: 4,
    recommendedReps: '6-10',
    restDurationSec: 90,
    commonMistakes: [
      'Kicking legs or kipping to generate upward momentum.',
      'Failing to reach full dead hang extension at the bottom.'
    ],
    safetyInstructions: [
      'If you suffer from shoulder impingement, switch to a neutral (palms-facing) grip.'
    ],
    animationType: 'pull',
    isPublished: true,
    viewsCount: 3670,
    environment: 'hybrid',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-bent-over-barbell-row',
    slug: 'bent-over-barbell-row',
    name: 'Bent-Over Barbell Row',
    category: 'Back',
    targetMuscle: 'Rhomboids, Latissimus Dorsi & Mid-Traps',
    secondaryMuscles: ['Biceps Brachii', 'Posterior Deltoids', 'Spinal Erectors'],
    difficulty: 'intermediate',
    equipmentRequired: 'Barbell',
    startingPosition: 'Hinge at the hips with knees slightly bent until your torso is approximately 45 degrees relative to the floor. Hold the barbell with an overhand grip shoulder-width apart, arms hanging vertically.',
    stepByStepExecution: [
      'Brace your abdominal wall and keep neck in a neutral line with spine.',
      'Pull the barbell upward toward your lower ribcage / belly button by driving your elbows backward.',
      'Retract your scapulae firmly at the peak of the movement.',
      'Lower the bar under control until arms are fully extended.'
    ],
    breathingTechnique: 'Exhale on the pull; inhale as you lower the weight.',
    recommendedSets: 4,
    recommendedReps: '8-10',
    restDurationSec: 90,
    commonMistakes: [
      'Standing too upright and turning the exercise into a shrug.',
      'Jerking the torso upward to heave heavy weight.'
    ],
    safetyInstructions: [
      'Do not allow lower back to round under load; drop the weight if position degrades.'
    ],
    animationType: 'pull',
    isPublished: true,
    viewsCount: 2980,
    environment: 'gym',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-overhead-barbell-press',
    slug: 'overhead-barbell-press',
    name: 'Standing Overhead Military Press',
    category: 'Shoulders',
    targetMuscle: 'Anterior & Lateral Deltoids',
    secondaryMuscles: ['Triceps Brachii', 'Upper Pectorals', 'Core', 'Trapezius'],
    difficulty: 'intermediate',
    equipmentRequired: 'Olympic Barbell & Rack',
    startingPosition: 'Unrack barbell at collarbone height. Grip bar just outside shoulder width with forearms perpendicular to the floor. Stand tall with feet hip-width apart, squeezing glutes and quads tight.',
    stepByStepExecution: [
      'Brace core and tilt head slightly back to clear bar path.',
      'Press the barbell straight vertically toward the ceiling.',
      'Once bar clears forehead, shift head and torso back under the bar.',
      'Lock out arms directly over midfoot/ears, shrugging traps slightly at the apex.',
      'Lower with control back to collarbone front rack position.'
    ],
    breathingTechnique: 'Inhale and brace at bottom; exhale through lockout at the top.',
    recommendedSets: 4,
    recommendedReps: '6-8',
    restDurationSec: 120,
    commonMistakes: [
      'Overarching lower back into hyperextension.',
      'Pressing bar forward in an arc rather than straight vertical.'
    ],
    safetyInstructions: [
      'Squeeze glutes maximally to lock pelvis and prevent lumbar hyperextension.'
    ],
    animationType: 'push',
    isPublished: true,
    viewsCount: 3180,
    environment: 'gym',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-dumbbell-lateral-raise',
    slug: 'dumbbell-lateral-raise',
    name: 'Standing Dumbbell Lateral Raise',
    category: 'Shoulders',
    targetMuscle: 'Lateral Deltoids (Side Delts)',
    secondaryMuscles: ['Anterior Deltoids', 'Trapezius', 'Supraspinatus'],
    difficulty: 'beginner',
    equipmentRequired: 'Pair of Dumbbells',
    startingPosition: 'Stand tall with feet hip-width apart holding a dumbbell in each hand at sides, palms facing inward. Slight forward torso lean with elbows softly unlocked.',
    stepByStepExecution: [
      'Raise dumbbells out to sides in the scapular plane (approx 20-30 degrees forward of midline).',
      'Lead with elbows, keeping hands and wrists slightly below or level with elbow height.',
      'Elevate to shoulder height, pause for half a second.',
      'Lower smoothly over 2 seconds back to sides.'
    ],
    breathingTechnique: 'Exhale raising weights out; inhale lowering under control.',
    recommendedSets: 3,
    recommendedReps: '12-15',
    restDurationSec: 60,
    commonMistakes: [
      'Using swinging hip momentum to launch heavy dumbbells.',
      'Shrugging traps high into ears on every rep.'
    ],
    safetyInstructions: [
      'Use modest weights; lateral delts respond best to strict execution and time under tension.'
    ],
    animationType: 'push',
    isPublished: true,
    viewsCount: 2740,
    environment: 'hybrid',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-cable-face-pull',
    slug: 'cable-face-pull',
    name: 'Cable Face Pull with External Rotation',
    category: 'Shoulders',
    targetMuscle: 'Posterior Deltoids & Infraspinatus',
    secondaryMuscles: ['Rhomboids', 'Middle Trapezius', 'Teres Minor'],
    difficulty: 'beginner',
    equipmentRequired: 'Cable Pulley & Triceps Rope Attachment',
    startingPosition: 'Set cable pulley at upper chest/face height. Attach double rope. Grasp rope with neutral thumbs-back grip. Step back to create cable tension.',
    stepByStepExecution: [
      'Set shoulders down away from ears.',
      'Pull rope toward bridge of nose while simultaneously rotating hands outward and pulling rope ends apart.',
      'At end range, knuckles should be beside ears and elbows pulled high and wide in a double bicep flex position.',
      'Hold the peak contraction for 2 seconds before returning slowly.'
    ],
    breathingTechnique: 'Exhale on pull and external rotation; inhale returning to start.',
    recommendedSets: 3,
    recommendedReps: '15-20',
    restDurationSec: 60,
    commonMistakes: [
      'Dropping elbows below hands, turning the movement into a triceps pressdown.',
      'Arching lower back and thrusting neck forward.'
    ],
    safetyInstructions: [
      'Prioritize external rotation and upper back contraction over heavy weight.'
    ],
    animationType: 'pull',
    isPublished: true,
    viewsCount: 2390,
    environment: 'gym',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-barbell-back-squat',
    slug: 'barbell-back-squat',
    name: 'Barbell Back Squat',
    category: 'Legs',
    targetMuscle: 'Quadriceps & Gluteus Maximus',
    secondaryMuscles: ['Hamstrings', 'Adductors', 'Erector Spinae', 'Core'],
    difficulty: 'intermediate',
    equipmentRequired: 'Barbell & Squat Rack',
    startingPosition: 'Rest barbell across upper traps (high bar) or across rear deltoids (low bar). Step out from rack, feet slightly wider than shoulder-width, toes turned out 15-30 degrees.',
    stepByStepExecution: [
      'Inhale deeply into belly and brace 360 degrees.',
      'Simultaneously break at hips and knees, sitting down between hips while tracking knees over toes.',
      'Descend until crease of hip is at or below the top of knees.',
      'Drive aggressively out of the hole, pushing through midfoot and heels back to standing.'
    ],
    breathingTechnique: 'Inhale and brace at top. Hold breath through bottom turn. Exhale through sticking point.',
    recommendedSets: 4,
    recommendedReps: '6-8',
    restDurationSec: 120,
    commonMistakes: [
      'Knees caving inward on ascent.',
      'Chest collapsing forward into a "good morning" squat.'
    ],
    safetyInstructions: [
      'Always set safety pins in rack at lowest squat depth.'
    ],
    animationType: 'squat',
    isPublished: true,
    viewsCount: 4320,
    environment: 'gym',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-romanian-deadlift',
    slug: 'dumbbell-romanian-deadlift',
    name: 'Dumbbell Romanian Deadlift (RDL)',
    category: 'Legs',
    targetMuscle: 'Hamstrings & Gluteus Maximus',
    secondaryMuscles: ['Erector Spinae', 'Forearms', 'Core'],
    difficulty: 'intermediate',
    equipmentRequired: 'Pair of Heavy Dumbbells',
    startingPosition: 'Stand tall holding dumbbells in front of thighs with an overhand grip. Feet hip-width apart, knees soft with a slight 15-degree bend.',
    stepByStepExecution: [
      'Maintain fixed slight knee bend throughout.',
      'Hinge backward at hips as if reaching butt toward a wall behind you.',
      'Glide dumbbells down close along shins until you feel a deep hamstring stretch just below knee height.',
      'Keep back completely flat and lats engaged.',
      'Drive hips forward to stand tall, squeezing glutes at lockout.'
    ],
    breathingTechnique: 'Inhale on way down; exhale as hips drive forward to lockout.',
    recommendedSets: 4,
    recommendedReps: '8-10',
    restDurationSec: 90,
    commonMistakes: [
      'Bending knees into a squat instead of hinging hips back.',
      'Letting weights drift forward away from legs.'
    ],
    safetyInstructions: [
      'Do not round spine to reach dumbbells to floor; stop when hamstring stretch is reached.'
    ],
    animationType: 'hinge',
    isPublished: true,
    viewsCount: 3260,
    environment: 'hybrid',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-bulgarian-split-squat',
    slug: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squats',
    category: 'Legs',
    targetMuscle: 'Quadriceps & Gluteus Maximus',
    secondaryMuscles: ['Hamstrings', 'Adductors', 'Calves', 'Core'],
    difficulty: 'advanced',
    equipmentRequired: 'Bench or Chair & Optional Dumbbells',
    startingPosition: 'Stand 2 to 3 feet in front of a flat bench. Place top of back foot laces-down on the bench. Front foot planted flat forward.',
    stepByStepExecution: [
      'Lower hips straight down until front thigh is parallel to floor and back knee hovers just above ground.',
      'Keep front knee tracking over middle toes.',
      'Torso may lean slightly forward to emphasize glute loading.',
      'Drive through front heel to return to standing.'
    ],
    breathingTechnique: 'Inhale descending; exhale driving up.',
    recommendedSets: 3,
    recommendedReps: '8-10 per leg',
    restDurationSec: 90,
    commonMistakes: [
      'Front foot placed too close, causing heel to lift and knee to take excessive shear.',
      'Losing balance due to feet being on a narrow single line.'
    ],
    safetyInstructions: [
      'Master bodyweight balance before adding external weights.'
    ],
    animationType: 'lunge',
    isPublished: true,
    viewsCount: 3790,
    environment: 'hybrid',
    developmentLevel: 'advanced'
  },
  {
    id: 'ex-incline-dumbbell-curl',
    slug: 'incline-dumbbell-curl',
    name: 'Incline Dumbbell Biceps Curl',
    category: 'Biceps',
    targetMuscle: 'Biceps Brachii (Long Head)',
    secondaryMuscles: ['Brachialis', 'Forearms'],
    difficulty: 'beginner',
    equipmentRequired: 'Incline Bench (45-60 deg) & Dumbbells',
    startingPosition: 'Sit on incline bench set to 45-60 degrees. Let arms hang straight down behind torso holding dumbbells with palms forward.',
    stepByStepExecution: [
      'Keep upper arms pinned vertically perpendicular to floor.',
      'Curl dumbbells upward by flexing at elbows while keeping shoulders back.',
      'Squeeze biceps hard at top contraction.',
      'Lower weights under control over 3 seconds back to full stretch at bottom.'
    ],
    breathingTechnique: 'Exhale curling up; inhale lowering down.',
    recommendedSets: 3,
    recommendedReps: '10-12',
    restDurationSec: 60,
    commonMistakes: [
      'Swinging elbows forward to cheat with anterior deltoids.',
      'Incomplete extension at bottom.'
    ],
    safetyInstructions: [
      'Do not abruptly bounce out of bottom stretch.'
    ],
    animationType: 'pull',
    isPublished: true,
    viewsCount: 2470,
    environment: 'gym',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-overhead-cable-triceps',
    slug: 'overhead-cable-triceps-extension',
    name: 'Overhead Cable Triceps Rope Extension',
    category: 'Triceps',
    targetMuscle: 'Triceps Brachii (Long Head)',
    secondaryMuscles: ['Medial & Lateral Triceps Heads'],
    difficulty: 'intermediate',
    equipmentRequired: 'Cable Machine & Rope Attachment',
    startingPosition: 'Attach rope to cable pulley at chest height. Grasp rope, face away from cable stack, and step into a staggered stance with elbows bent beside ears overhead.',
    stepByStepExecution: [
      'Keep upper arms fixed beside head with elbows pointed forward.',
      'Extend forearms forward and overhead until arms reach full straight lockout.',
      'Pull rope ends apart at top for maximal triceps tension.',
      'Slowly allow forearms to bend backward into a deep stretch behind head.'
    ],
    breathingTechnique: 'Exhale pressing to lockout; inhale returning to stretch.',
    recommendedSets: 3,
    recommendedReps: '12-15',
    restDurationSec: 60,
    commonMistakes: [
      'Flaring elbows out to sides.',
      'Arching lumbar spine to compensate.'
    ],
    safetyInstructions: [
      'Maintain braced core in staggered stance to protect lower back.'
    ],
    animationType: 'push',
    isPublished: true,
    viewsCount: 2280,
    environment: 'gym',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-parallel-bar-dips',
    slug: 'parallel-bar-dips',
    name: 'Parallel Bar Triceps & Chest Dips',
    category: 'Triceps',
    targetMuscle: 'Triceps Brachii & Lower Pectorals',
    secondaryMuscles: ['Anterior Deltoids', 'Core'],
    difficulty: 'advanced',
    equipmentRequired: 'Parallel Dip Bars',
    startingPosition: 'Mount dip bars with arms fully locked out, torso upright (triceps emphasis) or tilted 15 degrees forward (chest emphasis). Cross ankles behind.',
    stepByStepExecution: [
      'Lower body smoothly by bending elbows until upper arms are parallel to the floor (90 degrees).',
      'Keep elbows tracking backward, not flaring out wide.',
      'Pause briefly at bottom of controlled range.',
      'Press upward through palms to lock out at the top.'
    ],
    breathingTechnique: 'Inhale on descent; exhale pushing up to lockout.',
    recommendedSets: 3,
    recommendedReps: '8-12',
    restDurationSec: 90,
    commonMistakes: [
      'Descending too deep past 90 degrees with excessive shoulder shear.',
      'Kicking legs to gain upward momentum.'
    ],
    safetyInstructions: [
      'If you have pre-existing shoulder impingement, substitute with chair dips.'
    ],
    animationType: 'push',
    isPublished: true,
    viewsCount: 3120,
    environment: 'hybrid',
    developmentLevel: 'advanced'
  },
  {
    id: 'ex-hanging-leg-raise',
    slug: 'hanging-leg-raise',
    name: 'Hanging Straight Leg Raise',
    category: 'Abs',
    targetMuscle: 'Rectus Abdominis (Lower fibers)',
    secondaryMuscles: ['Hip Flexors', 'Forearms', 'Obliques'],
    difficulty: 'advanced',
    equipmentRequired: 'Pull-Up Bar',
    startingPosition: 'Hang from pull-up bar with an overhand grip in a dead hang. Engage lats and compress ribs down to prevent swinging.',
    stepByStepExecution: [
      'Posteriorly tilt pelvis to initiate abdominal engagement.',
      'Raise straight legs together until toes touch or exceed bar height (parallel minimum).',
      'Pause for a fraction of a second at top.',
      'Lower legs under complete eccentric control over 3 seconds without swinging.'
    ],
    breathingTechnique: 'Exhale forcefully as legs rise; inhale as legs descend.',
    recommendedSets: 3,
    recommendedReps: '10-12',
    restDurationSec: 60,
    commonMistakes: [
      'Using swinging momentum to kick legs up.',
      'Arching lower back on descent.'
    ],
    safetyInstructions: [
      'If hamstrings are tight, bend knees to 90 degrees for hanging knee raises.'
    ],
    animationType: 'core',
    isPublished: true,
    viewsCount: 2610,
    environment: 'hybrid',
    developmentLevel: 'advanced'
  },
  {
    id: 'ex-ab-wheel-rollout',
    slug: 'ab-wheel-rollout',
    name: 'Abdominal Wheel Rollout',
    category: 'Abs',
    targetMuscle: 'Rectus Abdominis & Transverse Abdominis',
    secondaryMuscles: ['Latissimus Dorsi', 'Shoulders', 'Erector Spinae'],
    difficulty: 'advanced',
    equipmentRequired: 'Ab Roller Wheel',
    startingPosition: 'Kneel on a soft mat holding ab wheel handles directly under shoulders. Round upper back slightly (hollow body) and squeeze glutes.',
    stepByStepExecution: [
      'Slowly roll wheel forward in a straight line, extending body forward.',
      'Descend as far as possible while keeping lower back flat and core tight.',
      'Do not allow lower back to collapse into extension.',
      'Contract lats and pull abs in to roll wheel back to start.'
    ],
    breathingTechnique: 'Inhale rolling forward; exhale squeezing abs to roll back.',
    recommendedSets: 3,
    recommendedReps: '8-10',
    restDurationSec: 60,
    commonMistakes: [
      'Sagging hips and arching lower back.',
      'Pulling back with hips first instead of core.'
    ],
    safetyInstructions: [
      'Only roll as far forward as you can safely reverse without lumbar pain.'
    ],
    animationType: 'core',
    isPublished: true,
    viewsCount: 2420,
    environment: 'hybrid',
    developmentLevel: 'advanced'
  },
  {
    id: 'ex-barbell-clean-and-press',
    slug: 'barbell-clean-and-press',
    name: 'Olympic Clean and Push Press',
    category: 'Full Body',
    targetMuscle: 'Full Body Kinetic Chain (Posterior Chain & Deltoids)',
    secondaryMuscles: ['Trapezius', 'Quadriceps', 'Core', 'Triceps'],
    difficulty: 'advanced',
    equipmentRequired: 'Olympic Barbell & Bumper Plates',
    startingPosition: 'Stand over barbell in deadlift stance. Grip bar just outside knees. Back flat, hips down, chest proud.',
    stepByStepExecution: [
      'Drive floor away to accelerate bar past knees.',
      'Triple extend hips, knees, and ankles violently into a shrug.',
      'Pull under bar, catching it on front deltoids in a shallow front squat (clean).',
      'Stand erect, dip knees 3 inches, and push press the bar explosively overhead to full lockout.'
    ],
    breathingTechnique: 'Brace on pull; exhale on catch; quick inhale, dip, and exhale on overhead push press.',
    recommendedSets: 4,
    recommendedReps: '5',
    restDurationSec: 120,
    commonMistakes: [
      'Arm-pulling the barbell instead of using violent hip drive.',
      'Pressing without solid front-rack transition.'
    ],
    safetyInstructions: [
      'Perform only on rubber platform or bumper mats with proper technique.'
    ],
    animationType: 'hinge',
    isPublished: true,
    viewsCount: 2190,
    environment: 'gym',
    developmentLevel: 'advanced'
  },
  {
    id: 'ex-hiit-burpee',
    slug: 'metabolic-hiit-burpee',
    name: 'Chest-to-Floor HIIT Burpee',
    category: 'Cardio',
    targetMuscle: 'Full Body Cardiovascular & Anaerobic Engine',
    secondaryMuscles: ['Chest', 'Quadriceps', 'Deltoids', 'Calves', 'Core'],
    difficulty: 'intermediate',
    equipmentRequired: 'Bodyweight',
    startingPosition: 'Stand with feet shoulder-width apart, arms at sides.',
    stepByStepExecution: [
      'Drop down, placing hands on floor, and kick feet back into a push-up plank.',
      'Lower chest completely to touch floor.',
      'Push up while snapping feet back under hips into a squat.',
      'Jump explosively upward, clapping hands overhead.'
    ],
    breathingTechnique: 'Continuous steady aerobic breathing in cadence with transitions.',
    recommendedSets: 4,
    recommendedReps: '15-20',
    restDurationSec: 45,
    commonMistakes: [
      'Arching lower back on push-up phase.',
      'Landing stiff-legged after jump.'
    ],
    safetyInstructions: [
      'Land softly with bent knees to absorb kinetic impact.'
    ],
    animationType: 'cardio',
    isPublished: true,
    viewsCount: 3150,
    environment: 'hybrid',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-jump-rope-intervals',
    slug: 'speed-jump-rope-intervals',
    name: 'Speed Jump Rope Intervals',
    category: 'Cardio',
    targetMuscle: 'Calves & Cardiovascular System',
    secondaryMuscles: ['Forearms', 'Shoulders', 'Core'],
    difficulty: 'beginner',
    equipmentRequired: 'Speed Jump Rope',
    startingPosition: 'Hold handles with thumbs forward, elbows tucked close to ribcage, rope looped behind heels.',
    stepByStepExecution: [
      'Rotate rope using quick wrist snaps, not arm circles.',
      'Bound softly on balls of feet just high enough (1-2 inches) to clear rope.',
      'Maintain light, rhythmic cadence.',
      'Alternate between double bounds and boxer step variations.'
    ],
    breathingTechnique: 'Deep rhythmic nasal breathing or rhythmic oral exhalation.',
    recommendedSets: 5,
    recommendedReps: '60 sec on / 30 sec off',
    restDurationSec: 30,
    commonMistakes: [
      'Jumping too high and stomping heels.',
      'Flaring elbows out away from body.'
    ],
    safetyInstructions: [
      'Jump on shock-absorbing surface (mat or wood floor); avoid concrete.'
    ],
    animationType: 'cardio',
    isPublished: true,
    viewsCount: 1980,
    environment: 'hybrid',
    developmentLevel: 'beginner'
  },
  {
    id: 'ex-pigeon-stretch',
    slug: 'pigeon-pose-stretch',
    name: 'Elevated Pigeon Hip Opener',
    category: 'Stretching',
    targetMuscle: 'Gluteus Medius, Piriformis & Hip Capsule',
    secondaryMuscles: ['Hip Flexors', 'Groin', 'Lower Back'],
    difficulty: 'beginner',
    equipmentRequired: 'Yoga Mat or Bench',
    startingPosition: 'On hands and knees, bring right knee forward behind right wrist, angling shin at 45 degrees. Slide left leg straight back.',
    stepByStepExecution: [
      'Square hips toward floor.',
      'Walk hands forward, lowering torso toward floor or resting on forearms.',
      'Sink into stretch, breathing deeply for 60 to 90 seconds per side.'
    ],
    breathingTechnique: 'Deep slow breaths, extending exhalations to trigger parasympathetic relaxation.',
    recommendedSets: 2,
    recommendedReps: '60 sec per side',
    restDurationSec: 30,
    commonMistakes: [
      'Collapsing onto the side hip instead of keeping hips square to ground.'
    ],
    safetyInstructions: [
      'If you feel sharp knee torque, place front leg onto a raised bench instead.'
    ],
    animationType: 'stretch',
    isPublished: true,
    viewsCount: 1670,
    environment: 'hybrid',
    developmentLevel: 'basic'
  },
  {
    id: 'ex-worlds-greatest-stretch',
    slug: 'worlds-greatest-stretch',
    name: "The World's Greatest Stretch",
    category: 'Mobility',
    targetMuscle: 'Thoracic Spine, Hips & Ankles',
    secondaryMuscles: ['Hamstrings', 'Hip Flexors', 'Groin', 'Chest'],
    difficulty: 'intermediate',
    equipmentRequired: 'Bodyweight',
    startingPosition: 'Start in a long runner’s lunge with left foot forward and hands planted on inside of left foot.',
    stepByStepExecution: [
      'Drop your left elbow down toward left instep for a deep groin and hip stretch.',
      'Rotate your left arm toward ceiling, looking up at hand and opening thoracic spine.',
      'Plant hand back down, push hips back to straighten both legs into a hamstring stretch.',
      'Step forward and switch sides.'
    ],
    breathingTechnique: 'Inhale as you rotate open to ceiling; exhale as you reach down.',
    recommendedSets: 2,
    recommendedReps: '6 per side',
    restDurationSec: 30,
    commonMistakes: [
      'Rotating through lower back instead of upper thoracic spine.'
    ],
    safetyInstructions: [
      'Move fluidly without bouncing or forcing end ranges.'
    ],
    animationType: 'stretch',
    isPublished: true,
    viewsCount: 2890,
    environment: 'hybrid',
    developmentLevel: 'basic'
  }
];
