const colors = require('colors');
const commander = require('commander');
const pkg = require('../package.json');

commander
  .version(pkg.version)
  .description(pkg.description)
  .usage('[options] <command> [...]')
  .option('-c, --city [name]', 'Add city name')
  .parse(process.argv);

if (process.argv.slice(2).length === 0) {
    commander.outputHelp(colors.red);
    process.exit()
}

// $ yarn ts-node src/index.ts
console.log(commander.city) // => dongguan