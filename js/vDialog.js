(function(window, undefined) {
  var zIndex = 1000;

  function VDialog(options) {
    this.version = '1.0.0';
    this.options = $.extend({
      title: '提示信息',
      content: '',
      okVal: '确定',
      cancelVal: '取消'
    }, options);
    return this.init();
  }

  VDialog.prototype._init = function() {
    var that = this,
      html = '<div class="vdialog">\
      <div class="vd-header">\
        <div class="vd-title"></div>\
        <a class="vd-close" href="javascript:;">&times;</a>\
      </div>\
      <div class="vd-content"></div>\
      <div class="vd-footer"></div>\
    </div>';
    html = $(html);
    // 缓存 DOM
    this.DOM = {
      wrap: html,
      header: html.find('.vd-header'),
      title: html.find('.vd-header .vd-title'),
      close: html.find('.vd-header .vd-close'),
      content: html.find('.vd-content'),
      footer: html.find('.vd-footer'),
      modal: null
    };
    // 确定按钮
    if (this.options.ok !== undefined) {
      this.ok();
    }
    // 取消按钮
    if (this.options.cancel !== undefined) {
      this.cancel();
    }
    // 关闭事件
    this.DOM.close.on('click', function() {
      that.close();
    });
    if (this.options.close !== undefined) {
      this.close(this.options.close);
    }
    // 标题
    this.title(this.options.title);
    // 尺寸
    if (this.options.width !== undefined) {
      this.width(this.options.width);
    }
    if (this.options.height !== undefined) {
      this.height(this.options.height);
    }
    // 创建 DOM
    this._build();

    // 内容，需要放到创建 DOM 之后
    this.content(this.options.content);

    this.inited = true;
    return this;
  }

  VDialog.prototype._build = function() {
    //index
    this.DOM.wrap.css({
      zIndex: ++zIndex
    });
    this.DOM.wrap.appendTo('body');
  };

  VDialog.prototype.init = function(fn) {
    if (!this.inited) {
      this._init();
    }
    if (fn !== undefined) {
      this.options.init = fn;
    }
    this.options.init && this.options.init();
    return this;
  };
  VDialog.prototype.title = function(title) {
    var toggleName = 'es-header-no-title';
    if (title === false) {
      this.DOM.header.addClass(toggleName);
      this.DOM.title.hide();
    } else {
      this.DOM.header.removeClass(toggleName);
      this.DOM.title.html(title);
    }
    return this;
  };
  VDialog.prototype.content = function(content) {
    if (content !== undefined) {
      this.DOM.content.html(content);
      this.position();
      return this;
    } else {
      return this.DOM.content;
    }
  };
  VDialog.prototype.ok = function(fn) {
    var that = this;
    that.button({
      className: 'ok',
      text: that.options.okVal
    }, function() {
      if (fn !== undefined) {
        that.options.ok = fn;
      }
      if (that.options.ok === true || that.options.ok && that.options.ok() !== false) {
        that.close();
      }
    });
  };
  VDialog.prototype.cancel = function(fn) {
    var that = this;
    that.button({
      className: 'cancel',
      text: that.options.cancelVal
    }, function() {
      if (fn !== undefined) {
        that.options.cancel = fn;
      }
      if (that.options.cancel === true || that.options.cancel && that.options.cancel() !== false) {
        that.close();
      }
    });
    return this;
  };
  VDialog.prototype.button = function(button, fn) {
    var that = this;
    button = $.extend({
      className: 'ok',
      text: '确定'
    }, button);
    var button = $('<a class="vd-btn vd-btn-' + button.className + '" href="javascript:;">' + button.text + '</a>');
    this.DOM.footer.prepend(button);
    fn && button.on('click', fn);
    return this;
  };
  VDialog.prototype.close = function(fn) {
    if (fn !== undefined) {
      this.options.close = fn;
      if (this.options.close === false) {
        this.DOM.close.hide();
      } else {
        this.DOM.close.show();
      }
    } else {
      this.DOM.wrap.remove();
      this.DOM.modal && this.DOM.modal.remove();
      if (typeof this.options.close === 'function') {
        this.options.close();
      }
    }
    return this;
  };
  VDialog.prototype.width = function(width) {
    if (width !== undefined) {
      this.options.width = width;
      this.DOM.content.width(this.options.width);
    }
    return this;
  };
  VDialog.prototype.height = function(height) {
    if (height !== undefined) {
      this.options.height = height;
      this.DOM.content.height(this.options.height);
    }
    return this;
  };
  VDialog.prototype.position = function() {
    var left, top, el = document.documentElement,
      scrollSize = {
        left: el.scrollLeft,
        top: el.scrollTop
      },
      screenSize = {
        width: el.clientWidth,
        height: el.clientHeight
      },
      dialogSize = {
        width: this.DOM.wrap.outerWidth(),
        height: this.DOM.wrap.outerHeight()
      };
    left = scrollSize.left + Math.max(0, (screenSize.width - dialogSize.width) / 2);
    top = scrollSize.top + Math.max(10, (screenSize.height - dialogSize.height) / 3);
    this.DOM.wrap.css({
      left: left + 'px',
      top: top + 'px'
    });
    return this;
  };

  VDialog.prototype.showModal = function() {
    var el = document.documentElement,
      height = Math.max(el.clientHeight, el.scrollHeight);
    this.DOM.modal = $('<div />').addClass('vdialog-modal').css({
      zIndex: zIndex,
      height: height
    }).insertBefore(this.DOM.wrap);
    return this;
  };

  window.vDialog = function(options) {
    return new VDialog(options);
  };
})(window);