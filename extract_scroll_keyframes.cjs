const fs = require('fs');
const cssPath = 'C:\\Users\\Admin1\\.gemini\\antigravity-ide\\brain\\109612ed-cd05-47bf-b486-8c9b1f29296a\\.system_generated\\steps\\75\\content.md';
let css = fs.readFileSync(cssPath, 'utf8');

const regex = /[^{}]*scrollLine[^{}]*\{[^}]*\}/i;
const match = css.match(regex);
console.log('scrollLine keyframes match:', match);
