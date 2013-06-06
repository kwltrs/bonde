/*! bonde - v0.0.3 - 2013-06-06
* https://github.com/kwltrs/bonde
* Copyright (c) 2013 Kristofer Walters; Licensed MIT */
/** @namespace */
var Bonde = this.Bonde || {};

(function(B, $) {
  'use strict';

  function mixin(dest, src) {
      for (var k in src) {
          if (src.hasOwnProperty(k)) {
              dest[k] = src[k];
          }
      }
  }

  B.AttributeHolder = (function () {

      /**
       * Notify all listeners of a given AttributeHolder instance.
       * @private
       */
      function notifyChange(attrHolder, key, newValue, oldValue) {
          var listeners = attrHolder.changeListeners;
          for (var i=0, len=listeners.length; i<len; i++) {
              listeners[i].call(attrHolder, key, newValue, oldValue);
          }
      }

      /**
       * @event Bonde.AttributeHolder~onChangeEvent
       */
      /**
       * @callback Bonde.AttributeHolder~onChangeCallback
       * @param {string} key
       * @param {string} newValue
       * @param {string} oldValue
       */

      /**
       * Event-firing key-value store.
       * @class Bonde.AttributeHolder
       */
      function AttributeHolder () {
          this.values = {};
          this.changeListeners = [];
      }

      /**
       * @method Bonde.AttributeHolder#get
       * @param {string} key
       */
      AttributeHolder.prototype.get = function (key) {
          return this.values[key];
      };

      /**
       * @method Bonde.AttributeHolder#set
       * @param {string} key
       * @param {string} value
       * @fires Bonde.AttributeHolder~onChangeEvent
       */
      AttributeHolder.prototype.set = function (key, value) {
          var oldValue = this.values[key];
          this.values[key] = value;
          notifyChange(this, key, value, oldValue);
      };

      /**
       * @method Bonde.AttributeHolder#on
       * @param {string} eventName
       * @param {Bonde.AttributeHolder~onChangeCallback} listener
       */
      AttributeHolder.prototype.on = function (eventName, listener) {
          if (eventName == 'change') {
              this.changeListeners.push( listener );
          }
      };

      return AttributeHolder;
  }());

  B.ModuleContext = (function () {

      function attachNodes (obj) {
          obj.$('[data-attach-to]').each(function () {
              var $this = $(this);
              var attachName = $this.data('attach-to');
              attachJqueryNode(obj, attachName, $this);
          });
      }

      function attachJqueryNode (obj, attachName, $el) {
          obj['$'+attachName] = $el;
          obj[attachName]     = $el.get(0);

          obj.attr.set(attachName, $el.text());
          obj.attr.on('change', function (key, value) {
              if (key == attachName) {
                  $el.text(value);
              }
          });
      }


      /**
       * @class Bonde.ModuleContext
       * @param {DOMElement} element
       */
      function ModuleContext (element) {
          this.$el = $(element);
          this.el  = this.$el.get(0);
          this.options = this.$el.data();
          this.attr = new B.AttributeHolder();

          attachNodes(this);
      }

      /**
       * @method Bonde.ModuleContext#$
       * @param {string} selector
       */
      ModuleContext.prototype.$ = function (selector) {
          return this.$el.find(selector);
      };

      /**
       * @method Bonde.ModuleContext#attach
       * @param {string} attachName
       * @param {string} selector
       */
      ModuleContext.prototype.attach = function (attachName, selector) {
          var $el = this.$(selector);
          if ($el.length > 0) {
              attachJqueryNode(this, attachName, $el);
          }
      };

      /**
       * Mixin properties from given object into self.
       * @method Bonde.ModuleContext#mixin
       * @param {object} obj
       */
      ModuleContext.prototype.mixin = function (obj) {
          mixin(this, obj);
      };

      return ModuleContext;
  }());


  var modules = [];

  /**
   * @method Bonde.registerModule
   * @param {string} moduleName
   * @param {callback} moduleCallback
   */
  B.registerModule = function (moduleName, moduleCallback) {
      modules[moduleName] = moduleCallback;
  };

  /**
   * @method Bonde.registerModules
   * @param {hash} moduleMap
   */
  B.registerModules = function (moduleMap) {
      mixin(modules, moduleMap);
  };

  /**
   * @method Bonde.reset
   */
  B.reset = function () {
      modules = [];
  };

  /**
   * @method Bonde.applyModule
   * @param {string} moduleName
   * @param {DOMNode} element
   */
  B.applyModule = function (moduleName, element) {
      if (!modules[moduleName]) {
          return;
      }

      var ctx = new B.ModuleContext(element);
      modules[moduleName].call(ctx);
      return ctx;
  };

  /**
   * @method Bonde.scanForModules
   * @param {DOMElement} node
   */
  B.scanForModules = function (node) {
      $(node).find('[data-module]').each(function () {
          var moduleName = $(this).data('module');
          B.applyModule(moduleName, this);
      });
  };

}(Bonde, jQuery));
