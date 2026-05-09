// Canonical Democracy Schools indicators, frameworks, crosswalk, and recommendations.
// This is the single source of truth used by seed.js and the in-memory store.

export const FRAMEWORKS = [
  { id: "WIDA",     name: "WIDA English Language Development Standards", shortName: "WIDA",     color: "#1565C0" },
  { id: "SEL",      name: "Illinois Social-Emotional Learning Standards",  shortName: "IL SEL",   color: "#2E7D32" },
  { id: "DANIELSON",name: "Danielson Framework for Teaching (FFT)",        shortName: "Danielson",color: "#6A1B9A" },
  { id: "ICLP",     name: "Illinois Comprehensive Literacy Plan",          shortName: "ICLP",     color: "#E65100" },
  { id: "EJC",      name: "Equity Journey Continuum",                      shortName: "EJC",      color: "#00695C" },
];

export const INDICATORS = [
  // Element 1 – Civic Knowledge & Understanding
  { id: "DS-1.1", element: 1, indicator: 1, title: "Constitutional Foundations",
    description: "Students demonstrate knowledge of constitutional principles, the Bill of Rights, and foundational democratic texts.",
    gradeBands: ["K-2","3-5","6-8","9-12"],
    evidenceTypes: ["Student Survey","School Audit","Student Outcome Data"] },

  { id: "DS-1.2", element: 1, indicator: 2, title: "Democratic Processes",
    description: "Students understand elections, legislative processes, and how policy is shaped at local, state, and federal levels.",
    gradeBands: ["3-5","6-8","9-12"],
    evidenceTypes: ["Student Survey","School Audit"] },

  { id: "DS-1.3", element: 1, indicator: 3, title: "Government Structure & Function",
    description: "Students can explain the roles and relationships among branches of government and compare systems across democracies.",
    gradeBands: ["6-8","9-12"],
    evidenceTypes: ["Student Survey","Student Outcome Data"] },

  { id: "DS-1.4", element: 1, indicator: 4, title: "Civil Rights & Liberties",
    description: "Students examine landmark civil rights movements, legal milestones, and ongoing equity challenges.",
    gradeBands: ["K-2","3-5","6-8","9-12"],
    evidenceTypes: ["Student Survey","School Audit","Administrative Data"] },

  // Element 2 – Civic Skills & Practices
  { id: "DS-2.1", element: 2, indicator: 1, title: "Critical Thinking & Analysis",
    description: "Students evaluate primary sources, weigh evidence, and construct reasoned arguments about civic issues.",
    gradeBands: ["3-5","6-8","9-12"],
    evidenceTypes: ["Student Survey","Staff Survey","Student Outcome Data"] },

  { id: "DS-2.2", element: 2, indicator: 2, title: "Deliberation & Discussion",
    description: "Students engage in structured academic controversy, Socratic seminars, and cross-perspective dialogue.",
    gradeBands: ["K-2","3-5","6-8","9-12"],
    evidenceTypes: ["Student Survey","Staff Survey","School Audit"] },

  { id: "DS-2.3", element: 2, indicator: 3, title: "Media Literacy",
    description: "Students identify bias, verify sources, and critically evaluate digital and traditional media for civic content.",
    gradeBands: ["3-5","6-8","9-12"],
    evidenceTypes: ["Student Survey","Staff Survey","School Audit"] },

  { id: "DS-2.4", element: 2, indicator: 4, title: "Direct Instruction in Civic Content",
    description: "Teachers deliver explicit, sequenced instruction in civic knowledge using high-leverage instructional strategies.",
    gradeBands: ["K-2","3-5","6-8","9-12"],
    evidenceTypes: ["Staff Survey","School Audit","Administrative Data"] },

  { id: "DS-2.5", element: 2, indicator: 5, title: "Research & Inquiry",
    description: "Students design and conduct civic inquiry projects using primary and secondary sources.",
    gradeBands: ["3-5","6-8","9-12"],
    evidenceTypes: ["Student Survey","Student Outcome Data"] },

  // Element 3 – Civic Action & Engagement
  { id: "DS-3.1", element: 3, indicator: 1, title: "Student Voice & Agency",
    description: "Students have authentic, structured opportunities to shape school policies, curriculum, and community decisions.",
    gradeBands: ["K-2","3-5","6-8","9-12"],
    evidenceTypes: ["Student Survey","Staff Survey","School Audit"] },

  { id: "DS-3.2", element: 3, indicator: 2, title: "School Governance Participation",
    description: "Students participate in student government, advisory councils, or other formal school decision-making bodies.",
    gradeBands: ["3-5","6-8","9-12"],
    evidenceTypes: ["Student Survey","Administrative Data","School Audit"] },

  { id: "DS-3.3", element: 3, indicator: 3, title: "Community Engagement",
    description: "Students connect classroom learning to community issues through structured partnerships with civic organizations.",
    gradeBands: ["K-2","3-5","6-8","9-12"],
    evidenceTypes: ["Student Survey","Staff Survey","Administrative Data"] },

  { id: "DS-3.4", element: 3, indicator: 4, title: "Democratic Action Projects",
    description: "Students plan, execute, and reflect on action civics projects addressing real community problems.",
    gradeBands: ["3-5","6-8","9-12"],
    evidenceTypes: ["Student Survey","Student Outcome Data","Administrative Data"] },

  { id: "DS-3.5", element: 3, indicator: 5, title: "Service Learning",
    description: "Students engage in reciprocal service-learning that integrates academic content with meaningful community contribution.",
    gradeBands: ["K-2","3-5","6-8","9-12"],
    evidenceTypes: ["Student Survey","Staff Survey","Administrative Data","Student Outcome Data"] },

  // Element 4 – Civic Culture & Environment
  { id: "DS-4.1", element: 4, indicator: 1, title: "Inclusive School Culture",
    description: "The school deliberately fosters a climate of belonging, safety, and cross-difference respect.",
    gradeBands: ["K-2","3-5","6-8","9-12"],
    evidenceTypes: ["Student Survey","Staff Survey","School Audit"] },

  { id: "DS-4.2", element: 4, indicator: 2, title: "Equity-Centered Practices",
    description: "Leaders and teachers analyze disaggregated data and implement targeted strategies to close civic opportunity gaps.",
    gradeBands: ["K-2","3-5","6-8","9-12"],
    evidenceTypes: ["Staff Survey","School Audit","Administrative Data"] },

  { id: "DS-4.3", element: 4, indicator: 3, title: "Family & Community Partnerships",
    description: "The school builds two-way partnerships with families and community members as civic co-educators.",
    gradeBands: ["K-2","3-5","6-8","9-12"],
    evidenceTypes: ["Student Survey","Staff Survey","Administrative Data"] },

  { id: "DS-4.4", element: 4, indicator: 4, title: "Culturally Responsive Civic Teaching",
    description: "Teachers draw on students' cultural assets and community contexts when teaching civic knowledge and skills.",
    gradeBands: ["K-2","3-5","6-8","9-12"],
    evidenceTypes: ["Staff Survey","School Audit","Student Survey"] },
];

