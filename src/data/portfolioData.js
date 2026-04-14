export const NAV_LINKS = ["About", "Projets", "Experience", "Skills", "Contact"];

export const REPOSITORIES = [
  {
    name: "Gestion Enseignants",
    language: "JavaScript",
    updated: "3 weeks ago",
    url: "https://github.com/YannickMariano/Enseignant",
    color: "#f15a5a"
  },
  {
    name: "Restaurant Bonita Project",
    language: "CSS",
    updated: "2 days ago",
    url: "https://github.com/YannickMariano/bonita",
    color: "#7d5af1"
  },
  {
    name: "Gestion de Caisse",
    language: "C#",
    updated: "3 days ago",
    url: "https://github.com/ndaoCorp/gestion-caisse",
    color: "#e9f15a"
  },
  {
    name: "Réseau de Pétris",
    language: "HTML, CSS, JavaScript",
    updated: "6 weeks ago",
    url: "https://github.com/YannickMariano/RDP",
    color: "#b07219"
  },
  {
    name: "Gestion de Permis de travail",
    language: "Django",
    updated: "2 years ago",
    url: "https://github.com/YannickMariano/HSE_Project/tree/master",
    color: "#14b6d2"
  },
  {
    name: "Projet QCM",
    language: "PHP",
    updated: "2 years ago",
    url: "https://github.com/YannickMariano/PHP_Projetct",
    color: "#d21470"
  },
  {
    name: "Probleme de Flot Maximum",
    language: "JavaScript",
    updated: "1 year ago",
    url: "https://github.com/YannickMariano/Flot_Max/tree/full",
    color: "#c5d214"
  },
  {
    name: "Gestion de Centre Médical",
    language: "Java",
    updated: "3 years ago",
    url: "https://github.com/YannickMariano/Centre-Medical",
    color: "#36f04f"
  },
];

export const PROJECTS = [
  {
    title: "Gestion de Transactions Financières",
    desc: "Conception et Réalisation d'une application de gestion de transactions financières.",
    tech: ["JSP", "Node.js", "PostgreSQL"],
    color: "#00a8ff",
    icon: "/Transaction.png",
    link: "https://github.com/YannickMariano/Transfert_argent_jsp",
    stars: 5,
    forks: 3,
  },
  {
    title: "Problème de Flot Maximum",
    desc: "Réalisation d'un système de résolution du problème de flot maximum dans les graphes.",
    tech: ["JavaScript"],
    color: "#ed3a3aff",
    icon: "/Flot_Max.png",
    link: "https://github.com/YannickMariano/Flot_Max/tree/full",
    stars: 5,
    forks: 2,
  },
  {
    title: "Gestion de Permis de Travail",
    desc: "Réalisation d'une application de gestion de permis de travail.",
    tech: ["JAVA", "PostgreSQL"],
    color: "#0bf588ff",
    icon: "/Note.png",
    link: "https://github.com/YannickMariano/HSE_Project/tree/master",
    stars: 5,
    forks: 1,
  },
  
    {
    title: "Gestion Restaurant",
    desc: "Conception et Réalisation d'une application de gestion de Restaurant Caisse et Stock.",
    tech: ["C#", "PostgreSQL"],
    color: "#ed3acfff",
    icon: "/Resto.png",
    link: "https://github.com/ROHY-enteprise/Nick-sProject",
    stars: 5,
    forks: 5,
  },

];

