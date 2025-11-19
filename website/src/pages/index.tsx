import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Blockchain MCP Standard v3.0
        </Heading>
        <p className="hero__subtitle">
          The unified standard for building blockchain MCP servers across 15+ blockchains
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/01-Blockchain-MCP-Standard-v3.0">
            Read the Standard 📖
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/03-QUICK-START-GUIDE"
            style={{marginLeft: '1rem'}}>
            Quick Start Guide 🚀
          </Link>
        </div>
        <div style={{marginTop: '2rem', fontSize: '0.9rem', opacity: 0.8}}>
          <strong>25 mandatory tools</strong> • <strong>15 blockchains</strong> • <strong>Factory automation</strong> • <strong>MIT Licensed</strong>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Blockchain MCP Standard v3.0"
      description="The unified standard for building blockchain MCP servers - 25 mandatory tools across 15+ blockchains with modular architecture and factory automation">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
