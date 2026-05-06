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

// Hindi (CBSE — Kshitij/Sparsh-style core selection used by mock)
const HINDI_CH: Chapter[] = [
  ch("सूरदास के पद", "भक्ति काव्य का सौंदर्य।", ["भाव", "अलंकार"]),
  ch("तुलसीदास", "रामचरितमानस से अंश।", ["संदर्भ"]),
  ch("नेताजी का चश्मा", "देशभक्ति की कथा।", ["कथानक"]),
  ch("बालगोबिन भगत", "एक साधक का जीवन।", ["चरित्र चित्रण"]),
  ch("लखनवी अंदाज़", "व्यंग्य रचना।", ["शैली"]),
  ch("एक कहानी यह भी", "मन्नू भंडारी का संस्मरण।", ["मुख्य विचार"]),
];

// Hindi First Language — KSEEB "Hindi Suman" 2025-26 (Parts 1 + 2 combined)
const HINDI_FL: Chapter[] = [
  ch("सारे जहाँ से अच्छा", "डॉ. इकबाल — देशभक्ति कविता।", ["कविता", "भाव"]),
  ch("अकबरी लोटा", "अन्नपूर्णानंद वर्मा — हास्य कहानी।", ["कहानी", "पात्र"]),
  ch("रुपया बोलता है!", "पांडेय बेचन शर्मा 'उग्र' — व्यंग्य निबंध।", ["निबंध"]),
  ch("पिछड़ा आदमी", "सर्वेश्वर दयाल सक्सेना — समाज पर कविता।", ["कविता"]),
  ch("महात्मा गाँधी", "सत्यकाम विद्यालंकार — जीवनी।", ["जीवनी"]),
  ch("ऐसा था नेपोलियन (पूरक)", "नेपोलियन बोनापार्ट का व्यक्तित्व।", ["पूरक वाचन"]),
  ch("आनंद के क्षण", "कन्हैयालाल मिश्र 'प्रभाकर' — निबंध।", ["निबंध"]),
  ch("जीवन संदेश", "रामनरेश त्रिपाठी — कविता।", ["कविता"]),
  ch("अपना-पराया", "जैनेंद्र — मार्मिक कहानी।", ["कहानी"]),
  ch("परिश्रम सफलता की कुंजी है (पूरक)", "श्रम के महत्त्व पर निबंध।", ["पूरक वाचन"]),
  ch("कर्नाटक कुलपुरोहित आलूर वेंकटराव", "गुरुनाथ जोशी — जीवनी।", ["जीवनी"]),
  ch("आओ नवनिर्माण करें", "बालकृष्ण शर्मा 'नवीन' — कविता।", ["कविता"]),
  ch("स्काउट (पूरक)", "स्काउट आंदोलन का परिचय।", ["पूरक वाचन"]),
  ch("सदाचार का तावीज़", "हरिशंकर परसाई — व्यंग्य कथा।", ["व्यंग्य"]),
  ch("एक कहानी यह भी", "मन्नू भंडारी — आत्मकथ्य।", ["आत्मकथ्य"]),
  ch("अक्कमहादेवी के वचन", "अनुवाद: नंदिनी गुंडुराव — प्राचीन वचन।", ["वचन साहित्य"]),
  ch("संत कवि रैदास (पूरक)", "रैदास का जीवन और भक्ति।", ["पूरक वाचन"]),
  ch("लोकगीत", "भगवत शरण उपाध्याय — निबंध।", ["निबंध"]),
  ch("समा बँध गया", "नगेंद्र भट्टाचार्य — यात्रा वृत्तांत।", ["यात्रा वृत्तांत"]),
  ch("सुबह उठा तो धूप खिली थी", "अज्ञेय — कविता।", ["कविता"]),
  ch("जो देखकर भी नहीं देखते (पूरक)", "दृष्टिकोण पर निबंध।", ["पूरक वाचन"]),
  ch("सच्चा धर्म", "सेठ गोविंददास — एकांकी।", ["एकांकी"]),
  ch("एक कुत्ता और एक मैना", "हजारी प्रसाद द्विवेदी — निबंध।", ["निबंध"]),
  ch("दोहे", "कबीर, बिहारी, वृंद, रहीम — प्राचीन दोहे।", ["दोहे"]),
];

