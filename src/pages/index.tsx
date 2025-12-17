import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

// Module icons mapping
const moduleIcons: Record<string, string> = {
  introduction: '🚀',
  foundations: '🧠',
  ros2: '🤖',
  'gazebo-unity': '🎮',
  'nvidia-isaac': '⚡',
  'humanoid-robotics': '🦾',
  'conversational-robotics': '💬',
};

// Assessment type styles mapping
const assessmentTypeStyles: Record<string, string> = {
  'hands-on': styles.typeHandsOn,
  simulation: styles.typeSimulation,
  pipeline: styles.typePipeline,
  capstone: styles.typeCapstone,
};

// Textbook data
const textbookData = {
  title: "Physical AI & Humanoid Robotics",
  description: "A comprehensive textbook covering the fundamental concepts, technologies, and practical applications of physical artificial intelligence and humanoid robotics.",
  modules: [
    {
      id: "introduction",
      name: "Introduction",
      weeks: [1],
      description: "Foundations of Physical AI and embodied intelligence. Discover the cutting-edge intersection of AI and robotics.",
      learningObjectives: [
        "Understand what Physical AI is",
        "Explore embodied intelligence concepts",
        "Identify why Physical AI matters",
        "Define learning outcomes for the course"
      ]
    },
    {
      id: "foundations",
      name: "Foundations of Physical AI",
      weeks: [1, 2],
      description: "Core concepts of Physical AI and sensor systems. Build your understanding from the ground up.",
      learningObjectives: [
        "Understand foundational concepts of Physical AI",
        "Learn about sensors and perception",
        "Explore basic robotics concepts"
      ]
    },
    {
      id: "ros2",
      name: "ROS 2",
      weeks: [3, 4, 5],
      description: "Robot Operating System 2 fundamentals. Master the industry-standard framework for robotics.",
      learningObjectives: [
        "Learn ROS 2 basics",
        "Understand nodes, topics, and services",
        "Build ROS 2 packages"
      ]
    },
    {
      id: "gazebo-unity",
      name: "Gazebo & Unity",
      weeks: [6, 7],
      description: "Simulation environments for robotics. Create virtual worlds to test your robots safely.",
      learningObjectives: [
        "Use Gazebo simulation environment",
        "Work with URDF/SDF models",
        "Visualize in Unity"
      ]
    },
    {
      id: "nvidia-isaac",
      name: "NVIDIA Isaac",
      weeks: [8, 9, 10],
      description: "NVIDIA Isaac platform for robotics. Leverage GPU-accelerated AI for autonomous systems.",
      learningObjectives: [
        "Explore NVIDIA Isaac platform",
        "Learn perception and manipulation",
        "Understand RL and Sim-to-Real"
      ]
    },
    {
      id: "humanoid-robotics",
      name: "Humanoid Robotics",
      weeks: [11, 12],
      description: "Humanoid robot kinematics and control. Design robots that move like humans.",
      learningObjectives: [
        "Understand humanoid kinematics",
        "Learn locomotion and balance",
        "Explore manipulation techniques"
      ]
    },
    {
      id: "conversational-robotics",
      name: "Conversational Robotics",
      weeks: [13],
      description: "Integrating GPT, voice, and vision. Create robots that understand and communicate naturally.",
      learningObjectives: [
        "Implement GPT + Voice + Vision",
        "Create conversational interfaces",
        "Integrate multiple modalities"
      ]
    }
  ],
  assessments: [
    {
      id: "ros-project",
      name: "ROS 2 Project",
      type: "hands-on",
      duration: "2-3 weeks",
      description: "Implement a complete ROS 2 project with nodes, topics, and services. Build real robotic applications."
    },
    {
      id: "gazebo-project",
      name: "Gazebo Simulation",
      type: "simulation",
      duration: "2-3 weeks",
      description: "Create and simulate a robot in Gazebo environment. Test your designs in virtual reality."
    },
    {
      id: "isaac-pipeline",
      name: "Isaac Pipeline",
      type: "pipeline",
      duration: "3-4 weeks",
      description: "Build an end-to-end perception and manipulation pipeline using NVIDIA Isaac's powerful tools."
    },
    {
      id: "capstone-humanoid",
      name: "Capstone Project",
      type: "capstone",
      duration: "4-5 weeks",
      description: "Design and implement a complete humanoid robot system. Your ultimate robotics challenge."
    }
  ],
  hardware: [
    {
      id: "digital-twin-workstation",
      name: "Digital Twin Workstation",
      icon: "🖥️",
      specs: ["High-performance GPU", "Multi-core CPU", "16GB+ RAM"],
      purpose: "Simulation and development environment for creating digital twins of physical robots."
    },
    {
      id: "jetson-edge-kit",
      name: "Jetson Edge Kit",
      icon: "🔌",
      specs: ["NVIDIA Jetson board", "Robotics sensors", "Connectivity modules"],
      purpose: "Edge computing platform for deploying AI models directly on robots."
    }
  ],
  features: [
    {
      icon: "📚",
      title: "Comprehensive Curriculum",
      description: "13 weeks of structured content covering everything from fundamentals to advanced humanoid robotics."
    },
    {
      icon: "🛠️",
      title: "Hands-on Projects",
      description: "Real-world projects using industry-standard tools like ROS 2, Gazebo, and NVIDIA Isaac."
    },
    {
      icon: "🤖",
      title: "AI-Powered Assistant",
      description: "Get instant help from our AI chatbot that understands the entire textbook content."
    }
  ]
};

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      {/* Floating shapes for visual interest */}
      <div className={styles.floatingShapes}>
        <div className={clsx(styles.floatingShape, styles.shape1)} />
        <div className={clsx(styles.floatingShape, styles.shape2)} />
        <div className={clsx(styles.floatingShape, styles.shape3)} />
      </div>

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          {siteConfig.title}
        </h1>
        <p className={styles.heroSubtitle}>
          Master the future of robotics with our comprehensive guide to Physical AI,
          from foundational concepts to building intelligent humanoid systems.
        </p>

        {/* Stats */}
        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>7</div>
            <div className={styles.statLabel}>Modules</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>13</div>
            <div className={styles.statLabel}>Weeks</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>4</div>
            <div className={styles.statLabel}>Projects</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={styles.buttons}>
          <Link
            className={clsx(styles.heroButton, styles.heroButtonPrimary)}
            to="/docs/intro">
            Start Learning →
          </Link>
          <Link
            className={clsx(styles.heroButton, styles.heroButtonSecondary)}
            to="/docs/introduction">
            Explore Modules
          </Link>
        </div>
      </div>
    </header>
  );
}

