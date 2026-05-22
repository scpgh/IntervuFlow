import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API Client
let aiModel = null;

try {
  if (process.env.GEMINI_API_KEY) {
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Using gemini-1.5-flash for fast, responsive generation
    aiModel = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('✅ Gemini API Client Successfully Initialized');
  } else {
    console.warn('⚠️ GEMINI_API_KEY not found in environment. Mock Database and local heuristics will be used.');
  }
} catch (err) {
  console.error('❌ Failed to initialize Gemini client:', err.message);
}

// -------------------------------------------------------------
// LOCAL MOCK QUESTION BANK (20 ROLES)
// -------------------------------------------------------------
const MOCK_QUESTION_BANK = {
  'DSA': {
    'Easy': [
      "Explain the difference between an Array and a Linked List.",
      "What is a Stack and how is it different from a Queue?",
      "Describe the concept of recursion with a simple example.",
      "What is the time complexity of searching in a Hash Table?",
      "How does a Binary Search algorithm work?",
      "Explain the concept of Big O notation.",
      "What is a palindrome and how would you check for it?",
      "Describe how you would reverse a string."
    ],
    'Medium': [
      "How would you detect a cycle in a Linked List?",
      "Explain the differences between QuickSort and MergeSort.",
      "What is a Binary Search Tree and how do you insert a node?",
      "How do you find the lowest common ancestor of two nodes in a binary tree?",
      "Explain dynamic programming and provide a real-world example.",
      "How do you implement a LRU Cache?",
      "What is a Trie data structure and when is it useful?",
      "Describe how Dijkstra's algorithm works."
    ],
    'Hard': [
      "Explain the A* search algorithm and its heuristic function.",
      "How would you serialize and deserialize a Binary Tree?",
      "Discuss the implementation and complexity of a Fibonacci Heap.",
      "How do you solve the Traveling Salesperson Problem?",
      "Explain the KMP algorithm for string matching.",
      "How do you find the longest palindromic substring in linear time?",
      "Describe the algorithmic approach to solving the N-Queens problem.",
      "Explain how you would design a data structure that supports insert, delete, and getRandom in O(1) time."
    ]
  },
  'System Design': {
    'Easy': [
      "What is the difference between vertical and horizontal scaling?",
      "Explain what a Load Balancer does.",
      "What is caching and why is it important?",
      "Describe the difference between SQL and NoSQL databases.",
      "What is a Content Delivery Network (CDN)?",
      "Explain the concept of microservices architecture.",
      "What is database replication?",
      "Describe the role of a reverse proxy."
    ],
    'Medium': [
      "How would you design a URL shortening service like Bitly?",
      "Explain the differences between eventual consistency and strong consistency.",
      "How does database sharding work and what are its challenges?",
      "Design a rate limiter for an API gateway.",
      "How would you design a highly available messaging queue?",
      "Explain the CAP theorem and its implications.",
      "How do you handle pagination for an API returning millions of records?",
      "Design a basic chat application."
    ],
    'Hard': [
      "Design a global video streaming platform like Netflix.",
      "How would you design a distributed key-value store?",
      "Design a ride-sharing service like Uber.",
      "How do you implement distributed transactions across multiple microservices?",
      "Design a system to process billions of real-time events per day.",
      "How would you architect a distributed web crawler?",
      "Explain how Paxos or Raft consensus algorithms work.",
      "Design a location-based search system (like Yelp or Tinder)."
    ]
  },
  'Frontend': {
    'Easy': [
      "What is the Virtual DOM and how does it improve performance?",
      "Explain the difference between let, const, and var in JavaScript.",
      "What are React Hooks and why were they introduced?",
      "Explain the CSS box model.",
      "What is the purpose of semantic HTML?",
      "How does event delegation work in JavaScript?",
      "Explain the difference between == and ===.",
      "What is CORS and why is it necessary?"
    ],
    'Medium': [
      "Explain the lifecycle of a React component.",
      "How do you handle state management in a large React application?",
      "Describe the concept of closures in JavaScript.",
      "How do you optimize a web application for accessibility (a11y)?",
      "Explain how Server-Side Rendering (SSR) differs from Client-Side Rendering (CSR).",
      "What are Web Workers and when would you use them?",
      "How does JavaScript's event loop handle asynchronous operations?",
      "Explain the concept of CSS Grid vs Flexbox."
    ],
    'Hard': [
      "How would you design the architecture for a large-scale enterprise frontend app?",
      "Explain how you would implement a custom React renderer.",
      "Discuss strategies for optimizing Web Vitals (LCP, FID, CLS).",
      "How do you handle offline capabilities and caching with Service Workers?",
      "Explain the internals of how a browser renders a web page from HTML to pixels.",
      "Design a robust client-side routing library from scratch.",
      "How do you manage memory leaks in a Single Page Application?",
      "Explain Micro-frontends and the tradeoffs of using them."
    ]
  },
  'Backend': {
    'Easy': [
      "What is the difference between REST and GraphQL?",
      "Explain the concept of middleware in Express.js.",
      "What are HTTP status codes and why are they important?",
      "How do you secure a REST API?",
      "What is the purpose of JWT (JSON Web Tokens)?",
      "Explain the difference between GET and POST requests.",
      "What is database indexing?",
      "Describe how you handle errors in a Node.js application."
    ],
    'Medium': [
      "How do you prevent SQL injection and XSS attacks?",
      "Explain the concept of connection pooling.",
      "How do you implement pagination and filtering in a REST API?",
      "Discuss the pros and cons of microservices vs monolithic architecture.",
      "How does OAuth 2.0 work?",
      "Explain the implementation of web sockets for real-time communication.",
      "How do you handle long-running background jobs?",
      "Describe strategies for API versioning."
    ],
    'Hard': [
      "How would you design an Idempotent API for payment processing?",
      "Discuss the implementation of a distributed locking mechanism.",
      "How do you architect an event-driven system using Kafka or RabbitMQ?",
      "Explain how you would migrate a massive legacy database with zero downtime.",
      "Design an auto-scaling backend infrastructure using Docker and Kubernetes.",
      "How do you manage distributed tracing and observability?",
      "Explain the intricacies of implementing GraphQL federation.",
      "How do you optimize a Node.js backend to handle 10k concurrent connections?"
    ]
  },
  'Behavioural': {
    'Easy': [
      "Tell me about a time you worked on a team project.",
      "Describe a situation where you had to learn a new technology quickly.",
      "What is your greatest professional achievement?",
      "How do you handle tight deadlines?",
      "Tell me about a time you made a mistake and how you resolved it.",
      "Why are you interested in this role?",
      "How do you prioritize your daily tasks?",
      "Describe a time you received constructive feedback."
    ],
    'Medium': [
      "Tell me about a time you had a conflict with a coworker and how you resolved it.",
      "Describe a situation where a project scope changed significantly mid-way.",
      "Tell me about a time you had to persuade a team to adopt your idea.",
      "How do you handle an underperforming team member?",
      "Describe a time you had to make a decision with incomplete information.",
      "Tell me about a time you failed to meet an objective.",
      "How do you balance technical debt with delivering new features?",
      "Describe a time you had to communicate a complex technical concept to a non-technical stakeholder."
    ],
    'Hard': [
      "Tell me about a time you had to lead a team through a major crisis.",
      "Describe a situation where you disagreed with a senior leader's decision.",
      "Tell me about a time you had to terminate or significantly restructure a project.",
      "How do you align engineering goals with business objectives?",
      "Describe a time you fundamentally changed the culture or process of your engineering team.",
      "Tell me about a time you took a calculated risk that failed.",
      "How do you handle a situation where two critical stakeholders have completely opposing requirements?",
      "Describe a time you mentored someone who was struggling significantly."
    ]
  },
  'HR': {
    'Easy': [
      "Where do you see yourself in five years?",
      "What are your main strengths and weaknesses?",
      "Why do you want to leave your current job?",
      "What are your salary expectations?",
      "How do you define success in your career?",
      "What motivates you to perform at your best?",
      "How do you handle a fast-paced work environment?",
      "What are you looking for in a new team?"
    ],
    'Medium': [
      "How do you align your personal goals with the company's mission?",
      "Describe a time when your values conflicted with a company's actions.",
      "How do you evaluate if a company's culture is a good fit for you?",
      "What role does continuous learning play in your career?",
      "How do you handle professional burnout?",
      "Describe a time you stepped outside your official job description.",
      "How do you approach remote work and staying connected with a team?",
      "What is your ideal management style?"
    ],
    'Hard': [
      "How would you handle a situation where you discovered unethical behavior by a manager?",
      "Describe a scenario where you had to negotiate your terms of employment significantly.",
      "How do you deal with organizational restructuring that negatively impacts your role?",
      "Tell me about a time you championed diversity and inclusion in the workplace.",
      "How do you manage up and influence leadership decisions?",
      "Describe your approach to building team morale during difficult periods.",
      "How would you handle being passed over for a promotion you felt you deserved?",
      "What would you do if a company asked you to relocate immediately?"
    ]
  },
  'Data Science': {
    'Easy': [
      "What is the difference between supervised and unsupervised learning?",
      "Explain the concept of Overfitting.",
      "What is a Confusion Matrix?",
      "Describe the K-Means clustering algorithm.",
      "What is linear regression?",
      "How do you handle missing values in a dataset?",
      "What is Cross-Validation?",
      "Explain the Central Limit Theorem."
    ],
    'Medium': [
      "Explain the difference between L1 and L2 regularization.",
      "How does a Random Forest algorithm work?",
      "What are eigenvectors and eigenvalues in PCA?",
      "Describe the bias-variance tradeoff.",
      "How do you select the optimal number of clusters in K-Means?",
      "Explain the concept of gradient descent.",
      "What is TF-IDF and how is it used?",
      "How do you deal with imbalanced datasets?"
    ],
    'Hard': [
      "Derive the backpropagation algorithm for a neural network.",
      "Explain the mathematical intuition behind Support Vector Machines.",
      "How would you design a recommendation engine for an e-commerce site?",
      "Discuss the implementation of XGBoost and its advantages.",
      "How do you deploy and monitor a machine learning model in production?",
      "Explain the architecture of a Transformer model.",
      "How do you detect and handle data drift?",
      "Design an anomaly detection system for credit card fraud."
    ]
  },
  'DevOps': {
    'Easy': [
      "What is Continuous Integration and Continuous Deployment (CI/CD)?",
      "Explain the concept of Infrastructure as Code (IaC).",
      "What is Docker and why is it used?",
      "What is the difference between a Virtual Machine and a Container?",
      "Explain the purpose of version control like Git.",
      "What is Jenkins?",
      "How do you monitor a server's health?",
      "What is the role of a reverse proxy like Nginx?"
    ],
    'Medium': [
      "Explain the architecture of Kubernetes.",
      "How do you manage secrets and configuration in a CI/CD pipeline?",
      "Describe a blue-green deployment strategy.",
      "How does Terraform handle state?",
      "Explain the concept of immutable infrastructure.",
      "How do you implement centralized logging using the ELK stack?",
      "What are Prometheus and Grafana used for?",
      "How do you handle database migrations in a CI/CD pipeline?"
    ],
    'Hard': [
      "Design a highly available and fault-tolerant architecture on AWS.",
      "How do you implement zero-downtime deployments for stateful applications?",
      "Discuss strategies for securing a Kubernetes cluster.",
      "How do you build a multi-region active-active deployment?",
      "Explain the concept and implementation of Service Mesh (like Istio).",
      "How do you handle disaster recovery for a large-scale database?",
      "Design an auto-scaling infrastructure that optimizes for cost.",
      "How do you architect a secure and compliant CI/CD pipeline for financial data?"
    ]
  },
  'Mobile Development': {
    'Easy': [
      "What is the difference between native, hybrid, and cross-platform app development?",
      "Explain the Activity lifecycle in Android or ViewController lifecycle in iOS.",
      "What are intents in Android?",
      "How do you manage state in a React Native application?",
      "What is Auto Layout in iOS?",
      "Explain the concept of push notifications.",
      "How do you handle different screen sizes?",
      "What is Gradle in Android?"
    ],
    'Medium': [
      "Explain memory management in iOS (ARC) or Android.",
      "How do you handle background tasks and services in mobile apps?",
      "Describe the MVVM architecture in mobile development.",
      "How do you optimize list views (RecyclerView in Android, UITableView in iOS)?",
      "Explain how to securely store sensitive data on a mobile device.",
      "How do you handle offline functionality and synchronization?",
      "Discuss strategies for reducing app bundle size.",
      "How do you implement deep linking?"
    ],
    'Hard': [
      "How would you design a complex offline-first architecture for a mobile app?",
      "Discuss performance optimization for a 60fps mobile animation.",
      "How do you handle concurrent network requests and data consistency?",
      "Design a robust mobile payment flow.",
      "Explain how to build custom UI components with complex touch gestures.",
      "How do you implement real-time bidirectional communication (WebSockets) effectively on mobile?",
      "Discuss the security implications and mitigation strategies for mobile APIs.",
      "How do you architect a multi-module mobile application for a large team?"
    ]
  },
  'Cybersecurity': {
    'Easy': [
      "What is the CIA triad?",
      "Explain the difference between symmetric and asymmetric encryption.",
      "What is a firewall and how does it work?",
      "Describe Phishing and how to prevent it.",
      "What is Multi-Factor Authentication (MFA)?",
      "Explain what a VPN does.",
      "What is malware?",
      "What is a Denial of Service (DoS) attack?"
    ],
    'Medium': [
      "Explain Cross-Site Scripting (XSS) and how to mitigate it.",
      "What is SQL Injection and how do you prevent it?",
      "Describe the concept of Least Privilege.",
      "How does Public Key Infrastructure (PKI) work?",
      "Explain the difference between IDS and IPS.",
      "What is a buffer overflow vulnerability?",
      "Discuss the concept of Zero Trust Architecture.",
      "How do you secure a REST API?"
    ],
    'Hard': [
      "How would you design a secure architecture for a cloud-native financial application?",
      "Discuss the methodology of conducting a comprehensive penetration test.",
      "How do you respond to and investigate a major data breach (Incident Response)?",
      "Explain advanced techniques for bypassing Web Application Firewalls (WAF).",
      "How do you implement secure key management in a distributed system?",
      "Discuss the implications of Quantum Computing on current cryptography.",
      "How do you design a secure boot process for an IoT device?",
      "Explain the mechanics of a sophisticated APT (Advanced Persistent Threat) attack."
    ]
  },
  'Product Management': {
    'Easy': [
      "What is the role of a Product Manager?",
      "Explain the difference between Agile and Waterfall methodologies.",
      "What is an MVP (Minimum Viable Product)?",
      "How do you write a good user story?",
      "What is a product roadmap?",
      "How do you prioritize features?",
      "What are OKRs?",
      "Describe the concept of User Personas."
    ],
    'Medium': [
      "How do you handle conflicting priorities from different stakeholders?",
      "Describe a time you had to say 'no' to a feature request.",
      "How do you measure the success of a new product launch?",
      "Explain your approach to conducting user research and interviews.",
      "How do you balance technical debt with new feature development?",
      "What is your framework for A/B testing?",
      "How do you price a new SaaS product?",
      "Describe how you manage a product backlog."
    ],
    'Hard': [
      "How would you define the product strategy for entering a highly saturated market?",
      "Describe a situation where a product failed and how you handled the post-mortem.",
      "How do you align the product vision across a 500+ person engineering organization?",
      "Design the monetization strategy for a free consumer app.",
      "How do you evaluate an acquisition target from a product perspective?",
      "Discuss how to pivot a product that is losing market share.",
      "How do you foster a product-led growth (PLG) culture?",
      "Explain how you manage product development with globally distributed teams."
    ]
  },
  'UI/UX Design': {
    'Easy': [
      "What is the difference between UI and UX?",
      "Explain the concept of wireframing.",
      "What is responsive design?",
      "Describe the importance of white space.",
      "What are heuristics in UX design?",
      "Explain the concept of accessibility in design.",
      "What is a style guide or design system?",
      "How do you use color theory in UI design?"
    ],
    'Medium': [
      "How do you conduct usability testing?",
      "Explain your process for creating a user journey map.",
      "How do you balance aesthetic design with functional usability?",
      "Describe a time you redesigned an interface based on user feedback.",
      "How do you handle designing for edge cases?",
      "What is Information Architecture?",
      "How do you incorporate micro-interactions to improve UX?",
      "Discuss the tradeoff between consistency and innovation in design."
    ],
    'Hard': [
      "How would you design a complex dashboard for enterprise data analytics?",
      "Describe your process for building and scaling a design system from scratch.",
      "How do you justify design decisions to business stakeholders using data?",
      "Discuss strategies for designing an application for users with severe cognitive disabilities.",
      "How do you approach designing for augmented or virtual reality interfaces?",
      "Explain how to conduct a UX audit on an existing legacy application.",
      "How do you integrate UX research into an agile development sprint?",
      "Design a seamless onboarding experience for a highly technical SaaS product."
    ]
  },
  'Database': {
    'Easy': [
      "What is a primary key and a foreign key?",
      "Explain the ACID properties of a database.",
      "What is normalization?",
      "Describe the difference between an INNER JOIN and a LEFT JOIN.",
      "What is a database index?",
      "Explain the difference between a table and a view.",
      "What is a stored procedure?",
      "How do you backup a database?"
    ],
    'Medium': [
      "Explain the difference between clustered and non-clustered indexes.",
      "How do you optimize a slow-running SQL query?",
      "Discuss the pros and cons of denormalization.",
      "What is a transaction deadlock and how do you resolve it?",
      "Explain isolation levels in database transactions.",
      "How does a B-Tree index work?",
      "What is database sharding?",
      "Describe the use of triggers."
    ],
    'Hard': [
      "How would you design the database schema for a high-frequency trading platform?",
      "Explain the implementation details of MVCC (Multi-Version Concurrency Control).",
      "How do you migrate a massive relational database to a NoSQL database with zero downtime?",
      "Discuss strategies for managing distributed transactions.",
      "How do you implement robust database replication across multiple geographic regions?",
      "Explain how query optimizers work under the hood.",
      "Design a highly available database architecture capable of millions of writes per second.",
      "How do you handle schema evolution in a continuous deployment environment?"
    ]
  },
  'QA Testing': {
    'Easy': [
      "What is the difference between manual and automated testing?",
      "Explain what a test case is.",
      "What is regression testing?",
      "Describe the difference between black-box and white-box testing.",
      "What is a bug lifecycle?",
      "Explain Unit Testing.",
      "What is exploratory testing?",
      "How do you write a good bug report?"
    ],
    'Medium': [
      "How do you prioritize which tests to automate?",
      "Explain the concept of integration testing vs end-to-end testing.",
      "What is the Page Object Model in test automation?",
      "How do you handle flaky automated tests?",
      "Discuss your approach to performance and load testing.",
      "What is Test-Driven Development (TDD)?",
      "How do you test an API?",
      "Explain continuous testing in a CI/CD pipeline."
    ],
    'Hard': [
      "How would you design a test automation framework from scratch for a complex web application?",
      "Discuss strategies for testing machine learning algorithms.",
      "How do you implement effective security testing within an agile sprint?",
      "Design a testing strategy for a distributed microservices architecture.",
      "How do you manage test data for automated tests in different environments?",
      "Explain your approach to chaos engineering.",
      "How do you test for accessibility compliance at scale?",
      "Discuss the integration of AI tools into the QA testing process."
    ]
  },
  'Blockchain': {
    'Easy': [
      "What is a blockchain?",
      "Explain the concept of decentralization.",
      "What is a smart contract?",
      "Describe the difference between Proof of Work and Proof of Stake.",
      "What is a hash function?",
      "What is a public and private key in cryptocurrency?",
      "Explain what a digital wallet is.",
      "What is a dApp?"
    ],
    'Medium': [
      "Explain how a 51% attack works.",
      "What is the difference between Ethereum and Bitcoin?",
      "Describe how gas fees work on the Ethereum network.",
      "What is an ERC-20 token?",
      "Explain the concept of consensus mechanisms.",
      "How do you handle security vulnerabilities in smart contracts?",
      "What is a hard fork?",
      "Describe Layer 2 scaling solutions."
    ],
    'Hard': [
      "How would you design a secure, decentralized voting system?",
      "Explain the intricacies of Zero-Knowledge Proofs (ZKPs) and their applications.",
      "Discuss the architecture of a cross-chain bridge and its security risks.",
      "How do you optimize a smart contract for gas efficiency?",
      "Explain the mechanics of flash loans and how to defend against flash loan attacks.",
      "Design a decentralized autonomous organization (DAO) governance structure.",
      "How do you implement off-chain computation securely?",
      "Discuss the challenges and solutions for blockchain interoperability."
    ]
  },
  'AI/ML': {
    'Easy': [
      "What is Artificial Intelligence vs Machine Learning?",
      "Explain what a Neural Network is.",
      "What is Natural Language Processing (NLP)?",
      "Describe the concept of deep learning.",
      "What is Computer Vision?",
      "Explain what training data and testing data are.",
      "What is an activation function?",
      "Describe a common use case for predictive analytics."
    ],
    'Medium': [
      "Explain how Convolutional Neural Networks (CNNs) work.",
      "What are Recurrent Neural Networks (RNNs) and LSTMs?",
      "Describe the concept of Transfer Learning.",
      "How do you evaluate the performance of an NLP model?",
      "Explain the Attention mechanism.",
      "What are Generative Adversarial Networks (GANs)?",
      "How do you handle vanishing and exploding gradients?",
      "Discuss the ethical implications of biased training data."
    ],
    'Hard': [
      "Explain the architecture and mechanism of Transformer models (like BERT or GPT).",
      "How would you design a scalable architecture for training massive LLMs?",
      "Discuss techniques for model quantization and edge deployment.",
      "How do you implement Reinforcement Learning for an autonomous agent?",
      "Explain the mathematical formulation of backpropagation through time (BPTT).",
      "Design a system for real-time multimodal emotion recognition.",
      "How do you optimize hyperparameters efficiently at scale?",
      "Discuss the concept of differential privacy in machine learning."
    ]
  },
  'Embedded Systems': {
    'Easy': [
      "What is an embedded system?",
      "Explain the difference between a microcontroller and a microprocessor.",
      "What is an RTOS (Real-Time Operating System)?",
      "Describe the purpose of GPIO pins.",
      "What is an interrupt?",
      "Explain the difference between volatile and non-volatile memory.",
      "What is PWM (Pulse Width Modulation)?",
      "Describe the I2C communication protocol."
    ],
    'Medium': [
      "Explain how DMA (Direct Memory Access) works.",
      "Discuss the differences between SPI, I2C, and UART.",
      "How do you handle debouncing a physical switch in software?",
      "Explain the concept of priority inversion in an RTOS and how to solve it.",
      "How do you optimize power consumption in an embedded device?",
      "What is a watchdog timer and why is it crucial?",
      "Describe memory management in a resource-constrained environment.",
      "How do you implement firmware Over-The-Air (OTA) updates securely?"
    ],
    'Hard': [
      "Design the firmware architecture for a life-critical medical device.",
      "How do you debug hard faults and memory corruption in bare-metal C code?",
      "Discuss strategies for implementing secure boot on a microcontroller.",
      "How would you design a custom communication protocol for a noisy industrial environment?",
      "Explain the intricacies of writing a custom bootloader.",
      "Design a real-time motor control system.",
      "How do you ensure determinism in a multi-core embedded system?",
      "Discuss hardware-software co-design principles for high-performance DSP."
    ]
  },
  'Game Development': {
    'Easy': [
      "What is a game engine?",
      "Explain the game loop.",
      "What is a sprite?",
      "Describe the concept of collision detection.",
      "What is a rigid body in physics simulation?",
      "Explain the difference between 2D and 3D graphics.",
      "What is a shader?",
      "Describe delta time and why it is important."
    ],
    'Medium': [
      "How do you implement A* pathfinding?",
      "Explain the concept of Object Pooling and why it's used in games.",
      "How do you handle state management for an RPG character?",
      "Discuss techniques for optimizing rendering performance (frustum culling, LOD).",
      "Explain how a basic physics engine resolves collisions.",
      "How do you implement a robust save/load system?",
      "Describe the Entity-Component-System (ECS) architecture.",
      "How do you manage audio spatialization?"
    ],
    'Hard': [
      "Design the networking architecture for a fast-paced multiplayer FPS.",
      "Explain how you would implement client-side prediction and server reconciliation.",
      "How do you optimize memory and garbage collection to prevent frame drops in Unity or Unreal?",
      "Design an AI system for complex NPC behavior using Behavior Trees and Utility AI.",
      "Explain advanced rendering techniques like deferred shading or ray tracing.",
      "How do you implement procedural generation for an infinite world?",
      "Discuss strategies for anti-cheat systems in online games.",
      "How do you architect a data-driven game engine from scratch?"
    ]
  },
  'Data Engineering': {
    'Easy': [
      "What is the difference between a Data Warehouse and a Data Lake?",
      "Explain the ETL process.",
      "What is Apache Hadoop?",
      "Describe the concept of data partitioning.",
      "What is a data pipeline?",
      "Explain the difference between batch processing and stream processing.",
      "What is Apache Spark?",
      "Describe a Star Schema."
    ],
    'Medium': [
      "How do you optimize a slow-running Spark job?",
      "Explain the concept of a Data Mesh.",
      "How do you handle late-arriving data in a streaming pipeline?",
      "Discuss the architecture of Apache Kafka.",
      "How do you ensure data quality and integrity in a pipeline?",
      "Explain the difference between OLAP and OLTP.",
      "How do you design a slowly changing dimension (SCD)?",
      "Describe the use of Apache Airflow for workflow orchestration."
    ],
    'Hard': [
      "Design a real-time data streaming architecture handling 1 million events per second.",
      "How do you build a highly scalable and fault-tolerant data lakehouse architecture?",
      "Discuss strategies for handling schema evolution in big data systems.",
      "How do you optimize data storage formats (Parquet, ORC) for complex analytical queries?",
      "Explain the intricacies of implementing Exactly-Once semantics in a distributed stream processor.",
      "Design a global data catalog and governance framework for an enterprise.",
      "How do you manage and orchestrate thousands of interdependent data pipelines?",
      "Discuss the implementation of distributed joins across massive datasets."
    ]
  },
  'Full Stack': {
    'Easy': [
      "What does a Full Stack Developer do?",
      "Explain the Model-View-Controller (MVC) architecture.",
      "What is the difference between client-side and server-side rendering?",
      "Describe how you connect a React frontend to a Node.js backend.",
      "What is an API endpoint?",
      "Explain the concept of responsive web design.",
      "What is a package manager like npm?",
      "Describe how sessions and cookies work."
    ],
    'Medium': [
      "How do you implement secure authentication in a full stack application?",
      "Explain how you would deploy a full stack application to production.",
      "How do you handle state across the frontend and backend?",
      "Describe your approach to end-to-end testing.",
      "How do you optimize the performance of a full stack app?",
      "Explain the concept of WebSockets for real-time features.",
      "How do you manage environment variables and secrets?",
      "Discuss your strategy for handling database migrations alongside frontend updates."
    ],
    'Hard': [
      "Design a highly available and scalable full stack architecture for an e-commerce platform.",
      "How do you implement an event-driven architecture across the full stack?",
      "Discuss your approach to migrating a legacy monolithic application to microservices and micro-frontends.",
      "How do you ensure seamless offline capabilities and data synchronization?",
      "Explain how you would implement robust caching strategies at every layer of the stack.",
      "Design a secure and scalable CI/CD pipeline for a complex full stack repository.",
      "How do you handle cross-origin resource sharing (CORS) securely in a distributed system?",
      "Discuss strategies for performance monitoring and distributed tracing across the entire stack."
    ]
  }
};

