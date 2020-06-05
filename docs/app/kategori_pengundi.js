/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var header = {
  starty: 50,
  gap: 140,
  placename: 200
};

var scale = {y: d3.scale.linear().domain([900, 0]).range([900, 0])};

function drawheader(sum, nth) {
  var vw = d3.select('#g-view').select('.h-layer');
  var g = vw.append('g').attr('transform', 'translate(' + [(nth * header.gap) + header.placename + 30, 80] + ')');


  var title = multilineText(sum.title, 2);
  title = title.reverse();
  console.log(title);
  g.selectAll('.text-title').data(title).enter().append('text')
          .attr({
	fill: '#fff',
	y: function(d, i) {
	  return (i * -12) + header.starty;
	},
	'text-anchor': 'start'
          }).text(function(d) {
    return d
  });

  g.append('text').attr({fill: '#fff', y: header.starty + 14, 'text-anchor': 'start'}).text(sum.quarter);
  g.append('text').attr({fill: '#fff', y: header.starty + 40, 'text-anchor': 'start', 'font-size': 'larger', 'font-weight': 'bold'}).text(_D_(sum.total));

  var data = [];
  if (sum.stateid === 13) {
    data = sum.sarawak;
  } else if (sum.stateid === 12 || sum.stateid === 15) {
    data = sum.sabah;
  } else {
    data = sum.semenanjung;
  }
  var barscale = d3.scale.linear().domain([0, sum.total]).range([0, 80]);
  var bartot = g.selectAll('.bar-total')
          .data(data)
          .enter();
  bartot.append('rect').attr({
    class: 'bar-total',
    fill: function(d) {
      return d[3]
    },
    height: 10,
    width: function(d) {
      return barscale(d[1]);
    },
    y: header.starty + 50,
    x: function(d) {
      return barscale(d[2]);
    }
  });

  var lbltot = g.selectAll('.g-label-total').data(data).enter();
  lbltot.append('g')
          .call(function(r) {
	r.attr({
	  class: 'g-label-total',
	  transform: function(d, i) {
	    return 'translate(' + [0, (i * 12) + header.starty + 62] + ')';
	  }
	});

	r.append('rect').attr({
	  fill: function(d) {
	    return d[3];
	  },
	  width: 10,
	  height: 10,
	  rx: 4
	});

	r.append('text').attr({
	  fill: '#fff',
	  'font-size': 'smaller',
	  y: 10,
	  x: 14
	}).text(function(d) {
	  return d[0]
	});

	r.append('text').attr({
	  fill: '#fff',
	  'font-size': 'smaller',
	  y: 10,
	  x: 75
	}).text(function(d) {
	  return _D_(d[1])
	});
          });
}


function drawtempat(data) {
  var vw = d3.select('#g-view').select('.v-layer');
  var g = vw.append('g').attr('transform', 'translate(' + [-60, 100] + ')');

  g.selectAll('.nama-tempat').data(data).enter().append('g')
          .call(function(t, i) {
	t.attr({
	  class: 'nama-tempat',
	  opacity: 0,
	  transform: 'translate(' + [Math.floor(Math.random() * 1200) + 1, Math.floor(Math.random() * 900) + 1] + ')'
	});

	t.transition().duration(function(d, i) {
	  return i * 30;
	}).attr({
	  opacity: 1,
	  transform: function(d, i) {
	    return 'translate(' + [80, (i * 13) + header.starty + 120] + ')'
	  }
	});

	t.append('text').attr({
	  fill: '#fff',
	  'font-size': 'smaller',
	  x: 0,
	  y: 12
	}).text(function(d) {
	  return d.tempat;
	});
          });
}

function drawkategori(data, sum, nth) {

  var vw = d3.select('#g-view').select('.v-layer');
  var g = vw.append('g').attr('class', 'kategori-col').attr('transform', 'translate(' + [(nth * header.gap) + header.placename, 100] + ')');
  //console.log(data, sum);


  drawheader(sum, nth);
  if (nth === 0) {
    drawtempat(data);
  }

  var barscale = d3.scale.linear().domain([0, sum.maxdomain]).range([0, 40]);
  g.selectAll('.g-place').data(data).enter().append('g')
          .call(function(t) {
	t.attr({
	  class: 'g-place',
	  transform: function(d, i) {
	    return 'translate(' + [80, (i * 13) + header.starty + 120] + ')'
	  }
	});

	t.append('text')
	        .attr({
	          fill: '#fff',
	          x: -10,
	          'text-anchor': 'end',
	          y: 12,
	          'font-size': 'smaller'
	        }).text(function(d) {
	  return d.total === 0 ? '-' : _D_(d.total);
	});

	var bar = t.selectAll('.bar-bangsa')
	        .data(function(d) {
	          return (d.stateid === 13 ? d.bangsa.sarawak : (d.stateid === 12 || d.stateid === 15 ? d.bangsa.sabah : d.bangsa.semenanjung));
	        }).enter();

	bar.append('rect')
	        .call(function(r) {
	          r.attr({
		class: 'bar-bangsa',
		fill: function(d) {
		  return d[2];
		},
		height: 12,
		width: 0,
		x: 0,
		opacity: 0
	          });

	          r.transition().duration(function(d, i) {
		return i * 300;
	          }).attr({
		width: function(d) {
		  return barscale(d[1]);
		},
		x: function(d, i) {
		  return barscale(d[3]);
		},
		opacity: 1
	          });

	        });
          });


}

