const TurndownService = require('turndown');

exports.NotFoundError = class extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFound';
  }
};

exports.convertToMarkdown = (str) => {
  const service = new TurndownService();
  return service.turndown(str);
};
