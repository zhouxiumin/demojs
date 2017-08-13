/**
 * Created by zhouxiumin on 2017/7/9.
 */

var myChart = echarts.init(document.getElementById('main'));
window.onresize = function () {
    myChart.resize();
};
myChart.showLoading();
$.get('/server/simple.gexf', function (xml) {
    myChart.hideLoading();

    var graph = echarts.dataTool.gexf.parse(xml);
    var categories = [];
    for (var i = 0; i < 9; i++) {
        categories[i] = {
            name: '类目' + i
        };
    }
    graph.nodes.forEach(function (node) {
        node.itemStyle = null;
        node.symbolSize = 20;
        node.value = node.symbolSize;
        node.category = node.attributes.modularity_class;
        // Use random x, y
        node.x = node.y = null;
        node.draggable = true;
    });
    option = {
        title: {
            text: 'Les Miserables',
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {
            trigger: 'item',
            enterable: true,
            triggerOn: 'mousemove',
            position: 'right',
            hideDelay: 500,
            formatter: function (params, ticket, callback) {

                return '菜单:<br/> <button onclick="clickBtn()"> 点击</button>'
            }
        },
        legend: [{
            // selectedMode: 'single',
            data: categories.map(function (a) {
                return a.name;
            })
        }],
        animation: false,
        series : [
            {
                name: 'Les Miserables',
                type: 'graph',
                layout: 'force',
                data: graph.nodes,
                links: graph.links,
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [1, 10],
                categories: categories,
                roam: true,
                label: {
                    normal: {
                        position: 'right'
                    }
                },
                force: {
                    repulsion: 100
                }
            }
        ]
    };

    myChart.setOption(option);
}, 'xml');

function clickBtn() {
    console.log('hello');
    var option = myChart.getOption();
    var series = option.series;

    console.log(series);

}
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////以下无用/////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
var arrayProto = Array.prototype;
var nativeForEach = arrayProto.forEach;
var nativeMap = arrayProto.map;

function map(obj, cb, context) {
    if (!(obj && cb)) {
        return;
    }
    if (obj.map && obj.map === nativeMap) {
        return obj.map(cb, context);
    }
    else {
        var result = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            result.push(cb.call(context, obj[i], i, obj));
        }
        return result;
    }
}

function each(obj, cb, context) {
    if (!(obj && cb)) {
        return;
    }
    if (obj.forEach && obj.forEach === nativeForEach) {
        obj.forEach(cb, context);
    }
    else if (obj.length === +obj.length) {
        for (var i = 0, len = obj.length; i < len; i++) {
            cb.call(context, obj[i], i, obj);
        }
    }
    else {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                cb.call(context, obj[key], key, obj);
            }
        }
    }
}

var vendors = ['', '-webkit-', '-moz-', '-o-'];
//
var gCssText = 'position:absolute;display:block;border-style:solid;white-space:nowrap;z-index:9999999;';

function assembleTransition(duration) {
    var transitionCurve = 'cubic-bezier(0.23, 1, 0.32, 1)';
    var transitionText = 'left ' + duration + 's ' + transitionCurve + ','
        + 'top ' + duration + 's ' + transitionCurve;
    return map(vendors, function (vendorPrefix) {
        return vendorPrefix + 'transition:' + transitionText;
    }).join(';');
}

function assembleFont(textStyleModel) {
    var cssText = [];

    var fontSize = textStyleModel.get('fontSize');
    var color = textStyleModel.getTextColor();

    color && cssText.push('color:' + color);

    cssText.push('font:' + textStyleModel.getFont());

    fontSize &&
    cssText.push('line-height:' + Math.round(fontSize * 3 / 2) + 'px');

    each(['decoration', 'align'], function (name) {
        var val = textStyleModel.get(name);
        val && cssText.push('text-' + name + ':' + val);
    });

    return cssText.join(';');
}

function assembleCssText(tooltipModel) {

    var cssText = [];

    var transitionDuration = tooltipModel.get('transitionDuration');
    var backgroundColor = tooltipModel.get('backgroundColor');
    var textStyleModel = tooltipModel.getModel('textStyle');
    var padding = tooltipModel.get('padding');

    // Animation transition. Do not animate when transitionDuration is 0.
    transitionDuration &&
    cssText.push(assembleTransition(transitionDuration));

    if (backgroundColor) {
        cssText.push('background-Color:' + backgroundColor);
    }

    // Border style
    each(['width', 'color', 'radius'], function (name) {
        var borderName = 'border-' + name;
        var camelCase = toCamelCase(borderName);
        var val = tooltipModel.get(camelCase);
        val != null &&
        cssText.push(borderName + ':' + val + (name === 'color' ? '' : 'px'));
    });

    // Text style
    cssText.push(assembleFont(textStyleModel));

    // Padding
    if (padding != null) {
        cssText.push('padding:' + formatUtil.normalizeCssArray(padding).join('px ') + 'px');
    }

    return cssText.join(';') + ';';
}

