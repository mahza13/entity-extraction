/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var _TIMR_LEN_ = 1800;
var _TIMR_HGT_ = 600;

function getPilihanraya(stateid, kerusi, fn) {
  $.ajax({
    type: "POST",
    url: "http://ws.aga.my/ws/ws.aspx/loadKronologiPilihanraya",
    data: "{'stateid':" + stateid + ",'kerusi':" + kerusi + "}",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(msg) {
      fn(msg.d);
    }
  });
}

function pru_nth(y) {
  var nth = '';
  switch (y) {
    //pru
    case 2013:
      nth = '13';
      break;
    case 2008:
      nth = '12';
      break;
    case 2004:
      nth = '11';
      break;
    case 1999:
      nth = '10';
      break;
    case 1995:
      nth = '9';
      break;
    case 1990:
      nth = '8';
      break;
    case 1986:
      nth = '7';
      break;
      //prn
    case 2011:
      nth = '10';
      break;
    case 2006:
      nth = '9';
      break;
    case 2001:
      nth = '8';
      break;
    case 1996:
      nth = '7';
      break;
    case 1991:
      nth = '6';
      break;
  }

  return nth;
}

function drawmenangpru(g) {
//console.log('totallll',total);
  g.selectAll('.mng').data(function(d) {
    //console.log('dddd', d.parti);
    var sortmng = function(a, b) {
      return b.mng - +a.mng;
    };

    d.parti.forEach(function(p) {
      p.perc = p.undi / d.total_undi * 100;
      p.perc_mng = p.mng / d.total_kerusi * 100;
    });
    //console.log(d.parti);
    return d.jenis === '1' ? d.parti.sort(sortmng) : [];
  }).enter().append('g')
          .call(function(t) {
	t.attr({
	  transform: function(d, i) {
	    var translate = [0, (i * 12) + 30];
	    return 'translate(' + translate + ')';
	  }
	});

	t.append('text')
	        .attr({
	          'font-size': 'smaller',
	          'text-anchor': 'end',
	          x: 0,
	          fill: function(d) {
		cl = '#fff';
		if (d.parti === 'BN') {
		  cl = '#6668ED';
		} else if (d.parti === 'PAS' || d.parti === 'PKR' || d.parti === 'KEADILAN' || d.parti === 'DAP') {
		  cl = '#E6683E';
		}
		return cl;
	          }
	        }).text(function(d) {
	  return d.parti;
	});


	t.append('text')
	        .attr({
	          'font-size': 'smaller',
	          'font-weight': 'normal',
	          'text-anchor': 'start',
	          x: 10,
	          fill: '#65EB70'
	        }).text(function(d) {
	  return d.mng > 0 ? d.mng : '-';
	});

	t.append('text')
	        .attr({
	          'font-size': 'smaller',
	          'font-weight': 'normal',
	          'text-anchor': 'end',
	          x: 90,
	          fill: '#fff'
	        }).text(function(d) {
	  return d.undi > 0 ? _D_(d.undi) : '-';
	});

	t.append('text')
	        .attr({
	          'font-size': 'smaller',
	          'font-weight': 'normal',
	          'text-anchor': 'middle',
	          x: 110,
	          fill: '#F2F754'
	        }).text(function(d) {
	  return d.undi > 0 ? _F_(d.perc) + '%' : '-';
	});

          });

}

