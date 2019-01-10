import React from 'react';
import PageComponent from '../components/PageComponent';
import Page from '../components/Page/Page';
import Logo from '../components/Logo/Logo';
import style from './App.css';
import config from '../config/config';

export default class AboutPage extends PageComponent {

  render() {
    const manifest = chrome.runtime.getManifest();
    const isBeta = parseInt(manifest.version.split('.')[0], 10) < 1;

    return (
      <Page cancelLink={this.getReferrer()} title={manifest.name} scroll>
        <section className={style.aboutLogo}>
          <Logo />
        </section>
        <section>
          <div className={style.aboutLinks}>
            <a href={config.helpUrl} target="_blank" rel="noopener noreferrer">Help</a>
            <a href={config.supportUrl} target="_blank" rel="noopener noreferrer">Support</a>
            <a href={config.websiteUrl} target="_blank" rel="noopener noreferrer">Website</a>
          </div>
        </section>
        <section>
          <h3 className={style.aboutDescription}>{manifest.description}</h3>
          <b>Version</b>: {manifest.version}{isBeta ? ' (beta)' : ''}<br />
          <b>Author</b>: {manifest.author}
        </section>
        <section>
          <h3>Term of use</h3>
          <pre className={style.aboutText}>{config.terms}</pre>
        </section>
        <section>
          <h3>Attributions</h3>
          <pre className={style.aboutText}>{config.attributions}</pre>
        </section>
      </Page>
    );
  }
}
