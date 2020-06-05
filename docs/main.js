/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var teritory = {
  stateid: 0,
  parid: 0,
  dunid: 0
};
var __ACTIVE_PANEL__ = 'thumbs';
var __ACTIVE_SCALE__ = 'none';
var _D_ = d3.format(',');
var _F_ = function(n) {
  return d3.round(n, 1);
};

Thumb = {
  create: {
    type1: function(container, title, descriptions, scaleby, color, x, y, fn) {
      var svg = d3.select('#' + container);
      var g = svg.append('g')
	  .attr({
	    class: 'thumb',
	    transform: 'translate(' + [x, y] + ')'
	  });
      g.attr({
        'init-x': x,
        'init-y': y,
        'init-color': color,
        'init-title': title,
        'init-scale': scaleby
      });
      var b = g.append('rect')
	  .attr({
	    width: 300,
	    height: 100,
	    fill: 'none',
	    'fill-opacity': 0
	  }).style({
        cursor: 'pointer'
      });

      g.append('text')
	  .attr({
	    x: 20,
	    y: 30,
	    'font-size': 'x-large',
	    'font-weight': 'bold',
	    fill: color,
	    'pointer-events': 'none'
	  }).text(title);

      var desc = multilineText(descriptions, 5);

      g.selectAll('.desc').data(desc).enter().append('text')
	  .attr({
	    class: 'desc',
	    x: 20,
	    y: function(d, i) {
	      return 60 + (i * 12)
	    },
	    'font-size': 'smaller',
	    fill: color,
	    'pointer-events': 'none'
	  }).text(function(d) {
        return d
      });
    },
    type2: function(container, title, descriptions, scaleby, color, x, y, img, fn) {
      var svg = d3.select('#' + container);
      var g = svg.append('g')
	  .attr({
	    class: 'thumb',
	    transform: 'translate(' + [x, y] + ')'
	  });
      g.attr({
        'init-x': x,
        'init-y': y,
        'init-color': color,
        'init-title': title,
        'init-scale': scaleby
      });
      var b = g.append('rect')
	  .attr({
	    width: 300,
	    height: 100,
	    rx: 2,
	    ry: 2,
	    fill: color,
	    'fill-opacity': 0,
	    stroke: '#fff',
	    'stroke-width': 3
	  }).style({
        cursor: 'pointer'
      });


      g.append('path').attr({
        class: 'icon',
        d: img.d,
        fill: '#fff',
        transform: 'translate(10,10)scale(' + img.sc + ')',
        'pointer-events': 'none'
      });

      //img.select('path').attr('stroke', color);

      g.append('text')
	  .attr({
	    x: img === '' ? 20 : 80,
	    y: 30,
	    'font-size': 'larger',
	    'font-weight': 'bold',
	    fill: '#fff',
	    'pointer-events': 'none'
	  }).text(title);

      var desc = multilineText(descriptions, 5);

      g.selectAll('.desc').data(desc).enter().append('text')
	  .attr({
	    class: 'desc',
	    x: img === '' ? 20 : 80,
	    y: function(d, i) {
	      return 60 + (i * 12)
	    },
	    'font-size': 'smaller',
	    fill: '#ddd',
	    'pointer-events': 'none'
	  }).text(function(d) {
        return d
      });
    },
    type3: function(container, title, descriptions, scaleby, color, x, y, img, fn) {
      var svg = d3.select('#' + container);
      var g = svg.append('g')
	  .attr({
	    class: 'thumb',
	    transform: 'translate(' + [x, y] + ')'
	  });
      g.attr({
        'init-x': x,
        'init-y': y,
        'init-color': color,
        'init-title': title,
        'init-scale': scaleby
      });

      var b = g.append('rect')
	  .attr({
	    width: 300,
	    height: 100,
	    rx: 2,
	    ry: 2,
	    fill: color,
	    'fill-opacity': 0.8
	  }).style({
        cursor: 'pointer'
      });



      g.append('path').attr({
        class: 'icon',
        d: img.d,
        fill: '#fff',
        transform: 'translate(10,10)scale(' + img.sc + ')',
        'pointer-events': 'none'
      });

      //img.select('path').attr('fill', color);

      g.append('text')
	  .attr({
	    x: img === '' ? 20 : 80,
	    y: 30,
	    'font-size': 'x-large',
	    'pointer-events': 'none'
	  }).text(title);

      var desc = multilineText(descriptions, 5);

      g.selectAll('.desc').data(desc).enter().append('text')
	  .attr({
	    class: 'desc',
	    x: img === '' ? 20 : 80,
	    y: function(d, i) {
	      return 60 + (i * 12);
	    },
	    'font-size': 'smaller',
	    'pointer-events': 'none'
	  }).text(function(d) {
        return d;
      });

      if (fn !== undefined) {
        g.on('click', fn);
      }
    },
    type4: function(container, title, descriptions, scaleby, color, x, y, w, h, img, fn, fnprev) {
      var svg = d3.select('#' + container);
      var g = svg.append('g')
	  .attr({
	    class: 'thumb',
	    transform: 'translate(' + [x, y] + ')'
	  });
      g.attr({
        'init-x': x,
        'init-y': y,
        'init-color': color,
        'init-title': title,
        'init-scale': scaleby
      });
      var b = g.append('rect')
	  .attr({
	    width: w,
	    height: h,
	    rx: 2,
	    ry: 2,
	    fill: color,
	    'fill-opacity': 0.8
	  }).style({
        cursor: 'pointer'
      });

//      var img = g.append("svg:image")
//	  .attr({
//	    'xlink:href': img,
//	    width: 64,
//	    height: 64,
//	    x: 10,
//	    y: 10
//	  });

      g.append('path').attr({
        class: 'icon',
        d: img.d,
        fill: '#fff',
        transform: 'translate(10,10)scale(' + img.sc + ')',
        'pointer-events': 'none'
      });

      //img.select('path').attr('fill', color);

      g.append('text')
	  .attr({
	    x: img === '' ? 20 : 80,
	    y: 30,
	    'font-size': 'x-large',
	    'pointer-events': 'none'
	  }).text(title);

      var desc = multilineText(descriptions, 4);

      g.selectAll('.desc').data(desc).enter().append('text')
	  .attr({
	    class: 'desc',
	    x: img === '' ? 20 : 80,
	    y: function(d, i) {
	      return 60 + (i * 12);
	    },
	    'font-size': 'smaller',
	    'pointer-events': 'none'
	  }).text(function(d) {
        return d;
      });

      if (fnprev !== undefined) {
        g.append('g').attr('transform', 'translate(10, 120)').call(fnprev);
      }

      g.on('click', fn);
    }
  }
};