function drawpilihanraya(d) {
  //console.log(d);

  var last_prk = 300;
  var tarikh = [];
  tarikh.push(new Date('1985-06-01'));
  d.forEach(function(dt) {
    t = new Date(dt.tarikh);
    //console.log(t);
    tarikh.push(new Date(dt.tarikh));
  });

  //console.log(tarikh);
  var vw = d3.select('#g-view');
  var pnl = vw.append('rect')
          .attr({
	width: _TIMR_LEN_,
	height: _TIMR_HGT_,
	fill: '#999',
	opacity: 0,
	y: 50
          });
  var g = vw.append('g').attr('transform', 'translate(0,0)');

  //console.log(d3.min(tarikh));
  var t1 = new Date(d3.min(tarikh)),
          t2 = new Date(d3.max(tarikh)),
          t0 = d3.time.month.offset(t1, -1),
          t3 = d3.time.month.offset(t2, +1);

  var x1 = d3.time.scale()
          .domain([t0, t3])
          .range([t0, t3].map(d3.time.scale()
	      .domain([t1, t2])
	      .range([0, _TIMR_LEN_])));

  var x = d3.time.scale()
          .domain(x1.domain())
          .range(x1.range());

  var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

  var y = d3.scale.linear().domain([0, 100]).range([400, 300]);
  var ry = d3.scale.linear().domain([0, 100]).range([0, 30]);
  var yAxis = d3.svg.axis().scale(y).orient("right").ticks(3);

  var p_line = d3.svg.line()
          .x(function(dx) {
	return x(new Date(dx.tarikh));
          })
          .y(function(dx) {
	return y(dx.popular);
          });

  var k_line = d3.svg.line()
          .x(function(dx) {
	return x(new Date(dx.tarikh));
          })
          .y(function(dx) {
	return y(dx.mng);
          });

  var zoom = d3.behavior.zoom()
          .x(x)
          .scaleExtent([1, 12])
          .on("zoom", zoomed);

  var bar = g.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(40,50)')
          .call(xAxis);

  bar.selectAll('text')
          .attr('y', 20)
          .attr('x', 6)
          .attr('fill', '#65EB70')
          .style('text-anchor', 'start');

  bar.selectAll('path')
          .attr({
	'stroke-width': 8,
	stroke: '#65EB70',
	fill: 'none',
	'shape-rendering': 'crispEdges'
          });

  bar.selectAll('line')
          .attr({
	'stroke-width': 2,
	stroke: '#fff',
	fill: 'none',
	'shape-rendering': 'crispEdges'
          });



  //pnl.on("mousewheel", pan);
  pnl.call(zoom);

  g.selectAll('.g-pru').data(d).enter().append('g')
          .call(function(pru) {
	pru.attr({
	  class: 'g-pru',
	  transform: 'translate(0,0)',
	  opacity: 0
	});

	pru.transition().duration(function(d, i) {
	  return i * 30;
	}).attr({
	  transform: function(dx) {
	    last_prk -= dx.jenis === '1' ? 0 : 50;
	    last_prk = last_prk <= 50 ? 250 : last_prk;
	    return 'translate(' + [x(new Date(dx.tarikh)), (dx.jenis === '1' ? 450 : last_prk)] + ')';
	  },
	  opacity: 1
	});

	pru.append('circle')
	        .attr({
	          cy: -15,
	          fill: function(dx) {
		c = '#65EB70';
		if (dx.jenis !== '1') {
		  mng = 0;
		  dx.parti.forEach(function(dy) {
		    if (dy.parti === 'BN' && dy.mng === 1) {
		      mng = 1;
		    }
		  });

		  c = mng === 1 ? '#6668ED' : '#E6683E';
		} else {
		  c = '#65EB70';
		}

		return c;
	          },
	          r: function(dx) {
		c = 5;
		if (dx.jenis === '2') {
		  mng = 0;
		  dx.parti.forEach(function(dy) {
		    if (dy.parti === 'BN') {
		      //console.log('dy', dy);
		      c = ry(dy.undi / dx.total_undi * 100);
		    }
		  });
		}
		//console.log(c);
		return c;
	          }
	        });

	pru.append('text')
	        .attr({
	          class: 'pru-label-date',
	          fill: '#65EB70',
	          y: 0,
	          'font-size': 'x-small',
	          'text-anchor': 'middle'
	        })
	        .text(function(dx) {
	          var t = new Date(dx.tarikh);
	          return t.getDate() + '/' + (t.getMonth() + 1) + '/' + t.getFullYear();
	        });


	pru.selectAll('.pru-label').data(function(d) {
	  return multilineText(d.label + ' ' + (d.jenis === '1' ? pru_nth(d.tahun) : ''), 2);
	}).enter().append('text')
	        .attr({
	          class: 'pru-label',
	          fill: '#fff',
	          y: function(dx, i) {
		return (i * 10) + 12;
	          },
	          'font-size': 'smaller',
	          'text-anchor': 'middle'
	        })
	        .text(function(dx) {
	          return dx;
	        });

	drawmenangpru(pru);
          });
  drawpopular();

  function zoomed() {
    vw.select(".x.axis").call(xAxis);

    bar.selectAll('text')
	.attr('y', 20)
	.attr('x', 6)
	.attr('fill', '#65EB70')
	.style('text-anchor', 'start');


    g.selectAll('.g-pru').attr('transform', function(dx) {
      var current_translate = d3.transform(d3.select(this).attr("transform")).translate;
      last_prk -= dx.jenis === '1' ? 0 : 50;
      last_prk = last_prk <= 50 ? 250 : last_prk;
      return 'translate(' + [x(new Date(dx.tarikh)), current_translate[1]] + ')';
    });

    g.selectAll('.line-popular').attr('d', function(dx) {
      return p_line(dx);
    });

    g.selectAll('.line-kerusi').attr('d', function(dx) {
      return k_line(dx);
    });
    //    

    g.selectAll('.point-popular')
	.call(function(gp) {
	  gp.attr({
	    transform: function(dx) {
	      return 'translate(' + [x(new Date(dx.tarikh)), y(dx.popular)] + ')';
	    }
	  });

	});

    g.selectAll('.point-kerusi')
	.call(function(gp) {
	  gp.attr({
	    transform: function(dx) {
	      return 'translate(' + [x(new Date(dx.tarikh)), y(dx.mng)] + ')';
	    }
	  });

	});
  }

  function drawpopular() {
    //console.log('drawpopular', d);
    var popular = [];
    d.forEach(function(dx, i) {
      pop = 0;
      kerusi = 0;
      if (dx.jenis === '1') {
        console.log('jenis', dx.jenis);
        dx.parti.forEach(function(dd) {
          if (dd.parti === 'BN') {
	pop = dd.perc;
	mng = dd.perc_mng;
          }
        });

        popular.push({tarikh: dx.tarikh, popular: pop, mng: mng});
      }
    });

    //console.log(popular);
    var gpop = g.append('g').attr({
      class: 'pop-box',
      transform: 'translate(40,300)'
    })

    var poppnl = gpop.append('rect').attr({
      fill: '#545763',
      height: 100,
      width: 2500,
      x: -100
    }).call(zoom);
    ;

    gpop.append('circle').attr({fill: '#fff', r: 10, cx: 20, cy: 85, opacity: 0.5});
    gpop.append('text').attr({
      x: 40,
      y: 90,
      fill: '#65EB70'
    }).text('Undi Popular');
    gpop.append('text').attr({
      x: 140,
      y: 90,
      fill: '#fff'
    }).text('VS');
    gpop.append('circle').attr({fill: '#00f', r: 10, cx: 180, cy: 85, opacity: 0.5});
    gpop.append('text').attr({
      x: 200,
      y: 90,
      fill: '#65EB70'
    }).text('Bilangan Kerusi dimenangi BN');


    var pop_y = g.append('g')         // Add the Y Axis
	.attr('class', 'y axis')
	.attr('transform', 'translate(40, 0)')
	.call(yAxis);

    pop_y.selectAll('text')
	.attr('y', 0)
	.attr('x', -10)
	.attr('fill', '#65EB70')
	.style('text-anchor', 'end');

    pop_y.selectAll('path')
	.attr({
	  'stroke-width': 8,
	  stroke: '#65EB70',
	  fill: 'none',
	  'shape-rendering': 'crispEdges'
	});

    pop_y.selectAll('line')
	.attr({
	  'stroke-width': 2,
	  stroke: '#fff',
	  fill: 'none',
	  'shape-rendering': 'crispEdges'
	});
    g.selectAll('.line-kerusi').data([popular]).enter().append('path')
	.attr('d', function(dx) {
	  return k_line(dx);
	})
	.attr({
	  class: 'line-kerusi',
	  stroke: '#00f',
	  'stroke-width': 6,
	  'stroke-opacity': 0.35,
	  fill: 'none'
	});

    g.selectAll('.line-popular').data([popular]).enter().append('path')
	.attr('d', function(dx) {
	  return p_line(dx);
	})
	.attr({
	  class: 'line-popular',
	  stroke: '#fff',
	  'stroke-width': 6,
	  'stroke-opacity': 0.35,
	  fill: 'none'
	});

// mark the kerusi point
    g.selectAll('.point-kerusi').data(popular).enter().append('g')
	.call(function(gp) {
	  gp.attr({
	    class: 'point-kerusi',
	    transform: function(dx) {
	      return 'translate(' + [x(new Date(dx.tarikh)), y(dx.mng)] + ')'
	    }
	  });

	  gp.append('circle').attr({
	    fill: '#00f',
	    opacity: 0.5,
	    r: function(dx) {
	      return ry(dx.mng)
	    }
	  });

	  gp.append('text').attr({
	    'text-anchor': 'middle',
	    fill: '#fff'
	  }).text(function(dx) {
	    return _F_(dx.mng)
	  });
	});
// mark the popular point
    g.selectAll('.point-popular').data(popular).enter().append('g')
	.call(function(gp) {
	  gp.attr({
	    class: 'point-popular',
	    transform: function(dx) {
	      return 'translate(' + [x(new Date(dx.tarikh)), y(dx.popular)] + ')'
	    }
	  });

	  gp.append('circle').attr({
	    fill: '#fff',
	    opacity: 0.5,
	    r: function(dx) {
	      return ry(dx.popular)
	    }
	  });

	  gp.append('text').attr({
	    'text-anchor': 'middle'
	  }).text(function(dx) {
	    return _F_(dx.popular)
	  });
	});

  }


  __height_resize__();
}




pilihanraya = {
  name: 'Histogram PRU',
  version: '0.1',
  description: 'Sejarah PRU/ PRN dan PRK dari tahun 1986 hingga 2013',
  fitscreenby: 'height',
  thumb: {
    type: 4,
    column: 0,
    color: '#36D6C6',
    height: 205,
    width: 300,
    icon: Icon.calendar,
    preview: function() {
    },
    onclick: function(g) {

      getPilihanraya(teritory.stateid, teritory.stateid > 0 ? 0 : 1, drawpilihanraya);
      _thumbs_out_(this);
    }
  }
};