var yc = require('../index');

var pattern = __dirname + '/*.yaml';

// output JS object
var y = yc(pattern, {
    cwd: __dirname
});

console.assert(y['test.yaml'].foo == 'bar')

// output YAML
var test = yc(pattern, {
    format: 'yaml',
    cwd: __dirname
}),

    fixture = "---\ntest.yaml:\n    foo: bar\ntest2.yaml:\n    bar: bar\n---";

try  {
    console.assert(fixture.slice(6, 10) == test.slice(6, 10));
    console.assert(fixture.slice(21, 4) == test.slice(21, 4));
} catch (e) {
    console.error("yaml output didn't work")
    console.error(fixture);
    console.error(test);
}

// output JSON
y = yc(pattern, {
    format: 'json',
    cwd: __dirname
});

try {
    console.assert(JSON.parse(y)['test.yaml'].foo == 'bar');    
} catch (e) {
    console.error("json didn't work")
    console.error(y)
}
