/**
 * Authentic Comparative Curriculums, Tech Stacks, and Career Pathways
 * For Lovely Professional University Degree Programmes
 */

import { PROGRAM_ENRICHMENT } from './programDetails';

export const PROGRAM_COMPARISON_DATA = {
  'btech-cse': {
    languages: ['C', 'C++', 'Java', 'Python', 'SQL'],
    techStack: ['Linux', 'Git', 'Spring Boot', 'Node.js', 'Docker', 'MySQL'],
    aiTopics: ['Applied Machine Learning Electives', 'Data Structures & Algorithms', 'Statistical Modeling'],
    coreElectives: 'Data Structures, OS, DBMS, Computer Networks, Theory of Computation, Compiler Design, Distributed Systems',
    labsAndInternships: 'Data Structures Lab, Operating Systems Lab, 6-Month Industry Capstone Internship (Semester 8)',
    certifications: 'AWS Certified Solutions Architect, Oracle Java Associate, Cisco CCNA',
    careerRoles: ['Software Development Engineer (SDE)', 'Full-Stack Developer', 'Systems Engineer'],
    higherEducation: 'M.Tech CSE, MS in Computer Science (US/UK/Canada), MBA in Technology Management',
  },
  'btech-aiml': {
    languages: ['Python', 'C++', 'R', 'Julia', 'SQL'],
    techStack: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'OpenCV', 'Hugging Face', 'Jupyter', 'Keras'],
    aiTopics: ['Deep Neural Networks', 'Natural Language Processing (NLP)', 'Large Language Models (LLMs)', 'Computer Vision', 'Reinforcement Learning'],
    coreElectives: 'Linear Algebra for AI, Pattern Recognition, AI Ethics, Autonomous Systems, Graph Neural Networks',
    labsAndInternships: 'AI Innovation Lab, Deep Learning GPU Cluster Practicum, Capstone AI Deployment Project',
    certifications: 'TensorFlow Developer Certificate, AWS Certified Machine Learning, Google Professional ML Engineer',
    careerRoles: ['AI Research Scientist', 'Machine Learning Engineer', 'NLP Specialist', 'Computer Vision Architect'],
    higherEducation: 'MS in Artificial Intelligence, MS in Robotics, PhD in Machine Learning',
  },
  'btech-ds': {
    languages: ['Python', 'R', 'SQL', 'Scala', 'Bash'],
    techStack: ['Apache Spark', 'Hadoop', 'Tableau', 'PowerBI', 'Pandas', 'MongoDB', 'Airflow'],
    aiTopics: ['Predictive Modeling', 'Time Series Forecasting', 'Big Data Mining', 'Generative Data Synthesis'],
    coreElectives: 'Multivariate Statistics, Data Warehousing, Cloud Analytics, Feature Engineering, Econometrics',
    labsAndInternships: 'Big Data Processing Lab, BI Dashboarding Studio, Industry Big Data Analytics Practicum',
    certifications: 'Google Professional Data Engineer, IBM Data Science Professional, Microsoft Certified Data Analyst',
    careerRoles: ['Data Scientist', 'Big Data Architect', 'Quantitative Analyst', 'Business Intelligence Lead'],
    higherEducation: 'MS in Data Science, MS in Business Analytics, Master of Data Engineering',
  },
  'btech-cyber': {
    languages: ['C', 'Python', 'Bash', 'x86 Assembly', 'PowerShell', 'SQL'],
    techStack: ['Kali Linux', 'Wireshark', 'Metasploit', 'Burp Suite', 'Nmap', 'Splunk', 'Snort'],
    aiTopics: ['AI in Threat Intelligence', 'Automated Vulnerability Detection', 'Adversarial Machine Learning'],
    coreElectives: 'Applied Cryptography, Network Security, Reverse Engineering, Penetration Testing, Cyber Forensics',
    labsAndInternships: 'Cyber Defense Range, Ethical Hacking Sandbox, Security Operations Center (SOC) Internship',
    certifications: 'CEH (Certified Ethical Hacker), CompTIA Security+, CISSP Associate, OSCP',
    careerRoles: ['Cyber Security Analyst', 'Penetration Tester (Ethical Hacker)', 'SOC Engineer', 'Incident Responder'],
    higherEducation: 'MS in Information Security, MS in Cybersecurity, M.Tech in Information Assurance',
  },
  'btech-cloud': {
    languages: ['Python', 'Go', 'Bash', 'HCL (Terraform)', 'YAML', 'JSON'],
    techStack: ['AWS', 'Microsoft Azure', 'Google Cloud Platform', 'Docker', 'Kubernetes', 'Terraform', 'Ansible'],
    aiTopics: ['MLOps on Cloud', 'Serverless AI Inference', 'Scalable Cloud Data Pipelines'],
    coreElectives: 'Cloud Architecture & Patterns, Virtualization Technologies, Microservices, Cloud Security & Governance',
    labsAndInternships: 'Multi-Cloud Sandboxes, Kubernetes Cluster Lab, 6-Month Enterprise Cloud Practicum',
    certifications: 'AWS Certified Solutions Architect, Google Associate Cloud Engineer, Azure Administrator (AZ-104)',
    careerRoles: ['Cloud Solutions Architect', 'DevOps & Cloud Engineer', 'Cloud Infrastructure Consultant'],
    higherEducation: 'MS in Cloud Computing, MS in Distributed Systems, MBA in Cloud Strategy',
  },
  'btech-fullstack': {
    languages: ['JavaScript', 'TypeScript', 'HTML5/CSS3', 'Python', 'Java', 'SQL'],
    techStack: ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'PostgreSQL', 'Docker', 'Redis'],
    aiTopics: ['Full-Stack AI Integration (LangChain, OpenAI/Gemini SDKs)', 'Vector Databases', 'Prompt Engineering'],
    coreElectives: 'Modern Web Architectures, REST & GraphQL APIs, Database Indexing, Micro-Frontend Design',
    labsAndInternships: 'Web Prototyping Studio, SaaS Product Development Lab, 6-Month Startup Tech Internship',
    certifications: 'Meta Full-Stack Developer Certificate, AWS Certified Developer, MongoDB Certified Developer',
    careerRoles: ['MERN/Full-Stack Software Engineer', 'Frontend Architect', 'Backend API Specialist'],
    higherEducation: 'MS in Software Engineering, MS in Computer Science, Product Management Masters',
  },
  'btech-devops': {
    languages: ['Python', 'Go', 'Bash', 'Groovy', 'YAML', 'HCL'],
    techStack: ['Jenkins', 'GitHub Actions', 'Docker', 'Kubernetes', 'Helm', 'Prometheus', 'Grafana', 'Terraform'],
    aiTopics: ['AIOps', 'Automated Anomaly Detection in CI/CD', 'Predictive Resource Auto-Scaling'],
    coreElectives: 'Infrastructure as Code (IaC), Site Reliability Engineering (SRE), Continuous Testing, Zero-Trust Architecture',
    labsAndInternships: 'CI/CD Pipeline Automation Lab, Cluster Chaos Engineering Sandbox, Enterprise DevOps Project',
    certifications: 'CKA (Certified Kubernetes Administrator), Docker Certified Associate, HashiCorp Terraform Associate',
    careerRoles: ['DevOps Pipeline Engineer', 'Site Reliability Engineer (SRE)', 'Platform Engineer'],
    higherEducation: 'MS in Systems & Infrastructure, MS in Cloud Architecture, Executive M.Tech',
  },
  'btech-iot': {
    languages: ['Embedded C', 'C++', 'Python', 'MicroPython', 'Rust'],
    techStack: ['Arduino', 'Raspberry Pi', 'ESP32', 'FreeRTOS', 'MQTT', 'Node-RED', 'Zigbee'],
    aiTopics: ['TinyML (Edge AI)', 'Embedded Computer Vision', 'Sensory Data Classification'],
    coreElectives: 'Microcontrollers & Sensors, Wireless Sensor Networks, IoT Protocol Design, Industrial Automation',
    labsAndInternships: 'Smart Hardware Prototyping Lab, Robotics & Embedded IoT Incubator, IoT Field Trials',
    certifications: 'Cisco Certified IoT Specialist, Arm Accredited Engineer, AWS IoT Core Specialist',
    careerRoles: ['IoT Firmware Engineer', 'Embedded Hardware Developer', 'Smart City Solutions Engineer'],
    higherEducation: 'MS in Embedded Systems, MS in Robotics & Automation, M.Tech in Microelectronics',
  },
  'btech-ece': {
    languages: ['Verilog', 'VHDL', 'C', 'Python', 'MATLAB', 'Assembly'],
    techStack: ['Cadence EDA', 'Xilinx Vivado', 'Keil µVision', 'Simulink', 'LabVIEW', 'Multisim'],
    aiTopics: ['Neuromorphic Computing Hardware', 'Edge AI Acceleration', 'Digital Signal Processing via ML'],
    coreElectives: 'VLSI Circuit Design, Digital Signal Processing, Analog & Digital ICs, 5G Wireless Communications, Antenna Design',
    labsAndInternships: 'Semiconductor Fabrication & Cleanroom Lab, Microwave Engineering Lab, 6-Month Core Telecom/VLSI Internship',
    certifications: 'Cadence Certified VLSI Designer, Cisco CCNA, Arm Architecture Certification',
    careerRoles: ['VLSI Design Engineer', 'Embedded Systems Architect', 'RF & Telecom Engineer', 'Hardware Verification Engineer'],
    higherEducation: 'M.Tech VLSI Design, MS in Microelectronics & Photonics, PhD in Semiconductor Physics',
  },
  'btech-me': {
    languages: ['Python (Engineering Simulation)', 'MATLAB', 'G-Code / M-Code', 'C++'],
    techStack: ['SolidWorks', 'AutoCAD', 'ANSYS Workbench', 'CATIA', 'Siemens NX', 'Adams'],
    aiTopics: ['AI in Generative CAD Design', 'Predictive Maintenance via Vibration Sensors', 'Autonomous EV Controls'],
    coreElectives: 'Thermodynamics, Finite Element Analysis (FEA), Electric Vehicle Engineering, Mechatronics, Robotics, Computational Fluid Dynamics (CFD)',
    labsAndInternships: 'Robotics & Automation Lab, Formula Student EV Racing Workshop, CNC Machining Center Internship',
    certifications: 'CSWA / CSWP (SolidWorks Certified Associate/Professional), ANSYS Certified Specialist',
    careerRoles: ['Robotics Design Engineer', 'Automotive / EV Systems Engineer', 'CAD/CAM Analyst', 'Thermal Systems Specialist'],
    higherEducation: 'M.Tech Robotics, MS in Mechanical / Automotive Engineering (Germany/US), MS in Aerospace Engineering',
  },
  'btech-civil': {
    languages: ['Python for Geospatial Data', 'MATLAB', 'SQL'],
    techStack: ['AutoCAD Civil 3D', 'STAAD.Pro', 'ETABS', 'Revit BIM', 'ArcGIS', 'Primavera P6'],
    aiTopics: ['AI in Smart City Planning', 'Computer Vision for Structural Crack Detection', 'GIS Predictive Traffic Analysis'],
    coreElectives: 'Structural Design, Reinforced Concrete, Geotechnical Engineering, Transportation Engineering, Green Building Design',
    labsAndInternships: 'Concrete Testing & Soil Mechanics Lab, Total Station Surveying Field Camp, Construction Site Practicum',
    certifications: 'Autodesk Certified BIM Specialist, Bentley STAAD.Pro Certified Engineer, LEED Green Associate',
    careerRoles: ['Structural Design Engineer', 'BIM Project Coordinator', 'Geotechnical Consultant', 'Construction Project Manager'],
    higherEducation: 'M.Tech Structural Engineering, MS in Smart Infrastructure, MS in Environmental Engineering',
  },
  'mba': {
    languages: ['R for Analytics', 'Python for Business', 'SQL', 'Advanced Excel VBA'],
    techStack: ['Tableau', 'PowerBI', 'SPSS', 'SAP ERP', 'Salesforce CRM', 'Google Analytics 4'],
    aiTopics: ['Generative AI in Marketing', 'Predictive Customer Churn Analytics', 'FinTech & Algorithmic Trading'],
    coreElectives: 'Corporate Finance, Strategic Brand Management, Supply Chain Logistics, Human Resource Analytics, Venture Capital',
    labsAndInternships: 'Bloomberg Financial Markets Lab, Simulated Stock Trading Desk, 8-Week Corporate Summer Internship',
    certifications: 'KPMG Six Sigma Green Belt, NCFM Financial Markets, HubSpot Digital Marketing, Project Management (CAPM)',
    careerRoles: ['Management Consultant', 'Investment Banker / Equity Analyst', 'Product Marketing Manager', 'Operations Lead'],
    higherEducation: 'Executive Leadership Programs, PhD in Management, CFA / FRM Charters',
  },
  'bba': {
    languages: ['Advanced Excel', 'SQL Basics', 'Python for Business Foundations'],
    techStack: ['MS Office Suite', 'PowerBI', 'Canva for Business', 'Tally Prime', 'Google Workspace'],
    aiTopics: ['AI Tools for Digital Marketing', 'Customer Segmentation Models', 'Automated Accounting Tools'],
    coreElectives: 'Principles of Marketing, Financial Accounting, Business Law, International Trade, Consumer Behavior',
    labsAndInternships: 'Business Incubation Center Practicum, Live Retail Field Project, Corporate Summer Training',
    certifications: 'Google Digital Marketing Certification, NISM Mutual Funds, Advanced Excel Specialist',
    careerRoles: ['Business Development Executive', 'Digital Marketing Specialist', 'HR Operations Analyst', 'Client Relationship Manager'],
    higherEducation: 'MBA / PGDM (India & Abroad), Master in International Business, CFA Level 1',
  },
  'bca': {
    languages: ['C', 'C++', 'Java', 'Python', 'PHP', 'JavaScript', 'SQL'],
    techStack: ['HTML5/CSS3', 'Bootstrap', 'React', 'MySQL', 'Node.js', 'Git', 'Linux'],
    aiTopics: ['Introduction to Machine Learning', 'Data Mining Algorithms', 'AI Chatbot Integration'],
    coreElectives: 'Object Oriented Programming, Database Management, Web Technologies, Software Engineering, Mobile App Development',
    labsAndInternships: 'Software Development Lab, Web Engineering Studio, Final Semester Industry Capstone Project',
    certifications: 'Oracle Certified Java Programmer, Microsoft Azure Fundamentals (AZ-900), Full-Stack Bootcamp',
    careerRoles: ['Junior Software Developer', 'Web Application Engineer', 'Database Administrator (DBA)', 'Quality Assurance (QA) Analyst'],
    higherEducation: 'MCA (Master of Computer Applications), MS in Information Technology, MBA in IT',
  },
  'mca': {
    languages: ['Java', 'Python', 'C++', 'JavaScript', 'SQL', 'Kotlin'],
    techStack: ['Spring Boot', 'React', 'Docker', 'PostgreSQL', 'Android Studio', 'AWS', 'Git'],
    aiTopics: ['Deep Learning & NLP', 'Cloud Microservices Architecture', 'Enterprise AI Systems'],
    coreElectives: 'Advanced Algorithm Design, Cloud Computing Architecture, Mobile Computing, Cyber Laws & Security',
    labsAndInternships: 'Enterprise Software Studio, Mobile App Prototyping Lab, 6-Month Full-Time Corporate Internship',
    certifications: 'AWS Certified Developer, Red Hat Certified Specialist in Enterprise Application, Google Associate Android Developer',
    careerRoles: ['Senior Software Engineer', 'Cloud Application Developer', 'Full-Stack Lead', 'Systems Analyst'],
    higherEducation: 'PhD in Computer Science, Advanced Executive Tech Fellowships',
  },
  'bpharm': {
    languages: ['ChemDraw Molecular Modeling', 'R for Biostatistics', 'Python for Drug Informatics'],
    techStack: ['HPLC Instrumentation', 'UV-Vis Spectrophotometer', 'Rotary Evaporator', 'AutoDock'],
    aiTopics: ['AI in Drug Discovery', 'Molecular Docking Simulations', 'Computational Toxicology'],
    coreElectives: 'Pharmaceutics, Pharmaceutical Chemistry, Pharmacology, Pharmacognosy, Pharmaceutical Jurisprudence',
    labsAndInternships: 'Formulation & Development Lab, Animal House Practicum (CPCSEA guidelines), 1-Month Industrial Pharmacy Training',
    certifications: 'Good Manufacturing Practices (GMP) Training, Clinical Research Associate (CRA), Regulatory Affairs Specialist',
    careerRoles: ['Formulation Scientist', 'Drug Regulatory Affairs Officer', 'Quality Control / QA Analyst', 'Clinical Research Coordinator'],
    higherEducation: 'M.Pharm (Pharmaceutics/Pharmacology), MS in Pharmaceutical Sciences (USA), MBA in Pharma Management',
  },
  'barch': {
    languages: ['Python in Grasshopper', 'Visual Scripting', 'Dynamo'],
    techStack: ['AutoCAD', 'Autodesk Revit BIM', 'Rhino 3D', 'SketchUp', 'V-Ray / Lumion', 'Adobe Photoshop'],
    aiTopics: ['Generative Parametric Design', 'AI Solar & Wind CFD Simulations', 'Automated Spatial Planning'],
    coreElectives: 'Architectural Design Studio, Building Materials & Construction, History of Architecture, Climate Responsive Design, Urban Planning',
    labsAndInternships: 'Model Making Workshop, Carpentry & Material Testing Lab, 6-Month Full-Time Architecture Firm Internship',
    certifications: 'Autodesk Certified Professional Revit, LEED Green Associate, Council of Architecture (CoA) Registration',
    careerRoles: ['Architectural Designer', 'BIM Specialist', 'Urban Landscape Designer', 'Interior Architecture Lead'],
    higherEducation: 'M.Arch (Urban Design/Sustainable Architecture), Master of Urban Planning (MUP), Landscape Architecture',
  },
  'llb': {
    languages: ['Legal AI Prompting', 'Document Drafting Automation'],
    techStack: ['SCC Online', 'Manupatra', 'LexisNexis', 'Westlaw', 'Supreme Court e-Services'],
    aiTopics: ['AI in Legal Research', 'Predictive Case Outcome Modeling', 'Smart Contract Analysis'],
    coreElectives: 'Constitutional Law, Criminal Law (BNS), Corporate Law, Intellectual Property Rights (IPR), Cyber Law, Arbitration',
    labsAndInternships: 'Moot Court Hall Training, Legal Aid Clinic Outreaches, Annual High Court / Corporate Law Firm Internships',
    certifications: 'Bar Council of India Enrollment, Cyber Law & IPR Diploma, Alternative Dispute Resolution (ADR) Arbitrator',
    careerRoles: ['Advocate / Litigator', 'Corporate Legal Counsel', 'Judicial Services Officer', 'Intellectual Property Attorney'],
    higherEducation: 'LL.M (Master of Laws) in Corporate / Constitutional Law, Judicial Services Examination, Civil Services (UPSC)',
  },
};

