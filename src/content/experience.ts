/** Published portfolio experience records. */
export interface ExperienceEntry {
    company: string
    role: string
    date: string
    location: string
    description: readonly string[]
    type: 'Professional' | 'Academic'
}

export const experiences: readonly ExperienceEntry[] = [
    {
        company: 'Binocs.co',
        role: 'SDE I',
        date: 'Jun 2024 - Present',
        location: 'Bengaluru, IN',
        description: [
            'Designed and implemented a configurable rule engine using Abstract Syntax Trees (ASTs) for dynamic financial calculations, enabling real-time updates and seamless recalculations.',
            'Engineered scalable background processing pipelines with SNS/SQS and stage-based microservices for efficient task coordination.',
            'Built a Retrieval-Augmented Generation (RAG) chatbot pipeline using pgvector for vector-based embeddings and fuzzy search.',
            'Developed an automated regression testing framework deployed via Docker and Kubernetes.',
            'Engineered a flexible data processing system for dynamic unit conversions and nested data handling.',
        ],
        type: 'Professional',
    },
    {
        company: 'KLA',
        role: 'Software Engineer Intern',
        date: 'May 2023 - Oct 2023',
        location: 'Chennai, IN',
        description: [
            'Enhanced system performance by 80% using asynchronous logging and a publisher-subscriber model with Disruptor Framework and log4j.',
            'Created interactive log visualizations with TypeScript, React, Plotly for actionable system insights.',
            'Built a flexible framework using a rule-based context engine to parse and extract data from various log files.',
            'Developed a React-based micro frontend dashboard with Elastic Search integration for fast log analysis.',
            'Implemented design patterns like Singleton, Factory, Builder, Observer, and Publisher-Subscriber for modularity and maintainability.',
        ],
        type: 'Professional',
    },
    {
        company: 'IIITDM Kancheepuram',
        role: 'Teaching Assistant',
        date: 'Mar 2024 - May 2024',
        location: 'Chennai, IN',
        description: [
            'Supervised and assisted students in CS1006 Data Structures and Algorithms Practice and CS2010 Computer Organization and Architecture practice courses.',
            'Provided guidance in formulating, improving, and debugging code for weekly coding assignments.',
        ],
        type: 'Academic',
    },
]
