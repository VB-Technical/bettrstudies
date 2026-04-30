// Karnataka Class 10 syllabus — chapters sourced from KTBS 2025-26 textbooks
// (English FL/SL/TL, Kannada FL/SL/TL). Other subjects use standard Class 10 chapters.
import type { Board } from "./store";

export interface Chapter {
  title: string;
  brief: string;
  topics: string[];
}

export interface Subject {
  id: string;
  name: string;
  colorVar: string;
  iconKey: SubjectIconKey;
  chapters: Chapter[];
}

export type SubjectIconKey =
  | "english"
  | "language"
  | "math"
  | "science"
  | "social"
  | "elective";

const ch = (title: string, brief: string, topics: string[]): Chapter => ({ title, brief, topics });

// ---------- Maths (Class 10, common to CBSE & KSEEB) ----------
const COMMON_MATH: Chapter[] = [
  ch("Real Numbers", "Euclid's algorithm, fundamental theorem of arithmetic, irrational numbers.", ["Euclid's Division Lemma", "HCF & LCM", "Irrational Numbers"]),
  ch("Polynomials", "Zeroes of polynomials and the relationship with coefficients.", ["Geometrical meaning", "Division algorithm", "Zeroes & coefficients"]),
  ch("Pair of Linear Equations", "Algebraic and graphical methods to solve linear systems.", ["Substitution", "Elimination", "Cross-multiplication"]),
  ch("Quadratic Equations", "Solve quadratic equations using factorization and the quadratic formula.", ["Factorization", "Quadratic formula", "Nature of roots"]),
  ch("Arithmetic Progressions", "Sequences with common difference and their sums.", ["nth term", "Sum of n terms", "Word problems"]),
  ch("Triangles", "Similarity criteria and theorems on triangles.", ["BPT", "AA similarity", "Pythagoras"]),
  ch("Coordinate Geometry", "Distance, section, and area formulas in the plane.", ["Distance formula", "Section formula", "Area of triangle"]),
  ch("Trigonometry & Applications", "Ratios, identities, heights and distances.", ["Ratios", "Identities", "Heights & Distances"]),
  ch("Circles", "Tangents and properties of circles.", ["Tangent properties", "Number of tangents", "Constructions"]),
  ch("Areas & Volumes", "Areas of sectors and combinations of solids.", ["Sectors & segments", "Surface areas", "Volumes"]),
  ch("Statistics", "Mean, median, mode, and ogives.", ["Mean", "Median", "Mode", "Ogive"]),
  ch("Probability", "Classical definition and simple problems.", ["Classical probability", "Sample space", "Events"]),
];

// ---------- Science (Class 10) ----------
const COMMON_SCIENCE: Chapter[] = [
  ch("Chemical Reactions and Equations", "Types of reactions and balancing equations.", ["Balancing", "Types of reactions", "Redox"]),
  ch("Acids, Bases and Salts", "pH, indicators, and important salts.", ["pH scale", "Indicators", "Common salts"]),
  ch("Metals and Non-metals", "Reactivity, refining, and corrosion.", ["Reactivity series", "Extraction", "Corrosion"]),
  ch("Carbon and its Compounds", "Bonding, functional groups, and reactions.", ["Covalent bonding", "Homologous series", "Soaps & detergents"]),
  ch("Life Processes", "Nutrition, respiration, transportation, excretion.", ["Nutrition", "Respiration", "Transport", "Excretion"]),
  ch("Control and Coordination", "Nervous and hormonal coordination.", ["Nervous system", "Hormones", "Reflex actions"]),
  ch("How do Organisms Reproduce?", "Asexual and sexual reproduction.", ["Asexual modes", "Flower structure", "Human reproduction"]),
  ch("Heredity", "Mendel's laws and inheritance.", ["Mendel's experiments", "Sex determination"]),
  ch("Light – Reflection and Refraction", "Mirrors, lenses, and image formation.", ["Mirror formula", "Lens formula", "Refractive index"]),
  ch("Electricity", "Ohm's law, circuits, and heating effect.", ["Ohm's law", "Resistors", "Power"]),
  ch("Magnetic Effects of Current", "Electromagnetism and motors.", ["Field lines", "Right-hand rule", "Motor & generator"]),
  ch("Our Environment", "Ecosystems and ozone layer.", ["Food chains", "Biodegradable waste", "Ozone"]),
];

