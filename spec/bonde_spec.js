/*global Bonde:false */

describe('Bonde', function () {

    var customMatchers = {
        toBeFunction: function () {
            return typeof this.actual === 'function';
        }
    };

    beforeEach(function () {
        this.addMatchers(customMatchers);
    });



    it('Bonde should be defined', function () {
        expect( Bonde ).toBeDefined();
    });



    describe('Bonde.applyModule', function () {
        beforeEach(function () {
            this.callback = jasmine.createSpy();
            this.el = DOMBuilder.createElement('div');

            Bonde.registerModule('myModule', this.callback);
        });

        it("calls a callback for given module name", function () {
            Bonde.applyModule('myModule', this.el);
            expect( this.callback ).toHaveBeenCalled();
        });

        it("does not call callback with other module name", function () {
            Bonde.applyModule('NOT-myModule', this.el);
            expect( this.callback ).not.toHaveBeenCalled();
        });

        it("returns a module's context object", function () {
            var ctx = Bonde.applyModule('myModule', this.el);
            expect( ctx ).toBeDefined();
            expect( ctx.el ).toBe( this.el );

        });
    });


    describe('Bonde.registerModules', function () {
        beforeEach(function () {
            this.el = DOMBuilder.createElement('div');
            this.callbackA = jasmine.createSpy();
            this.callbackB = jasmine.createSpy();

            Bonde.registerModules({
                moduleA: this.callbackA,
                moduleB: this.callbackB
            });
        });

        it("calls callback for module B", function () {
            Bonde.applyModule('moduleA', this.el);
            expect( this.callbackA ).toHaveBeenCalled();
        });

        it("calls callback for module B", function () {
            Bonde.applyModule('moduleB', this.el);
            expect( this.callbackB ).toHaveBeenCalled();
        });
    });


    describe('Bonde.reset', function () {
        it('unregisters modules', function () {
            var callback = jasmine.createSpy();
            var el = DOMBuilder.createElement('div');

            Bonde.registerModule('myModule', callback);

            Bonde.reset();

            Bonde.applyModule('myModule', el);

            expect( callback ).not.toHaveBeenCalled();
        });
    });



    describe('Bonde.ModuleContext', function () {
        beforeEach(function () {
            this.el = DOMBuilder.build(['div', {'data-foo': 'bar'},
                ['i', 'inner']
            ]);

            this.moduleContext = new Bonde.ModuleContext( this.el );
        });

        it("has el", function () {
            expect( this.moduleContext.el ).toBe( this.el );
        });

        it("takes options from data attributes", function () {
            expect( this.moduleContext.options ).toBeDefined();
            expect( this.moduleContext.options['foo'] ).toEqual('bar');
        });

        it("has jQuery node $el", function () {
            expect( this.moduleContext.$el ).toBeDefined();
            expect( this.moduleContext.$el.jquery ).toBeDefined();
        });

        it("registers as jQuery $el.bondeModule()", function () {
            expect( this.moduleContext.$el.bondeModule ).toBeDefined();
            expect( this.moduleContext.$el.bondeModule() ).toBe( this.moduleContext );
        });

        it("has a local selector finder", function () {
            expect( this.moduleContext.$ ).toBeFunction();
            expect( this.moduleContext.$(':first-child')[0] ).toBeDefined();
            expect( this.moduleContext.$(':first-child')[0].outerHTML ).toEqual('<i>inner</i>');
        });
    });



    describe('Bonde.ModuleContext node attachment', function () {
        beforeEach(function () {

            this.fooNode = DOMBuilder.createElement('span', {'data-attach-to': 'foo'}, 'bar');
            this.fizNode = DOMBuilder.createElement('span', {'data-attach-to': 'fiz'}, 'baz');
            this.fusNode = DOMBuilder.createElement('span', {'id': 'fus'}, 'fus content');
            this.el      = DOMBuilder.createElement('div', {}, [this.fooNode, this.fizNode, this.fusNode]);

            this.moduleContext = new Bonde.ModuleContext( this.el );
        });

        it("has refernce to dom node", function () {
            expect( this.moduleContext.foo ).toBeDefined();
            expect( this.moduleContext.foo ).toEqual( this.fooNode );
        });

        it("has refernce to jQueriefied node", function () {
            expect( this.moduleContext.$foo ).toBeDefined();
            expect( this.moduleContext.$foo.jquery ).toBeDefined();
            expect( this.moduleContext.$foo.get(0) ).toEqual( this.fooNode );
        });

        describe('Attribute mapping', function () {
            it('has attributes', function () {
                expect( this.moduleContext.attr ).toBeDefined();
            });

            it('has getter', function () {
                expect( this.moduleContext.attr.get ).toBeDefined();
            });

            it('gets node content', function () {
                expect( this.moduleContext.attr.get('foo') ).toEqual('bar');
            });

            it('has setter', function () {
                expect( this.moduleContext.attr.set ).toBeDefined();
            });

            it('has event thingie', function () {
                expect( this.moduleContext.attr.on ).toBeDefined();
            });

            describe('changing value', function () {
                beforeEach(function () {
                    this.callback = jasmine.createSpy();
                    this.moduleContext.attr.on('change', this.callback);
                    this.moduleContext.attr.set('foo', 'any string');
                });

                it('changes getter value', function () {
                    expect( this.moduleContext.attr.get('foo') ).toEqual('any string');
                });

                it('changes node content', function () {
                    expect( this.fooNode.innerHTML ).toEqual('any string');
                });


                it('does not change other getter value', function () {
                    expect( this.moduleContext.attr.get('fiz') ).not.toEqual('any string');
                });

                it('does not change other node content', function () {
                    expect( this.fizNode.innerHTML ).not.toEqual('any string');
                });


                it('triggers event listener', function () {
                    expect( this.callback ).toHaveBeenCalledWith('foo', 'any string', 'bar');
                });
            });

            describe('without mapping to dom node', function () {
                beforeEach(function () {
                    this.callback = jasmine.createSpy();
                    this.moduleContext.attr.on('change', this.callback);
                });

                it('is undefined by default', function () {
                    expect( this.moduleContext.attr.get('ftw') ).toBeUndefined();
                });

                it('is changeable', function () {
                    this.moduleContext.attr.set('ftw', 'any string');
                    expect( this.moduleContext.attr.get('ftw') ).toEqual('any string');
                });

                it('trigger event listener', function () {
                    this.moduleContext.attr.set('ftw', 'any string');
                    expect( this.callback ).toHaveBeenCalledWith('ftw', 'any string', undefined);
                });
            });

            describe('attach node manually', function () {
                beforeEach(function () {
                    this.moduleContext.attach('fus', '#fus');
                });

                it("creates refernce to dom node", function () {
                    expect( this.moduleContext.fus ).toBeDefined();
                    expect( this.moduleContext.fus ).toEqual( this.fusNode );
                });

                it("creates refernce to jQueriefied node", function () {
                    expect( this.moduleContext.$fus ).toBeDefined();
                    expect( this.moduleContext.$fus.jquery ).toBeDefined();
                    expect( this.moduleContext.$fus.get(0) ).toEqual( this.fusNode );
                });

                it("adds node value to attribute map", function () {
                    expect( this.moduleContext.attr.get('fus') ).toEqual('fus content');
                });
            });

            describe('attach non-existing node manually', function () {
                beforeEach(function () {
                    this.moduleContext.attach('xxx', '#xxx');
                });

                it("creates no dom node refernce", function () {
                    expect( this.moduleContext.xxx ).not.toBeDefined();
                });

                it("creates no jQueried refernce", function () {
                    expect( this.moduleContext.$xxx ).not.toBeDefined();
                });

                it("adds no value to attribute map", function () {
                    expect( this.moduleContext.attr.get('xxx') ).toBeUndefined();
                });
            });
        });
    });


    describe('Bonde.ModuleContext mixin', function () {
        beforeEach(function () {
            this.moduleContext = new Bonde.ModuleContext( DOMBuilder.createElement('div') );
            this.moduleContext.mixin({
                foo: "foo value",
                bar: function () { return "bar called"; }
            });
        });

        it("adds properties", function () {
            expect( this.moduleContext.foo ).toEqual('foo value');
        });

        it("adds methods", function () {
            expect( this.moduleContext.bar() ).toEqual('bar called');
        });

    });



    describe('Bonde.scanForModules', function () {
        it('applies module callback to all module dom nodes', function () {
            var nodeA  = DOMBuilder.createElement('div', {'data-module': 'modA'});
            var nodeB1 = DOMBuilder.createElement('div', {'data-module': 'modB'});
            var nodeB2 = DOMBuilder.createElement('div', {'data-module': 'modB'});

            var domTree = DOMBuilder.createElement('div', {}, [nodeA, nodeB1, nodeB2]);

            spyOn(Bonde, 'applyModule');

            Bonde.scanForModules( domTree );

            expect( Bonde.applyModule ).toHaveBeenCalled();
            expect( Bonde.applyModule.callCount ).toEqual( 3 );

            expect( Bonde.applyModule ).toHaveBeenCalledWith('modA', nodeA);
            expect( Bonde.applyModule ).toHaveBeenCalledWith('modB', nodeB1);
            expect( Bonde.applyModule ).toHaveBeenCalledWith('modB', nodeB2);
        });

        it('applies module callback to given dom node', function () {
            var parentNode = DOMBuilder.createElement('div', {'data-module': 'modA'}, [
                DOMBuilder.createElement('div'),
                DOMBuilder.createElement('div'),
                DOMBuilder.createElement('div')
            ]);

            spyOn(Bonde, 'applyModule');

            Bonde.scanForModules( parentNode );

            expect( Bonde.applyModule ).toHaveBeenCalled();
            expect( Bonde.applyModule.callCount ).toEqual( 1 );

            expect( Bonde.applyModule ).toHaveBeenCalledWith('modA', parentNode);
        });

        it('does not fail with document given', function () {
            var error = null;
            try {
                Bonde.scanForModules( document );
            } catch (e) {
                error = e;
            }

            expect(error).toBeNull();
        });
    });
});