// Hindi Third Language — KSEEB "Hindi Vallari" 2025-26 (Parts 1 + 2 combined)
const HINDI_TL: Chapter[] = [
  ch("मातृभूमि", "मातृभूमि पर कविता।", ["कविता"]),
  ch("कश्मीरी सेब", "मुंशी प्रेमचंद — कहानी।", ["कहानी"]),
  ch("गिल्लू", "महादेवी वर्मा — रेखाचित्र।", ["रेखाचित्र"]),
  ch("अभिनव मनुष्य", "आधुनिक मानव पर कविता।", ["कविता"]),
  ch("मेरा बचपन", "आत्मकथा अंश।", ["आत्मकथा"]),
  ch("बसंत की सच्चाई", "एकांकी।", ["एकांकी"]),
  ch("तुलसी के दोहे", "तुलसीदास — दोहे।", ["दोहा"]),
  ch("इंटरनेट क्रांति", "सूचना तकनीक पर निबंध।", ["निबंध"]),
  ch("ईमानदारों के सम्मेलन में", "व्यंग्य रचना।", ["व्यंग्य"]),
  ch("दुनिया में पहला मकान", "डॉ. विजया गुप्ता — लेख।", ["लेख"]),
  ch("समय की पहचान", "समय के मूल्य पर कविता।", ["कविता"]),
  ch("रोबोट", "विज्ञान कथा।", ["कहानी"]),
  ch("महिला की साहसगाथा", "व्यक्ति परिचय।", ["जीवनी"]),
  ch("सूर-श्याम", "सूरदास — कृष्ण भक्ति पद।", ["पद"]),
  ch("कर्नाटक संपदा", "कर्नाटक की विरासत — निबंध।", ["निबंध"]),
  ch("बाल-शक्ति", "लघु नाटिका।", ["नाटिका"]),
  ch("कोशिश करनेवालों की हार नहीं होती", "हरिवंशराय बच्चन — प्रेरक कविता।", ["कविता"]),
];

// Sanskrit First Language — "Samskrutha Nandini-3" KTBS 2025-26 (Parts 1 + 2 combined)
const SANSKRIT_FL: Chapter[] = [
  ch("उपनिषद्वचनम्", "वेदान्तवाणी — उपनिषद् से चयनित श्लोक।", ["श्लोक", "वेदान्त"]),
  ch("त्यागधनः", "नीतिकथा — त्याग का महत्त्व।", ["नीतिकथा"]),
  ch("विसर्गसन्धिः", "व्याकरण — विसर्ग सन्धि के नियम।", ["व्याकरण"]),
  ch("भारतीयविज्ञानम्", "सम्भाषणम् — प्राचीन भारतीय विज्ञान।", ["सम्भाषण"]),
  ch("ज्ञानदीपः", "व्यक्तिपरिचयः — ज्ञानपीठ पुरस्कार विजेता।", ["जीवनी"]),
  ch("समासः", "व्याकरण — समास के प्रकार।", ["व्याकरण"]),
  ch("अभयदायिनी", "आधुनिक नाटक — वीरनारी।", ["नाटक"]),
  ch("कृदन्तः", "गद्यांश एवं कृदन्त प्रत्यय।", ["व्याकरण"]),
  ch("भारतेः महिमा", "भारत की महिमा पर रचना।", ["गद्य"]),
  ch("अलङ्कारः 1-2", "अलङ्कार — परिभाषा एवं प्रकार।", ["व्याकरण"]),
  ch("सुभाषितानि (कण्ठपाठः)", "नीतिपूर्ण सुभाषित — कण्ठस्थ करणीय।", ["सुभाषित"]),
  ch("छन्दः", "छन्द शास्त्र का परिचय।", ["व्याकरण"]),
  ch("पत्रलेखनम्", "संस्कृत में पत्र-लेखन।", ["लेखन"]),
  ch("प्रबन्धः", "निबन्ध-लेखन।", ["लेखन"]),
  ch("विवेकोदयः", "विवेक का उदय — कथा।", ["कथा"]),
  ch("मन्थरा निर्ममथ", "रामायण से प्रसंग।", ["कथा"]),
  ch("प्रयोगः", "धातु-प्रयोग एवं रूप।", ["व्याकरण"]),
  ch("कर्णभारम्", "भास का प्रसिद्ध एकांकी नाटक।", ["नाटक"]),
  ch("भारतीयभावना", "देशभक्ति पद्य।", ["पद्य"]),
  ch("नाट्यांशाः", "नाट्यशास्त्र — रसों का परिचय।", ["नाट्यशास्त्र"]),
  ch("भीष्मोक्तयः", "महाभारत — भीष्म के उपदेश।", ["गद्य"]),
  ch("नगाधिराजः (पूरक)", "हिमालय पर रचना।", ["पूरक पाठ"]),
  ch("भगवान् रमणमहर्षिः (पूरक)", "रमण महर्षि का जीवन।", ["पूरक पाठ"]),
];

