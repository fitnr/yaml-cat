var yc = require('../index');

var pattern = __dirname + '/*.{hbs,yaml}';

// output JS object
var y = yc(pattern, {
    cwd: __dirname
});

console.assert(y['test.hbs'].foo == 'bar', 'parsed yaml has key');

// output YAML
var test = yc(pattern, {
    format: 'yaml',
    cwd: __dirname
}),
    fixture = "---\ntest.hbs:\n    foo: bar\ntest.yaml:\n    bar: bar\n---";
    arrFix = [{foo: 'bar'}, {bar: 'bar', cat: 'meow'}];

try {
    console.assert(fixture.slice(6, 10) == test.slice(6, 10), 'output yaml matches fixture (0)');
    console.assert(fixture.slice(21, 4) == test.slice(21, 4), 'output yaml matches fixture (1)');
} catch (e) {
    console.error("yaml output didn't work");
    console.error(fixture);
    console.error(test);
}

// output JSON
y = yc(pattern, {
    format: 'json',
    cwd: __dirname
});

try {
    console.assert(JSON.parse(y)['test.hbs'].foo == 'bar', 'parsed json has key');    
} catch (e) {
    console.error("json didn't work");
    console.error(y);
}

try {
    var result = JSON.parse(yc(pattern, {format: 'json', array: true}));
    console.assert(result[0].foo == arrFix[0].foo, 'output json matches fixture (0)');
    console.assert(result[1].bar == arrFix[1].bar, 'output json matches fixture (1)');

} catch(e){
    console.log("array option didn't work");
    console.error(JSON.parse(arr));
    console.error(arrFix);
}
