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
    title: 'Code Generation',
    icon: '🚀',
    description: (
      <>
        <code>bmcps-generator.js</code> turns the schema into project skeletons with stub
        handlers. As shipped, its MCP output needs fixes to compile; see Status.
      </>
    ),
  },
  {
    title: 'Chain-Agnostic Design',
    icon: '🌐',
    description: (
      <>
        One 25-tool interface meant to fit EVM, UTXO, Cosmos, and Move chains. The generator
        knows 17 chain identifiers; those are targets, not working integrations.
      </>
    ),
  },
  {
    title: 'Tested, With Known Gaps',
    icon: '✅',
    description: (
      <>
        238 automated generator tests pass. They check the shape of generated files, not that
        they build; closing that gap is first on my list.
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
