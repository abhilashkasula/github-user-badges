const grade = (repoLanguages) => {
  return new Promise((resolve, reject) => {
    const languages = repoLanguages.reduce((unique, languages) => {
      Object.keys(languages).forEach(lang => unique.add(lang));
      return unique
    }, new Set());
    console.log(languages);
    const badges = ['None', 'Beginner', 'Average', 'Pro'];
    const badge = badges[languages.size] || 'Pro';
    resolve(badge);
  });
};

module.exports = {grade};