// ---------- Social Science ----------
const COMMON_SOCIAL: Chapter[] = [
  ch("Nationalism in India", "Civil disobedience and the rise of national consciousness.", ["Non-cooperation", "Civil Disobedience", "Salt March"]),
  ch("Resources and Development", "Classification and conservation of resources.", ["Types of resources", "Land use", "Soil conservation"]),
  ch("Power Sharing", "Federalism and forms of power sharing.", ["Belgium & Sri Lanka", "Forms of power sharing"]),
  ch("Development", "Comparing development indicators.", ["HDI", "Sustainability", "Per capita income"]),
  ch("Print Culture and the Modern World", "Print revolution and its impact.", ["Gutenberg", "Print in India"]),
  ch("Globalisation and the Indian Economy", "MNCs and global trade.", ["MNCs", "Liberalisation", "Trade barriers"]),
];

// ---------- CBSE English (First Flight) ----------
const ENGLISH_CBSE: Chapter[] = [
  ch("A Letter to God", "Faith, hope, and the irony of human nature.", ["Theme", "Characters", "Literary devices"]),
  ch("Nelson Mandela: Long Walk to Freedom", "Inauguration and the journey of freedom.", ["Context", "Key events"]),
  ch("Two Stories about Flying", "Courage and overcoming fear.", ["Plot", "Symbolism"]),
  ch("From the Diary of Anne Frank", "Adolescence in hiding during WWII.", ["Voice", "Tone"]),
  ch("Glimpses of India", "Snapshots of culture across regions.", ["Imagery", "Vocabulary"]),
  ch("Mijbil the Otter", "A pet otter in the city.", ["Narrative style"]),
  ch("Madam Rides the Bus", "A child's first solo journey.", ["Character study"]),
  ch("The Sermon at Benares", "Buddha and the meaning of suffering.", ["Theme", "Allegory"]),
  ch("The Proposal", "A one-act comic farce.", ["Drama", "Humor"]),
];

// ---------- KSEEB English Second Language (Class 10, 2025-26) ----------
// Sourced from KTBS textbooks (Part-1 + Part-2)
const ENGLISH_KSEEB: Chapter[] = [
  ch("A Hero", "R.K. Narayan — Swami's overnight transformation into a hero.", ["Theme", "Characters", "Comprehension"]),
  ch("There's a Girl by the Tracks!", "True account of Baleshwar's brave rescue of Roma Talreja.", ["Plot", "Real-life heroism"]),
  ch("Gentleman of Rio en Medio", "An old man's quiet dignity in a land deal.", ["Character", "Dignity & honour"]),
  ch("Dr. B.R. Ambedkar", "Life and work of the architect of the Indian Constitution.", ["Biography", "Social reform"]),
  ch("The Eyes are not Here", "Ruskin Bond — twist in a train compartment.", ["Irony", "Narration"]),
  ch("The Girl who was Anne Frank", "Louis De Jong — the legacy of Anne Frank.", ["Holocaust", "Diary form"]),
  ch("A Village Cricket Match", "A.G. Macdonell — humorous English village cricket.", ["Humour", "Description"]),
  ch("Consumerist Culture", "Cheriyan Alexander — critique of modern consumerism.", ["Argumentation", "Modern issues"]),
  ch("The Pie and the Tart", "Hugh Chesterman — short comic play.", ["Drama", "Dialogue"]),
  ch("Grandma Climbs a Tree", "Poem on a spirited grandmother.", ["Poetry", "Character"]),
  ch("Quality of Mercy", "Shakespeare — speech on mercy.", ["Memorization", "Imagery"]),
  ch("The Song of India", "Patriotic verse on India's heritage.", ["Nationalism", "Imagery"]),
  ch("Sonnet 73", "Shakespeare — sonnet on ageing.", ["Sonnet form", "Metaphor"]),
  ch("Mending Wall", "Robert Frost — neighbours and walls.", ["Symbolism", "Theme"]),
  ch("Ulysses and the Cyclops", "Charles Lamb — Odysseus and Polyphemus.", ["Adventure", "Retelling"]),
];