export const MAPPINGS = [
  // DS-1.1 – Constitutional Foundations
  { dsIndicatorId:"DS-1.1", frameworkId:"WIDA",      frameworkCode:"ELD-2.1",   confidence:"medium", needsReview:false, rationale:"Civic discourse requires academic language; WIDA ELD standard 2 addresses language for social studies contexts." },
  { dsIndicatorId:"DS-1.1", frameworkId:"SEL",       frameworkCode:"SEL-1B.3a", confidence:"medium", needsReview:false, rationale:"Understanding rights and responsibilities maps to self-management and social awareness goals." },
  { dsIndicatorId:"DS-1.1", frameworkId:"DANIELSON", frameworkCode:"1a",        confidence:"high",   needsReview:false, rationale:"Demonstrating content knowledge of constitutional law directly reflects Danielson 1a: Knowledge of Content." },
  { dsIndicatorId:"DS-1.1", frameworkId:"ICLP",      frameworkCode:"ICLP-C3",   confidence:"medium", needsReview:false, rationale:"Comprehension of complex informational texts (founding documents) aligns with ICLP comprehension component." },
  { dsIndicatorId:"DS-1.1", frameworkId:"EJC",       frameworkCode:"EJC-2.1",   confidence:"low",    needsReview:true,  rationale:"REVIEW NEEDED – equity lens of constitutional history varies widely; alignment depends on instructional framing." },

  // DS-1.2 – Democratic Processes
  { dsIndicatorId:"DS-1.2", frameworkId:"WIDA",      frameworkCode:"ELD-2.3",   confidence:"medium", needsReview:false, rationale:"Language of argumentation and process description aligns with WIDA social studies language functions." },
  { dsIndicatorId:"DS-1.2", frameworkId:"SEL",       frameworkCode:"SEL-2A.4b", confidence:"high",   needsReview:false, rationale:"Understanding civic processes supports responsible decision-making (SEL goal 2A)." },
  { dsIndicatorId:"DS-1.2", frameworkId:"DANIELSON", frameworkCode:"1b",        confidence:"medium", needsReview:false, rationale:"Teachers must understand democratic processes to design authentic learning (Danielson 1b)." },

  // DS-1.4 – Civil Rights & Liberties
  { dsIndicatorId:"DS-1.4", frameworkId:"EJC",       frameworkCode:"EJC-3.2",   confidence:"high",   needsReview:false, rationale:"Civil rights history is foundational to equity journey continuum work." },
  { dsIndicatorId:"DS-1.4", frameworkId:"SEL",       frameworkCode:"SEL-2B.4a", confidence:"high",   needsReview:false, rationale:"Recognizing others' rights and perspectives maps directly to social awareness standards." },
  { dsIndicatorId:"DS-1.4", frameworkId:"ICLP",      frameworkCode:"ICLP-V2",   confidence:"medium", needsReview:false, rationale:"Civil rights vocabulary is essential academic language targeted by ICLP vocabulary component." },

  // DS-2.1 – Critical Thinking & Analysis
  { dsIndicatorId:"DS-2.1", frameworkId:"WIDA",      frameworkCode:"ELD-3.1",   confidence:"high",   needsReview:false, rationale:"Evaluating evidence requires language functions WIDA categorizes under argumentation." },
  { dsIndicatorId:"DS-2.1", frameworkId:"ICLP",      frameworkCode:"ICLP-C2",   confidence:"high",   needsReview:false, rationale:"Comprehension strategies (inference, synthesis) are explicitly targeted in ICLP Section 2." },
  { dsIndicatorId:"DS-2.1", frameworkId:"DANIELSON", frameworkCode:"3b",        confidence:"high",   needsReview:false, rationale:"Questioning and discussion techniques (Danielson 3b) are the instructional vehicle for civic analysis." },

  // DS-2.2 – Deliberation & Discussion
  { dsIndicatorId:"DS-2.2", frameworkId:"SEL",       frameworkCode:"SEL-2B.3a", confidence:"high",   needsReview:false, rationale:"Cross-perspective dialogue is the operational definition of SEL social awareness in action." },
  { dsIndicatorId:"DS-2.2", frameworkId:"DANIELSON", frameworkCode:"3b",        confidence:"high",   needsReview:false, rationale:"Structured discussion is core to Danielson 3b: Questioning and Discussion Techniques." },
  { dsIndicatorId:"DS-2.2", frameworkId:"WIDA",      frameworkCode:"ELD-1.1",   confidence:"high",   needsReview:false, rationale:"Oral deliberation requires the academic oral language functions described in WIDA standard 1." },
  { dsIndicatorId:"DS-2.2", frameworkId:"ICLP",      frameworkCode:"ICLP-O1",   confidence:"high",   needsReview:false, rationale:"Oracy (oral language) is the first ICLP component; deliberation is its civic application." },

  // DS-2.3 – Media Literacy
  { dsIndicatorId:"DS-2.3", frameworkId:"ICLP",      frameworkCode:"ICLP-C4",   confidence:"high",   needsReview:false, rationale:"Evaluating digital and print sources maps directly to ICLP comprehension strategies." },
  { dsIndicatorId:"DS-2.3", frameworkId:"WIDA",      frameworkCode:"ELD-3.2",   confidence:"medium", needsReview:false, rationale:"Interpreting media requires the language of analysis and evaluation (WIDA ELD standard 3)." },
  { dsIndicatorId:"DS-2.3", frameworkId:"SEL",       frameworkCode:"SEL-1A.4a", confidence:"medium", needsReview:false, rationale:"Media literacy supports self-awareness and critical consumption (SEL 1A)." },
  { dsIndicatorId:"DS-2.3", frameworkId:"EJC",       frameworkCode:"EJC-2.3",   confidence:"high",   needsReview:false, rationale:"Recognizing bias in media is central to equity journey continuum work on systemic awareness." },
  { dsIndicatorId:"DS-2.3", frameworkId:"DANIELSON", frameworkCode:"1c",        confidence:"medium", needsReview:false, rationale:"Selecting appropriate digital resources reflects Danielson 1c: Setting Instructional Outcomes." },

  // DS-2.4 – Direct Instruction in Civic Content
  { dsIndicatorId:"DS-2.4", frameworkId:"DANIELSON", frameworkCode:"3c",        confidence:"high",   needsReview:false, rationale:"Explicit, sequenced civic instruction directly corresponds to Danielson 3c: Engaging Students in Learning." },
  { dsIndicatorId:"DS-2.4", frameworkId:"ICLP",      frameworkCode:"ICLP-WR1",  confidence:"high",   needsReview:false, rationale:"Direct instruction in word recognition and fluency is explicitly named in ICLP components 3-4." },
  { dsIndicatorId:"DS-2.4", frameworkId:"WIDA",      frameworkCode:"ELD-4.1",   confidence:"medium", needsReview:false, rationale:"Structured language instruction for ELL students aligns with WIDA ELD standard 4." },
  { dsIndicatorId:"DS-2.4", frameworkId:"SEL",       frameworkCode:"SEL-3A.4a", confidence:"low",    needsReview:true,  rationale:"REVIEW NEEDED – direct instruction alignment with SEL responsible decision-making is indirect." },

  // DS-2.5 – Research & Inquiry
  { dsIndicatorId:"DS-2.5", frameworkId:"ICLP",      frameworkCode:"ICLP-W2",   confidence:"high",   needsReview:false, rationale:"Writing for inquiry (ICLP writing component) directly mirrors the research and inquiry process." },
  { dsIndicatorId:"DS-2.5", frameworkId:"DANIELSON", frameworkCode:"1e",        confidence:"high",   needsReview:false, rationale:"Designing inquiry-based learning reflects Danielson 1e: Designing Coherent Instruction." },
  { dsIndicatorId:"DS-2.5", frameworkId:"WIDA",      frameworkCode:"ELD-3.3",   confidence:"medium", needsReview:false, rationale:"Academic research requires language functions in WIDA standard 3 (interpretive mode)." },

  // DS-3.1 – Student Voice & Agency
  { dsIndicatorId:"DS-3.1", frameworkId:"SEL",       frameworkCode:"SEL-1B.4a", confidence:"high",   needsReview:false, rationale:"Student agency is the operational outcome of SEL self-management standards." },
  { dsIndicatorId:"DS-3.1", frameworkId:"EJC",       frameworkCode:"EJC-4.1",   confidence:"high",   needsReview:false, rationale:"Student voice is a primary indicator in EJC equity domain 4 (shared power)." },
  { dsIndicatorId:"DS-3.1", frameworkId:"DANIELSON", frameworkCode:"3d",        confidence:"medium", needsReview:false, rationale:"Student engagement and agency map to Danielson 3d: Using Assessment in Instruction." },

  // DS-3.3 – Community Engagement
  { dsIndicatorId:"DS-3.3", frameworkId:"EJC",       frameworkCode:"EJC-4.3",   confidence:"high",   needsReview:false, rationale:"Community partnerships are explicit in EJC domain 4 (belonging and community)." },
  { dsIndicatorId:"DS-3.3", frameworkId:"SEL",       frameworkCode:"SEL-2C.4b", confidence:"high",   needsReview:false, rationale:"Relationship skills with community organizations directly maps to SEL standard 2C." },

  // DS-3.5 – Service Learning
  { dsIndicatorId:"DS-3.5", frameworkId:"DANIELSON", frameworkCode:"4c",        confidence:"high",   needsReview:false, rationale:"Service learning involves communicating with families and community (Danielson 4c)." },
  { dsIndicatorId:"DS-3.5", frameworkId:"SEL",       frameworkCode:"SEL-3B.4a", confidence:"high",   needsReview:false, rationale:"Service learning is the civic application of responsible decision-making and prosocial behavior (SEL 3B)." },
  { dsIndicatorId:"DS-3.5", frameworkId:"EJC",       frameworkCode:"EJC-4.4",   confidence:"high",   needsReview:false, rationale:"Reciprocal service with community reflects EJC's community co-creation principle." },
  { dsIndicatorId:"DS-3.5", frameworkId:"ICLP",      frameworkCode:"ICLP-W3",   confidence:"medium", needsReview:false, rationale:"Service learning projects require persuasive and expository writing targeted by ICLP component 7." },
  { dsIndicatorId:"DS-3.5", frameworkId:"WIDA",      frameworkCode:"ELD-2.2",   confidence:"medium", needsReview:false, rationale:"Community engagement contexts provide authentic oral language use aligned with WIDA standard 2." },

  // DS-4.1 – Inclusive School Culture
  { dsIndicatorId:"DS-4.1", frameworkId:"EJC",       frameworkCode:"EJC-1.1",   confidence:"high",   needsReview:false, rationale:"Belonging and inclusive culture is the foundational domain (1) of the Equity Journey Continuum." },
  { dsIndicatorId:"DS-4.1", frameworkId:"SEL",       frameworkCode:"SEL-2B.3b", confidence:"high",   needsReview:false, rationale:"Inclusive culture operationalizes SEL social awareness at the school-systems level." },
  { dsIndicatorId:"DS-4.1", frameworkId:"DANIELSON", frameworkCode:"2a",        confidence:"high",   needsReview:false, rationale:"Creating an environment of respect and rapport is Danielson domain 2a." },

  // DS-4.2 – Equity-Centered Practices
  { dsIndicatorId:"DS-4.2", frameworkId:"EJC",       frameworkCode:"EJC-3.1",   confidence:"high",   needsReview:false, rationale:"Using disaggregated data for equity action is central to EJC domain 3 (equitable systems)." },
  { dsIndicatorId:"DS-4.2", frameworkId:"ICLP",      frameworkCode:"ICLP-EQ1",  confidence:"high",   needsReview:false, rationale:"ICLP Section 5 explicitly requires equity-centered data analysis for literacy improvement." },
  { dsIndicatorId:"DS-4.2", frameworkId:"DANIELSON", frameworkCode:"4e",        confidence:"medium", needsReview:false, rationale:"Growing and developing professionally includes equity-focused professional learning (Danielson 4e)." },

  // DS-4.4 – Culturally Responsive Civic Teaching
  { dsIndicatorId:"DS-4.4", frameworkId:"WIDA",      frameworkCode:"ELD-1.3",   confidence:"high",   needsReview:false, rationale:"WIDA emphasizes drawing on students' home language assets; culturally responsive teaching is essential." },
  { dsIndicatorId:"DS-4.4", frameworkId:"EJC",       frameworkCode:"EJC-2.2",   confidence:"high",   needsReview:false, rationale:"Culturally responsive practice is explicitly named in EJC domain 2 (identity and culture)." },
  { dsIndicatorId:"DS-4.4", frameworkId:"ICLP",      frameworkCode:"ICLP-EQ2",  confidence:"high",   needsReview:false, rationale:"ICLP requires contextualization of literacy instruction to students' cultural and linguistic backgrounds." },
];

