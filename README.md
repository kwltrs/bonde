# Bonde

Bonde is a library to bootstrap JavaScript callbacks within a HTML document.
It is an alternative to initialize JavaScript by binding callbacks to queries
for CSS classes or ids.  Instead Bonde searches a HTML document for elements,
which have a attribute named `data-module`, and then initializes prior
registered callbacks within a facade around the targeted HTML elements.


## Download

Download the [production version][min] or the [development version][max].

[min]: http://kwltrs.github.io/bonde/dist/bonde.min.js
[max]: http://kwltrs.github.io/bonde/dist/bonde.js


## Getting Started

 * [QuickStart](http://github.com/kwltrs/bonde/blob/master/doc/QuickStart.md)
 * [API documentation](http://kwltrs.github.io/bonde/)
 * [bonde-rails  gem](http://github.com/kwltrs/bonde-rails)

## Development

Clone the git repository from [Github](http://github.com/kwltrs/bonde).

    $ npm install
    $ grunt
    $ grunt jasmine
    $ grunt jsdoc


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" subdirectory as they are generated via Grunt. You'll find source code in the "lib" subdirectory!_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Kristofer Walters
Licensed under the MIT license.