// -------------------------------------------------------------
// HELPER: FISHER-YATES SHUFFLE
// -------------------------------------------------------------
function fisherYatesShuffle(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// -------------------------------------------------------------
// HELPER: GIBBERISH DETECTION (Heuristics)
// -------------------------------------------------------------
export function isGibberishOrRubbish(answer) {
  if (!answer || typeof answer !== 'string') return true;

  const clean = answer.trim();
  
  // 1. Extremely short length
  if (clean.length < 15) return true;

  // 2. Keyboard Mash Heuristic: Consecutive repeating characters
  if (/(.)\1{3,}/.test(clean)) return true;

  // 3. Sequential Keyboard Mash Pattern list
  const lowercase = clean.toLowerCase();
  const mashPatterns = [
    'asdf', 'sdfg', 'dfgh', 'fghj', 'ghjk', 'hjkl',
    'qwerty', 'werty', 'ertyu', 'rtyui', 'tyuio', 'yuiop',
    'zxcv', 'xcvb', 'cvbn', 'vbnm',
    'qaz', 'wsx', 'edc', 'rfv', 'tgb', 'yhn', 'ujm'
  ];
  for (const pat of mashPatterns) {
    if (lowercase.includes(pat)) return true;
  }

  // 4. White space checks: If strings over 15 characters contain NO whitespace
  if (clean.length > 15 && !/\s/.test(clean)) return true;

  // 5. Trash terms / filler keywords blacklist
  const trashResponses = [
    "don't know", "dont know", "do not know", "i dont know", "i do not know",
    "rubbish", "trash", "nothing", "skip", "idk", "qwer",
    "test answer", "hello world", "nonsense", "filler", "blah blah",
    "whatever", "what is this", "no idea", "pass", "no answer", "skip this",
    "i have no idea", "none", "na", "n/a", "nil", "rubbish answer", "filler text"
  ];
  const normalized = lowercase.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
  if (trashResponses.includes(normalized)) return true;

  // 6. Vowel-Consonant Ratio
  const letters = clean.replace(/[^a-zA-Z]/g, '');
  if (letters.length > 15) {
    const vowelCount = (letters.match(/[aeiouAEIOU]/g) || []).length;
    const vowelRatio = vowelCount / letters.length;
    if (vowelRatio < 0.12 || vowelRatio > 0.85) return true;
  }

  return false;
}

// -------------------------------------------------------------
// HELPER: IDEAL ANSWER GENERATOR
// -------------------------------------------------------------
function generateIdealAnswer(question, domain) {
  const lowercaseQ = question.toLowerCase();
  
  // Generic STAR template
  let baseTemplate = "An ideal candidate would answer using the STAR method: Situation (context), Task (challenge), Action (how you solved it technically), and Result (quantifiable outcome).";

  if (domain === 'DSA' || lowercaseQ.includes('algorithm') || lowercaseQ.includes('complexity')) {
    return "A model answer should clearly explain the algorithmic approach, mention the specific data structures used, analyze the Big O Time and Space complexity, and briefly discuss a potential edge case.";
  }
  if (domain === 'System Design' || lowercaseQ.includes('design') || lowercaseQ.includes('architecture')) {
    return "An ideal response would start with gathering constraints, outlining the high-level architecture (APIs, Databases, Caches), discussing specific scalability tradeoffs, and explaining how bottlenecks are mitigated.";
  }
  if (domain === 'Frontend' || lowercaseQ.includes('react') || lowercaseQ.includes('css')) {
    return "A strong technical answer will explain the core concepts clearly, detail how performance and state management are handled, and mention accessibility (a11y) or responsiveness considerations.";
  }
  if (domain === 'Backend' || lowercaseQ.includes('api') || lowercaseQ.includes('database')) {
    return "A high-quality response should discuss the underlying mechanisms, security considerations, database optimization strategies, and how to design the system to handle high concurrency.";
  }
  if (domain === 'Behavioural' || domain === 'HR' || lowercaseQ.includes('tell me about')) {
    return "A perfect answer uses the STAR method. Describe the Situation, the specific Task you were responsible for, the Action you took to overcome the challenge, and the measurable Result or learning outcome.";
  }

  return baseTemplate + " Provide technical details relevant to the question and demonstrate a deep understanding of tradeoffs.";
}

// -------------------------------------------------------------
// FALLBACK MOCK EVALUATION
// -------------------------------------------------------------
function generateMockEvaluation(question, answer, domain = 'DSA') {
  // 1. Pre-check for gibberish
  if (isGibberishOrRubbish(answer)) {
    return {
      score: 1,
      strengths: ["None identified due to invalid or incoherent answer."],
      improvements: [
        "Please provide a structured, relevant technical response explaining the core concepts in detail.",
        "Avoid submitting keyboard mash, filler text, or extremely short placeholder responses."
      ],
      tip: `Ideal Model Answer: ${generateIdealAnswer(question, domain)}`
    };
  }

  // 2. Length-based scoring heuristics
  const answerLength = answer.trim().length;
  let score = 2.0; // Base score starts at 2
  const lowercaseAnswer = answer.toLowerCase();
  
  if (answerLength < 50) {
    score += 0.5; // Very short
  } else if (answerLength < 100) {
    score += 1.5; // Short
  } else if (answerLength < 250) {
    score += 3.5; // Moderate
  } else if (answerLength < 500) {
    score += 5.5; // Good
  } else {
    score += 6.5; // Exceptional length
  }
  
  // 3. Keyword bonuses
  const technicalKeywords = [
    'structure', 'experience', 'example', 'optimize', 'scalability', 
    'performance', 'complexity', 'design', 'process', 'star',
    'algorithm', 'cache', 'database', 'latency', 'security', 'architecture'
  ];
  
  let keywordCount = 0;
  technicalKeywords.forEach(kw => {
    if (lowercaseAnswer.includes(kw)) {
      score += 0.3;
      keywordCount++;
    }
  });

  score = Math.min(Math.round(score * 10) / 10, 10);

  // 4. Generate Feedback
  const strengths = [];
  const improvements = [];

  if (score >= 7) {
    strengths.push("Demonstrates a solid understanding of the fundamental concepts.");
    strengths.push("Provides excellent detail and structure to back up assertions.");
  } else if (score >= 4) {
    strengths.push("Formulates a coherent basic response.");
    improvements.push("Elaborate further on trade-offs and technical depth related to the concept.");
  } else {
    strengths.push("Attempted to address the core topic.");
    improvements.push("The response lacks sufficient detail. Expand significantly on your explanation.");
  }

  if (!lowercaseAnswer.includes('example') && !lowercaseAnswer.includes('instance')) {
    improvements.push("Incorporate a concrete, real-world example to illustrate your points.");
  }

  if (keywordCount < 2) {
    improvements.push("Use more specific industry terminology and technical vocabulary to strengthen your answer.");
  }

  return { 
    score, 
    strengths, 
    improvements, 
    tip: `Ideal Model Answer: ${generateIdealAnswer(question, domain)}` 
  };
}

// -------------------------------------------------------------
// DYNAMIC AI QUESTION GENERATOR SERVICE
// -------------------------------------------------------------
export async function generateQuestions(domain, difficulty, count = 5) {
  const countNum = parseInt(count) || 5;

  if (aiModel) {
    try {
      const prompt = `Generate ${countNum} highly professional and diverse ${difficulty} level interview questions for a candidate applying for a "${domain}" role. 
      Ensure the questions cover distinct technical aspects, actual real-world scenarios, or conceptual problems within "${domain}". Do not repeat topics.
      Return ONLY a valid JSON array of strings. No explanation, no markdown, just the JSON array.
      Example format: ["Question 1?", "Question 2?"]`;
      
      const result = await aiModel.generateContent(prompt);
      const textResponse = result.response.text();
      
      const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, countNum);
      }
    } catch (err) {
      console.warn(`Gemini API Question Gen failed for "${domain}", falling back to database:`, err.message);
    }
  }

  // Fallback to local question bank using proper Fisher-Yates shuffle
  const normDomain = MOCK_QUESTION_BANK[domain] ? domain : 'DSA';
  const normDiff = MOCK_QUESTION_BANK[normDomain] && MOCK_QUESTION_BANK[normDomain][difficulty] ? difficulty : 'Medium';
  
  const bank = MOCK_QUESTION_BANK[normDomain][normDiff];
  const shuffled = fisherYatesShuffle(bank);
  
  // In case the bank has fewer questions than requested
  const returnCount = Math.min(countNum, shuffled.length);
  return shuffled.slice(0, returnCount);
}