function ModuleCard({ module, index }: { module: typeof textbookData.modules[0]; index: number }) {
  const icon = moduleIcons[module.id] || '📖';

  return (
    <div className={styles.moduleCard}>
      <span className={styles.moduleNumber}>{index + 1}</span>
      <div className={styles.moduleIcon}>{icon}</div>
      <h3 className={styles.moduleTitle}>{module.name}</h3>
      <span className={styles.weekBadge}>
        📅 Week{module.weeks.length > 1 ? 's' : ''} {module.weeks.join('-')}
      </span>
      <p className={styles.moduleDescription}>{module.description}</p>

      <div className={styles.learningObjectives}>
        <div className={styles.objectivesTitle}>What you'll learn</div>
        <ul className={styles.objectivesList}>
          {module.learningObjectives.slice(0, 3).map((obj, idx) => (
            <li key={idx} className={styles.objectiveItem}>
              <span className={styles.objectiveIcon}>✓</span>
              {obj}
            </li>
          ))}
        </ul>
      </div>

      <Link to={`/docs/${module.id}`} className={styles.moduleButton}>
        Start Module →
      </Link>
    </div>
  );
}

function AssessmentCard({ assessment }: { assessment: typeof textbookData.assessments[0] }) {
  const typeStyle = assessmentTypeStyles[assessment.type] || styles.typeHandsOn;

  return (
    <div className={styles.assessmentCard}>
      <span className={clsx(styles.assessmentType, typeStyle)}>
        {assessment.type}
      </span>
      <h3 className={styles.assessmentTitle}>{assessment.name}</h3>
      <div className={styles.assessmentMeta}>
        <span>⏱️ {assessment.duration}</span>
      </div>
      <p className={styles.assessmentDescription}>{assessment.description}</p>
      <Link to={`/docs/assessments/${assessment.id}`} className={styles.assessmentButton}>
        View Details →
      </Link>
    </div>
  );
}

function HardwareCard({ hardware }: { hardware: typeof textbookData.hardware[0] }) {
  return (
    <div className={styles.hardwareCard}>
      <div className={styles.hardwareIcon}>{hardware.icon}</div>
      <h3 className={styles.hardwareTitle}>{hardware.name}</h3>
      <p className={styles.hardwarePurpose}>{hardware.purpose}</p>
      <div className={styles.specsList}>
        {hardware.specs.map((spec, idx) => (
          <span key={idx} className={styles.specBadge}>{spec}</span>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ feature }: { feature: typeof textbookData.features[0] }) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>{feature.icon}</div>
      <h3 className={styles.featureTitle}>{feature.title}</h3>
      <p className={styles.featureDescription}>{feature.description}</p>
    </div>
  );
}

function HomepageContent() {
  return (
    <main>
      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Learn With Us?</h2>
            <p className={styles.sectionSubtitle}>
              Everything you need to become a Physical AI expert, all in one place.
            </p>
          </div>
          <div className={styles.featuresGrid}>
            {textbookData.features.map((feature, idx) => (
              <FeatureCard key={idx} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Course Modules</h2>
            <p className={styles.sectionSubtitle}>
              A structured journey from basics to building intelligent humanoid robots.
            </p>
          </div>
          <div className={styles.modulesGrid}>
            {textbookData.modules.map((module, index) => (
              <ModuleCard key={module.id} module={module} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Assessments Section */}
      <section className={styles.assessmentSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Hands-On Projects</h2>
            <p className={styles.sectionSubtitle}>
              Apply your knowledge through real-world challenges and build your portfolio.
            </p>
          </div>
          <div className={styles.assessmentsGrid}>
            {textbookData.assessments.map((assessment, index) => (
              <AssessmentCard key={index} assessment={assessment} />
            ))}
          </div>
        </div>
      </section>

      {/* Hardware Section */}
      <section className={styles.hardwareSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Hardware Requirements</h2>
            <p className={styles.sectionSubtitle}>
              The tools and systems you'll use for hands-on learning.
            </p>
          </div>
          <div className={styles.hardwareGrid}>
            {textbookData.hardware.map((hardware, idx) => (
              <HardwareCard key={idx} hardware={hardware} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Learn AI Robotics`}
      description="Comprehensive textbook for Physical AI & Humanoid Robotics - From fundamentals to building intelligent systems">
      <HomepageHeader />
      <HomepageContent />
    </Layout>
  );
}
