// Karnataka Class 10 syllabus — chapters sourced from KTBS 2025-26 textbooks
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

export type SubjectIconKey = "english" | "language" | "math" | "science" | "social" | "elective";

const ch = (title: string, brief: string, topics: string[]): Chapter => ({ title, brief, topics });

const COMMON_MATH: Chapter[] = [
  ch("Real Numbers", "Euclid's algorithm, fundamental theorem of arithmetic.", ["Euclid's Lemma", "HCF & LCM", "Irrational Numbers"]),
  ch("Polynomials", "Zeroes and coefficients.", ["Geometrical meaning", "Division algorithm"]),
  ch("Pair of Linear Equations", "Algebraic and graphical methods.", ["Substitution", "Elimination"]),
  ch("Quadratic Equations", "Factorization and quadratic formula.", ["Factorization", "Nature of roots"]),
  ch("Arithmetic Progressions", "Sequences and sums.", ["nth term", "Sum of n terms"]),
  ch("Triangles", "Similarity criteria and theorems.", ["BPT", "Pythagoras"]),
  ch("Coordinate Geometry", "Distance, section, area formulas.", ["Distance", "Section", "Area"]),
  ch("Trigonometry & Applications", "Ratios, identities, heights.", ["Ratios", "Identities"]),
  ch("Circles", "Tangents and properties.", ["Tangents", "Constructions"]),
  ch("Areas & Volumes", "Sectors and combinations of solids.", ["Sectors", "Volumes"]),
  ch("Statistics", "Mean, median, mode, ogives.", ["Mean", "Median", "Mode"]),
  ch("Probability", "Classical definition.", ["Sample space", "Events"]),
];

const COMMON_SCIENCE: Chapter[] = [
  ch("Chemical Reactions and Equations", "Types of reactions and balancing.", ["Balancing", "Redox"]),
  ch("Acids, Bases and Salts", "pH, indicators, important salts.", ["pH scale", "Indicators"]),
  ch("Metals and Non-metals", "Reactivity, refining, corrosion.", ["Reactivity", "Extraction"]),
  ch("Carbon and its Compounds", "Bonding, functional groups.", ["Covalent bonding", "Homologous series"]),
  ch("Life Processes", "Nutrition, respiration, transport.", ["Nutrition", "Respiration"]),
  ch("Control and Coordination", "Nervous and hormonal coordination.", ["Nervous system", "Hormones"]),
  ch("How do Organisms Reproduce?", "Asexual and sexual reproduction.", ["Asexual modes", "Human reproduction"]),
  ch("Heredity", "Mendel's laws and inheritance.", ["Mendel", "Sex determination"]),
  ch("Light – Reflection and Refraction", "Mirrors, lenses, image formation.", ["Mirror formula", "Lens formula"]),
  ch("Electricity", "Ohm's law, circuits.", ["Ohm's law", "Power"]),
  ch("Magnetic Effects of Current", "Electromagnetism and motors.", ["Field lines", "Motor"]),
  ch("Our Environment", "Ecosystems and ozone layer.", ["Food chains", "Ozone"]),
];

const COMMON_SOCIAL: Chapter[] = [
  ch("Nationalism in India", "Civil disobedience and national consciousness.", ["Non-cooperation", "Salt March"]),
  ch("Resources and Development", "Classification and conservation.", ["Land use", "Soil conservation"]),
  ch("Power Sharing", "Federalism and forms of power sharing.", ["Belgium & Sri Lanka"]),
  ch("Development", "Comparing development indicators.", ["HDI", "Sustainability"]),
  ch("Print Culture and the Modern World", "Print revolution and impact.", ["Gutenberg", "Print in India"]),
  ch("Globalisation and the Indian Economy", "MNCs and global trade.", ["MNCs", "Liberalisation"]),
];

// CBSE English (First Flight)
const ENGLISH_CBSE: Chapter[] = [
  ch("A Letter to God", "Faith, hope, and irony.", ["Theme", "Characters"]),
  ch("Nelson Mandela: Long Walk to Freedom", "The journey of freedom.", ["Context"]),
  ch("Two Stories about Flying", "Courage and overcoming fear.", ["Plot", "Symbolism"]),
  ch("From the Diary of Anne Frank", "Adolescence in hiding.", ["Voice", "Tone"]),
  ch("Glimpses of India", "Snapshots of culture.", ["Imagery"]),
  ch("Mijbil the Otter", "A pet otter in the city.", ["Narrative style"]),
  ch("Madam Rides the Bus", "A child's first solo journey.", ["Character study"]),
  ch("The Sermon at Benares", "Buddha and suffering.", ["Allegory"]),
  ch("The Proposal", "A one-act comic farce.", ["Drama", "Humor"]),
];