// -------------------------------------------------------------
// AI ANSWER EVALUATION SERVICE
// -------------------------------------------------------------
export async function evaluateAnswer(question, answer, domain = 'DSA') {
  if (isGibberishOrRubbish(answer)) {
    return {
      score: 1,
      strengths: ["None identified due to invalid or incoherent response."],
      improvements: [
        "Please provide a structured, relevant technical response explaining the core concepts in detail.",
        "Avoid submitting keyboard mash, filler text, or extremely short placeholder responses."
      ],
      tip: `Ideal Model Answer: ${generateIdealAnswer(question, domain)}`
    };
  }

  if (aiModel) {
    try {
      const prompt = `You are a professional engineering interviewer evaluating a candidate's response.
      Domain: "${domain}"
      Question: "${question}"
      Answer: "${answer}"
      
      CRITICAL GRADING INSTRUCTIONS:
      1. If the candidate's answer is extremely brief, incoherent, off-topic, gibberish, or contains filler/garbage sentences, you MUST assign a score of 0, 1, or 2 out of 10. Do not give passing scores (5 or more) for non-cooperative, empty, or trash answers.
      2. Grade realistically. Assign scores of 8-10 only for excellent answers demonstrating deep technical details, vocabulary, and appropriate tradeoffs.
      
      MODEL ANSWER INSTRUCTION:
      - For the 'tip' key, you MUST generate a detailed, professional model answer in STAR format (Situation, Task, Action, Result) showing how a perfect candidate would answer this question in 2-4 sentences, complete with technical details or architecture. Do not give general advice in 'tip', give the actual ideal answer.
      
      Return ONLY a valid JSON object matching this schema:
      {
        "score": <number 0 to 10>,
        "strengths": ["<strength 1>", "<strength 2>"],
        "improvements": ["<improvement 1>", "<improvement 2>"],
        "tip": "<Detailed STAR model answer showing how a perfect candidate would answer this question>"
      }
      Do not wrap in markdown, return raw JSON.`;
      
      const result = await aiModel.generateContent(prompt);
      const textResponse = result.response.text();
      
      const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      if (parsed && typeof parsed.score === 'number') {
        return {
          score: parsed.score,
          strengths: parsed.strengths || [],
          improvements: parsed.improvements || [],
          tip: parsed.tip || ""
        };
      }
    } catch (err) {
      console.warn('Gemini API Answer Evaluation failed, falling back to heuristics:', err.message);
    }
  }

  return generateMockEvaluation(question, answer, domain);
}

