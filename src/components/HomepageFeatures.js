import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import Emoji from './Emoji';

const FeatureList = [
  {
    title: 'What Is This?',
    description: (
      <>
        <p>
          I created this blogging site to help myself keep note of stuff I come across.
          I have a bad record of having notes all over and it's hard to keep track sometimes. 
          I came up with the title "Let's Pretend I Know This" since in the blogposts I will just be explaining stuff as 
          I understand it and not really being a guru at any of the stuff.
        </p>
      </>
    ),
  },
  {
    title: 'What do I do?',
    description: (
      <>
        <p>
        I write software I am also trying to be active on open source environment.
        I also enjoy reading about software thus writing some personal notes about
        cool designs, practices, etc.
        </p>
      </>
    ),
  },
  {
    title: 'Who am I?',
    description: (
      <>
        <p>
        I am someone who stole{''} <a href="https://blog.johnnyreilly.com/about">John Reilly's</a> About page structure 
        because why not <Emoji symbol='😀'></Emoji>.
        I am software developer (relatively new to this). 
        I went to the <a href='https://en.wikipedia.org/wiki/University_of_the_Witwatersrand'>University Of Witwatersrand</a> where I studies Computer Science.
        </p>
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      {/* <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div> */}
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
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