// ---------- KSEEB English Third Language (Class 10) ----------
const ENGLISH_TL: Chapter[] = [
  ch("Chanakya and Rakshasa", "Statecraft and wisdom in ancient India.", ["Plot", "Characters"]),
  ch("Faithful Friends", "Poem on the value of true friendship.", ["Theme"]),
  ch("At the Zoo", "Children's visit and observations of animals.", ["Vocabulary"]),
  ch("The Tiger and the Deer", "Poem on the law of nature.", ["Imagery"]),
  ch("Kashmir, the Garden of India", "Beauty and culture of Kashmir.", ["Description"]),
  ch("Autumn Song", "Sarojini Naidu — seasons and feeling.", ["Poetry"]),
  ch("The Two Great Musicians", "Bismillah Khan & Lata Mangeshkar.", ["Biography"]),
  ch("Life in Banjarumale", "A self-sufficient tribal hamlet in Karnataka.", ["Article", "Eco-living"]),
  ch("Plant Tree", "Poem celebrating tree planting.", ["Theme"]),
  ch("Simpleton!", "Tale of a foolish younger cousin.", ["Folk tale"]),
  ch("Sohrab and Rustum", "The tragic father–son combat.", ["Epic", "Tragedy"]),
  ch("A Scene from Shakuntala", "Excerpt from Kalidasa's classic play.", ["Drama"]),
];

// ---------- Kannada First Language (KSEEB, 2025-26) ----------
const KANNADA_FL: Chapter[] = [
  ch("ಸಂಕಲ್ಪ ಗೀತೆ", "ಸಂಕಲ್ಪ ಮತ್ತು ದೃಢ ನಿಶ್ಚಯದ ಗೀತೆ.", ["ಭಾವಾರ್ಥ", "ಸಂದರ್ಭ"]),
  ch("ವ್ಯಾಘ್ರಗೀತೆ", "ಎ.ಎನ್. ಮೂರ್ತಿರಾವ್ ಅವರ ಪ್ರಸಿದ್ಧ ಬರಹ.", ["ಕಥಾಸಾರಾಂಶ", "ನೀತಿ"]),
  ch("ಭಾಗ್ಯಶಿಲ್ಪಿಗಳು", "ಸಮಾಜ ನಿರ್ಮಾಪಕರ ಪರಿಚಯ.", ["ವ್ಯಕ್ತಿಚಿತ್ರಣ"]),
  ch("ಎದೆಗೆ ಬಿದ್ದ ಅಕ್ಷರ", "ದೇವನೂರ ಮಹಾದೇವ — ಶಿಕ್ಷಣದ ಪ್ರಭಾವ.", ["ಸ್ವಾನುಭವ", "ಶಿಕ್ಷಣ"]),
  ch("ಯುದ್ಧ", "ಸಾರಾ ಅಬೂಬಕ್ಕರ್ — ಯುದ್ಧದ ಭೀಕರತೆ ಮತ್ತು ಮಾನವೀಯತೆ.", ["ಸಣ್ಣಕಥೆ", "ಮಾನವೀಯ ಮೌಲ್ಯ"]),
  ch("ತಬರಿಯ ಕಥೆ", "ಪೂ. ತಿ. ನರಸಿಂಹಾಚಾರ್ — ಸಾಮಾಜಿಕ ಕಥೆ.", ["ಪಾತ್ರ", "ಸಮಾಜ"]),
  ch("ಅಂಡಮಾನ್", "ಎ. ಕೃ. ರಾಮಾನುಜನ್ — ಪ್ರವಾಸ ಕಥನ.", ["ಪ್ರವಾಸ ಸಾಹಿತ್ಯ"]),
  ch("ಆಗ್ನೇಯ ಏಷ್ಯಾದ ಕಡೆಗೆ", "ಶಿವರಾಮ ಕಾರಂತ — ಪ್ರವಾಸ ಅನುಭವ.", ["ಪ್ರವಾಸ", "ಸಂಸ್ಕೃತಿ"]),
  ch("ಕೆಸರು", "ಕವನ — ಬದುಕಿನ ಪ್ರತಿಮೆ.", ["ಕವನ", "ಪ್ರತಿಮೆ"]),
  ch("ವಚನಗಳು", "ಬಸವಣ್ಣ ಮುಂತಾದ ಶರಣರ ವಚನಗಳು.", ["ಭಕ್ತಿ", "ಸಮಾಜ"]),
];