function loadkategori(region, stateid, parid, dunid, list) {

  list.forEach(function(d, i) {
    new AGA.Kategori.Kategori(region, d[0], d[1], stateid, parid, dunid,
	function(d, e) {
	  drawkategori(d, e, i);

	  __height_resize_by__(1.4);
	}
    );

  });
}


kategori_pengundi_umur = {
  name: 'Umur Pengundi',
  version: '0.1',
  description: 'Kumpulan Umur Pengundi Terkini',
  fitscreenby: 'none',
  thumb: {
    type: 4,
    column: 1,
    color: '#ED93B7',
    height: 100,
    width: 300,
    icon: Icon.pie,
    preview: function() {
    },
    onclick: function(g) {
      _thumbs_out_(this);
      __reset_scale__();
      var vkids = [
        [1, '2015-06-30'],
        [500, '2015-06-30'],
        [501, '2015-06-30'],
        [502, '2015-06-30'],
        [503, '2015-06-30']
      ];
      var vw = d3.select('#g-view');
      var g = vw.append('g').attr('class', 'v-layer').attr('transform', 'translate(0,0)');
      var h = vw.append('g').attr('class', 'h-layer').attr('transform', 'translate(0,0)');
      h.append('rect').attr({
        width: 2500,
        height: 285,
        x: -10,
        y: -10,
        rx: 5,
        ry: 5,
        fill: '#000'
      });
      //vw.append('g').attr('class','v-layer').attr('transform','translate(0,0)');
      loadkategori(1, teritory.stateid, teritory.parid, teritory.dunid, vkids);
      var pnl = vw.append('rect')
	  .attr({
	    width: 1200,
	    height: 900,
	    fill: '#999',
	    opacity: 0,
	    y: 50
	  });
      var zoom = d3.behavior.zoom()
	  .y(scale.y)
	  .scaleExtent([1, 10])
	  .on("zoom", zoomed);

      pnl.call(zoom);
      function zoomed() {
        //console.log('zoomed..');
        d3.select('#g-view').select('.v-layer').attr('transform', 'translate(' + [0, scale.y(0)] + ')');
      }
    }
  }
};

kategori_pengundi_quarter = {
  name: 'Pengundi',
  version: '0.1',
  description: 'Pengundi mengikut Quarter',
  fitscreenby: 'none',
  thumb: {
    type: 4,
    column: 1,
    color: '#FA7E55',
    height: 100,
    width: 300,
    icon: Icon.organisation,
    preview: function() {
    },
    onclick: function(g) {
      _thumbs_out_(this);
      __reset_scale__();
      var vkids = [
        [1, '2013-03-31'],
        [1, '2013-06-30'],
        [1, '2015-03-31'],
        [1, '2015-06-30']
      ];

      var vw = d3.select('#g-view');
      var g = vw.append('g').attr('class', 'v-layer').attr('transform', 'translate(0,0)');
      var h = vw.append('g').attr('class', 'h-layer').attr('transform', 'translate(0,0)');
      h.append('rect').attr({
        width: 2500,
        height: 285,
        x: -10,
        y: -10,
        rx: 5,
        ry: 5,
        fill: '#000'
      });
      //vw.append('g').attr('class','v-layer').attr('transform','translate(0,0)');
      loadkategori(1, teritory.stateid, teritory.parid, teritory.dunid, vkids);
      var pnl = vw.append('rect')
	  .attr({
	    width: 1200,
	    height: 700,
	    fill: '#999',
	    opacity: 0,
	    y: 50
	  });
      var zoom = d3.behavior.zoom()
	  .y(scale.y)
	  .scaleExtent([1, 10])
	  .on("zoom", zoomed);

      pnl.call(zoom);
      function zoomed() {
        //console.log('zoomed..');
        d3.select('#g-view').select('.v-layer').attr('transform', 'translate(' + [0, scale.y(0)] + ')');
      }
    }
  }
};

kategori_pengundi_pos = {
  name: 'Pengundi Pos',
  version: '0.1',
  description: 'Pengundi Pos dari data pengundi terkini',
  fitscreenby: 'none',
  thumb: {
    type: 4,
    column: 1,
    color: '#70D156',
    height: 100,
    width: 300,
    icon: Icon.pie,
    preview: function() {
    },
    onclick: function(g) {
      _thumbs_out_(this);
      __reset_scale__();
      var vkids = [
        [1, '2015-06-30'],
        [3, '2015-06-30'],
        [4, '2015-06-30'],
        [5, '2015-06-30'],
        [6, '2015-06-30']
      ];
      var vw = d3.select('#g-view');
      var g = vw.append('g').attr('class', 'v-layer').attr('transform', 'translate(0,0)');
      var h = vw.append('g').attr('class', 'h-layer').attr('transform', 'translate(0,0)');
      h.append('rect').attr({
        width: 2500,
        height: 285,
        x: -10,
        y: -10,
        rx: 5,
        ry: 5,
        fill: '#000'
      });
      //vw.append('g').attr('class','v-layer').attr('transform','translate(0,0)');
      loadkategori(1, teritory.stateid, teritory.parid, teritory.dunid, vkids);
      var pnl = vw.append('rect')
	  .attr({
	    width: 1200,
	    height: 900,
	    fill: '#999',
	    opacity: 0,
	    y: 50
	  });
      var zoom = d3.behavior.zoom()
	  .y(scale.y)
	  .scaleExtent([1, 10])
	  .on("zoom", zoomed);

      pnl.call(zoom);
      function zoomed() {
        console.log('zoomed..');
        d3.select('#g-view').select('.v-layer').attr('transform', 'translate(' + [0, scale.y(0)] + ')');
      }
    }
  }
};