// Sanskrit Third Language — "Samskrutha Rashmi-5" KTBS 2025-26 (Parts 1 + 2 combined)
const SANSKRIT_TL: Chapter[] = [
  ch("प्रणतिः / प्रगतिः", "प्रार्थना पद्य — कण्ठपाठ।", ["पद्य"]),
  ch("अपूर्वमेला", "गद्य सम्भाषण — पुस्तक मेला।", ["सम्भाषण"]),
  ch("सन्धिः", "व्याकरण — सन्धि के नियम।", ["व्याकरण"]),
  ch("मिथ्याभिमानः", "गद्य — झूठे अभिमान की कथा।", ["कथा"]),
  ch("कृदन्तः", "व्याकरण — कृदन्त प्रत्यय।", ["व्याकरण"]),
  ch("जीवनयोगः", "गीता आधारित पद्य।", ["पद्य"]),
  ch("एकाग्रता", "एकाग्रता पर कथा।", ["कथा"]),
  ch("समासः", "समास का परिचय।", ["व्याकरण"]),
  ch("इन्दुः क्षीरनिधाविव", "उपमा अलङ्कार पद्य।", ["पद्य"]),
  ch("कारकम्", "कारक एवं विभक्ति।", ["व्याकरण"]),
  ch("अलङ्कारः", "अलङ्कार के प्रकार।", ["व्याकरण"]),
  ch("छन्दः", "छन्द का परिचय।", ["व्याकरण"]),
  ch("उभयभारती (पूरक)", "उभय-भारती का व्यक्ति परिचय।", ["पूरक पाठ"]),
  ch("यदुगिरिः", "गद्य — यदुगिरि क्षेत्र का वर्णन।", ["गद्य"]),
  ch("सूक्तिपीयूषम्", "पद्य — कण्ठपाठ करणीय सुभाषित।", ["पद्य"]),
  ch("मुद्राङ्गुलीयकम्", "चम्पू — कथा।", ["चम्पू"]),
  ch("सनातनी नो बध्नाति", "पद्य — सनातन मूल्य।", ["पद्य"]),
  ch("दाने सर्वं प्रतिष्ठितम्", "नाटक — दान का महत्त्व।", ["नाटक"]),
  ch("तद्धितः", "व्याकरण — तद्धित प्रत्यय।", ["व्याकरण"]),
  ch("अनुवादः", "व्याकरण — अनुवाद अभ्यास।", ["व्याकरण"]),
  ch("पत्राणि", "पत्र-लेखन।", ["लेखन"]),
  ch("प्रबन्धाः", "निबन्ध-लेखन।", ["लेखन"]),
  ch("विक्रमः वेतालश्च (पूरक)", "विक्रम-बेताल कथा।", ["पूरक पाठ"]),
];

const ELECTIVE_CH: Chapter[] = [
  ch("Introduction to Computer Applications", "Hardware, software, and networks.", ["Hardware", "OS basics"]),
  ch("Web Technologies", "HTML, CSS for the modern web.", ["HTML", "CSS"]),
  ch("Spreadsheets in Practice", "Formulas and charts.", ["Formulas", "Charts"]),
  ch("Cyber Safety", "Staying safe online.", ["Passwords", "Phishing"]),
];