function multilineText(str, nwords, color) {
  var res = [];
  var nstr = str.split(' ');
  var ss = '';
  nstr.forEach(function(d, i) {
    ss += d + ' ';
    if ((i + 1) % nwords === 0 || (i + 1) === nstr.length) {
      res.push(ss);
      ss = '';
    }
    //console.log(d,i,(i+1) % nwords,nstr.length);
  });

  //console.log(res);
  return res;
}


function d3StripText(el, w_aloc) {
 el.text(
          function() {
	t = d3.select(this).text();
	len = t.length;
	w = Math.round(d3.select(this).node().getBBox().width);
	
	_clen = Math.round(w/ len);
	
	if(w > w_aloc){
	  bal = w - w_aloc;
	  
	  strip = Math.round(bal / _clen);
	  
	  t =  t.substring(0, t.length - strip);
	}else{
	  _s = true;
	}
	
	return t;
          }
  );//.call(d3StripText, w_aloc, _s)
}

function _thumbs_out_(r) {
  // reset app view container
  //d3.select('#h-view').selectAll('*').remove();
  d3.select('#g-view').selectAll('*').remove();
  d3.select('#g-view').attr({opacity: 1});
  //d3.select('#thumbs-scroll').attr('fill', 'none');

  __ACTIVE_PANEL__ = 'view';
  __ACTIVE_SCALE__ = $(r).attr('init-scale');
  //console.log(d3.select(r).select('.icon').attr('d'));
  color = $(r).attr('init-color');
  title = $(r).attr('init-title');
  d3.selectAll('.thumb,.thumb2').transition().duration(800).attr('transform', 'translate(-500,-500)skewX(10)skewY(35)')
          .transition().duration(30).attr('transform', 'translate(-500,-500)');
  var g = d3.select('#main-g').append('g');
  g.attr({
    class: 'g-open',
    transform: 'translate(10,10)'
  });

  var t = g.append('rect')
          .attr({
	width: 2500,
	height: 50,
	x: -10,
	y: -10,
	rx: 5,
	ry: 5,
	fill: '#222'
          });

  var ttl = g.append('text').attr({
    'font-size': 'larger',
    'font-weight': 'bold',
    'text-anchor': 'start',
    x: -100,
    y: 20,
    fill: '#fff'
  }).text(title);

  var t = g.append('rect')
          .attr({
	width: 30,
	height: 30,
	rx: 5,
	ry: 5,
	fill: color,
	opacity: 0.9,
	cursor: 'pointer'
          });

  var ic = g.append('path').attr({
    class: 'icon-small',
    d: d3.select(r).select('.icon').attr('d'),
    fill: '#fff',
    transform: 'translate(0,0)scale(1,1)',
    cursor: 'pointer'
  });

  var bbox = ic.node().getBBox();
  var sh = 24 / bbox.height;
  //console.log('icon', sh);
  ic.attr('transform', 'translate(3,3)scale(' + [sh, sh] + ')');

  ttl.transition().duration(600).attr('x', 40);

  t.on('click', clicked);
  ic.on('click', clicked);

  function clicked() {
    d3.selectAll('.thumb,.thumb2').transition().duration(500).attr('transform', function() {
      _this = d3.select(this);
      x = _this.attr('init-x');
      y = _this.attr('init-y');
      _this.transition().duration(600)
	  .attr({
	    transform: 'translate(' + [x, y] + ')'
	  });
      d3.select('.g-open').remove();
      d3.select('#g-view').selectAll('*').remove();
      d3.select('#g-view').attr({opacity: 0});
      __ACTIVE_PANEL__ = 'thumbs';

      //d3.select('#thumbs-scroll').attr('fill', '#000');
      //__scroll_thumb__();
      __win_resize__();
    });


  }
}