// Nouveau format pour les skills - juste des logos avec noms
export const SKILLS = [
  { name: "CSS", icon: "/css-3.png", category: "Frontend" },
  { name: "React", icon: "/react.png", category: "Frontend" },
  { name: "Next.js", icon: "/NextJs.png", category: "Frontend" },
  { name: "Vue.js", icon: "/Vue.png", category: "Frontend" },
  { name: "TypeScript", icon: "/Typescript.png", category: "Frontend" },
  { name: "TailwindCSS", icon: "/Tailwind.png", category: "Frontend" },
  { name: "HTML", icon: "/HTML.png", category: "Frontend" },

  { name: "Node.js", icon: "/NodeJs.png", category: "Backend" },
  { name: "Express", icon: "/Express.png", category: "Backend" },
  { name: "Python", icon: "/Python.png", category: "Backend" },
  { name: "FastAPI", icon: "/Api.png", category: "Backend" },
  { name: "PHP", icon: "/PHP.png", category: "Backend" },

  { name: "PostgreSQL", icon: "/Postgres.png", category: "Database" },
  { name: "MongoDB", icon: "/Mongo.png", category: "Database" },
  { name: "MySQL", icon: "/MySql.png", category: "Database" },

  { name: "VS Code", icon: "/VSCode.png", category: "IDE" },
  { name: "Visual Studio", icon: "/VisualStudio.png", category: "IDE" },
  { name: "PyCharm", icon: "/PyCharm.png", category: "IDE" },
  { name: "Eclipse", icon: "/Eclipse.png", category: "IDE" },

  { name: "Illustrator", icon: "/Illustrator.png", category: "Design" },
  { name: "Photoshop", icon: "/Photoshop.png", category: "Design" },
  { name: "Canva", icon: "/Canva.png", category: "Design" },
  { name: "DaVinci Resolve", icon: "/DaVinci.png", category: "Design" },

  { name: "Docker", icon: "/Docker.png", category: "DevOps" },
  { name: "Kubernetes", icon: "/Kubernete.png", category: "DevOps" },
  { name: "AWS", icon: "/AWS.png", category: "DevOps" },
  { name: "GitHub Actions", icon: "/Github.png", category: "DevOps" },
];

// Nouvelle section expérience
export const EXPERIENCES = [
  {
    title: "Développeur Fullstack",
    company: "Norma Service",
    location: "Antananarivo, Madagascar",
    period: "2023",
    description: "Mise en place d'une plateforme de gestion de permis de contruction au seins de l'Organisation HSE de la société Norma Service.",
    achievements: [
      "Mise en place d'une API REST avec Django",
      "Facilitation des Taches pour les Utilisateurs",
      "Mise en place de l'architecture microservices"
    ],
    color: "#00eaffff",
    icon: "/NormaService.jpg",
  },
  {
    title: "Stagiaire en IA",
    company: "Arato",
    location: "Fianarantsoa, Madagascar",
    period: "2024",
    description: "Mis en place d'un système intélligent pour la conduite d'enrtetiens professionnels.",
    achievements: [
      "Mis en place d'un modèle de NLP pour l'analyse de réponses d'entretiens",
      "Création d'un chatbot qui fait les entretiens",
      "Intégration d'API d'IA pour feedback en temps réel",
      "Génération de rapports d'entretien automatisés"
    ],
    color: "#b4fe20ff",
    icon: "/Arato.png",
  },
  {
    title: "Gestion de Restaurant",
    company: "NICKS",
    location: "Fianarantsoa, Madagascar",
    period: "2026",
    description: "Gestion complète d'un restaurant, de la prise de commandes à la supervision du personnel en passant par la gestion des stocks et l'expérience client.",
    achievements: [
      "Synchronisation des commandes en temps réel entre la cuisine et le personnel de service",
      "Mise en place d'un système de gestion des stocks qui a réduit les coûts de 15%",
      "Mis en place d'un gestion de Budget efficace pour optimiser les dépenses",
    ],
    color: "#d414c4ff",
    icon: "/Resto.png",
  },
  
];

export const HERO_ROLES = ["Développeur Fullstack", "Architecte Backend", "Gestionnaire de Projet", "Problem Solver", "Developpeur Mobile", "Creation de Site Web"];

export const SOCIAL_LINKS = [
  { label: "GitHub", icon: "/Git3.png", href: "https://github.com/YannickMariano" },
  { label: "LinkedIn", icon: "/LinkedIn.png", href: "https://mg.linkedin.com/in/yannick-mariano-rakotoniharantsoa-0116b8280" },
  { label: "Telephone", icon: "/Phone.png", href: "tel: +261 38 61 390 62" },
  { label: "Email", icon: "/Mail.png", href: "mailto:r.yannick.mariano@gmail.com" },
];