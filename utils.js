const Showdown = require('showdown');

exports.NotFoundError = class extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFound';
  }
};

exports.convertToMarkdown = (str) =>
  new Showdown.Converter({
    omitExtraWLInCodeBlocks: true,
    noHeaderId: true,
    ghCompatibleHeaderId: true,
    headerLevelStart: 2,
    parseImgDimensions: true,
    strikethrough: true,
    tables: true,
    ghCodeBlocks: true,
    ghMentions: true,
    tasklists: true,
    smartIndentationFix: true,
    simpleLineBreaks: true,
    openLinksInNewWindow: true,
    backslashEscapesHTMLTags: true,
    emoji: true,
  }).makeMarkdown(str);