var menuModel = {
    type: 'menu',
    defaultOption: {
        transitionDuration: 0.4,
        padding: 5,
        enterable: false,
        triggerOn: 'mousemove|click',
        backgroundColor: 'rgba(50,50,50,0.7)',
        textStyle: {
            color: '#fff',
            fontSize: 14
        }
    },
    get: function (path) {
        if (path === null) {
            return this.defaultOption;
        } else if(this.defaultOption.hasOwnProperty(path)) {
            return this.defaultOption[path];
        } else {
            return null;
        }
    }
};

function MenuContent(container, api) {
    var el = document.createElement('div');

    var zr = this._zr = api.getZr();
    this.el = el;

    this._x = api.getWidth() / 2;
    this._y = api.getHeight() / 2;

    this.menu_number = 4;
    this._container = container;
    this._show = false;
}

MenuContent.prototype = {
    constructor: MenuContent,
    _enterable: true,
    update: function () {
        // FIXME
        // Move this logic to ec main?
        var container = this._container;
        var stl = container.currentStyle
            || document.defaultView.getComputedStyle(container);
        var domStyle = container.style;
        if (domStyle.position !== 'absolute' && stl.position !== 'absolute') {
            domStyle.position = 'relative';
        }
    },
    show: function (tooltipModel) {
        clearTimeout(this._hideTimeout);
        var el = this.el;

        el.style.cssText = gCssText + assembleCssText(tooltipModel)
            // http://stackoverflow.com/questions/21125587/css3-transition-not-working-in-chrome-anymore
            + ';left:' + this._x + 'px;top:' + this._y + 'px;'
            + (tooltipModel.get('extraCssText') || '');

        el.style.display = el.innerHTML ?  'block' : 'none';

        this._show = true;
    },

    setContent: function (content) {
        this.el.innerHTML = content == null ? '' : content;
    },
    setEnterable: function (enterable) {
        this._enterable = enterable;
    },
    getSize: function () {
        var el = this.el;
        return [el.clientWidth, el.clientHeight];
    },
    moveTo: function (x, y) {
        // xy should be based on canvas root. But tooltipContent is
        // the sibling of canvas root. So padding of ec container
        // should be considered here.
        var zr = this._zr;
        var viewportRoot;
        if (zr && zr.painter && (viewportRoot = zr.painter.getViewportRoot())) {
            x += viewportRoot.offsetLeft || 0;
            y += viewportRoot.offsetTop || 0;
        }

        var style = this.el.style;
        style.left = x + 'px';
        style.top = y + 'px';

        this._x = x;
        this._y = y;
    },
    hide: function () {
        this.el.style.display = 'none';
        this._show = false;
    },

    isShow: function () {
        return this._show;
    }
};
var proxyRect = new echarts.graphic.Rect({
    shape: {x: -1, y: -1, width: 2, height: 2}
});

function MenuView(api) {
    this._menuContent = new MenuContent(api.getDom(), api);
    this._menuModel = menuModel;
}

MenuView.prototype = {
    type: 'menu',
    init: function (ecModel, api) {
        var menuContent = new MenuContent(api.getDom(), api);
        this._menuContent = menuContent;
    },
    render: function (menuModel, ecModel, api) {
        this._menuModel = menuModel;

        this._ecModel = ecModel;

        this._api = api;

        var menuContent = this._menuContent;
        menuContent.update();
        menuContent.setEnterable(menuModel.get('enterable'));

        this._keepShow();
    },

    _keepShow: function () {
        var menuModel = this._menuModel;
        var ecModel = this._ecModel;
        var api = this._api;

        // Try to keep the tooltip show when refreshing
        if (this._lastX !== null
            && this._lastY !== null
            // When user is willing to control tooltip totally using API,
            // self.manuallyShowTip({x, y}) might cause tooltip hide,
            // which is not expected.
            && menuModel.get('triggerOn') !== 'none'
        ) {
            var self = this;
            clearTimeout(this._refreshUpdateTimeout);
            this._refreshUpdateTimeout = setTimeout(function () {
                // Show tip next tick after other charts are rendered
                // In case highlight action has wrong result
                // FIXME
                self.manuallyShowTip(menuModel, ecModel, api, {
                    x: self._lastX,
                    y: self._lastY
                });
            },0);
        }
    },

    manuallyShowTip: function (tooltipModel, ecModel, api, payload) {
        if (payload.from === this.uid) {
            return;
        }

        var dispatchAction = makeDispatchAction(payload, api);

        if (payload.tooltip && payload.x != null && payload.y != null) {
            var el = proxyRect;
            el.position = [payload.x, payload.y];
            el.update();
            el.tooltip = payload.tooltip;
            // Manually show tooltip while view is not using zrender elements.
            this._tryShow({
                offsetX: payload.x,
                offsetY: payload.y,
                target: el
            }, dispatchAction);
        }
    },

    _tryShow: function (e, dispatchAction) {
        var el = e.target;
        var tooltipModel = this._tooltipModel;

        if (!tooltipModel) {
            return;
        }

        // Save mouse x, mouse y. So we can try to keep showing the tip if chart is refreshed
        this._lastX = e.offsetX;
        this._lastY = e.offsetY;

        // Tooltip provided directly. Like legend.
        if (el && el.tooltip) {
            this._showComponentItemTooltip(e, el, dispatchAction);
        }
    }

};
