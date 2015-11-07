var yc = require('../index');

var pattern = __dirname + '/*.{hbs,yaml}';

// output JS object
var y = yc(pattern, {
    cwd: __dirname
});

console.assert(y['test.hbs'].foo == 'bar');

// output YAML
var test = yc(pattern, {
    format: 'yaml',
    cwd: __dirname
}),

    fixture = "---\ntest.hbs:\n    foo: bar\ntest.yaml:\n    bar: bar\n---";
    arrFix = [{foo: 'bar'}, {bar: 'bar', cat: 'meow'}];

try  {
    console.assert(fixture.slice(6, 10) == test.slice(6, 10));
    console.assert(fixture.slice(21, 4) == test.slice(21, 4));
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
    console.assert(JSON.parse(y)['test.hbs'].foo == 'bar');    
} catch (e) {
    console.error("json didn't work");
    console.error(y);
}

try{
    var arr = yc(pattern, {format: 'json', array: true});
    console.assert(JSON.parse(arr)[0].foo == arrFix[0].foo);
    console.assert(JSON.parse(arr)[1].bar == arrFix[1].bar);

} catch(e){
    console.log("array option didn't work");
    console.error(JSON.parse(arr));
    console.error(arrFix);
}
