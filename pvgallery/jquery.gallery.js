;(function($) {
    'use strict';
    var Pgallery = function(ele, opts) {
        this.$element = ele;
        this.defaults = {
            pageSize: 6,
            viewModel: 0
        };
        this.options = $.extend({}, this.defaults, opts || {});
        this.$wrapper = $(this.$element.attr('data-target'));
        this.$closeBtn = this.$wrapper.find('.close');
        this.$realImg = this.$wrapper.find('.realimg');

        this.$gallery = this.$wrapper.find('.gallery');
        this.$videoWrapper = this.$wrapper.find('.video-wrapper');
        this.$videoIcon = $('<i class="icon-video"></i>');
        this.$prevBtn = this.$gallery.find('.prev');
        this.$nextBtn = this.$gallery.find('.next');

        this.$galleryThumbs = this.$wrapper.find('.gallery-thumbs');
        this.$tmbPrevBtn = this.$galleryThumbs.find('.prev');
        this.$tmbNextBtn = this.$galleryThumbs.find('.next');
        this.$photoListWrapper = this.$galleryThumbs.find('.photolist-wrapper');
        this.$photoList = this.$photoListWrapper.find('ul');

        this.page = 1;
        this.currentIndex = 0;
        this.pageTotal = 0;
        this.photoLen = 0;
        this.tmbPicWidth = 0;
    };

    Pgallery.prototype = {
        constructor: Pgallery,

        /**
         * [init 初始化]
         * @return {[type]} [description]
         */
        init: function() {
            // 总页数
            this.pageTotal = this.getPageTotal();
            // 缩略图总个数
            this.photoLen = this.getTotalCount();
            // 单个缩略图宽度
            this.tmbPicWidth = this.getTmbPicWidth();
            // 设置缩略图框宽度
            this.setPhotoListW();
            // 初始化缩略图
            this.initTmbImg();
            // 绑定事件
            this.evtHandler();
        },

        /**
         * [getTotalCount 获取缩略图总数]
         * @return {[type]} [description]
         */
        getTotalCount: function() {
            return this.$photoList.find('li').length;
        },

        /**
         * [getPageTotal 总页数]
         * @return {[type]} [description]
         */
        getPageTotal: function() {
            return Math.ceil(this.getTotalCount() / this.options.pageSize);
        },

        /**
         * [getTmbPicWidth 获取缩略图单个图片宽度]
         * @return {[type]} [description]
         */
        getTmbPicWidth: function() {
            return this.$photoList.find('li').outerWidth(true);
        },

        /**
         * [setPhotoListW 初始化缩略图框宽度]
         * @return {[type]} [description]
         */
        setPhotoListW: function() {
            // 如果缩略图总个数小数分页数
            if (this.photoLen < this.options.pageSize) {
                this.options.pageSize = this.photoLen;
            }
            this.$photoListWrapper.width(this.options.pageSize * this.tmbPicWidth);
            this.$photoList.width(this.photoLen * this.tmbPicWidth);
        },

        /**
         * [initTmbImg 延迟加载缩略图]
         * @return {[type]} [description]
         */
        initTmbImg: function() {
            var _this = this;
            _this.$photoList.find('li').each(function(i) {
                var $img = $(this).find('img');
                var type = $(this).attr('data-type');
                var videoSrc = $(this).attr('data-video-src');
                if (type === 'video') {
                    $(this).append(_this.$videoIcon);
                }
                var src = $img.attr('data-src');
                if (i === 0) {
                    if (type === 'video') {
                        _this.$gallery.append(_this.$videoIcon);
                    }
                    _this.tmbPicSelected();
                    _this.$realImg.attr('src', src);
                }
                $img.attr('src', src);
            });
        },

        /**
         * [evtHandler 事件处理]
         * @return {[type]} [description]
         */
        evtHandler: function() {
            var _this = this;
            _this.refreshBtn();
            // 显示相册
            if (this.options.viewModel === 0) {
                    _this.$element.click(function() {
                    _this.show();
                });
            } else {
                _this.$element.find('.realimg').click(function() {
                    _this.show();
                });
            }

            // 关闭相册
            _this.$closeBtn.click(function() {
                _this.close();
            });
            // 点击缩略图
            _this.$photoList.find('li').each(function(i) {
                $(this).click(function() {
                    _this.currentIndex = i;
                    _this.tmbPicSelected();
                    _this.showPic();
                    _this.refreshBtn();
                });
            });
            // 缩略图加载下一页
            _this.$tmbNextBtn.click(function() {
                _this.tmbNextPage();
            });
            // 缩略图加载上一页
            _this.$tmbPrevBtn.click(function() {
                _this.tmbPrevPage();
            });
            // 大图加载下一张
            _this.$nextBtn.click(function() {
                _this.nextItem();
            });
            // 大图加载上一张
            _this.$prevBtn.click(function() {
                _this.prevItem();
            });
        },

        /**
         * [disabledBtn 禁用按钮]
         * @return {[type]} [description]
         */
        disabledBtn: function(ele) {
            return $(ele).attr('disabled', true);
        },

        /**
         * [enabledBtn 激活按钮]
         * @return {[type]} [description]
         */
        enabledBtn: function(ele) {
            return $(ele).attr('disabled', false);
        },

        /**
         * [refreshBtn 缩略图按钮状态]
         * @return {[type]} [description]
         */
        refreshBtn: function() {
            if (this.pageTotal <= 1) {
                this.disabledBtn(this.$tmbPrevBtn);
                this.disabledBtn(this.$tmbNextBtn);
            } else {
                if (this.page === 1) {
                    this.disabledBtn(this.$tmbPrevBtn);
                } else {
                    this.enabledBtn(this.$tmbPrevBtn);
                }
                if (this.page === this.pageTotal) {
                    this.disabledBtn(this.$tmbNextBtn);
                } else {
                    this.enabledBtn(this.$tmbNextBtn);
                }
            }

            if (this.currentIndex === 0) {
                this.disabledBtn(this.$prevBtn);
            } else {
                this.enabledBtn(this.$prevBtn);
            }

            if (this.currentIndex === this.photoLen - 1) {
                this.disabledBtn(this.$nextBtn);
            } else {
                this.enabledBtn(this.$nextBtn);
            }
        },

        /**
         * [show 显示相册]
         * @return {[type]} [description]
         */
        show: function() {
            if (this.options.viewModel === 0) {
                return this.$wrapper.fadeIn();
            } else {
                return this.$wrapper.addClass('gallery-mask').removeClass('gallery-visible').fadeIn();
            }
        },

        /**
         * [close 关闭相册]
         * @return {[type]} [description]
         */
        close: function() {
            if (this.options.viewModel === 0) {
                return this.$wrapper.fadeOut();
            } else {
                return this.$wrapper.addClass('gallery-visible').removeClass('gallery-mask');
            }
        },

        /**
         * [showPic 显示大图]
         * @param  {[type]} i [description]
         * @return {[type]}   [description]
         */
        showPic: function(i) {
            var src = this.$photoList.find('li').eq(this.currentIndex).children('img').attr('src');
            this.$realImg.attr('src', src)
        },

        /**
         * [tmbPrevPage 缩略图加载上一页]
         * @return {[type]} [description]
         */
        tmbPrevPage: function() {
            var _this = this;
            if (!_this.$photoList.is(':animated')) {
                _this.$photoList.animate({
                    left: '+=' + _this.tmbPicWidth * _this.options.pageSize + 'px'
                }, 1000);
                _this.page--;
                _this.refreshBtn();
            }
        },

        /**
         * [tmbNextPage 缩略图加载下一页]
         * @return {[type]} [description]
         */
        tmbNextPage: function() {
            var _this = this;
            if (!_this.$photoList.is(':animated')) {
                _this.$photoList.animate({
                    left: '-=' + _this.tmbPicWidth * _this.options.pageSize + 'px'
                }, 1000);
                _this.page++;
                _this.refreshBtn();
            }
        },

        /**
         * [nextItem 大图加载下一张]
         * @return {[type]} [description]
         */
        nextItem: function() {
            if (this.currentIndex === this.photoLen - 1) {
                this.currentIndex = this.photoLen - 1;
                this.refreshBtn();
                return;
            }
            var src = this.$photoList.find('li:eq('+ (this.currentIndex+1) +')').find('img').attr('src');
            this.$realImg.attr('src', src);
            this.currentIndex++;
            this.tmbPicSelected();
            if ((this.currentIndex+1) > (this.page * this.options.pageSize)) {
                this.$tmbNextBtn.trigger('click');
            }
            this.refreshBtn();
        },

        /**
         * [prevItem 大图加载上一张]
         * @return {[type]} [description]
         */
        prevItem: function() {
            if (this.currentIndex <= 0) {
                this.currentIndex = 0;
                this.refreshBtn();
                return;
            }
            var src = this.$photoList.find('li:eq('+ (this.currentIndex-1) +')').find('img').attr('src');
            this.$realImg.attr('src', src);
            this.currentIndex--;
            this.tmbPicSelected();
            if (this.currentIndex < ((this.page-1) * this.options.pageSize)) {
                this.$tmbPrevBtn.trigger('click');
            }
            this.refreshBtn();
        },

        /**
         * [tmbPicOn 当前图片选中状态]
         * @return {[type]} [description]
         */
        tmbPicSelected: function() {
            return this.$photoList.find('li:eq('+ this.currentIndex +')').addClass('active').siblings().removeClass('active');
        },

        /**
         * [loadPic 加载图片]
         * @return {[type]} [description]
         */
        loadPic: function() {
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