// -------------------------------------------------------------
// AI RESUME ANALYSIS SERVICE
// -------------------------------------------------------------
export async function analyzeResume(resumeText, domain) {
  if (aiModel) {
    try {
      const prompt = `Analyze the following resume text tailored to a target domain of: "${domain}".
      Evaluate its strength for this role. You MUST return ONLY a valid JSON object with the following exact keys:
      {
        "score": <a number 0 to 100 based on metrics, achievements, STAR format, and keyword matching>,
        "summary": "<a 2-3 sentence high-level summary of the candidate's resume strength and key growth areas>",
        "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
        "improvements": ["<actionable improvement 1>", "<actionable improvement 2>", "<actionable improvement 3>"],
        "missingKeywords": ["<missing keyword 1>", "<missing keyword 2>", "<missing keyword 3>", "<missing keyword 4>", "<missing keyword 5>"],
        "starCalibration": "<a paragraph analyzing how well the bullet points incorporate the STAR (Situation, Task, Action, Result) method with quantitative results>",
        "recommendedQuestions": [
          { "question": "<recommended practice question 1>", "domain": "${domain}", "difficulty": "Medium" },
          { "question": "<recommended practice question 2>", "domain": "${domain}", "difficulty": "Medium" },
          { "question": "<recommended practice question 3>", "domain": "${domain}", "difficulty": "Medium" }
        ]
      }
      Do not include any explanation or markdown wraps, just the raw JSON object.`;

      const result = await aiModel.generateContent([
        prompt,
        { text: resumeText }
      ]);
      const textResponse = result.response.text();
      
      const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      if (parsed && typeof parsed.score === 'number') {
        const formattedQuestions = (parsed.recommendedQuestions || []).map((q, idx) => ({
          id: `rec-q-${idx}-${Date.now()}`,
          question: q.question || q,
          domain: q.domain || domain,
          difficulty: q.difficulty || "Medium"
        }));

        return {
          score: parsed.score,
          summary: parsed.summary || '',
          strengths: parsed.strengths || [],
          improvements: parsed.improvements || [],
          missingKeywords: parsed.missingKeywords || [],
          starCalibration: parsed.starCalibration || '',
          recommendedQuestions: formattedQuestions
        };
      }
    } catch (err) {
      console.warn('Gemini API Resume Analysis failed, falling back to local heuristic analyzer:', err.message);
    }
  }

  return generateMockResumeAnalysis(resumeText, domain);
}

