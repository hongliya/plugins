;(function($) {
    'use strict';
    var Pagebar = function(ele, opts) {
        this.$element = ele;
        this.defaults = {
            totalCount: 1000,
            pageSize: 10,
            pageBarSize: 5,
            prevBtnText: '<',
            nextBtnText: '>',
            activeClass: 'active',
            callback: null,
            remote: {
                url: null,
                type: 'GET',
                data: null,
                callback: null,
                beforeSend: null,
                success: null,
                error: null,
                complete: null
            }
        };
        this.options = $.extend({}, this.defaults, opts || {});
        this.currentPage = 1;
    };

    Pagebar.prototype = {
        constructor: Pagebar,

        /**
         * [renderRemote remote]
         * @return {[type]} [description]
         */
        renderRemote: function(pageId) {
            var _this = this;
            pageId = pageId || 1;
            this.options.remote.data.page = pageId;
            $.ajax({
                url: this.options.remote.url,
                type: this.options.remote.type,
                data: this.options.data,
                dataType: 'JSON',
                beforeSend: function() {
                    if (_this.options.remote.beforeSend && (typeof _this.options.remote.beforeSend === 'function')) {
                        _this.options.remote.beforeSend();
                    }
                },
                success: function(data) {
                    _this.options.totalCount = Number(data.totalCount) || 1;
                    _this.options.pageSize = Number(data.pageSize) || _this.options.pageSize;
                    _this.pageTotal = _this.getPageTotal();
                    _this.initPagebar();
                    if (_this.options.remote.success && (typeof _this.options.remote.success === 'function')) {
                        _this.options.remote.success(data);
                    }
                },
                error: function(err) {
                    if (_this.options.remote.error && (typeof _this.options.remote.error === 'function')) {
                        _this.options.remote.error(err);
                    }
                },
                complete: function() {
                    if (_this.options.remote.complete && (typeof _this.options.remote.complete === 'function')) {
                        _this.options.remote.complete();
                    }
                }
            });
        },

        /**
         * [getPageTotal 总共多少页]
         * @return {[type]} [description]
         */
        getPageTotal: function() {
            return Math.ceil(this.options.totalCount / this.options.pageSize);
        },

        /**
         * [getPageInterval 页码起始范围]
         * @return {[type]} [description]
         */
        getPageInterval: function() {
            var obj = {
                prevShow: false,
                nextShow: false,
                startNum: 1,
                endNum: Number(this.options.pageBarSize)
            };
            obj.startNum = Number(Math.ceil(this.currentPage/this.options.pageBarSize) * this.options.pageBarSize - (this.options.pageBarSize - 1));
            obj.endNum = Number(obj.startNum + (this.options.pageBarSize - 1));
            if (this.currentPage/this.options.pageBarSize >= this.pageTotal) {
                obj.endNum = this.pageTotal;
            }
            if (this.pageTotal <= this.options.pageBarSize) {
                obj.endNum = this.pageTotal;
            }
            if (obj.startNum > this.options.pageBarSize) {
                obj.prevShow = true;
            } else {
                obj.prevShow = false;
            }
            if (obj.endNum < this.pageTotal) {
                obj.nextShow = true;
            } else {
                obj.nextShow = false;
            }

            return obj;
        },

        /**
         * [pageSelected 点击页码]
         * @param  {[type]} pageId [description]
         * @param  {[type]} evt    [description]
         * @return {[type]}        [description]
         */
        pageSelected: function(pageId, evt) {
            this.currentPage = pageId;
            this.renderRemote(pageId);
            if (this.options.callback && typeof this.options.callback === 'function') {
                this.options.callback(pageId);
            }
        },

        /**
         * [clickHandler 点击页码事件处理]
         * @param  {[type]} pageId [description]
         * @return {[type]}        [description]
         */
        clickEvtHandler: function(pageId) {
            var _this = this;
            return function(evt) {
                return _this.pageSelected(pageId, evt);
            };
        },

        /**
         * [renderPerPage 渲染分页]
         * @param  {[type]} pageId [description]
         * @param  {[type]} text   [description]
         * @return {[type]}        [description]
         */
        renderPerPage: function(pageId, opts) {
            pageId = pageId < 0 ? 1 : (pageId > this.pageTotal ? this.pageTotal : pageId);
            var $p = $('<a class="'+ opts.className +'" data-page-id="'+ pageId +'">'+ opts.text +'</a>');
            if (!opts.clickEvt) {
                return this.$element.append($p);
            }
            this.$element.append($p.bind('click', this.clickEvtHandler(pageId)));
        },

        /**
         * [initPagebar 初始化分页]
         * @return {[type]} [description]
         */
        initPagebar: function() {
            this.$element.empty();
            var pIntvalObj = this.getPageInterval();
            if (pIntvalObj.prevShow) {
                this.renderPerPage(1, {
                    text: '首页',
                    className: '',
                    clickEvt: true
                });
                this.renderPerPage(Number(pIntvalObj.startNum-1), {
                    text: this.options.prevBtnText,
                    className: '',
                    clickEvt: true
                });
            }
            for (var i = pIntvalObj.startNum; i <= pIntvalObj.endNum; i++) {
                if (i === this.currentPage) {
                    this.renderPerPage(i, {
                        text: i,
                        className: this.options.activeClass,
                        clickEvt: false
                    });
                } else {
                    this.renderPerPage(i, {
                        text: i,
                        className: '',
                        clickEvt: true
                    });
                }
            }
            if (pIntvalObj.nextShow) {
                this.renderPerPage(Number(pIntvalObj.endNum+1), {
                    text: this.options.nextBtnText,
                    className: '',
                    clickEvt: true
                });
                this.renderPerPage(this.pageTotal, {
                    text: '末页',
                    className: '',
                    clickEvt: true
                });
            }
        },

        init: function() {
            this.renderRemote(1);
        }
    };

    $.fn.pagebar = function(options) {
        return this.each(function() {
            var $this = $(this);
            var pb = new Pagebar($this, options);
            return pb.init();
        });
    };
})(jQuery);
