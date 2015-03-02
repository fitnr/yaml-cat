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

var path = require('path')
var yfm = require('yfm');
var glob = require('glob');

var yfmConcat = function(pattern, options) {
    options = typeof(options) == 'object' ? options : {};
    options.indent = options.indent || 4;
    options.cwd = options.cwd || '';
    options.format = options.format || '';

    var data = options.extend || {};

    var yfmOptions = {
        delims: options.hasOwnProperty('delims') ? options.delims : ['---', '---']
    }

    var matches = []

    if (typeof(pattern) === 'object' && pattern.length !== undefined) {
        matches = pattern;
    } else if (typeof(pattern) == 'string') {
        matches = glob.sync(pattern, options);    
    } else {
        throw 'Need Array or string for "pattern", but received a ' + typeof(pattern);
    }

    for (var i = 0, len = matches.length, filename; i < len; i++) {
        try {
            filename = path.relative(options.cwd, matches[i]);
            data[filename] = yfm.read(matches[i], yfmOptions).context;
        } catch (e) {
            // pass
        }
    };

    if (options.format.toLowerCase() === 'yaml') {
        var YAML = require('js-yaml');
        return yfmOptions.delims[0] + '\n' + YAML.safeDump(data, options) + yfmOptions.delims[1] + '\n';

    } else if (options.format.toLowerCase() === 'json') {
        return JSON.stringify(data);

    } else {
        return data

    }
}

module.exports = yfmConcat;