// -------------------------------------------------------------
// DYNAMIC CHAT-STYLE MOCK INTERVIEW SERVICE
// -------------------------------------------------------------
export async function generateChatInitialQuestion(domain, difficulty) {
  if (aiModel) {
    try {
      const prompt = `You are a professional technical interviewer. Start a mock interview for a candidate applying for a "${difficulty}" level "${domain}" engineering or business role.
      Introduce yourself and ask ONLY the first interview question. Do not ask multiple questions. Keep it professional, friendly, and concise.
      Return a JSON response matching exactly: { "question": "<your first question text>" }.`;

      const result = await aiModel.generateContent(prompt);
      const textResponse = result.response.text();
      
      const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      if (parsed && parsed.question) {
        return parsed.question;
      }
    } catch (err) {
      console.warn('Gemini API Chat Initial Question failed, falling back to mock bank:', err.message);
    }
  }

  const normDomain = MOCK_QUESTION_BANK[domain] ? domain : 'DSA';
  const normDiff = MOCK_QUESTION_BANK[normDomain] && MOCK_QUESTION_BANK[normDomain][difficulty] ? difficulty : 'Medium';
  const bank = MOCK_QUESTION_BANK[normDomain][normDiff];
  return bank[Math.floor(Math.random() * bank.length)];
}

