export const validatePagesBranch = (pages, pageName) => {
  if (!pages[pageName]) {
    throw new Error(`Page ${pageName} does not exist in store!`);
  }

  if (!pages[pageName].auth || !pages[pageName].inputs) {
    throw new Error(`Page ${pageName} branch in store has incorrect structure`);
  }
};

export const getReferrer = (history, defaultLocation = '/') => {
  if (history.location && history.location.state) {
    return history.location.state.referrer || defaultLocation;
  }
  return defaultLocation;
};
