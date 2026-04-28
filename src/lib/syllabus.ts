// Mock syllabus data. Real chapters/blueprints will be plugged in later.
import type { Board } from "./store";

export interface Chapter {
  title: string;
  brief: string;
  topics: string[];
}

export interface Subject {
  id: string;
  name: string;
  colorVar: string; // tailwind var class fragment
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

const COMMON_SOCIAL: Chapter[] = [
  ch("Nationalism in India", "Civil disobedience and the rise of national consciousness.", ["Non-cooperation", "Civil Disobedience", "Salt March"]),
  ch("Resources and Development", "Classification and conservation of resources.", ["Types of resources", "Land use", "Soil conservation"]),
  ch("Power Sharing", "Federalism and forms of power sharing.", ["Belgium & Sri Lanka", "Forms of power sharing"]),
  ch("Development", "Comparing development indicators.", ["HDI", "Sustainability", "Per capita income"]),
  ch("Print Culture and the Modern World", "Print revolution and its impact.", ["Gutenberg", "Print in India"]),
  ch("Globalisation and the Indian Economy", "MNCs and global trade.", ["MNCs", "Liberalisation", "Trade barriers"]),
];

const ENGLISH_CH: Chapter[] = [
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

const KANNADA_CH: Chapter[] = [
  ch("ಶಬರಿ", "ರಾಮಾಯಣದ ಸ್ಫೂರ್ತಿದಾಯಕ ಪಾತ್ರ.", ["ಭಾವಾರ್ಥ", "ಸಂದರ್ಭ"]),
  ch("ವಚನಗಳು", "ಬಸವಣ್ಣ ಮುಂತಾದ ಶರಣರ ವಚನಗಳು.", ["ಭಾವ", "ಪದಗಳು"]),
  ch("ಭೂಮಿಗೆ ಬಿದ್ದ ಬೀಜ", "ಸಮಾಜ ಮತ್ತು ಬದಲಾವಣೆ.", ["ಕಥಾ ಸಾರಾಂಶ"]),
  ch("ವ್ಯಾಘ್ರಗೀತೆ", "ನೈತಿಕ ಪಾಠವಿರುವ ಕಥೆ.", ["ನೀತಿ"]),
  ch("ಹಸಿರು ಕ್ರಾಂತಿ", "ಕೃಷಿ ಮತ್ತು ತಂತ್ರಜ್ಞಾನ.", ["ಮುಖ್ಯ ವಿಷಯಗಳು"]),
  ch("ಸಾಧನೆಯ ಹಾದಿ", "ಸ್ಫೂರ್ತಿಯ ಜೀವನ ಚರಿತ್ರೆ.", ["ಪಾತ್ರ"]),
];

const HINDI_CH: Chapter[] = [
  ch("सूरदास के पद", "भक्ति काव्य का सौंदर्य।", ["भाव", "अलंकार"]),
  ch("तुलसीदास", "रामचरितमानस से अंश।", ["संदर्भ", "व्याख्या"]),
  ch("नेताजी का चश्मा", "देशभक्ति की कथा।", ["कथानक"]),
  ch("बालगोबिन भगत", "एक साधक का जीवन।", ["चरित्र चित्रण"]),
  ch("लखनवी अंदाज़", "व्यंग्य रचना।", ["शैली"]),
  ch("एक कहानी यह भी", "मन्नू भंडारी का संस्मरण।", ["मुख्य विचार"]),
];

const ELECTIVE_CH: Chapter[] = [
  ch("Introduction to Computer Applications", "Hardware, software, and networks.", ["Hardware", "OS basics", "Networks"]),
  ch("Web Technologies", "HTML, CSS basics for the modern web.", ["HTML", "CSS", "Browsers"]),
  ch("Spreadsheets in Practice", "Formulas and charts for analysis.", ["Formulas", "Charts", "Pivot basics"]),
  ch("Cyber Safety", "Staying safe online and protecting privacy.", ["Passwords", "Phishing", "Privacy"]),
];

export function getSubjects(board: Board, _medium?: string): Subject[] {
  const secondName = board === "cbse" ? "Hindi" : "Kannada";
  const secondChapters = board === "cbse" ? HINDI_CH : KANNADA_CH;
  return [
    { id: "english", name: "English", colorVar: "subject-english", iconKey: "english", chapters: ENGLISH_CH },
    { id: "second-lang", name: secondName, colorVar: "subject-language", iconKey: "language", chapters: secondChapters },
    { id: "math", name: "Mathematics", colorVar: "subject-math", iconKey: "math", chapters: COMMON_MATH },
    { id: "science", name: "Science", colorVar: "subject-science", iconKey: "science", chapters: COMMON_SCIENCE },
    { id: "social", name: "Social Science", colorVar: "subject-social", iconKey: "social", chapters: COMMON_SOCIAL },
    { id: "elective", name: "Elective (Computer Apps)", colorVar: "subject-elective", iconKey: "elective", chapters: ELECTIVE_CH },
  ];
}

export function getSubject(board: Board, id: string): Subject | undefined {
  return getSubjects(board).find((s) => s.id === id);
}