export async function generateChatFollowUp(domain, difficulty, chatLog) {
  if (aiModel) {
    try {
      const formattedHistory = chatLog.map(msg => `${msg.sender === 'ai' ? 'Interviewer' : 'Candidate'}: ${msg.text}`).join('\n');
      
      const prompt = `You are a professional technical interviewer conducting a "${difficulty}" level "${domain}" mock interview.
      Here is the complete conversation transcript so far:
      
      ${formattedHistory}
      
      Review the candidate's last response.
      CRITICAL GRADING CONSTRAINTS:
      - If the candidate's last response is extremely brief, gibberish, filler, or trash text, you MUST ask them to elaborate or clarify their response constructively instead of moving to a completely new topic. Keep the score metrics poor in the final evaluation.
      
      If their answer is fine:
      Respond to the candidate with a brief acknowledgement or encouraging validation of their answer (1-2 sentences), and then ask a dynamic, highly contextual follow-up question.
      The follow-up should dig deeper into their previous explanation, challenge their trade-offs, or ask how they would optimize/scale their approach. Keep your response concise (3-4 sentences total).
      
      Return ONLY a JSON response: { "reply": "<your response acknowledging their answer and asking the follow-up question>" }`;

      const result = await aiModel.generateContent(prompt);
      const textResponse = result.response.text();
      
      const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      if (parsed && parsed.reply) {
        return parsed.reply;
      }
    } catch (err) {
      console.warn('Gemini API Chat Follow-up failed, falling back to mock dialogue generator:', err.message);
    }
  }

  return generateMockChatFollowUp(domain, difficulty, chatLog);
}

