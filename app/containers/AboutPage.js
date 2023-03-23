import React from 'react';
import PageComponent from '../components/PageComponent';
import Page from '../components/Page/Page';
import Logo from '../components/Logo/Logo';
import style from './About.css';
import config from '../config/config';

export default class AboutPage extends PageComponent {
  render() {
    const manifest = chrome.runtime.getManifest();
    const isBeta = parseInt(manifest.version.split('.')[0], 10) < 1;

    return (
      <Page cancelLink={this.getReferrer()} hideSelectAccount >
        <div className={style.aboutVersion}>
          <h1>{manifest.name}</h1>
          <span>Version: {manifest.version}{isBeta ? ' (beta)' : ''} </span>
        </div>
        <div className={style.aboutLogo} >
          <Logo />
        </div>
        <div>
          <p className={style.aboutDescription}>{manifest.description}</p>
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
        </div>
      </Page>
    );
  }
}
