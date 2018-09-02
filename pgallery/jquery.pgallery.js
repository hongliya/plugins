;(function($) {
    'use strict';
    var Pgallery = function(ele, opts) {
        this.$element = ele;
        this.defaults = {
        };
        this.options = $.extend({}, this.defaults, opts || {});
        this.$wrapper = $(this.$element.attr('data-target'));
        this.$closeBtn = this.$wrapper.find('.close');
        this.$thumbWrapper = this.$wrapper.find('.gallery-thumbs');
        this.$thumbPrevBtn = this.$thumbWrapper.find('.prev');
        this.$thumbNextBtn = this.$thumbWrapper.find('.next');
        this.$realImg = this.$wrapper.find('.realimg');
    };

    Pgallery.prototype = {
        constructor: Pgallery,

        /**
         * [show 显示大图]
         * @return {[type]} [description]
         */
        show: function() {
            return this.$wrapper.fadeIn();
        },

        /**
         * [close 关闭显示大图]
         * @return {[type]} [description]
         */
        close: function() {
            return this.$wrapper.fadeOut();
        },

        showPic: function(i) {
            console.log(i)
            var src = this.$thumbWrapper.find('li').eq(i).children('img').attr('src');
            console.log(src)
            this.$realImg.attr('src', src)
        },

        /**
         * [evtHandler 事件处理]
         * @return {[type]} [description]
         */
        evtHandler: function() {
            var _this = this;
            // 显示
            _this.$element.click(function() {
                _this.show();
            });
            // 关闭
            _this.$closeBtn.click(function() {
                _this.close();
            });
            _this.$thumbWrapper.find('li').each(function(i) {
                $(this).click(function() {
                    _this.showPic(i);
                });
            });
        },

        /**
         * [init 初始化]
         * @return {[type]} [description]
         */
        init: function() {
            console.log(this)
            // 绑定事件
            this.evtHandler();
        }
    };

    $.fn.pgallery = function(options) {
        return this.each(function() {
            var $this = $(this);
            var pg = new Pgallery($this, options);
            return pg.init();
        });
    };
})(jQuery);