export const RECOMMENDATIONS = [
  { id:"rec-001", dsIndicatorId:"DS-2.3", title:"Digital Literacy/Source Evaluation",
    description:"SIFT (Stop, Investigate, Find, Trace) method resources for teaching media verification across grade bands.",
    resourceUrl:"https://cor.stanford.edu/curriculum/collections/sift-the-four-moves",
    tags:["media","digital","source evaluation"] },

  { id:"rec-002", dsIndicatorId:"DS-2.3", title:"News Literacy Project – Checkology",
    description:"Free platform with lessons for evaluating news and information in civic contexts.",
    resourceUrl:"https://get.checkology.org/",
    tags:["media","news literacy","digital"] },

  { id:"rec-003", dsIndicatorId:"DS-2.2", title:"Structured Academic Controversy Protocol",
    description:"Step-by-step protocol for facilitating productive disagreement using primary sources.",
    resourceUrl:"https://www.facing.org/classroom-resources/structured-academic-controversy/",
    tags:["deliberation","discussion","protocol"] },

  { id:"rec-004", dsIndicatorId:"DS-3.5", title:"National Youth Leadership Council – Service Learning Standards",
    description:"K-12 service learning quality indicators, rubrics, and implementation guides.",
    resourceUrl:"https://nylc.org/service-learning/",
    tags:["service learning","community","action"] },

  { id:"rec-005", dsIndicatorId:"DS-3.4", title:"Action Civics Collaborative Framework",
    description:"Project-based civic action framework with portfolio rubrics aligned to grade bands.",
    resourceUrl:"https://www.actioncivicscollaborative.org/",
    tags:["action civics","project-based","democracy"] },

  { id:"rec-006", dsIndicatorId:"DS-2.1", title:"Civic Online Reasoning (Stanford)",
    description:"Free lateral reading and fact-checking curriculum for grades 6-12.",
    resourceUrl:"https://cor.stanford.edu/",
    tags:["critical thinking","evidence","online"] },

  { id:"rec-007", dsIndicatorId:"DS-4.2", title:"Equity Audit Toolkit (ISBE)",
    description:"Illinois State Board of Education equity audit tools for disaggregated data analysis.",
    resourceUrl:"https://www.isbe.net/Pages/Equity.aspx",
    tags:["equity","data","audit"] },

  { id:"rec-008", dsIndicatorId:"DS-4.4", title:"Culturally Responsive Teaching & the Brain",
    description:"Professional learning resources based on Zaretta Hammond's framework for culturally responsive instruction.",
    resourceUrl:"https://crtandthebrain.com/",
    tags:["culturally responsive","professional learning","equity"] },

  { id:"rec-009", dsIndicatorId:"DS-2.4", title:"iCivics – Direct Instruction Games & Lessons",
    description:"Standards-aligned civic content games and teacher-directed lesson modules.",
    resourceUrl:"https://www.icivics.org/",
    tags:["direct instruction","civic content","games"] },

  { id:"rec-010", dsIndicatorId:"DS-1.1", title:"Annenberg Classroom – Constitutional Resources",
    description:"Free primary source documents, videos, and discussion guides for teaching constitutional foundations.",
    resourceUrl:"https://www.annenbergclassroom.org/",
    tags:["constitution","primary sources","knowledge"] },

  { id:"rec-011", dsIndicatorId:"DS-3.1", title:"Student Voice Toolkit (Tufts CIRCLE)",
    description:"Research-based tools for creating authentic student voice and agency structures.",
    resourceUrl:"https://circle.tufts.edu/",
    tags:["student voice","agency","participation"] },

  { id:"rec-012", dsIndicatorId:"DS-4.1", title:"Restorative Practices Implementation Guide",
    description:"School-level guide for building inclusive culture through restorative community-building circles.",
    resourceUrl:"https://www.iirp.edu/restorative-practices/what-is-restorative-practices",
    tags:["inclusive culture","restorative","community"] },
];

