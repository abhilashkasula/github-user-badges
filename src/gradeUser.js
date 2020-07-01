const group = (languages, groups) => {
  return Object.keys(languages).reduce((newGroups, key) => {
    if (newGroups[key]) {
      newGroups[key] += 1;
      return newGroups;
    }
    newGroups[key] = 1;
    return newGroups;
  }, groups);
};

const getMaxLang = (languages) => {
  return Object.keys(languages).reduce(
    (max, lang) => {
      if (max[1] < languages[lang]) {
        return [lang, languages[lang]];
      }
      return max;
    },
    ['no lang', -Infinity]
  );
};

const getBadge = (languages) => {
  const numberOfLangs = Object.keys(languages).length;
  if(numberOfLangs >= 30) {
    return 'Sensational Linguist';
  }
  if(numberOfLangs >= 10) {
    return 'Super Linguist'
  }
  if(numberOfLangs < 5) {
    return 'Beginner Linguist';
  }
  return 'Average Linguist';
}

const grade = (repoLanguages) => {
  return new Promise((resolve, reject) => {
    const languages = repoLanguages.reduce((unique, languages) => {
      group(languages, unique);
      return unique;
    }, {});
    const topLanguage = getMaxLang(languages)[0];
    const badge = getBadge(languages);
    resolve({languages, topLanguage, badge});
  });
};

module.exports = {grade};
