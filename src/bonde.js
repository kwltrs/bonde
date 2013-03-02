/*
 * Bonde
 * https://github.com/kwltrs/bonde
 *
 * Copyright (c) 2013 Kristofer Walters
 * Licensed under the MIT license.
 */

var Bonde = this.Bonde || {};

(function(B, $) {

  'use strict';

  B.AttributeHolder = (function () {
      function notifyChange(attrHolder, key, newValue, oldValue) {
          var listeners = attrHolder.changeListeners;
          for (var i=0, len=listeners.length; i<len; i++) {
              listeners[i].call(attrHolder, key, newValue, oldValue);
          }
      }


      function AttributeHolder () {
          this.values = {};
          this.changeListeners = [];
      }

      AttributeHolder.prototype.get = function (key) {
          return this.values[key];
      };

      AttributeHolder.prototype.set = function (key, value) {
          var oldValue = this.values[key];
          this.values[key] = value;
          notifyChange(this, key, value, oldValue);
      };

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
              obj[attachName] = this;
              obj['$'+attachName] = $this;

              obj.attr.set(attachName, $this.text());
              obj.attr.on('change', function (key, value) {
                  if (key == attachName) {
                      $this.text(value);
                  }
              });
          });
      }

      function ModuleContext (element) {
          this.el = element;
          this.$el = $(element);
          this.options = this.$el.data();
          this.attr = new B.AttributeHolder();

          attachNodes(this);
      }

      ModuleContext.prototype.$ = function (selector) {
          return this.$el.find(selector);
      };

      return ModuleContext;
  }());


  var modules = [];

  B.registerModule = function (moduleName, moduleCallback) {
      modules[moduleName] = moduleCallback;
  };

  B.reset = function () {
      modules = [];
  };

  B.applyModule = function (moduleName, element) {
      if (!modules[moduleName]) {
          return;
      }

      modules[moduleName].call(new B.ModuleContext(element));
  };

  B.scanForModules = function (node) {
      $(node).find('[data-module]').each(function () {
          var moduleName = $(this).data('module');
          B.applyModule(moduleName, this);
      });
  };

}(Bonde, jQuery));