export const SAMPLE_PERFORMANCE = [
  { id:"p-001", schoolId:"school-demo", dsIndicatorId:"DS-1.1", score:3, level:"medium", gradeBand:"6-8",  schoolYear:"2024-25", evidenceType:"Student Survey" },
  { id:"p-002", schoolId:"school-demo", dsIndicatorId:"DS-1.2", score:3, level:"medium", gradeBand:"6-8",  schoolYear:"2024-25", evidenceType:"School Audit" },
  { id:"p-003", schoolId:"school-demo", dsIndicatorId:"DS-2.1", score:4, level:"high",   gradeBand:"9-12", schoolYear:"2024-25", evidenceType:"Student Outcome Data" },
  { id:"p-004", schoolId:"school-demo", dsIndicatorId:"DS-2.2", score:4, level:"high",   gradeBand:"6-8",  schoolYear:"2024-25", evidenceType:"Student Survey" },
  { id:"p-005", schoolId:"school-demo", dsIndicatorId:"DS-2.3", score:1, level:"low",    gradeBand:"6-8",  schoolYear:"2024-25", evidenceType:"Staff Survey" },
  { id:"p-006", schoolId:"school-demo", dsIndicatorId:"DS-2.4", score:2, level:"low",    gradeBand:"3-5",  schoolYear:"2024-25", evidenceType:"School Audit" },
  { id:"p-007", schoolId:"school-demo", dsIndicatorId:"DS-3.1", score:3, level:"medium", gradeBand:"9-12", schoolYear:"2024-25", evidenceType:"Student Survey" },
  { id:"p-008", schoolId:"school-demo", dsIndicatorId:"DS-3.5", score:4, level:"high",   gradeBand:"9-12", schoolYear:"2024-25", evidenceType:"Administrative Data" },
  { id:"p-009", schoolId:"school-demo", dsIndicatorId:"DS-4.1", score:3, level:"medium", gradeBand:"K-2",  schoolYear:"2024-25", evidenceType:"Student Survey" },
  { id:"p-010", schoolId:"school-demo", dsIndicatorId:"DS-4.2", score:2, level:"low",    gradeBand:"K-2",  schoolYear:"2024-25", evidenceType:"Administrative Data" },
  { id:"p-011", schoolId:"school-demo", dsIndicatorId:"DS-4.4", score:4, level:"high",   gradeBand:"3-5",  schoolYear:"2024-25", evidenceType:"Staff Survey" },
];
