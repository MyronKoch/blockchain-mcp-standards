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
    title: 'Unified Standard',
    icon: '⭐',
    description: (
      <>
        Combines architecture (MSAS v1.0) and tool requirements (MBPS v2.1)
        into a single comprehensive standard. One source of truth for all blockchain MCP servers.
      </>
    ),
  },
  {
    title: 'Modular Architecture',
    icon: '🏗️',
    description: (
      <>
        Category-based tool organization with mandatory <code>core/</code>, <code>wallet/</code>,
        <code>network/</code>, and <code>tokens/</code> directories. Scale from 25 to 100+ tools.
      </>
    ),
  },
  {
    title: 'Factory Automation',
    icon: '🚀',
    description: (
      <>
        Generate compliant servers in minutes with factory scripts. Includes validation
        tools, testing frameworks, and implementation templates.
      </>
    ),
  },
  {
    title: 'Universal Compatibility',
    icon: '🌐',
    description: (
      <>
        Designed to work with any blockchain ecosystem (EVM, SVM, Move, etc.) while maintaining
        a consistent interface for AI agents.
      </>
    ),
  },
  {
    title: 'Enterprise Ready',
    icon: '🛡️',
    description: (
      <>
        Built-in error handling patterns, security best practices (API key cycling), and
        comprehensive testing standards.
      </>
    ),
  },
  {
    title: 'Developer Experience',
    icon: '⚡',
    description: (
      <>
        Clear documentation, quick start guides, and a standardized "Help" system
        make it easy for both humans and AIs to use.
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