// ---------- Kannada Second Language ----------
const KANNADA_SL: Chapter[] = [
  ch("ಗಿಳಿಯ ಮರದ ಗಿಳಿ", "ಪರಿಸರ ಮತ್ತು ಜೀವನದ ಸಂಬಂಧ.", ["ಪದಗಳ ಅರ್ಥ"]),
  ch("ಆಸಿ-ಮಾಸಿ-ಕೃಷಿ", "ಕೃಷಿಯ ಮಹತ್ವ.", ["ಕೃಷಿ ಸಂಸ್ಕೃತಿ"]),
  ch("ಗಾನಯೋಗಿ ಪಂಡಿತ ಪುಟ್ಟರಾಜ ಗವಾಯಿ", "ಪ್ರಸಿದ್ಧ ಗಾಯಕನ ಜೀವನ.", ["ವ್ಯಕ್ತಿ ಪರಿಚಯ"]),
  ch("ಹಕ್ಕಿಗಳ ನಾಗರಿಕ ಜಗತ್ತು", "ಪಕ್ಷಿಗಳ ಬಗ್ಗೆ ವಿವರಣೆ.", ["ಪ್ರಕೃತಿ"]),
  ch("ಕಾಳಿಂಗ-ಕೇರಳ", "ಗುರುರಾಜ ಕಾಯ್ಕಿಣಿ — ಕಥೆ.", ["ಸಣ್ಣ ಕಥೆ"]),
  ch("ಗಂಗೆಯಲ್ಲಿ ದೀಪಮಾಲೆ", "ಜಿ.ಎಸ್. ಶಿವರುದ್ರಪ್ಪ — ಪ್ರಯಾಣದ ಅನುಭವ.", ["ಪ್ರವಾಸ"]),
  ch("ನನ್ನ ಗೋಪಾಲ", "ಕುವೆಂಪು — ಭಾವಗೀತೆ.", ["ಭಕ್ತಿ"]),
  ch("ಸೌಜನ್ಯ", "ಹಾ.ಮಾ. ನಾಯಕ — ಪ್ರಬಂಧ.", ["ಮೌಲ್ಯ"]),
  ch("ಮೊಗ್ಗಿನ ಜಡೆ", "ಜನಪದ ಗೀತೆ.", ["ಜನಪದ"]),
  ch("ವಚನಗಳು", "ಬಸವಣ್ಣ, ನೀಲಾಂಬಿಕೆ, ಅಕ್ಕಮಹಾದೇವಿ.", ["ವಚನ ಸಾಹಿತ್ಯ"]),
];

// ---------- Kannada Third Language ----------
const KANNADA_TL: Chapter[] = [
  ch("ನಾವೆಲ್ಲರು ಒಂದೇ ಜಾತಿ", "ಸಮಾನತೆಯ ಸಂದೇಶ.", ["ಮೌಲ್ಯ"]),
  ch("ಕೊಡಗಿನ ಗೌರಮ್ಮ", "ಲೇಖಕಿಯ ಪರಿಚಯ.", ["ವ್ಯಕ್ತಿ ಪರಿಚಯ"]),
  ch("ಭೂಮಿತಾಯಿ ಕುಡಿಗಳು", "ಭೂಮಿಯ ಮಕ್ಕಳಾಗಿ ಬದುಕು.", ["ಪ್ರಕೃತಿ"]),
  ch("ತಿತ್ತೀನಾಳ ತಿಮ್ಮಪ್ಪ ಸಾಹುಕಾರರು", "ಗ್ರಾಮೀಣ ಜೀವನ ಚಿತ್ರ.", ["ಪಾತ್ರಚಿತ್ರಣ"]),
  ch("ಧ್ವಜ ರಕ್ಷಣೆ", "ಎನ್.ಎಲ್.