import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import SpaceFidget from '@site/src/components/SpaceFidget';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className="hero-container" style={{ position: 'relative', overflow: 'hidden' }}>
      <SpaceFidget />
      <div className="hero-glow" style={{ zIndex: 0 }} />
      <div className="container hero-content" style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
        <h1 className="hero-title">
          The Universal Standard<br />
          for Blockchain AI Integration
        </h1>
        <p className="hero-subtitle">
          Generate MCP servers, OpenAI functions, REST APIs, and more — all from one universal schema.
          Choose the right protocol for your context needs.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', pointerEvents: 'auto' }}>
          <Link
            className="button button--primary button--lg"
            to="/docs/Blockchain-MCP-Standard-v3.0">
            Read the Standard
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/QUICK-START-GUIDE">
            Quick Start ⚡
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="BMCPS v3.0"
      description="The universal standard for building blockchain MCP servers">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
