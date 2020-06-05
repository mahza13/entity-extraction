/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


title_history = {
  name: 'Sejarah Pilihanraya',
  version: '0.1',
  description: 'Sejarah pilihanraya PRU/ PRN dan PRK',
  thumb: {
    type: 1,
    column: 0,
    color: '#CCED85',
    height: 80,
    width: 300,
    icon: Icon.balance,
    preview: function() {
    },
    onclick: function() {
      console.log('Contoh');
    }
  }
};

title_pengundi = {
  name: 'Demografi',
  version: '0.1',
  description: 'Demografi berdasarkan data pengundi',
  thumb: {
    type: 1,
    column: 1,
    color: '#A1E099',
    height: 80,
    width: 300,
    icon: Icon.election,
    preview: function() {
    },
    onclick: function() {
      console.log('Contoh');
    }
  }
};

title_media = {
  name: 'Media',
  version: '0.1',
  description: 'Sumber dari pelbagai media traditional dan baru',
  thumb: {
    type: 1,
    column: 2,
    color: '#97C8F0',
    height: 80,
    width: 300,
    icon: Icon.election,
    preview: function() {
    },
    onclick: function() {
      console.log('Media');
    }
  }
};


app3 = {
  name: 'Tajuk App 3',
  version: '1.0',
  description: 'Ini adalah contoh applikasi App 2',
  thumb: {
    type: 4,
    column: 1,
    color: '#7699D6',
    height: 300,
    width: 300,
    icon: Icon.balance,
    preview: function(r) {
      var data = [
        {bangsa: 'Melayu', total: 2300, color: '#00f'},
        {bangsa: 'Cina', total: 1000, color: '#f00'},
        {bangsa: 'India', total: 200, color: '#880'},
        {bangsa: 'Lain', total: 100, color: '#888'}
      ];

      scale = d3.scale.linear().range([0, 100]).domain([0, 3600]);

      r.selectAll('g').data(data).enter().append('g')
	  .call(function(g) {
	    g.attr('transform', function(d, i) {
	      return 'translate(' + [0, (i * 15) + 2] + ')'
	    });
	    g.append('rect').attr({
	      width: function(d) {
	        return scale(d.total)
	      },
	      fill: function(d) {
	        return d.color
	      },
	      height: 15,
	      x: 120
	    });

	    g.append('text').attr({
	      'font-size': 'smaller',
	      'text-anchor': 'end',
	      x: 110,
	      y: 10
	    }).text(function(d) {
	      return d.bangsa
	    });
	  });
    },
    onclick: function() {
      console.log('Tajuk App 2');
    }
  }
};

/*
 * 
 * ______GLOBAL________
 */
var _column_last_y = [];
var _gap = {
  horizontal: 300,
  vertical: 100
};
var _margin = {
  left: 5,
  right: 5,
  top: 5,
  bottom: 0
};
var apps = [];


/*
 * 
 * Initial function to draw thumbs on screen
 */
function __init__() {
  //Edit this area to Add buttons to the App list
  apps.push(title_history);
  apps.push(title_pengundi);
  apps.push(title_media);

  apps.push(pilihanraya);
  apps.push(keputusan_dun);
  apps.push(keputusan_parlimen);
  
  apps.push(kategori_pengundi_quarter);
  apps.push(kategori_pengundi_umur);
  apps.push(kategori_pengundi_pos);
  apps.push(simulasi);
  
  
  apps.push(twitter);
  apps.push(akhbar);

  var h = $(window).height() - 35;
  var w = $(window).width() - 35;


  d3.select('#main-g').append('rect')
          .attr({
	class: 'thumb2',
	id: 'thumbs-scroll',
	width: 2500,
	height: 0,
	fill: '#000',
	opacity: 0
          });

  d3.select('#main-g').append('g').attr({
    id: 'thumbs-g',
    transform: 'translate(0,0)'
  });
  //Draw all listed applications
  apps.forEach(function(d, i) {
    if (_column_last_y[d.thumb.column] === undefined) {
      _column_last_y[d.thumb.column] = _margin.top;
    }

    if (d.thumb.type === 1) {
      new Thumb.create.type1('thumbs-g', d.name, d.description, d.fitscreenby, d.thumb.color, ((_gap.horizontal + _margin.left) * d.thumb.column) + _margin.left, _column_last_y[d.thumb.column], d.thumb.onclick);
    } else if (d.thumb.type === 2) {
      new Thumb.create.type2('thumbs-g', d.name, d.description, d.fitscreenby, d.thumb.color, ((_gap.horizontal + _margin.left) * d.thumb.column) + _margin.left, _column_last_y[d.thumb.column], d.thumb.icon, d.thumb.onclick);
    } else if (d.thumb.type === 3) {
      new Thumb.create.type3('thumbs-g', d.name, d.description, d.fitscreenby, d.thumb.color, ((_gap.horizontal + _margin.left) * d.thumb.column) + _margin.left, _column_last_y[d.thumb.column], d.thumb.icon, d.thumb.onclick);
    } else if (d.thumb.type === 4) {
      new Thumb.create.type4('thumbs-g', d.name, d.description, d.fitscreenby, d.thumb.color, ((_gap.horizontal + _margin.left) * d.thumb.column) + _margin.left, _column_last_y[d.thumb.column], d.thumb.width, d.thumb.height, d.thumb.icon, d.thumb.onclick, d.thumb.preview);
    }

    _column_last_y[d.thumb.column] = _column_last_y[d.thumb.column] + d.thumb.height + _margin.top;

  });

  var bbox = d3.select('#main-g').node().getBBox();
  d3.select('#thumbs-scroll').attr({height: bbox.height});
  __scroll_thumb__();
}