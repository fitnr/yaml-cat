# yfm-concat

Concatenate the YAML front matter of a glob of files.

## Usage

Given two files, `foo.yaml` and `bar.yaml` that look like this:

````yaml
---
# foo.yaml
foo: oh wow
````

````
---
# bar.yaml
bar: neato keen
````

You can do this in node:

````javascript
> var yfmConcat = require('yfm-concat');
> var result = yfmConcat('*.yaml');
{
    'bar.yaml': {
        bar: 'neato keen'
    },
    'foo.yaml': {
        'foo': 'oh wow'
    }
}
````

Or this on the command line:

````bash
$ yfm-concat '*.yaml'
---
bar.yaml:
    bar: neato keen
foo.yaml
    foo: oh wow
---
````

## Usage

````bash
  Usage: yfm-concat [options] <file ...>

  Concatenate the YAML front matter of several files

    -V, --version             output the version number
    -o, --output <file>       Save result to file
    -f, --format <format>     Output format (YAML or JSON)
    -C, --cwd <path>          Output with keys relative to this path
    -d, --delims <delimiter>  YAML delimiter
    -i, --indent <indent>     Number of spaces to indent
````

Example:
````
$ yfm-concat 'foo/*.yaml' 'foo/bar/*.yaml' --cwd foo --delims +++ -o result.yaml
$ cat result.yaml
+++
foo.yaml:
    foo: oh wow
bar.yaml:
    bar: neato.keen
+++
```


The `delims` flag can take a comma-separated list of  two different delimters. If you don't want any trailing delimeter, end your delimiter with a comma.

```
$ yfm-concat foo/*.yaml foo/bar/*.yaml --delims ---,
---
foo.yaml:
    foo: oh wow
bar.yaml:
    bar: neato keen
````

### API

yfmConcat(pattern, options)

* pattern: A file, list of files, or [glob](https://www.npmjs.com/package/glob).
* options: A javascript object. The default looks like this:

````javascript

var opts = {
    // The keys in the output are filenames. Interpret them relative to this
    cwd: '.',

    // The start and end delimiter for the output YAML
    delims: ['---\n', '---\n'],

    // return format
    // if empty, function returns a Javascript object
    // valid formats: 'yaml', 'json'
    format: null,

    // number of spaces to indent
    indent: 4,

    // javascript object to extend with the result
    // js only.
    extend: {}
}
````