export async function evaluateChatTranscript(domain, difficulty, chatLog) {
  if (aiModel) {
    try {
      const formattedHistory = chatLog.map(msg => `${msg.sender === 'ai' ? 'Interviewer' : 'Candidate'}: ${msg.text}`).join('\n');
      
      const prompt = `You are an elite engineering hiring panel assessing a candidate's completed mock interview for a "${difficulty}" level "${domain}" role.
      Here is the complete conversation transcript of the interview:
      
      ${formattedHistory}
      
      Analyze their answers and provide a comprehensive final grade evaluation.
      CRITICAL GRADING CONSTRAINT:
      - If the candidate answered using gibberish, filler, keyboard mash, or nonsensical answers during the conversation, you MUST score them 0.0, 1.0, or 2.0 out of 10.0 overall. Do not give passing scores.
      
      You MUST return ONLY a valid JSON object matching this exact schema:
      {
        "score": <a final performance score between 1.0 and 10.0, e.g. 7.5>,
        "summary": "<a high-level summary of the candidate's communication, problem solving, and domain knowledge shown in this conversation>",
        "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
        "improvements": ["<actionable improvement suggestion 1>", "<actionable improvement suggestion 2>", "<actionable improvement suggestion 3>"]
      }
      Do not wrap in markdown or explain, just the raw JSON object.`;

      const result = await aiModel.generateContent(prompt);
      const textResponse = result.response.text();
      
      const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      if (parsed && typeof parsed.score === 'number') {
        return {
          score: parsed.score,
          summary: parsed.summary || '',
          strengths: parsed.strengths || [],
          improvements: parsed.improvements || []
        };
      }
    } catch (err) {
      console.warn('Gemini API Chat Transcript evaluation failed, falling back to mock evaluator:', err.message);
    }
  }

  return generateMockChatConclude(domain, difficulty, chatLog);
}