/**
 * Fallback generator for programs not explicitly listed above
 */
export function getProgramComparisonDetails(program) {
  if (!program) return null;
  const custom = PROGRAM_COMPARISON_DATA[program.id];
  if (custom) return custom;

  const isTech = program.tags?.includes('Engineering') || program.tags?.includes('Computer Science');
  const isMgmt = program.tags?.includes('Management') || program.tags?.includes('Commerce');
  const isBio = program.tags?.includes('Pharmacy') || program.tags?.includes('Biotechnology');

  if (isTech) {
    return {
      languages: ['C++', 'Python', 'Java', 'SQL'],
      techStack: ['Linux', 'Git', 'Docker', 'Relational Databases'],
      aiTopics: ['Applied Data Analysis', 'Machine Learning Foundations'],
      coreElectives: 'Core Engineering Systems, Computing Foundations, Industrial Capstone Project',
      labsAndInternships: 'Specialized Engineering Lab, Prototyping Practicum, 6-Month Industry Internship',
      certifications: 'Industry Recognized Foundation Certification, Technical Professional Credential',
      careerRoles: ['Technical Systems Engineer', 'Engineering Analyst', 'Domain Specialist'],
      higherEducation: 'M.Tech in Discipline, MS Abroad, MBA in Technology Management',
    };
  }

  if (isMgmt) {
    return {
      languages: ['Advanced Excel', 'SQL', 'R Foundations'],
      techStack: ['PowerBI', 'Tableau', 'ERP Systems', 'CRM Software'],
      aiTopics: ['AI in Business Operations', 'Predictive Analytics'],
      coreElectives: 'Strategic Management, Financial Systems, Marketing & Operations Management',
      labsAndInternships: 'Case Study Simulation Studio, Business Incubation Lab, Corporate Internship',
      certifications: 'Project Management Associate, Financial Modeling Certificate',
      careerRoles: ['Business Consultant', 'Operations Executive', 'Commercial Analyst'],
      higherEducation: 'MBA / Executive Management, CFA / Financial Certifications',
    };
  }

  return {
    languages: ['Analytical Tools', 'Domain Specific Software', 'Data Processing'],
    techStack: ['Professional Suite', 'Discipline Workstations', 'Cloud Portals'],
    aiTopics: ['AI in Academic Research & Domain Modeling'],
    coreElectives: 'Domain Theory, Applied Practicums, Professional Ethics, Research Methodologies',
    labsAndInternships: 'State-of-the-Art Departmental Labs, Field Work, Final Semester Internship',
    certifications: 'Professional Body Accreditations, National Competency Certificates',
    careerRoles: ['Domain Specialist', 'Research Officer', 'Professional Consultant'],
    higherEducation: 'Postgraduate Master Degree, Doctoral Studies (PhD), Civil Services',
  };
}
