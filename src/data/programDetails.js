/**
 * Authentic Academic & Career Enrichment for all 44 LPU Degree Programmes
 * Provides Semester 1 course subjects, career tracks, and official NIRF / Accreditation badges.
 */

export const PROGRAM_ENRICHMENT = {
  // --- Computer Science & AI ---
  'btech-cse': {
    nirfBadge: 'NIRF Rank #50 (Engineering) • NAAC A++',
    careerTracks: ['Full Stack Architect', 'Cloud Systems Engineer', 'Software Development Engineer (SDE)'],
    semester1Subjects: [
      { code: 'CSE101', name: 'Programming in C & Problem Solving', credits: 4, type: 'Core' },
      { code: 'CSE111', name: 'Programming Laboratory', credits: 1, type: 'Lab' },
      { code: 'MTH165', name: 'Mathematics for Engineers - I', credits: 4, type: 'Core' },
      { code: 'PHY110', name: 'Engineering Physics', credits: 3, type: 'Core' },
      { code: 'ECE131', name: 'Basic Electrical & Electronics Engg', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Corporate & Technical Communication', credits: 2, type: 'Skill' },
    ],
  },
  'btech-aiml': {
    nirfBadge: 'NIRF Rank #50 • Top 3 AI Innovation Center',
    careerTracks: ['AI/ML Research Scientist', 'Deep Learning Engineer', 'Applied GenAI Architect'],
    semester1Subjects: [
      { code: 'CSE101', name: 'Programming in Python & C', credits: 4, type: 'Core' },
      { code: 'CSE111', name: 'Algorithmic Problem Solving Lab', credits: 1, type: 'Lab' },
      { code: 'MTH165', name: 'Linear Algebra & Calculus for AI', credits: 4, type: 'Core' },
      { code: 'PHY110', name: 'Quantum Optics & Semiconductor Physics', credits: 3, type: 'Core' },
      { code: 'ECE131', name: 'Digital Logic & Circuit Theory', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Critical Thinking & Technical Writing', credits: 2, type: 'Skill' },
    ],
  },
  'btech-ds': {
    nirfBadge: 'NIRF Rank #50 • Big Data Analytics Hub',
    careerTracks: ['Big Data Engineer', 'Data Science Specialist', 'Quantitative Data Analyst'],
    semester1Subjects: [
      { code: 'CSE101', name: 'Python for Data Computing', credits: 4, type: 'Core' },
      { code: 'CSE111', name: 'Data Structures Foundations Lab', credits: 1, type: 'Lab' },
      { code: 'MTH165', name: 'Multivariate Calculus & Statistics', credits: 4, type: 'Core' },
      { code: 'PHY110', name: 'Engineering Physics & Sensors', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Communication & Data Storytelling', credits: 2, type: 'Skill' },
    ],
  },
  'btech-cyber': {
    nirfBadge: 'NIRF Rank #50 • Cyber Defense Center of Excellence',
    careerTracks: ['Ethical Hacker & Pen-Tester', 'Security Operations Analyst', 'Cryptographic Engineer'],
    semester1Subjects: [
      { code: 'CSE101', name: 'C Programming & System Internals', credits: 4, type: 'Core' },
      { code: 'CSE111', name: 'Linux System & Scripting Lab', credits: 1, type: 'Lab' },
      { code: 'MTH165', name: 'Discrete Math & Number Theory', credits: 4, type: 'Core' },
      { code: 'PHY110', name: 'Applied Physics & Electromagnetics', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Corporate Communication', credits: 2, type: 'Skill' },
    ],
  },
  'btech-cloud': {
    nirfBadge: 'NIRF Rank #50 • AWS & GCP Cloud Academy',
    careerTracks: ['Cloud Solutions Architect', 'DevOps & Site Reliability Engineer', 'Cloud Security Specialist'],
    semester1Subjects: [
      { code: 'CSE101', name: 'Programming Fundamentals', credits: 4, type: 'Core' },
      { code: 'CSE111', name: 'Virtualization & Linux Lab', credits: 1, type: 'Lab' },
      { code: 'MTH165', name: 'Calculus and Linear Algebra', credits: 4, type: 'Core' },
      { code: 'ECE131', name: 'Computer Systems Foundations', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Technical Presentation Skills', credits: 2, type: 'Skill' },
    ],
  },
  'btech-fullstack': {
    nirfBadge: 'NIRF Rank #50 • Industry Capstone Track',
    careerTracks: ['MERN/MEAN Full Stack Developer', 'Frontend Engineer', 'Backend Microservices Developer'],
    semester1Subjects: [
      { code: 'CSE101', name: 'Computer Programming & Web Basics', credits: 4, type: 'Core' },
      { code: 'CSE111', name: 'Web Prototyping Laboratory', credits: 1, type: 'Lab' },
      { code: 'MTH165', name: 'Applied Engineering Mathematics', credits: 4, type: 'Core' },
      { code: 'ECE131', name: 'Digital Logic & Architecture', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Executive Soft Skills', credits: 2, type: 'Skill' },
    ],
  },
  'btech-spe': {
    nirfBadge: 'NIRF Rank #50 • Product Design Incubator',
    careerTracks: ['Software Product Manager', 'Product Engineering Lead', 'Agile Tech Specialist'],
    semester1Subjects: [
      { code: 'CSE101', name: 'Algorithms & Computational Thinking', credits: 4, type: 'Core' },
      { code: 'CSE111', name: 'Product Coding Lab', credits: 1, type: 'Lab' },
      { code: 'MTH165', name: 'Mathematics for Systems', credits: 4, type: 'Core' },
      { code: 'PEL121', name: 'Design Thinking & Communication', credits: 2, type: 'Skill' },
    ],
  },
  'btech-iot': {
    nirfBadge: 'NIRF Rank #50 • Smart Sensors & Embedded Lab',
    careerTracks: ['IoT Hardware Engineer', 'Embedded Systems Firmware Developer', 'Smart Robotics Integrator'],
    semester1Subjects: [
      { code: 'CSE101', name: 'Structured Programming in C', credits: 4, type: 'Core' },
      { code: 'ECE131', name: 'Sensors & Circuit Design', credits: 3, type: 'Core' },
      { code: 'ECE139', name: 'IoT Hardware Prototyping Lab', credits: 1, type: 'Lab' },
      { code: 'MTH165', name: 'Calculus and Differential Equations', credits: 4, type: 'Core' },
      { code: 'PEL121', name: 'Professional English', credits: 2, type: 'Skill' },
    ],
  },
  'btech-devops': {
    nirfBadge: 'NIRF Rank #50 • Enterprise CI/CD Cloud Lab',
    careerTracks: ['DevOps Pipeline Engineer', 'Kubernetes Cluster Admin', 'Infrastructure Automation Lead'],
    semester1Subjects: [
      { code: 'CSE101', name: 'System Programming & Automation', credits: 4, type: 'Core' },
      { code: 'CSE111', name: 'Shell Scripting & Git Lab', credits: 1, type: 'Lab' },
      { code: 'MTH165', name: 'Mathematical Modeling', credits: 4, type: 'Core' },
      { code: 'PEL121', name: 'Technical Communication', credits: 2, type: 'Skill' },
    ],
  },
  'btech-cse-hons': {
    nirfBadge: 'NIRF Rank #50 • Elite Honors Research Track',
    careerTracks: ['Chief Technology Officer Track', 'Advanced Systems Architect', 'R&D Computer Scientist'],
    semester1Subjects: [
      { code: 'CSE101H', name: 'Advanced Computational Theory & C++', credits: 4, type: 'Core' },
      { code: 'CSE111H', name: 'Competitive Coding & Algorithmic Lab', credits: 2, type: 'Lab' },
      { code: 'MTH165H', name: 'Rigorous Mathematical Analysis', credits: 4, type: 'Core' },
      { code: 'PHY110', name: 'Quantum Information & Physics', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Research Paper Writing & Communication', credits: 2, type: 'Skill' },
    ],
  },

  // --- Core Engineering ---
  'btech-ece': {
    nirfBadge: 'NIRF Rank #50 • VLSI & 5G Telecommunications Hub',
    careerTracks: ['VLSI Design Engineer', '5G Telecom System Engineer', 'Embedded Hardware Developer'],
    semester1Subjects: [
      { code: 'ECE131', name: 'Network Analysis & Synthesis', credits: 4, type: 'Core' },
      { code: 'ECE139', name: 'Circuits & Devices Laboratory', credits: 1, type: 'Lab' },
      { code: 'MTH165', name: 'Engineering Mathematics - I', credits: 4, type: 'Core' },
      { code: 'PHY110', name: 'Semiconductor Physics', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Technical English', credits: 2, type: 'Skill' },
    ],
  },
  'btech-me': {
    nirfBadge: 'NIRF Rank #50 • Advanced CAD/CAM & Robotics Hub',
    careerTracks: ['Automotive Design Engineer', 'Robotics Automation Engineer', 'Thermal & Fluid Dynamics Analyst'],
    semester1Subjects: [
      { code: 'MEC101', name: 'Engineering Mechanics', credits: 4, type: 'Core' },
      { code: 'MEC107', name: 'Digital Graphics & Prototyping Lab', credits: 2, type: 'Lab' },
      { code: 'MTH165', name: 'Calculus for Mechanical Systems', credits: 4, type: 'Core' },
      { code: 'CHE110', name: 'Materials Science & Chemistry', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Technical Communication', credits: 2, type: 'Skill' },
    ],
  },
  'btech-civil': {
    nirfBadge: 'NIRF Rank #50 • Smart City & BIM Modeling Labs',
    careerTracks: ['Structural Design Engineer', 'BIM Project Specialist', 'Urban Infrastructure Consultant'],
    semester1Subjects: [
      { code: 'CIV101', name: 'Building Materials & Construction', credits: 4, type: 'Core' },
      { code: 'CIV108', name: 'Computer Aided Drafting (CAD) Lab', credits: 2, type: 'Lab' },
      { code: 'MTH165', name: 'Applied Mathematics - I', credits: 4, type: 'Core' },
      { code: 'PHY110', name: 'Engineering Geophysics', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Executive Soft Skills', credits: 2, type: 'Skill' },
    ],
  },
  'btech-aero': {
    nirfBadge: 'NIRF Rank #50 • Subsonic Wind Tunnel & Drone Testing Facility',
    careerTracks: ['Aerodynamic Flight Analyst', 'Avionics System Engineer', 'UAV / Drone Design Engineer'],
    semester1Subjects: [
      { code: 'AER101', name: 'Introduction to Aeronautics & Astronautics', credits: 4, type: 'Core' },
      { code: 'AER105', name: 'Aerodynamics Simulation Lab', credits: 1, type: 'Lab' },
      { code: 'MTH165', name: 'Vector Calculus & Fluid Dynamics Math', credits: 4, type: 'Core' },
      { code: 'PHY110', name: 'Thermodynamics & Classical Mechanics', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Aviation English & Documentation', credits: 2, type: 'Skill' },
    ],
  },
  'btech-biotech': {
    nirfBadge: 'NIRF Rank #50 • BSL-2 Cell Culture & Bioprocess Labs',
    careerTracks: ['Bioinformatics Specialist', 'Bioprocess Quality Assurance Engineer', 'Genetic Testing Analyst'],
    semester1Subjects: [
      { code: 'BIO101', name: 'Biochemistry & Molecular Cell Biology', credits: 4, type: 'Core' },
      { code: 'BIO105', name: 'Biochemical Analysis Laboratory', credits: 1, type: 'Lab' },
      { code: 'MTH165', name: 'Biostatistics & Mathematical Foundations', credits: 4, type: 'Core' },
      { code: 'CHE110', name: 'Organic & Analytical Chemistry', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Scientific Communication', credits: 2, type: 'Skill' },
    ],
  },
  'btech-ee': {
    nirfBadge: 'NIRF Rank #50 • Renewable Energy & Power Grid Labs',
    careerTracks: ['Power Grid Automation Engineer', 'EV Powertrain Specialist', 'Renewable Energy Consultant'],
    semester1Subjects: [
      { code: 'ELE101', name: 'Electric Circuit Theory & Analysis', credits: 4, type: 'Core' },
      { code: 'ELE105', name: 'Electrical Machines Laboratory', credits: 1, type: 'Lab' },
      { code: 'MTH165', name: 'Differential Equations & Transforms', credits: 4, type: 'Core' },
      { code: 'PHY110', name: 'Electromagnetics & Optics', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Technical Communication', credits: 2, type: 'Skill' },
    ],
  },
  'btech-auto': {
    nirfBadge: 'NIRF Rank #50 • SAE Formula Racing Track & Chassis Lab',
    careerTracks: ['Electric Vehicle Battery Architect', 'Chassis Dynamics Engineer', 'Automotive Safety Tester'],
    semester1Subjects: [
      { code: 'AUT101', name: 'Automotive Engine & Powertrain Principles', credits: 4, type: 'Core' },
      { code: 'AUT105', name: 'Automotive CAD Simulation Lab', credits: 2, type: 'Lab' },
      { code: 'MTH165', name: 'Applied Mathematics - I', credits: 4, type: 'Core' },
      { code: 'MEC101', name: 'Kinematics & Machine Dynamics', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Industry Communication Skills', credits: 2, type: 'Skill' },
    ],
  },
  'btech-che': {
    nirfBadge: 'NIRF Rank #50 • Petrochemical & Polymer Pilot Plants',
    careerTracks: ['Process Optimization Engineer', 'Petrochemical Plant Manager', 'Safety & Environmental Officer'],
    semester1Subjects: [
      { code: 'CHE101', name: 'Chemical Process Calculations', credits: 4, type: 'Core' },
      { code: 'CHE105', name: 'Chemical Engineering Practicum Lab', credits: 1, type: 'Lab' },
      { code: 'MTH165', name: 'Multivariate Calculus', credits: 4, type: 'Core' },
      { code: 'CHE110', name: 'Physical Chemistry', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Corporate Communication', credits: 2, type: 'Skill' },
    ],
  },

  // --- Computer Applications ---
  'bca': {
    nirfBadge: 'Top 10 in India for Computer Applications (India Today)',
    careerTracks: ['Web Application Developer', 'Database Administrator', 'Cloud DevOps Support Engineer'],
    semester1Subjects: [
      { code: 'CAP101', name: 'Computer Programming in C', credits: 4, type: 'Core' },
      { code: 'CAP102', name: 'Programming Lab in C', credits: 1, type: 'Lab' },
      { code: 'CAP103', name: 'Digital Electronics & Logic', credits: 3, type: 'Core' },
      { code: 'MTH104', name: 'Mathematical Foundations for Computing', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Communication & Verbal Aptitude', credits: 2, type: 'Skill' },
    ],
  },
  'bca-hons': {
    nirfBadge: 'Premier Software Development Track',
    careerTracks: ['Enterprise Software Engineer', 'Cloud Microservices Architect', 'Cyber Defense Analyst'],
    semester1Subjects: [
      { code: 'CAP101H', name: 'Programming in Python & C++', credits: 4, type: 'Core' },
      { code: 'CAP102H', name: 'Full Stack Coding Lab', credits: 2, type: 'Lab' },
      { code: 'MTH104H', name: 'Discrete Math for Software Engineering', credits: 4, type: 'Core' },
      { code: 'PEL121', name: 'Professional Presentation Skills', credits: 2, type: 'Skill' },
    ],
  },
  'mca': {
    nirfBadge: 'Highest Placement Packages • Top Corporate Recruiters',
    careerTracks: ['Principal System Architect', 'AI/ML Solutions Engineer', 'IT Project Director'],
    semester1Subjects: [
      { code: 'CAP601', name: 'Advanced Data Structures & Algorithms', credits: 4, type: 'Core' },
      { code: 'CAP602', name: 'Advanced Algorithms Lab', credits: 1, type: 'Lab' },
      { code: 'CAP603', name: 'Modern Database Systems (SQL & NoSQL)', credits: 3, type: 'Core' },
      { code: 'CAP604', name: 'Software Engineering & Enterprise Patterns', credits: 3, type: 'Core' },
      { code: 'PEV601', name: 'Executive Leadership & Soft Skills', credits: 2, type: 'Skill' },
    ],
  },
  'msc-data': {
    nirfBadge: 'Advanced Machine Intelligence & Predictive Lab',
    careerTracks: ['Senior Data Scientist', 'Machine Learning Engineer', 'Quantitative Modeling Analyst'],
    semester1Subjects: [
      { code: 'DAT501', name: 'Statistical Inference & Probability Modeling', credits: 4, type: 'Core' },
      { code: 'DAT502', name: 'Python for Advanced Analytics Lab', credits: 2, type: 'Lab' },
      { code: 'DAT503', name: 'Linear Algebra & Optimization for ML', credits: 4, type: 'Core' },
      { code: 'DAT504', name: 'Data Mining & Warehousing', credits: 3, type: 'Core' },
    ],
  },

  // --- Business & Management ---
  'bba': {
    nirfBadge: 'NIRF Rank #32 (Management) • ACBSP (USA) Accredited',
    careerTracks: ['Financial Analyst', 'Marketing Operations Manager', 'Business Development Executive'],
    semester1Subjects: [
      { code: 'MGT101', name: 'Principles & Practice of Management', credits: 4, type: 'Core' },
      { code: 'ACC102', name: 'Financial Accounting Fundamentals', credits: 4, type: 'Core' },
      { code: 'ECO103', name: 'Microeconomics for Decision Making', credits: 3, type: 'Core' },
      { code: 'QNT104', name: 'Business Mathematics & Statistics', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Executive Business Communication', credits: 2, type: 'Skill' },
    ],
  },
  'bba-hons': {
    nirfBadge: 'NIRF Rank #32 • Live Bloomberg Equity Trading Lab',
    careerTracks: ['Investment Banking Analyst', 'Strategy Consultant', 'Global Supply Chain Lead'],
    semester1Subjects: [
      { code: 'MGT101H', name: 'Strategic Management & Global Business', credits: 4, type: 'Core' },
      { code: 'ACC102H', name: 'Corporate Financial Accounting & Modeling', credits: 4, type: 'Core' },
      { code: 'ECO103', name: 'Managerial Economics', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Corporate Negotiation & Persuasion', credits: 2, type: 'Skill' },
    ],
  },
  'mba': {
    nirfBadge: 'NIRF Rank #32 (Management) • ACBSP (USA) Accredited',
    careerTracks: ['Management Consultant', 'Investment Banker', 'Product Growth Manager', 'Brand Director'],
    semester1Subjects: [
      { code: 'MBA701', name: 'Financial Reporting & Corporate Finance', credits: 4, type: 'Core' },
      { code: 'MBA702', name: 'Marketing Management in Digital Age', credits: 4, type: 'Core' },
      { code: 'MBA703', name: 'Organizational Behavior & Human Capital', credits: 3, type: 'Core' },
      { code: 'MBA704', name: 'Quantitative Methods for Business Decisions', credits: 3, type: 'Core' },
      { code: 'PEV701', name: 'Executive Grooming & Leadership Seminars', credits: 2, type: 'Skill' },
    ],
  },
  'bcom-hons': {
    nirfBadge: 'ACCA & CMA Accredited Global Degree',
    careerTracks: ['Chartered Accountant / Auditor', 'Tax Consultant', 'Equity Research Analyst'],
    semester1Subjects: [
      { code: 'COM101', name: 'Financial Accounting - I', credits: 4, type: 'Core' },
      { code: 'COM102', name: 'Business Law & Mercantile Compliance', credits: 4, type: 'Core' },
      { code: 'ECO101', name: 'Business Economics', credits: 3, type: 'Core' },
      { code: 'MTH102', name: 'Business Statistics', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Business Communication', credits: 2, type: 'Skill' },
    ],
  },

  // --- Healthcare & Sciences ---
  'bpharm': {
    nirfBadge: 'NIRF Rank #16 (Pharmacy) • PCI Approved',
    careerTracks: ['Pharmaceutical Formulation Scientist', 'Clinical Research Associate', 'Drug Regulatory Officer'],
    semester1Subjects: [
      { code: 'BP101T', name: 'Human Anatomy and Physiology - I', credits: 4, type: 'Core' },
      { code: 'BP107P', name: 'Human Anatomy Lab', credits: 2, type: 'Lab' },
      { code: 'BP102T', name: 'Pharmaceutical Analysis - I', credits: 4, type: 'Core' },
      { code: 'BP108P', name: 'Pharmaceutical Analysis Lab', credits: 2, type: 'Lab' },
      { code: 'BP103T', name: 'Pharmaceutics - I', credits: 4, type: 'Core' },
    ],
  },
  'mpharm': {
    nirfBadge: 'NIRF Rank #16 (Pharmacy) • PCI Approved',
    careerTracks: ['Principal Formulation R&D Lead', 'Pharmacovigilance Director', 'Senior Regulatory Consultant'],
    semester1Subjects: [
      { code: 'MPH101T', name: 'Modern Pharmaceutical Analytical Techniques', credits: 4, type: 'Core' },
      { code: 'MPH102T', name: 'Advanced Biopharmaceutics & Pharmacokinetics', credits: 4, type: 'Core' },
      { code: 'MPH105P', name: 'Pharmaceutical Practical - I', credits: 6, type: 'Lab' },
    ],
  },
  'bpt': {
    nirfBadge: 'Multi-Specialty Campus Hospital Tie-up',
    careerTracks: ['Sports Physiotherapist', 'Neuro-Rehabilitation Specialist', 'Orthopedic Physical Therapist'],
    semester1Subjects: [
      { code: 'BPT101', name: 'Human Anatomy & Histology', credits: 4, type: 'Core' },
      { code: 'BPT102', name: 'Human Physiology', credits: 4, type: 'Core' },
      { code: 'BPT107', name: 'Anatomy Dissection & Practicum Lab', credits: 2, type: 'Lab' },
      { code: 'BPT103', name: 'Biochemistry for Physiotherapists', credits: 3, type: 'Core' },
    ],
  },
  'bsc-agri': {
    nirfBadge: 'ICAR Accredited (India’s 1st Private Agri School)',
    careerTracks: ['Precision Agronomist', 'Agricultural Drone Specialist', 'Seed & Crop Biotech Scientist'],
    semester1Subjects: [
      { code: 'AGR101', name: 'Fundamentals of Agronomy', credits: 4, type: 'Core' },
      { code: 'AGR105', name: 'Field Crop Production Practicum', credits: 2, type: 'Lab' },
      { code: 'AGR102', name: 'Fundamentals of Soil Science', credits: 3, type: 'Core' },
      { code: 'AGR103', name: 'Agricultural Heritage & Ethics', credits: 2, type: 'Core' },
    ],
  },
  'bsc-forensic': {
    nirfBadge: 'Recognized by Directorate of Forensic Science',
    careerTracks: ['Forensic Crime Scene Investigator', 'Ballistics & Fingerprint Analyst', 'Cyber Forensics Specialist'],
    semester1Subjects: [
      { code: 'FSC101', name: 'Introduction to Forensic Science & Criminal Justice', credits: 4, type: 'Core' },
      { code: 'FSC105', name: 'Crime Scene Documentation Lab', credits: 2, type: 'Lab' },
      { code: 'CHE101', name: 'Forensic Chemistry & Toxicology', credits: 3, type: 'Core' },
      { code: 'BIO101', name: 'Forensic Biology & Serology', credits: 3, type: 'Core' },
    ],
  },
  'bsc-biotech': {
    nirfBadge: 'DBT Recognized Biotechnology Labs',
    careerTracks: ['Research Assistant', 'Quality Control Microbiologist', 'Clinical Diagnostic Analyst'],
    semester1Subjects: [
      { code: 'BTC101', name: 'Cell Biology & Genetics', credits: 4, type: 'Core' },
      { code: 'BTC105', name: 'Molecular Biology Lab', credits: 2, type: 'Lab' },
      { code: 'CHE101', name: 'General Chemistry', credits: 3, type: 'Core' },
      { code: 'MTH101', name: 'Calculus & Biostatistics', credits: 3, type: 'Core' },
    ],
  },
  'bsc-micro': {
    nirfBadge: 'State-of-the-Art Fermentation Lab',
    careerTracks: ['Medical Microbiologist', 'Food Safety Specialist', 'Environmental Microbiologist'],
    semester1Subjects: [
      { code: 'MIC101', name: 'Fundamentals of Microbiology', credits: 4, type: 'Core' },
      { code: 'MIC105', name: 'Microbial Culture & Staining Lab', credits: 2, type: 'Lab' },
      { code: 'BIO101', name: 'Bacteriology & Virology', credits: 3, type: 'Core' },
      { code: 'CHE101', name: 'Biochemical Foundations', credits: 3, type: 'Core' },
    ],
  },

  // --- Law & Legal Studies ---
  'ba-llb': {
    nirfBadge: 'NIRF Rank #27 (Law) • Bar Council of India (BCI) Approved',
    careerTracks: ['Corporate Legal Counsel', 'Litigation Advocate', 'Judicial Services Officer'],
    semester1Subjects: [
      { code: 'LAW101', name: 'Legal Methods, Research & Systems', credits: 4, type: 'Core' },
      { code: 'LAW102', name: 'Law of Torts & Consumer Protection', credits: 4, type: 'Core' },
      { code: 'POL103', name: 'Political Science - I (State & Governance)', credits: 3, type: 'Core' },
      { code: 'SOC104', name: 'Sociology of Law & Social Institutions', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Legal English & Moot Court Argumentation', credits: 2, type: 'Skill' },
    ],
  },
  'bba-llb': {
    nirfBadge: 'NIRF Rank #27 (Law) • BCI Approved • Corporate Law Specialty',
    careerTracks: ['Corporate Mergers & Acquisitions Lawyer', 'Fintech Compliance Officer', 'Arbitration & IP Counsel'],
    semester1Subjects: [
      { code: 'LAW101', name: 'Legal Systems & Jurisprudence', credits: 4, type: 'Core' },
      { code: 'LAW102', name: 'Law of Contract - I', credits: 4, type: 'Core' },
      { code: 'MGT101', name: 'Principles of Business Management', credits: 3, type: 'Core' },
      { code: 'ACC101', name: 'Financial Accounting for Lawyers', credits: 3, type: 'Core' },
      { code: 'PEL121', name: 'Legal Drafting & Argumentation', credits: 2, type: 'Skill' },
    ],
  },
  'llb': {
    nirfBadge: 'NIRF Rank #27 • High Court & Supreme Court Moot Courts',
    careerTracks: ['Criminal Defense Advocate', 'Civil Rights Lawyer', 'Legal Advisor to Banks'],
    semester1Subjects: [
      { code: 'LAW401', name: 'Constitutional Law - I', credits: 4, type: 'Core' },
      { code: 'LAW402', name: 'Law of Crimes (Indian Penal Code)', credits: 4, type: 'Core' },
      { code: 'LAW403', name: 'Family Law - I', credits: 4, type: 'Core' },
      { code: 'LAW404', name: 'Law of Contracts & Specific Relief', credits: 4, type: 'Core' },
    ],
  },
  'llm': {
    nirfBadge: 'NIRF Rank #27 • Corporate & Commercial Law Center',
    careerTracks: ['Senior Legal Consultant', 'Law Professor / Academician', 'International Law Specialist'],
    semester1Subjects: [
      { code: 'LLM501', name: 'Research Methods & Legal Writing', credits: 3, type: 'Core' },
      { code: 'LLM502', name: 'Comparative Public Law & Governance', credits: 3, type: 'Core' },
      { code: 'LLM503', name: 'Law and Justice in a Globalizing World', credits: 3, type: 'Core' },
    ],
  },

  // --- Design, Media & Architecture ---
  'bdes': {
    nirfBadge: 'Top Design School • International Fashion Week Tie-ups',
    careerTracks: ['UI/UX Product Designer', 'Industrial Product Stylist', 'Spatial & Interior Designer'],
    semester1Subjects: [
      { code: 'DES101', name: 'Design Fundamentals, Form & Space', credits: 4, type: 'Core' },
      { code: 'DES105', name: '2D & 3D Prototyping Workshop', credits: 3, type: 'Lab' },
      { code: 'DES102', name: 'Color Theory & Visual Semiotics', credits: 3, type: 'Core' },
      { code: 'DES103', name: 'Design Thinking & Human Factors', credits: 3, type: 'Core' },
    ],
  },
  'barch': {
    nirfBadge: 'Council of Architecture (CoA) Approved • Green Building Center',
    careerTracks: ['Licensed Architect', 'Sustainable Urban Planner', 'Landscape Architect'],
    semester1Subjects: [
      { code: 'ARC101', name: 'Architectural Design Studio - I', credits: 6, type: 'Core' },
      { code: 'ARC102', name: 'Building Materials & Construction - I', credits: 4, type: 'Core' },
      { code: 'ARC103', name: 'Architectural Graphics & Freehand Sketching', credits: 3, type: 'Lab' },
      { code: 'ARC104', name: 'History of Architecture & Civilization', credits: 3, type: 'Core' },
    ],
  },
  'bsc-animation': {
    nirfBadge: 'Autodesk & Unreal Engine Certified Gaming Studios',
    careerTracks: ['3D Character Animator', 'VFX Compositor', 'Technical Game Artist'],
    semester1Subjects: [
      { code: 'ANI101', name: 'Classical Animation Principles & Drawing', credits: 4, type: 'Core' },
      { code: 'ANI105', name: 'Maya 3D Modeling Laboratory', credits: 2, type: 'Lab' },
      { code: 'ANI102', name: 'Storyboarding & Cinematography', credits: 3, type: 'Core' },
      { code: 'ANI103', name: 'Digital Art & Texturing', credits: 3, type: 'Core' },
    ],
  },
  'ba-jmc': {
    nirfBadge: 'Broadcast TV Studio & Campus Radio 90.8 FM',
    careerTracks: ['Investigative News Journalist', 'Broadcast TV Producer', 'Digital Content Strategist'],
    semester1Subjects: [
      { code: 'JMC101', name: 'Introduction to Journalism & Mass Media', credits: 4, type: 'Core' },
      { code: 'JMC105', name: 'Print & Digital News Reporting Lab', credits: 2, type: 'Lab' },
      { code: 'JMC102', name: 'History of Media & Press Laws', credits: 3, type: 'Core' },
      { code: 'JMC103', name: 'Audio-Visual Media Techniques', credits: 3, type: 'Core' },
    ],
  },
  'bhmct': {
    nirfBadge: 'NCHMCT Partner • In-Campus 5-Star Hotel Uni-Hotel Training',
    careerTracks: ['Luxury Hotel General Manager', 'Executive Chef & Culinary Director', 'Hospitality Operations Lead'],
    semester1Subjects: [
      { code: 'HMC101', name: 'Food Production Principles - I', credits: 4, type: 'Core' },
      { code: 'HMC105', name: 'Basic Training Kitchen Laboratory', credits: 2, type: 'Lab' },
      { code: 'HMC102', name: 'Food & Beverage Service Foundations', credits: 3, type: 'Core' },
      { code: 'HMC103', name: 'Front Office Management Operations', credits: 3, type: 'Core' },
    ],
  },
  'mtech-cse': {
    nirfBadge: 'NIRF Rank #50 • IEEE & Scopus Research Lab',
    careerTracks: ['Lead Research Engineer', 'Chief Data Architect', 'Doctoral Fellow / AI Scientist'],
    semester1Subjects: [
      { code: 'CSE701', name: 'Advanced Algorithms & Complexity Theory', credits: 4, type: 'Core' },
      { code: 'CSE702', name: 'High Performance & Distributed Computing', credits: 4, type: 'Core' },
      { code: 'CSE705', name: 'Advanced Systems Lab', credits: 2, type: 'Lab' },
    ],
  },
  'bed': {
    nirfBadge: 'NCTE Approved • Smart Classroom Teaching Pedagogy',
    careerTracks: ['Senior Secondary School Educator', 'Curriculum Design Specialist', 'Educational Administrator'],
    semester1Subjects: [
      { code: 'EDU101', name: 'Childhood and Growing Up', credits: 4, type: 'Core' },
      { code: 'EDU102', name: 'Contemporary India and Education', credits: 4, type: 'Core' },
      { code: 'EDU103', name: 'Language across the Curriculum', credits: 2, type: 'Core' },
      { code: 'EDU104', name: 'Understanding ICT in Education', credits: 2, type: 'Skill' },
    ],
  },
};

/**
 * Get enrichment data for any program ID with safe universal fallback
 */
export function getProgramEnrichment(programId) {
  if (PROGRAM_ENRICHMENT[programId]) {
    return PROGRAM_ENRICHMENT[programId];
  }

  // Graceful fallback for any variant ID
  return {
    nirfBadge: 'NIRF Top 30 in India • NAAC A++ (3.68/4)',
    careerTracks: ['Domain Specialist', 'Industry Consultant', 'Research Analyst'],
    semester1Subjects: [
      { code: 'UNI101', name: 'Foundational Core Computing', credits: 4, type: 'Core' },
      { code: 'UNI105', name: 'Applied Laboratory Practicum', credits: 1, type: 'Lab' },
      { code: 'MTH101', name: 'Applied Quantitative Analysis', credits: 4, type: 'Core' },
      { code: 'PEL121', name: 'Corporate Communication & Soft Skills', credits: 2, type: 'Skill' },
    ],
  };
}
