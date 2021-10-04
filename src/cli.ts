import fs from 'fs';
import compiler from './compiler';

const [,,...args] = process.argv;
if (args.length === 0) {
  // No file specified, wait for stdin
  const input = fs.readFileSync('/dev/stdin', {encoding: 'utf8'});
  const output = compiler(input);
  console.log(output); // tslint:disable-line no-console
} else {
  // Iterate through each file & compile them
  args.forEach(arg => {
    try {
      fs.accessSync(arg, fs.constants.R_OK);

      const input = fs.readFileSync(arg, {encoding: 'utf8'});
      const output = compiler(input);

      console.log(`${output}`); // tslint:disable-line no-console

    } catch (err) {
      console.log(`${arg}: No such file or directory`); // tslint:disable-line no-console
      process.exit(127);
    }
  });
}