// KSEEB English Second Language (Karnataka, 2025-26) — from KTBS textbooks
const ENGLISH_KSEEB: Chapter[] = [
  ch("A Hero", "R.K. Narayan — Swami's overnight transformation.", ["Theme", "Characters"]),
  ch("There's a Girl by the Tracks!", "Baleshwar's brave rescue of Roma Talreja.", ["Real-life heroism"]),
  ch("Gentleman of Rio en Medio", "An old man's quiet dignity in a land deal.", ["Dignity & honour"]),
  ch("Dr. B.R. Ambedkar", "Architect of the Indian Constitution.", ["Biography"]),
  ch("The Eyes are not Here", "Ruskin Bond — twist in a train compartment.", ["Irony"]),
  ch("The Girl who was Anne Frank", "Louis De Jong — legacy of Anne Frank.", ["Holocaust"]),
  ch("A Village Cricket Match", "A.G. Macdonell — humorous cricket scene.", ["Humour"]),
  ch("Consumerist Culture", "Cheriyan Alexander — critique of consumerism.", ["Argumentation"]),
  ch("The Pie and the Tart", "Hugh Chesterman — short comic play.", ["Drama"]),
  ch("Grandma Climbs a Tree", "Poem on a spirited grandmother.", ["Poetry"]),
  ch("Quality of Mercy", "Shakespeare — speech on mercy.", ["Memorization"]),
  ch("The Song of India", "Patriotic verse.", ["Nationalism"]),
  ch("Sonnet 73", "Shakespeare — sonnet on ageing.", ["Sonnet form"]),
  ch("Mending Wall", "Robert Frost — neighbours and walls.", ["Symbolism"]),
  ch("Ulysses and the Cyclops", "Charles Lamb — Odysseus and Polyphemus.", ["Adventure"]),
];

// Kannada First Language (KSEEB, 2025-26)
const KANNADA_FL: Chapter[] = [
  ch("ಸಂಕಲ್ಪ ಗೀತೆ", "ಸಂಕಲ್ಪ ಮತ್ತು ದೃಢ ನಿಶ್ಚಯ.", ["ಭಾವಾರ್ಥ"]),
  ch("ವ್ಯಾಘ್ರಗೀತೆ", "ಎ.ಎನ್. ಮೂರ್ತಿರಾವ್ ಅವರ ಬರಹ.", ["ಕಥಾಸಾರಾಂಶ", "ನೀತಿ"]),
  ch("ಭಾಗ್ಯಶಿಲ್ಪಿಗಳು", "ಸಮಾಜ ನಿರ್ಮಾಪಕರ ಪರಿಚಯ.", ["ವ್ಯಕ್ತಿಚಿತ್ರಣ"]),
  ch("ಎದೆಗೆ ಬಿದ್ದ ಅಕ್ಷರ", "ದೇವನೂರ ಮಹಾದೇವ — ಶಿಕ್ಷಣದ ಪ್ರಭಾವ.", ["ಶಿಕ್ಷಣ"]),
  ch("ಯುದ್ಧ", "ಸಾರಾ ಅಬೂಬಕ್ಕರ್ — ಯುದ್ಧ ಮತ್ತು ಮಾನವೀಯತೆ.", ["ಸಣ್ಣಕಥೆ"]),
  ch("ತಬರಿಯ ಕಥೆ", "ಪೂ.ತಿ. ನರಸಿಂಹಾಚಾರ್ — ಸಾಮಾಜಿಕ ಕಥೆ.", ["ಪಾತ್ರ"]),
  ch("ಅಂಡಮಾನ್", "ಎ.ಕೃ. ರಾಮಾನುಜನ್ — ಪ್ರವಾಸ ಕಥನ.", ["ಪ್ರವಾಸ"]),
  ch("ಆಗ್ನೇಯ ಏಷ್ಯಾದ ಕಡೆಗೆ", "ಶಿವರಾಮ ಕಾರಂತ — ಪ್ರವಾಸ ಅನುಭವ.", ["ಸಂಸ್ಕೃತಿ"]),
  ch("ಕೆಸರು", "ಬದುಕಿನ ಪ್ರತಿಮೆಯಾಗಿ ಕವನ.", ["ಕವನ"]),
  ch("ವಚನಗಳು", "ಬಸವಣ್ಣ ಮುಂತಾದ ಶರಣರ ವಚನಗಳು.", ["ಭಕ್ತಿ", "ಸಮಾಜ"]),
];

