var PanZoom = function (n, t) {
    function rt(n, t, i, r) {
        var u = n / t;
        return (n > i || t < r) && (n = i, t = Math.floor(n / u)), (t > r || n < i) && (t = r, n = Math.floor(t * u)), {
            width: n,
            height: t
        }
    }

    function a() {
        return $(n).find("#viewport").get(0)
    }

    function k() {
        var t, r, s;
        if (b) {
            var e = b.split(" "),
                o = parseFloat(e[2]),
                h = parseFloat(e[3]),
                u = $(n).width(),
                f = $(n).height();
            typeof i.createSVGMatrix == "function" && (t = i.createSVGMatrix(), r = rt(o, h, u, f), r.width < u && (t = t.translate((u - r.width) / 2, 0)), r.height < f && (t = t.translate(0, (f - r.height) / 2, 0)), t = t.scale(r.width / o), s = $(i).find("#viewport").get(0), p(s, t))
        }
    }

    function v(n) {
        return n.originalEvent ? n.originalEvent.touches ? n.originalEvent.touches[0] : n.originalEvent : n
    }

    function y(t) {
        var r = i.createSVGPoint();
        return r.x = t.pageX - $(n).offset().left, r.y = t.pageY - $(n).offset().top, r
    }

    function ut() {
        var t = i.createSVGPoint();
        return t.x = $(n).width() / 2, t.y = $(n).height() / 2, t
    }

    function p(t, r) {
        var u = "matrix(" + r.a + "," + r.b + "," + r.c + "," + r.d + "," + r.e + "," + r.f + ")";
        t.setAttribute("transform", u);
        navigator.userAgent.match(/trident|edge/i) && typeof i.style.strokeMiterlimit != "undefined" && (i.style.strokeMiterlimit = i.style.strokeMiterlimit !== "3" ? "3" : "2");
        l && l(n)
    }

    function d(n) {
        var t, i;
        tt && (n.preventDefault && n.preventDefault(), n.returnValue = !1, t = n.originalEvent.wheelDelta ? n.originalEvent.wheelDelta / 360 : n.originalEvent.detail / -9, i = Math.pow(1 + o, t), f(i, n))
    }

    function f(n, t) {
        var o = t ? y(v(t)) : ut(),
            r = a(),
            f = o.matrixTransform(r.getCTM().inverse()),
            e = i.createSVGMatrix().translate(f.x, f.y).scale(n).translate(-f.x, -f.y);
        p(r, r.getCTM().multiply(e));
        u == null && (u = r.getCTM().inverse());
        u = u.multiply(e.inverse())
    }

    function e(n, t) {
        return {
            pageX: n[t].pageX,
            pageY: n[t].pageY
        }
    }

    function w(n, t) {
        var i = n.pageX - t.pageX,
            r = n.pageY - t.pageY;
        return Math.sqrt(i * i + r * r)
    }

    function g(n) {
        var t, i, o, l, b, k;
        n.preventDefault && n.preventDefault();
        n.returnValue = !1;
        r === "pinch" && (t = n.originalEvent.touches, t && t.length === 2 && (i = e(t, 0), o = e(t, 1), n.pageX = (i.pageX + o.pageX) / 2, n.pageY = (i.pageY + o.pageY) / 2, l = w(i, o), f(l / c, n), c = l));
        b = v(n);
        r === "down" && w(b, h) > it && (r = "pan");
        r === "pan" && (k = y(b).matrixTransform(u), p(a(), u.inverse().translate(k.x - s.x, k.y - s.y)))
    }

    function ft(n) {
        return n.preventDefault && n.preventDefault(), nt(n)
    }

    function nt(n) {
        var t = n.originalEvent.touches,
            i, f;
        t && t.length === 2 ? (i = e(t, 0), f = e(t, 1), c = w(i, f), r = "pinch") : (u = a().getCTM().inverse(), h = v(n), s = y(h).matrixTransform(u), r = "down")
    }

    function et(n) {
        (r == "pan" || r == "pinch") && n.stopPropagation && n.stopPropagation();
        r = null
    }
    var tt = 1,
        o = .5,
        it = 3,
        r = null,
        s = null,
        h = null,
        u = null,
        c = null,
        l = null,
        i = t.svg,
        b = t.viewBox;
    k();
    $.contains(document, i) || (i = $(n).html(i).find("svg").get(0));
    navigator.userAgent.match(/trident|edge/i) && (SVGElement.prototype.getBoundingClientRect = function () {
        var f = i.createSVGPoint(),
            n = this.getBBox(),
            e = this.getScreenCTM(),
            t, u, r;
        return f.x = n.x, f.y = n.y, t = f.matrixTransform(e), u = i.createSVGPoint(), u.x = n.x + n.width, u.y = n.y + n.height, r = u.matrixTransform(e), {
            left: t.x,
            top: t.y,
            right: r.x,
            bottom: r.y,
            width: r.x - t.x,
            height: r.y - t.y
        }
    });
    $(n).on("mousedown", ft).on("mousemove", g).on("touchstart", nt).on("touchmove", g);
    if ($(n).get(0).addEventListener("click", et, !0), navigator.userAgent.toLowerCase().indexOf("firefox") >= 0) $(n).on("DOMMouseScroll", d);
    else $(n).on("mousewheel", d);
    return {
        zoomIn: function () {
            f(Math.pow(1 + o, 1))
        },
        zoomOut: function () {
            f(Math.pow(1 + o, -1))
        },
        zoomReset: function () {
            k()
        },
        onViewChanged: function (n) {
            l = n
        }
    }
};
