const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // match ease: [number, number, etc]
  content = content.replace(/ease:\s*(\[[0-9.,\s]+\])(?! as const)/g, 'ease: $1 as const');
  // match ease: "easeSomething"
  content = content.replace(/ease:\s*(['"][a-zA-Z]+['"])(?! as const)/g, 'ease: $1 as const');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
