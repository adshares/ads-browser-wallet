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
      <Page cancelLink={this.getReferrer()} title={manifest.name}>
        <section className={style.aboutVersion}>
          <b>Version</b>: {manifest.version}{isBeta ? ' (beta)' : ''}
        </section>
        <section className={style.aboutLogo}>
          <Logo />
        </section>
        <section>
          <h3 className={style.aboutDescription}>{manifest.description}</h3>
          <div className={style.aboutLinks}>
            <a href={config.helpUrl} target="_blank" rel="noopener noreferrer">Help</a>
            <a href={config.supportUrl} target="_blank" rel="noopener noreferrer">Support</a>
            <a href={config.websiteUrl} target="_blank" rel="noopener noreferrer">Website</a>
          </div>
          <div className={style.aboutLinks}>
            <a href={config.termsUrl} target="_blank" rel="noopener noreferrer">Term of use</a>
            <a href={config.privacyUrl} target="_blank" rel="noopener noreferrer">Privacy policy</a>
            <a href={config.attributionsUrl} target="_blank" rel="noopener noreferrer">Attributions</a>
          </div>
        </section>
      </Page>
    );
  }
}
