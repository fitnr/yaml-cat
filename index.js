// Copyright 2015 Neil Freeman
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

var path = require('path');
var fs = require('fs');
var yfm = require('yfm');
var YAML = require('js-yaml');
var globconcat = require('glob-concat');

var yamlcat = function(pattern, options) {
    options = typeof(options) == 'object' ? options : {};
    options.indent = parseInt(options.indent || 4);
    options.cwd = options.cwd || '';
    options.format = (options.format || '').toLowerCase();
    options.ext = (typeof(options.ext) === 'undefined') ? true : options.ext;

    // options.merge uses the merge pkg to merge the data,
    options.merge = options.merge || false;
    if (options.merge) merge = require('merge');

    // options.extend adds keys to an existing object
    var data = options.extend || {};

    // options.array overrides this, and appends objects to an array
    if (options.array) data = [];

    var yfmOptions = {
        delims: 'delims' in options ? options.delims : ['---', '']
    };
    if (yfmOptions.delims.length == 1) yfmOptions.delims[1] = '';

    var matches = [];

    if (typeof(pattern) == 'string' || Array.isArray(pattern))
        matches = globconcat.sync(pattern, {nodir: true});
    else
        throw 'Need Array or string for "pattern", but received a ' + typeof(pattern);

    matches.forEach(function(match){
        try {
            if (yfm.exists(match))
                result = yfm.read(match, yfmOptions).context;
            else
                result = YAML.safeLoad(fs.readFileSync(match, 'utf8'));

            if (options.array)
                data.push(result);
            if (options.merge)
                data = merge(data, result);
            else {
                var key = path.relative(options.cwd, match);
                if (!options.ext) key = key.slice(0, -path.extname(key).length);
                data[key] = result;
            }
        } catch (e) {
            console.error('Problem reading ' + match);
        }
    });

    if (options.format === 'yaml') {
        return yfmOptions.delims[0] + '\n' + YAML.safeDump(data, options) + yfmOptions.delims[1] + '\n';

    } else if (options.format === 'json')
        return JSON.stringify(data);

    else
        return data;

};

module.exports = yamlcat;
