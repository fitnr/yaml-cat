#!/usr/bin/env node

'use strict';

var program = require('commander');
var yamlcat = require('..');

function toLowerCase(val) { return String.prototype.toLowerCase.apply(val); }

program
    .version('0.3.2')
    .usage('[options] <file ...>')
    .description('Concatenate the YAML front matter of several files')
    .option('-o, --output <file>', 'Save result to file', String, '-')
    .option('-f, --format <format>', 'Output format (YAML or JSON)', toLowerCase, 'yaml')
    .option('-C, --cwd <path>', 'Output with keys relative to this path', String, '')
    .option('-d, --delims <delimiter>', 'YAML delimiter', String, '---,')
    .option('-i, --indent <indent>', 'Number of spaces to indent', parseInt, 4)
    .option('-m, --merge', 'Merge YAML into a single object')
    .option('-e, --extend <key>', 'Put result under a key with this name')
    .option('-n, --no-ext', 'Strip the file extension from keys')
    .option('-a, --array', 'Return an array (list) of objects')
    .parse(process.argv);

// check arguments
var err = '';
if (program.args.length < 1)
    err += 'error - please provide a files pattern\n';

if (['yaml', 'json'].indexOf(program.format) < 0)
    err += 'error - unknown format '+ program.format +'.\n';

if (err) {
    process.stderr.write(err);
    process.exit(1);
}

// delimiters
var delims = program.delims.split(',');

var extend = false;
if (program.extend) {
    var data = {};
    extend = data[program.extend] = {};
}

// CAT!
var result = yamlcat(program.args, {
    array: program.array,
    indent: program.indent,
    cwd: program.cwd,
    format: (extend) ? null : program.format,
    delims: delims,
    merge: program.merge,
    extend: extend,
    ext: program.ext
});

// result is a JS object
if (extend)
    if (program.format == 'json') result = JSON.stringify(data);
    else result = delims[0] + '\n' + require('js-yaml').safeDump(data) + delims[1] + '\n';

if (result === delims[0] + '\n' + '{}\n' + delims[1] + '\n')
    result = delims[0] + '\n' + delims[1] + '\n';

// output
if (program.output === '-')
    process.stdout.write(result);
else
    require('fs').writeFile(program.output, result, function(err) {
        if (err) process.stderr.write(err);
        else process.stdout.write(program.output + '\n');
    });