function __win_resize__() {
  var h = $(window).height() - 35;

  //d3.select('#thumbs-scroll').attr('fill', '#000');
  var bbox = d3.select('#main-g').node().getBBox();

  var hscale = h / bbox.height;
  d3.select('#main-g')
          .attr({
	transform: 'translate(0,0)scale(' + [hscale, hscale] + ')'
          });

  if (__ACTIVE_SCALE__ === 'height') {
    __height_resize__();
  } else if (__ACTIVE_SCALE__ === 'width') {
    __width_resize__();
  } else if (__ACTIVE_SCALE__ === 'none') {
    __reset_scale__();
  }


  //d3.select('#thumbs-scroll').attr('fill', 'none');

}


function __height_resize__() {
  var h = $(window).height() - 35;

  var vbox = d3.select('#g-view').node().getBBox();
  var vscale = h / (vbox.height + 50);
  d3.select('#g-view').transition().duration(800)
          .attr({
	transform: 'translate(0,40)scale(' + [vscale, vscale] + ')'
          });
}

function __height_resize_by__(f) {
  var h = $(window).height() - 35;

  var vbox = d3.select('#g-view').node().getBBox();
  var vscale = h / (vbox.height + 50);
  d3.select('#g-view').transition().duration(800)
          .attr({
	transform: 'translate(0,40)scale(' + [vscale * f, vscale * f] + ')'
          });
}


function __width_resize__() {
  var h = $(window).width() - 35;

  var vbox = d3.select('#g-view').node().getBBox();
  var vscale = h / vbox.width;
  d3.select('#g-view').transition().duration(800)
          .attr({
	transform: 'translate(0,40)scale(' + [vscale, vscale] + ')'
          });
}

function __reset_scale__() {
  d3.select('#g-view').transition().duration(800)
          .attr({
	transform: 'translate(0,40)scale(' + [1, 1] + ')'
          });
}


function __scroll_thumb__() {
  //thumb nails view active
  var sx = d3.scale.linear().domain([0, 2500]).range([0, 2500]);
  var svg = d3.select('#thumbs-scroll');

  var zoom = d3.behavior.zoom()
          .x(sx)
          .scaleExtent([1, 10])
          .on('zoom', zoomed);

  svg.call(zoom);
  //d3.select('#thumbs-g').call(zoom);
  function zoomed() {
    console.log('zoomed... thumb');
    d3.select('#thumbs-g').attr({
      transform: 'translate(' + [sx(0), 0] + ')'
    });
  }
}
