### Basic Usage

Bonde scans a document for elements having a `data-module` attribute.  A module
callback registered with the name of the attribute value is executed within the
module context of the element.

```html
<div data-module="hello"></div>
```

```javascript
Bonde.registerModule('hello', function () {
    this.el.innerHTML = 'Hello!';
});

jQuery(function () {
    Bonde.scanForModules(document);
});
```


Multiple module callbacks can be registered at once with
`Bonde.registerModules`. The method takes a hash of callbacks with the module
names as keys.


```javascript
var myModules = {
    'mod1': function () { /* ... */ },
    'mod2': function () { /* ... */ },
    'mod3': function () { /* ... */ }
};

Bonde.registerModules( myModules );
```

### Module Context

Bonde binds each module callback to a `ModuleContext` instance, which provides
properties and methods to ease dealing with the DOM elements.

 * `this.$el`
 * `this.el`
 * `this.$(selector)`
 * `this.options`
 * `this.attr`


#### Passing options with data attributes

Bonde adds all data attributes to the module context as an hash map, i.e.
`this.options`.  The hash key is the attribute name in lower camel case, but
without the data-prefix.

```html
<div data-module="greet" data-first-name="Alice"></div>
```

```javascript
Bonde.registerModule('greet', function () {
    var name = this.options['firstName'];
    this.el.innerHTML = 'Hello ' + name + '!';
});
```


#### Element references

The module context contains a reference to the targeted DOM element, i.e.
`this.el`.  Additionally, `this.$el` is a jQuery object wrapping the element.
The method `this.$()` is a jQuery-based finder, limited to descendant elements
of the module node.


```html
<div data-module="hello-jquery">
    Hello <span class="fn"></span>!
</div>
```

```javascript
Bonde.registerModule('hello-jquery', function () {
    this.$el.on('click', function () {
        alert("Don't push me");
    });

    this.$('.fn').text('Alice');
});
```


#### Node attachment

Descendent nodes of the targeted element with the attribute `data-attach-to` get
referenced inside the module context.  These nodes can be accessed through a
property with the name given as value of the `data-attach-to` attribute.  As
with the target node, the context has a property with the same name prefixed
with $, containing a jQuery object bound to the element.

```html
<div data-module="hello-data-attach">
    Hello <span data-attach-to="fname"></span>!
</div>
```

```javascript
Bonde.registerModule('hello-data-attach', function () {
    this.fname.innerHTML = 'Alice';
    this.$fname.on('click', function () {
        alert("Don't push me.");
    });
});
```


#### Attribute Holder

With `this.attr` the module context provides an `AttributeHolder` object, which
basically is an event-emiting value store.  Listeners are registered with
`this.attr.on('change', callback)`. When changing a value with `this.attr.set`,
the attribute holder passes three parameters to the listener callback, the name
of the changed attribute and the new and old values.

```html
<div data-module="hello-attr-listener">
    Hello
</div>
```

```javascript
Bonde.registerModule('hello-attr-listener', function () {
    this.attr.on('change', function (key, currentValue, oldValue) {
        console.log('Value of '+key+' changed from '+ oldValue +
                    ' to '+ currentValue);
    });

    // outputs “Value of fname changed from undefined to Alice”
    this.attr.set('fname', 'Alice');

    // outputs “Value of fname changed from Alice to Bob”
    this.attr.set('fname', 'Bob');
});
```

If the context has an attached descendent node, Bonde stores the content of the
attached node in the attribute holder.  Changing the value will also change the
DOM element.

```html
<div data-module="hello-attr">
    Hello <span data-attach-to="fname">Alice</span>!
</div>
```

```javascript
Bonde.registerModule('hello-attr', function () {
    var name = this.attr.get('fname');
    console.log(name); // outputs “Alice”

    this.attr.set('fname', 'Bob');
    console.log(this.fname.innerHTML); // outputs “Bob”
});
```

Nodes without the `data-attach-to` attribute can be programatically attached to
the context and the attribute holder with the `this.attach` method.  The method
expects the name under which the node should be attached, and a selector as
parameters.

```html
<div data-module="hello-attach">
    Hello <span class="fn">Alice</span>!
</div>
```

```javascript
Bonde.registerModule('hello-attach', function () {
    this.attach('fname', '.fn');

    var name = this.attr.get('fname'); // innerHTML of element
    console.log(name); // outputs “Alice”

    this.attr.set('fname', 'Bob');
    console.log(this.fname.innerHTML); // outputs “Bob”
});
```


### Extending a Context with Mixins

The method `this.mixin` can be used to extend the context object with methods
and properties. The method adds all properties of a given object into the
context.  This allows to write reusable extensions, that can be shared among
different module callbacks.


```html
<div data-module="hello-mixin">
    Hello <span data-attach-to="fname">Alice</span>!
</div>
```

```javascript
var myExtension = {
    doStuff: function () {
        this.sayHello();
    },
    sayHello: function () {
        // `this` referes to the module context
        console.log('Hello ' + this.attr.get('fname') );
    }
};

Bonde.registerModule('hello-mixin', function () {
    this.mixin( myExtension );

    this.doStuff(); // outputs “Hello Alice”
});
```


### Programmatically

Besides invoking Bonde with `Bonde.scanForModules`, module can programatically be initialized with a given DOM element.
The element does not need to have the `data-module` attribute.

```html
<div id="noDataAttr"></div>
```

```javascript
Bonde.registerModule('prog-hello', function () {
    this.el.innerHTML = 'Hello';
});

jQuery(function ($) {
    Bonde.applyModule('prog-hello', document.getElementById('noDataAttr'));
});
```
