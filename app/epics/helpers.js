
export const validatePagesBranch = (pages, pageName) => {
  if (!pages[pageName]) {
    throw new Error(`Page ${pageName} does not exist in store!`);
  }

  if (!pages[pageName].auth || !pages[pageName].inputs) {
    throw new Error(`Page ${pageName} branch in store has incorrect structure`);
  }
};