// -------------------------------------------------------------
// LOCAL FALLBACK DATA GENERATORS
// -------------------------------------------------------------
function generateMockResumeAnalysis(resumeText, domain) {
  const cleanText = (resumeText || '').trim();
  const textLength = cleanText.length;
  
  if (textLength < 50) {
    return {
      score: 15,
      summary: "The provided resume is extremely brief or empty, making it impossible to perform a complete professional assessment.",
      strengths: ["None identified due to insufficient content."],
      improvements: [
        "Please provide a complete resume listing your experiences, education, and technical projects.",
        "Ensure you detail specific roles, timelines, and accomplishments."
      ],
      missingKeywords: ["Professional Experience", "Technical Skills", "Education", "Projects"],
      starCalibration: "We could not find any action-oriented bullet points. When writing accomplishments, make sure to detail the Situation, Task, Action, and specific numerical Result (e.g. 'Optimized database queries, reducing load times by 40%').",
      recommendedQuestions: [
        { id: `rec-q-0-${Date.now()}`, question: "Can you introduce yourself and talk about your main engineering focus?", domain, difficulty: "Easy" },
        { id: `rec-q-1-${Date.now()}`, question: "What is your typical process when building a new software project?", domain, difficulty: "Medium" }
      ]
    };
  }

  let score = 62;
  if (textLength > 300) score += 5;
  if (textLength > 800) score += 8;
  if (textLength > 1500) score += 10;
  
  const lowercase = cleanText.toLowerCase();
  
  const domainKeywords = {
    'DSA': ['algorithm', 'complexity', 'array', 'tree', 'graph', 'hash', 'recursion', 'sorting', 'search', 'optimization'],
    'System Design': ['architecture', 'scalability', 'microservices', 'database', 'caching', 'load balancing', 'sharding', 'replica', 'latency'],
    'Frontend': ['react', 'javascript', 'css', 'html', 'tailwind', 'typescript', 'webpack', 'dom', 'redux', 'responsive', 'performance'],
    'Backend': ['node', 'express', 'database', 'sql', 'nosql', 'api', 'jwt', 'security', 'docker', 'redis', 'graphql', 'auth'],
    'Behavioural': ['leadership', 'teamwork', 'deadline', 'conflict', 'collaboration', 'project', 'communication', 'ownership', 'star'],
    'HR': ['alignment', 'values', 'growth', 'culture', 'motivation', 'achievement', 'strengths', 'learning', 'career'],
    'Data Science': ['machine learning', 'python', 'pandas', 'scikit-learn', 'deep learning', 'nlp', 'statistics', 'modeling'],
    'DevOps': ['ci/cd', 'docker', 'kubernetes', 'jenkins', 'terraform', 'aws', 'linux', 'automation'],
    'Mobile Development': ['ios', 'android', 'react native', 'flutter', 'swift', 'kotlin', 'mobile', 'app'],
    'Cybersecurity': ['security', 'penetration testing', 'firewall', 'encryption', 'vulnerability', 'owasp', 'network security'],
    'Product Management': ['agile', 'roadmap', 'strategy', 'jira', 'user research', 'metrics', 'kpi', 'stakeholder'],
    'UI/UX Design': ['figma', 'wireframe', 'prototyping', 'user experience', 'accessibility', 'usability', 'design system'],
    'Database': ['sql', 'nosql', 'postgresql', 'mysql', 'mongodb', 'schema', 'query optimization', 'data modeling'],
    'QA Testing': ['selenium', 'cypress', 'automation', 'testing', 'jest', 'bug tracking', 'regression', 'unit testing'],
    'Blockchain': ['smart contracts', 'solidity', 'ethereum', 'web3', 'cryptography', 'defi', 'dapp'],
    'AI/ML': ['tensorflow', 'pytorch', 'neural networks', 'computer vision', 'nlp', 'llm', 'generative ai'],
    'Embedded Systems': ['c', 'c++', 'microcontroller', 'rtos', 'iot', 'hardware', 'firmware', 'spi', 'i2c'],
    'Game Development': ['unity', 'unreal engine', 'c#', 'c++', '3d', 'physics', 'rendering', 'gameplay'],
    'Data Engineering': ['spark', 'hadoop', 'kafka', 'etl', 'data pipeline', 'airflow', 'snowflake', 'big data'],
    'Full Stack': ['react', 'node.js', 'express', 'mongodb', 'typescript', 'api', 'frontend', 'backend']
  };

  const activeKeywords = domainKeywords[domain] || domainKeywords['DSA'];
  const missing = [];
  const found = [];

  activeKeywords.forEach(kw => {
    if (lowercase.includes(kw)) {
      score += 1.5;
      found.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    } else {
      missing.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  });

  score = Math.min(Math.round(score), 98);

  const strengths = [
    `Clear display of matching concepts aligned to the ${domain} domain.`,
    "Solid visual structure with descriptive details.",
  ];
  if (found.length > 3) {
    strengths.push(`Strong vocabulary in key fields such as ${found.slice(0, 3).join(', ')}.`);
  } else {
    strengths.push("Good organization of professional background details.");
  }

  const improvements = [
    `Incorporate more quantitative metrics. Try to state specific percentages, numerical hours, or dollar amounts to validate your achievements.`,
    `Integrate more industry standard keywords related to ${domain} (e.g. ${missing.slice(0, 2).join(', ')}) to successfully pass automated ATS scanners.`,
  ];
  if (lowercase.includes('responsibilities include') || lowercase.includes('responsible for')) {
    improvements.push("Shift away from passive duty descriptions ('Responsible for writing tests') toward action-oriented result statements ('Implemented a Jest test suite, boosting code coverage to 92%').");
  }

  const starCalibration = lowercase.includes('result') || lowercase.includes('%') || lowercase.includes('optimized')
    ? "Good start using result-driven vocabulary. You have quantified some impact! Continue refining by ensuring every project bullet point follows the exact 'Action -> Result' sequence."
    : "Your bullets focus heavily on tasks and duties rather than results. Transform your bullet points to clearly highlight the Situation, Task, Action you took, and the quantifiable Result (e.g., speedups, user growth, or error reductions).";

  const normDomain = MOCK_QUESTION_BANK[domain] ? domain : 'DSA';
  const questionsList = MOCK_QUESTION_BANK[normDomain]['Medium'];
  const shuffledQuestions = fisherYatesShuffle(questionsList).slice(0, 3);
    
  const recommendedQuestions = shuffledQuestions.map((q, idx) => ({
    id: `rec-q-${idx}-${Date.now()}`,
    question: q,
    domain,
    difficulty: "Medium"
  }));

  return {
    score,
    summary: `Your resume outlines a promising background for a ${domain} position. To elevate your application to a premium standard, enrich your work descriptions with metric-based outcomes and incorporate missing core keywords to pass modern recruiter filter algorithms. Focus on demonstrating measurable impact.`,
    strengths,
    improvements,
    missingKeywords: missing.slice(0, 5),
    starCalibration,
    recommendedQuestions
  };
}

function generateMockChatFollowUp(domain, difficulty, chatLog) {
  const userMessages = chatLog.filter(m => m.sender === 'user');
  const lastUserAnswer = userMessages.length > 0 ? userMessages[userMessages.length - 1].text : '';
  
  if (isGibberishOrRubbish(lastUserAnswer)) {
    return "I noticed your response was a bit brief or contained unstructured characters. Could you explain your thoughts on this more clearly, perhaps sharing how you would apply standard architecture rules here?";
  }

  const lowercaseAnswer = lastUserAnswer.toLowerCase();
  let reply = "That's a very solid explanation of the concepts. You've clearly outlined the main mechanisms and considerations here.";
  
  if (lowercaseAnswer.length < 50) {
    reply = "I see, thank you for that brief overview. To help me evaluate further, could you expand a bit more on the specific implementation steps, perhaps detailing a time when you personally put this into practice?";
  } else if (lowercaseAnswer.includes('depend') || lowercaseAnswer.includes('trade-off') || lowercaseAnswer.includes('cost')) {
    reply = "I really appreciate how you highlighted the engineering trade-offs; that shows maturity. Moving forward, how would you handle monitoring and debugging this system or code once it is deployed at a massive production scale?";
  } else if (domain === 'DSA' || domain === 'System Design' || domain === 'Backend') {
    reply = "Excellent. You walked through the logic perfectly. If we were to encounter an edge-case where resources are highly constrained, how would you optimize your approach to handle this?";
  } else if (domain === 'Frontend' || domain === 'Mobile Development' || domain === 'UI/UX Design') {
    reply = "That makes perfect sense. Your approach is clean. How would you ensure this component remains fully accessible and performant for users on slower devices?";
  } else if (domain === 'Cybersecurity' || domain === 'DevOps') {
    reply = "Great strategy. In a scenario where this experiences a massive distributed attack or high-concurrency spikes, what rate-limiting or defensive mechanisms would you introduce?";
  } else {
    reply = "That is a very insightful reflection. To follow up on that, what was the primary bottleneck or challenge you encountered when solving this in the past, and how did you collaborate with your teammates to resolve it?";
  }

  return reply;
}

function generateMockChatConclude(domain, difficulty, chatLog) {
  const userMessages = chatLog.filter(m => m.sender === 'user');
  let totalLength = 0;
  let gibberishDetected = false;

  userMessages.forEach(m => {
    totalLength += m.text.length;
    if (isGibberishOrRubbish(m.text)) {
      gibberishDetected = true;
    }
  });
  
  const averageLength = userMessages.length > 0 ? totalLength / userMessages.length : 0;
  
  if (gibberishDetected) {
    return {
      score: 1.5,
      summary: "The candidate submitted several non-cooperative, empty, or gibberish answers during the session. Performance indicates a lack of domain skills or non-engagement with standard technical criteria.",
      strengths: ["None identified due to extremely poor quality replies."],
      improvements: [
        "Focus on providing complete, relevant explanations rather than random strings.",
        "Demonstrate standard communication professionalism during the interview rounds."
      ]
    };
  }

  let score = 5.0; // Starting from 5.0 base for chat interactions (they are usually shorter)
  if (averageLength > 100) score += 1.5;
  if (averageLength > 200) score += 1.5;
  if (userMessages.length >= 4) score += 0.5;
  
  score = parseFloat(Math.min(score, 9.8).toFixed(1));

  const strengths = [
    "Structured, logical explanations with clear concepts.",
    "Good awareness of practical solutions.",
  ];
  if (averageLength > 150) {
    strengths.push("Excellent elaboration depth, offering detailed descriptions rather than superficial definitions.");
  } else {
    strengths.push("Focused, prompt communication that addresses the core questions directly.");
  }

  const improvements = [
    "Aim to systematically incorporate quantitative results and concrete past achievements when validating technical claims.",
  ];
  if (averageLength < 100) {
    improvements.push("Elaborate further on edge cases, safety bounds, and testing strategies without needing explicit prompting.");
  } else {
    improvements.push("Discuss alternative approaches or trade-offs proactively to show wider engineering depth.");
  }

  return {
    score,
    summary: `The candidate demonstrated solid conversational capability and functional understanding of ${domain} concepts for a ${difficulty} level role. Visualizing trade-offs and backing up technical descriptions with numerical metrics will elevate their future interview outcomes.`,
    strengths,
    improvements
  };
}
