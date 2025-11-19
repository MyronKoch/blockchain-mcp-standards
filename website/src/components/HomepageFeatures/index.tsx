import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '⭐ Unified Standard',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        BMCPS v3.0 combines architecture (MSAS v1.0) and tool requirements (MBPS v2.1)
        into a single comprehensive standard. One source of truth for all blockchain MCP servers.
      </>
    ),
  },
  {
    title: '🏗️ Modular Architecture',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Category-based tool organization with mandatory <code>core/</code>, <code>wallet/</code>,
        <code>network/</code>, <code>tokens/</code>, and <code>help/</code> directories.
        Scale from 25 tools to 100+ with clean structure.
      </>
    ),
  },
  {
    title: '🚀 Factory Automation',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Generate compliant servers in minutes with our factory scripts. Includes validation
        tools, testing frameworks, and implementation templates for rapid development.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
