# Bonde

Bonde maps JavaScript callbacks to HTML elements.
Bonde will map page elements to registered callbacks and execute the callbacks within a facade around the targeted HTML element.


## Getting Started
### In the browser
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/kwltrs/bonde/master/dist/bonde.min.js
[max]: https://raw.github.com/kwltrs/bonde/master/dist/bonde.js

## Examples

```html
<div data-module="foo" data-fiz="biz">
  <h1 data-attach-to="heading">Hello</h1>
  <p>Lorem ipsum</p>
</div>
```

```javascript
var myModule = function () {
  // ...
};

Bonde.registerModule('foo', myModule);

jQuery(function () {
  Bonde.scanForModules(document);
});
```



## API

### Bonde.registerModule(moduleName, callback)

Register a callback with a given name.  Name can be anything that fits into a string, but it should be unique.

### Bonde.applyModule(moduleName, DOMNode)

Execute a callback in context.

### Bonde.scanForModules(DOMNode)

### Bonde.reset()

Remove all registered callbacks.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" subdirectory as they are generated via Grunt. You'll find source code in the "lib" subdirectory!_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Kristofer Walters
Licensed under the MIT license.
