# yaml-cat

Concatenate the YAML and YAML front matter of files.

## Usage

Given two files, `pets/cats.yaml` and `pets/dogs.yaml` that look like this:

````yaml
---
# pets/cats.yaml
sound: meow
lives: 9
````
````yaml
# pets/dogs.yaml
---
sound: bark
````

Do this on the command line:

````bash
yaml-cat 'pets/*.yaml'
````
````yaml
---
pets/cats.yaml:
    sound: meow
    lives: 9
pets/dogs.yaml
    sound: bark
---
````

Or, do this in node:

````javascript
> var yamlCat = require('yaml-cat');
> var result = yamlCat('pets/*.yaml');
{
    'pets/cats.yaml': {
        sound: 'meow',
        lives: 9
    },
    'pets/dogs.yaml': {
        sound: 'bark',
    }
}
````

## Usage

````bash
  Usage: yaml-cat [options] <file ...>

  Concatenate the YAML front matter of several files

    -V, --version             output the version number
    -o, --output <file>       Save result to file
    -f, --format <format>     Output format (YAML or JSON)
    -C, --cwd <path>          Output with keys relative to this path
    -d, --delims <delimiter>  YAML delimiter
    -i, --indent <indent>     Number of spaces to indent
    -m, --merge               Merge YFM into a single object
    -e, --extend <key>        Put result under a key with this name
    -n, --no-ext              Strip the file extension from keys
    -a, --array               Return an array (list) of objects
````

Example:
````
yaml-cat pets/cats.yaml pets/dogs.yaml -o result.yaml
$ cat result.yaml
````
````yaml
---
pets/cats.yaml:
    sound: meow
    lives: 9
pets/dogs.yaml:
    sound: bark
````

## Command line options

### cwd
`yaml-cat` uses the filepaths of input files as keys in the output. With `--cwd`, the key will be relative to the given directory.
````
yaml-cat --cwd pets pets/cats.yaml pets/dogs.yaml
````
````yaml
---
cats.yaml:
    sound: meow
    lives: 9
dogs.yaml:
    sound: bark
````

### no-ext

Strip the extension from files in the given key. Use with `--cwd` to get just the file name-part as the key.

````
yaml-cat --cwd pets --no-ext pets/cats.yaml pets/dogs.yaml
````
````yaml
---
cats:
    sound: meow
    lives: 9
dogs:
    sound: bark
````

### extend
Pass a string to `---extend` to place the entire result under that key.
````
yaml-cat --extent pets --cwd pets pets/cats.yaml pets/dogs.yaml
````
````yaml
---
pets:
    cats.yaml:
        sound: meow
        lives: 9
    dogs.yaml:
        sound: bark
````

### format
Choose output in JSON or YAML.
````
yaml-cat --format json pets/cats.yaml pets/dogs.yaml
````
````json
{
    "pets/cats.yaml": {...},
    "pets/dogs.yaml": {...}
}
````

(Note that JSON output is prettified here for readability. The actual function does not prettify.)

### merge
Merge all the yaml front matter into a single object. Overlapping keys will be given the value of the last given file, which could be unpredictible if globs are used.
````
yaml-cat --merge pets/cats.yaml pets/dogs.yaml
````
````yaml
---
sound: bark
lives: 9
````

Obviously that isn't that effective in this example, but maybe your data isn't as contrived as it is here.

The `--merge` and `--extend` options may seem similar, but they have a very different effect. Running them together will merge the entire result AND place it under a single key.
````
yaml-cat --extend pets --merge pets/cats.yaml pets/dogs.yaml
````
````yaml
---
pets:
    sound: bark
    lives: 9
````

### delims

The default delimiter is `---`, and by default `yaml-cat` only puts one at the start of YAML. If you want an ending delimeter, pass a comma-separated list of two delimters. Does nothing when `--format` equals `json`.
````
yaml-cat --delims +++,+++ foo/*.yaml foo/bar/*.yaml
````
````
+++
foo/foo.yaml:
    ...
foo/bar/bar.yaml:
    ...
+++
````

### array

Use this option to return an array of objects:
````
yaml-cat --array pets/cats.yaml pets/dogs.yaml
````
````yaml
-
    sound: meow
    lives: 9
-
    sound: bark
````

````
yaml-cat --format json --array pets/cats.yaml pets/dogs.yaml
````
````json
[
    {
        "sound": "meow",
        "lives": 9
    },
    {
        "sound": "bark"
    }
]
````

### API

yamlcat(pattern, options)

* pattern: A file, list of files, or [glob](https://www.npmjs.com/package/glob).
* options: A javascript object. The default looks like this:

````javascript

var opts = {
    // (String) The keys in the output are the input filenames. Interpret them relative to this
    // ignored if 'merge' is set
    cwd: '.',

    // The start and end delimiter for the output YAML
    delims: ['---', '---'],

    // (string) return format
    // if empty, function returns a Javascript object
    // valid formats: 'yaml', 'json'
    format: null,

    // (Integer) number of spaces to indent
    indent: 4,

    // Object to extend with the result
    extend: {},

    // (Boolean) whether to merge all the front matter into a single object
    merge: false,
}
````
