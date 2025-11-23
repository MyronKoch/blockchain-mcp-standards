import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
  colSpan?: number;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Multi-Protocol Support',
    icon: '🔄',
    description: (
      <>
        Generate MCP servers, OpenAI Functions, REST APIs, or JSON schemas — all from one universal
        tool definition. Choose the right protocol for your use case.
      </>
    ),
  },
  {
    title: 'Context Management',
    icon: '🧠',
    description: (
      <>
        MCP (~5k tokens), OpenAI Functions (~500 tokens), or REST API (zero tokens).
        Optimize context overhead based on your conversation length needs.
      </>
    ),
  },
  {
    title: 'Factory Automation',
    icon: '🚀',
    description: (
      <>
        Generate compliant integrations in seconds with <code>bmcps-generator.js</code>.
        Complete with validation, testing, and documentation.
      </>
    ),
  },
  {
    title: 'Universal Compatibility',
    icon: '🌐',
    description: (
      <>
        Designed for any blockchain (EVM, SVM, Move, etc.) with 17+ supported chains
        and a consistent 25-tool interface.
      </>
    ),
  },
  {
    title: 'Production Ready',
    icon: '✅',
    description: (
      <>
        238 automated tests (100% passing). Built-in error handling, security patterns,
        and comprehensive testing standards.
      </>
    ),
  },
  {
    title: 'Developer Experience',
    icon: '⚡',
    description: (
      <>
        One command generates everything: <code>--format mcp</code>, <code>--format openai</code>,
        <code>--format rest-api</code>, or <code>--format all</code>.
      </>
    ),
  },
];

function Feature({ title, icon, description }: FeatureItem) {
  return (
    <div className="bento-card">
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className="bento-section">
      <div className="container">
        <div className="text--center">
          <Heading as="h2" style={{ fontSize: '2.5rem' }}>Why BMCPS?</Heading>
          <p className="text--secondary">The foundation for the next generation of AI-Blockchain integration.</p>
        </div>
        <div className="bento-grid">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
