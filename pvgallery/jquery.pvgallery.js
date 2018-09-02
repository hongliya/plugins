;(function($) {
    'use strict';
    var Pvgallery = function(ele, opts) {
        this.$element = ele;
        this.defaults = {

        };
        this.options = $.extend({}, this.defaults, opts || {});
    };

    Pvgallery.prototype = {
        constructor: Pvgallery,
        init: function() {

        }
    };

    $.fn.pvgallery = function(options) {
        return this.each(function() {
            var _this = $(this);
            var pvg = new Pvgallery($this, options);
            return pvg.init();
        });
    };
})(jQuery);