// Kannada Second Language (KSEEB, 2025-26)
const KANNADA_SL: Chapter[] = [
  ch("ಗಿಳಿಯ ಮರದ ಗಿಳಿ", "ಪರಿಸರ ಮತ್ತು ಜೀವನ.", ["ಪದಗಳ ಅರ್ಥ"]),
  ch("ಆಸಿ-ಮಾಸಿ-ಕೃಷಿ", "ಕೃಷಿಯ ಮಹತ್ವ.", ["ಕೃಷಿ ಸಂಸ್ಕೃತಿ"]),
  ch("ಗಾನಯೋಗಿ ಪಂಡಿತ ಪುಟ್ಟರಾಜ ಗವಾಯಿ", "ಗಾಯಕನ ಜೀವನ.", ["ವ್ಯಕ್ತಿ ಪರಿಚಯ"]),
  ch("ಹಕ್ಕಿಗಳ ನಾಗರಿಕ ಜಗತ್ತು", "ಪಕ್ಷಿಗಳ ಬಗ್ಗೆ.", ["ಪ್ರಕೃತಿ"]),
  ch("ಕಾಳಿಂಗ-ಕೇರಳ", "ಗುರುರಾಜ ಕಾಯ್ಕಿಣಿ — ಕಥೆ.", ["ಸಣ್ಣ ಕಥೆ"]),
  ch("ಗಂಗೆಯಲ್ಲಿ ದೀಪಮಾಲೆ", "ಜಿ.ಎಸ್. ಶಿವರುದ್ರಪ್ಪ.", ["ಪ್ರವಾಸ"]),
  ch("ನನ್ನ ಗೋಪಾಲ", "ಕುವೆಂಪು — ಭಾವಗೀತೆ.", ["ಭಕ್ತಿ"]),
  ch("ಸೌಜನ್ಯ", "ಹಾ.ಮಾ. ನಾಯಕ — ಪ್ರಬಂಧ.", ["ಮೌಲ್ಯ"]),
  ch("ಮೊಗ್ಗಿನ ಜಡೆ", "ಜನಪದ ಗೀತೆ.", ["ಜನಪದ"]),
  ch("ವಚನಗಳು", "ಬಸವಣ್ಣ, ಅಕ್ಕಮಹಾದೇವಿ.", ["ವಚನ ಸಾಹಿತ್ಯ"]),
];

const HINDI_CH: Chapter[] = [
  ch("सूरदास के पद", "भक्ति काव्य का सौंदर्य।", ["भाव", "अलंकार"]),
  ch("तुलसीदास", "रामचरितमानस से अंश।", ["संदर्भ"]),
  ch("नेताजी का चश्मा", "देशभक्ति की कथा।", ["कथानक"]),
  ch("बालगोबिन भगत", "एक साधक का जीवन।", ["चरित्र चित्रण"]),
  ch("लखनवी अंदाज़", "व्यंग्य रचना।", ["शैली"]),
  ch("एक कहानी यह भी", "मन्नू भंडारी का संस्मरण।", ["मुख्य विचार"]),
];

const ELECTIVE_CH: Chapter[] = [
  ch("Introduction to Computer Applications", "Hardware, software, and networks.", ["Hardware", "OS basics"]),
  ch("Web Technologies", "HTML, CSS for the modern web.", ["HTML", "CSS"]),
  ch("Spreadsheets in Practice", "Formulas and charts.", ["Formulas", "Charts"]),
  ch("Cyber Safety", "Staying safe online.", ["Passwords", "Phishing"]),
];

export function getSubjects(board: Board, _medium?: string): Subject[] {
  const secondName = board === "cbse" ? "Hindi" : "Kannada";
  // For Karnataka board, default to Kannada Second Language chapters; FL/TL also represented.
  const secondChapters = board === "cbse" ? HINDI_CH : KANNADA_SL;
  const englishChapters = board === "cbse" ? ENGLISH_CBSE : ENGLISH_KSEEB;
  return [
    { id: "english", name: "English", colorVar: "subject-english", iconKey: "english", chapters: englishChapters },
    { id: "second-lang", name: secondName, colorVar: "subject-language", iconKey: "language", chapters: secondChapters },
    { id: "math", name: "Mathematics", colorVar: "subject-math", iconKey: "math", chapters: COMMON_MATH },
    { id: "science", name: "Science", colorVar: "subject-science", iconKey: "science", chapters: COMMON_SCIENCE },
    { id: "social", name: "Social Science", colorVar: "subject-social", iconKey: "social", chapters: COMMON_SOCIAL },
    { id: "elective", name: "Elective (Computer Apps)", colorVar: "subject-elective", iconKey: "elective", chapters: ELECTIVE_CH },
  ];
}

// Expose Kannada FL as an additional dataset (used when medium = Kannada FL).
export const KANNADA_FIRST_LANGUAGE = KANNADA_FL;

export function getSubject(board: Board, id: string): Subject | undefined {
  return getSubjects(board).find((s) => s.id === id);
}