// Map a chosen language id (from onboarding) to the matching chapter set.
function chaptersForLanguage(lang?: string): Chapter[] | null {
  switch (lang) {
    case "kannada": return KANNADA_SL;
    case "kannada-fl": return KANNADA_FL;
    case "hindi": return HINDI_CH;
    case "hindi-fl": return HINDI_FL;
    case "hindi-tl": return HINDI_TL;
    case "sanskrit": return SANSKRIT_TL;
    case "sanskrit-fl": return SANSKRIT_FL;
    case "sanskrit-tl": return SANSKRIT_TL;
    default: return null;
  }
}

function nameForLanguage(lang?: string, fallback = "Language"): string {
  if (!lang || lang === "none") return fallback;
  if (lang.startsWith("hindi")) return "Hindi";
  if (lang.startsWith("sanskrit")) return "Sanskrit";
  if (lang.startsWith("kannada")) return "Kannada";
  if (lang === "english") return "English";
  if (lang === "urdu") return "Urdu";
  return fallback;
}

function subjectForLanguage(
  lang: string | undefined,
  slot: "first-lang" | "second-lang" | "third-lang",
  board: Board,
  englishChapters: Chapter[],
): Subject | null {
  if (!lang || lang === "none") return null;
  let chapters: Chapter[];
  if (lang === "english") {
    chapters = englishChapters;
  } else {
    chapters = chaptersForLanguage(lang) ?? (board === "cbse" ? HINDI_CH : KANNADA_SL);
  }
  const isEnglish = lang === "english";
  return {
    id: slot,
    name: nameForLanguage(lang, "Language"),
    colorVar: isEnglish ? "subject-english" : "subject-language",
    iconKey: isEnglish ? "english" : "language",
    chapters,
  };
}

export function getSubjects(
  board: Board,
  _medium?: string,
  secondLang?: string,
  thirdLang?: string,
  firstLang?: string,
): Subject[] {
  const englishChapters = board === "cbse" ? ENGLISH_CBSE : ENGLISH_KSEEB;

  const subjects: Subject[] = [];
  const seen = new Set<string>();
  const addLang = (lang: string | undefined, slot: "first-lang" | "second-lang" | "third-lang") => {
    const subj = subjectForLanguage(lang, slot, board, englishChapters);
    if (!subj) return;
    const key = subj.name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    subjects.push(subj);
  };

  addLang(firstLang, "first-lang");
  addLang(secondLang, "second-lang");
  addLang(thirdLang, "third-lang");

  // Fallback: if user hasn't chosen any languages yet, show English as default.
  if (subjects.length === 0) {
    subjects.push({
      id: "english",
      name: "English",
      colorVar: "subject-english",
      iconKey: "english",
      chapters: englishChapters,
    });
  }

  subjects.push(
    { id: "math", name: "Mathematics", colorVar: "subject-math", iconKey: "math", chapters: COMMON_MATH },
    { id: "science", name: "Science", colorVar: "subject-science", iconKey: "science", chapters: COMMON_SCIENCE },
    { id: "social", name: "Social Science", colorVar: "subject-social", iconKey: "social", chapters: COMMON_SOCIAL },
    { id: "elective", name: "Elective (Computer Apps)", colorVar: "subject-elective", iconKey: "elective", chapters: ELECTIVE_CH },
  );
  return subjects;
}

// Expose datasets for any consumer that needs the raw chapter lists.
export const KANNADA_FIRST_LANGUAGE = KANNADA_FL;
export const HINDI_FIRST_LANGUAGE = HINDI_FL;
export const HINDI_THIRD_LANGUAGE = HINDI_TL;
export const SANSKRIT_FIRST_LANGUAGE = SANSKRIT_FL;
export const SANSKRIT_THIRD_LANGUAGE = SANSKRIT_TL;

export function getSubject(board: Board, id: string, secondLang?: string, thirdLang?: string, firstLang?: string): Subject | undefined {
  return getSubjects(board, undefined, secondLang, thirdLang, firstLang).find((s) => s.id === id);
}

