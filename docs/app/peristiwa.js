/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


peristiwa = {
  name: 'Peristiwa Politik',
  version: '0.1',
  description: 'Peristiwa penting yang berlaku dlm sejarah politik Malaysia',
  fitscreenby: 'none',
  thumb: {
    type: 4,
    column: 0,
    color: '#F0C47D',
    height: 100,
    width: 300,
    icon: Icon.calendar,
    preview: function() {
    },
    onclick: function(g) {
      //getPilihanraya(0, 1, drawpilihanraya);
      _thumbs_out_(this);
    }
  }
};


simulasi = {
  name: 'Simulasi Pilihanraya',
  version: '0.1',
  description: 'Simulasi PRU menggunakan data pengundi terkini',
  fitscreenby: 'none',
  thumb: {
    type: 4,
    column: 1,
    color: '#BAA6BA',
    height: 100,
    width: 300,
    icon: Icon.graph1,
    preview: function() {
    },
    onclick: function(g) {
      //getPilihanraya(0, 1, drawpilihanraya);
      _thumbs_out_(this);
    }
  }
};


keputusan_dun = {
  name: 'Keputusan DUN',
  version: '0.1',
  description: 'Imbasan keputusan DUN dari tahun 1986 hingga 2015',
  fitscreenby: 'width',
  thumb: {
    type: 4,
    column: 0,
    color: '#BAD45D',
    height: 100,
    width: 300,
    icon: Icon.election,
    preview: function() {
    },
    onclick: function(g) {
      _thumbs_out_(this);
      getPRU(teritory.stateid, 1);
    }
  }
};

keputusan_parlimen = {
  name: 'Keputusan Parlimen',
  version: '0.1',
  description: 'Imbasan keputusan Parlimen dari 1986 hingga 2015',
  fitscreenby: 'width',
  thumb: {
    type: 4,
    column: 0,
    color: '#9B9BC7',
    height: 100,
    width: 300,
    icon: Icon.election,
    preview: function() {
    },
    onclick: function(g) {
      _thumbs_out_(this);
      getPRU(teritory.stateid, 0);
    }
  }
};


function pru_nth_keputusan(y) {
  var nth = '';
  switch (y) {
    //pru
    case 2013:
      nth = 'Pilihanraya Umum Ke 13';
      break;
    case 2008:
      nth = 'Pilihanraya Umum Ke 12';
      break;
    case 2004:
      nth = 'Pilihanraya Umum Ke 11';
      break;
    case 1999:
      nth = 'Pilihanraya Umum Ke 10';
      break;
    case 1995:
      nth = 'Pilihanraya Umum Ke 9';
      break;
    case 1990:
      nth = 'Pilihanraya Umum Ke 8';
      break;
    case 1986:
      nth = 'Pilihanraya Umum Ke 7';
      break;
      //prn
    case 2011:
      nth = 'Pilihanraya Negeri Ke 10';
      break;
    case 2006:
      nth = 'Pilihanraya Negeri Ke 9';
      break;
    case 2001:
      nth = 'Pilihanraya Negeri Ke 8';
      break;
    case 1996:
      nth = 'Pilihanraya Negeri Ke 7';
      break;
    case 1991:
      nth = 'Pilihanraya Negeri Ke 6';
      break;
  }

  return nth;
}


function getKeputusanPRU(stateid, kerusi, fn) {
  $.ajax({
    type: "POST",
    url: "http://ws.aga.my/ws/ws.aspx/LoadKeputusanPRU",
    data: "{'stateid':'" + stateid + "','kerusi':'" + kerusi + "'}",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(msg) {
      fn(msg.d);
    }
  });
}


function getPRU(stateid, kerusi) {
  getKeputusanPRU(stateid, kerusi,
          function(data) {
	var pru = [], pru_index = [];
	var i = 0;

	data.forEach(function(d) {
	  if (pru_index[d.pilihanrayaid + '-' + d.stateid + '-' + d.parid + '-' + d.dunid] === undefined) {
	    //p = pru[d.pilihanrayaid + '-' + d.stateid + '-' + d.parid + '-' + d.dunid] = {};
	    p = {};
	    pru_index[d.pilihanrayaid + '-' + d.stateid + '-' + d.parid + '-' + d.dunid] = i++;

	    p.stateid = d.stateid;
	    p.parid = d.parid;
	    p.dunid = d.dunid;
	    p.negeri = d.negeri;
	    p.tempat = d.tempat;
	    p.jenis = d.jenis;

	    p.pengundi = d.pengundi;
	    p.pilihanrayaid = d.pilihanrayaid;
	    p.tahun = d.tahun;
	    p.tarikh = d.tarikh;
	    p.undi_dalam_peti = d.undi_dalam_peti;
	    p.undi_keluar = d.undi_keluar;
	    p.undi_majoriti = d.undi_majoriti;
	    p.undi_takkembali = d.undi_takkembali;
	    p.undi_tolak = d.undi_tolak;
	    p.undi_kira = d.undi_keluar - (d.undi_tolak + d.undi_takkembali);

	    p.calon = [];

	    p.calon.push(
		{
		  nocalon: d.nocalon,
		  calon: d.calon,
		  parti: d.parti,
		  komponen: d.komponen,
		  undi: d.undi,
		  perc_undi: d.undi > 0 ? d.undi/(d.undi_keluar - (d.undi_tolak + d.undi_takkembali))*100 : 0,
		  keputusan: d.keputusan
		}
	    );

	    pru.push(p);
	  } else {
	    p = pru[pru_index[d.pilihanrayaid + '-' + d.stateid + '-' + d.parid + '-' + d.dunid]];
	    p.calon.push(
		{
		  nocalon: d.nocalon,
		  calon: d.calon,
		  parti: d.parti,
		  komponen: d.komponen,
		  undi: d.undi,
		  perc_undi: d.undi > 0 ? d.undi/(d.undi_keluar - (d.undi_tolak + d.undi_takkembali))*100 : 0,
		  keputusan: d.keputusan
		});
	  }
	});


	var praya = [], praya_index = [];
	i = 0;
	pru.forEach(function(d) {
	  if (praya_index[d.pilihanrayaid] === undefined) {
	    praya_index[d.pilihanrayaid] = i++;

	    pl = [];
	    pl.push(d);
	    praya.push({
	      id: d.pilihanrayaid,
	      nama: d.jenis === 1 ? pru_nth_keputusan(d.tahun) : 'PRK ' + d.tempat + ' (' + d.tahun + ')',
	      tarikh: d.tarikh,
	      tahun: d.tahun,
	      jenis: d.jenis,
	      pertandingan: pl
	    });
	  } else {
	    praya[praya_index[d.pilihanrayaid]].pertandingan.push(d);
	  }
	});

	var tahun = [], tahun_index = [];
	i = 0;

	praya.forEach(function(d) {
	  if (tahun_index[d.tahun] === undefined) {
	    tahun_index[d.tahun] = i++;

	    pl = [];
	    pl.push(d);
	    tahun.push({
	      tahun: d.tahun,
	      pilihanraya: pl
	    });
	  } else {
	    tahun[tahun_index[d.tahun]].pilihanraya.push(d);
	  }
	});

	//console.log(tahun);
	drawPRU(tahun);
          }
  );
}


function drawPRU(tahun) {
  __reset_scale__();
  var vw = d3.select('#g-view');

  var scale = {
    y: d3.scale.linear().domain([700, 0]).range([700, 0]),
    x: d3.scale.linear().domain([1200, 0]).range([1200, 0])
  };
  var panning_bar = vw.append('rect').attr({
    fill: '#000',
    width: 1200,
    height: 700,
    y: 80,
    x: 0
  });

  var zoom = d3.behavior.zoom()
          .x(scale.x)
          .scaleExtent([1, 10])
          .on("zoom", zoomed);

  panning_bar.call(zoom);
  function zoomed() {
    //console.log('zoomed..');
    d3.select('#g-view').select('.g-tahun-grp').attr('transform', 'translate(' + [scale.x(0), scale.y(80)] + ')');
  }

  var g = vw.append('g').attr('class', 'g-tahun-grp').attr('transform', 'translate(0,80)');

  var thn = g.selectAll('.tahun').data(tahun).enter();

  thn.append('g').call(
          function(r) {
	r.attr({
	  class: 'tahun',
	  transform: function(d, i) {
	    return 'translate(' + [0, 20] + ')';
	  },
	  cursor: 'pointer'
	});

	gt = r.append('g').attr('transform', 'translate(0,0)skewX(0)skewY(0)');
	c = gt.append('rect').attr({
	  fill: '#F0C171',
	  rx: 2,
	  stroke: '#D4B072',
	  width: 135,
	  height: 20
	});

	gt.append('text').attr({
	  fill: '#000',
	  'font-weight': 'bold',
	  x: 5,
	  y: 15,
	  'pointer-events': 'none'
	}).text(function(d) {
	  return d.tahun;
	});

	r.transition().duration(function(d, i) {
	  return i * 120
	}).attr({
	  transform: function(d, i) {
	    return 'translate(' + [(i * 140) + 20, 20] + ')';
	  }
	});

	c.on('mouseover', function() {
	  d3.select(this).attr({
	    fill: '#C2D18C',
	    stroke: '#919C6D'
	  });
	}).on('mouseout', function() {
	  d3.select(this).attr({
	    fill: '#F0C171',
	    stroke: '#D4B072'
	  });
	});

	var e = r.selectAll('.g-event').data(function(d) {
	  return d.pilihanraya;
	}).enter();
	e.append('g').call(function(f) {
	  f.attr({
	    class: 'g-event',
	    transform: function(d, i) {
	      return 'translate(' + [0, (i * 80) + 20] + ')'
	    }
	  });

	  ce_dt = f.append('rect').attr({
	    fill: '#38B042',
	    rx: 2,
	    width: 135,
	    height: 15
	  });

	  ce_bg = f.append('rect').attr({
	    fill: function(d) {
	      return d.jenis === 1 ? '#4B62AD' : '#454745'
	    },
	    y: 14,
	    width: 135,
	    height: 60
	  });


	  f.append('text').attr({
	    fill: '#fff',
	    'font-size': 'x-small',
	    x: 70,
	    y: 10,
	    'text-anchor': 'middle',
	    'pointer-events': 'none'
	  }).text(function(d) {
	    dt = new Date(d.tarikh);
	    return dt.getDate() + '/' + (dt.getMonth() + 1) + '/' + dt.getFullYear();
	  });

	  f.selectAll('.text-event').data(function(d) {
	    return multilineText(d.nama, 2)
	  }).enter().append('text').attr({
	    fill: '#fff',
	    'font-size': 'smaller',
	    'text-anchor': 'middle',
	    x: 70,
	    y: function(d, i) {
	      return (i * 12) + 35
	    },
	    'pointer-events': 'none'
	  }).text(function(d) {
	    return d;
	  });

	  f.on('click', function(f) {
	    //console.log('dddddd', f);
	    showPRUResult(f);
	  });
	});

//	c.on('click', function(f) {
//	  console.log('ffffff', f);
//	});
          }
  );
}


function showPRUResult(data) {
  //console.log('i am innn', data);
  var W = 300, H = 300;
  var COLUMNS = 3;
  var vw = d3.select('#g-view');

  vw.select('*').remove();
  var g = vw.append('g').attr('transform', 'translate(0,80)');

  var scale = {
    y: d3.scale.linear().domain([700, 0]).range([700, 0]),
    x: d3.scale.linear().domain([1200, 0]).range([1200, 0])
  };
  var panning_bar = g.append('rect').attr({
    fill: '#000',
    width: 1200,
    height: 700,
    y: 0,
    x: 0
  });

  var zoom = d3.behavior.zoom()
          .y(scale.y)
          .scaleExtent([1, 10])
          .on("zoom", zoomed);

  panning_bar.call(zoom);
  function zoomed() {
    //console.log('zoomed..');
    d3.select('#g-view').select('.lawan-container').attr('transform', 'translate(' + [scale.x(0), scale.y(0)] + ')');
  }



  var lwn0 = g.append('g').attr({
    class: 'lawan-container',
    transform: 'translate(0,0)'
  });

  var lwn = lwn0.selectAll('.lawan').data(data.pertandingan).enter();

  lwn.append('g').call(function(e) {
    e.attr({
      class: 'lawan',
      opacity: 0,
      transform: function(d, i) {
        ny = Math.floor(i / COLUMNS);
        nx = i % COLUMNS;
        return 'translate(' + [(nx * W), (ny * H) + 60] + ')';
      }
    });

    e_bg = e.append('rect').attr({
      fill: function(d) {
        return d.jenis === 1 ? '#222' : '#454745'
      },
      width: W - 2,
      height: H - 3
    });

    e.append('text').attr({
      fill: '#fff',
      'font-weight': 'bold',
      'font-size': 'larger',
      x: W / 2,
      y: 30,
      'text-anchor': 'middle',
      'pointer-events': 'none'
    }).text(function(d) {
      return d.tempat;
    });

    tanding = e.append('g').attr('transform', 'translate(0,40)');

    parti = tanding.selectAll('.parti').data(function(d) {
      var sort = function(a, b) {
        return b.undi - +a.undi;
      };
      return d.calon.sort(sort);
    }).enter();

    parti.append('g').call(function(tg) {
      tg.attr({
        class: 'parti',
        transform: function(d, i) {
          return 'translate(' + [0, (i * 30) + 80] + ')';
        }
      });
      
      tg.append('rect').attr({
        fill: function(d){ return d.parti === 'BN' ? '#1245A3' : '#A31212';},
        width: 300,
        height: 30,
        opacity: function(d, i){ return i === 0 ? 1 : 0;}
      });

      tg.append('image').attr({
        'xlink:href': function(d) {
          pp = d.parti;
          return 'img/party/' + pp + '.jpg';
        },
        x: 20,
        y: 0,
        width: 30,
        height: 30
      });

//      tg.selectAll('.calon-text').data(function(d) {
//        return multilineText(d.calon, 3)
//      }).enter().append('text').attr({
//        fill: '#fff',
//        'font-size': 'x-small',
//        x: 55,
//        y: function(d, i) {
//          return (i * 12) + 18;
//        },
//        'text-anchor': 'start',
//        'pointer-events': 'none'
//      }).text(function(d) {
//        return d;
//      });
      
      //d3StripText
      
      tg.append('text').attr({
        fill: '#fff',
        'font-size': 'smaller',
        x: 55,
        y: 18,
        'text-anchor': 'start',
        'pointer-events': 'none'
      }).text(function(d) {
        return d.calon;
      }).call(d3StripText, 120);

      tg.append('text').attr({
        fill: '#fff',
        'font-weight': 'bold',
        x: 230,
        y: 18,
        'text-anchor': 'end',
        'pointer-events': 'none'
      }).text(function(d) {
        return d.undi > 0 ? _D_(d.undi) : 'MTB';
      });
      
      tg.append('text').attr({
        fill: '#ff0',
        'font-size': 'smaller',
        x: 280,
        y: 18,
        'text-anchor': 'end',
        'pointer-events': 'none'
      }).text(function(d) {
        return d.perc_undi > 0 ? _F_(d.perc_undi) + '%' : '';
      });

      //__width_resize__();

    });

    res = e.append('g').attr('transform', 'translate(20, 60)');
    resv = res.selectAll('.res').data(function(d) {
//        undi_dalam_peti: 9623
//        undi_keluar: 9624
//        undi_majoriti: 6911
//        undi_takkembali: 1
//        undi_tolak: 146
//        
//      var dt_res = [
//        ['Pengundi', d.pengundi],
//        ['Kehadiran', d.undi_keluar],
//        ['Tdk. Dikembalikan', d.undi_takkembali],
//        ['Ditolak', d.undi_tolak],
//        ['Dikira', d.undi_kira],
//        ['Majoriti', d.undi_majoriti]
//      ]
      var dt_res = [
        ['Pengundi', d.pengundi, 0],
        ['Kehadiran', d.undi_keluar, d.undi_keluar / d.pengundi * 100],
        ['Majoriti', d.undi_majoriti, 0]
      ];

      //console.log('whatttt', d);
      return dt_res;
    }).enter();


    resv.append('g').call(
	function(b) {
	  b.attr({
	    class: 'res',
	    transform: function(d, i) {
	      return 'translate(' + [0, (i * 15) + 2] + ')'
	    }
	  });

	  b.append('text').attr({
	    fill: '#fff',
	    'font-size': 'smaller',
	    x: 140,
	    y: 0,
	    'text-anchor': 'end',
	    'pointer-events': 'none'
	  }).text(function(d) {
	    return d[0];
	  });

	  b.append('text').attr({
	    fill: function(d){return d[0] === 'Majoriti' ? '#0f0' : '#fff'},
	    'font-size': function(d){return d[0] === 'Majoriti' ? 'larger' : 'smaller'},
	    'font-weight': 'bold',
	    x: 210,
	    y:  function(d){return d[0] === 'Majoriti' ? 8 : 0},
	    'text-anchor': 'end',
	    'pointer-events': 'none'
	  }).text(function(d) {
	    return d[1] === 0 ? '' : _D_(Math.abs(d[1]));
	  });

	  b.append('text').attr({
	    fill: '#ff0',
	    'font-size': 'smaller',
	    x: 260,
	    y: 0,
	    'text-anchor': 'end',
	    'pointer-events': 'none'
	  }).text(function(d) {
	    return d[2] > 0 ? _F_(d[2]) + '%' : '';
	  });

	});


    e.transition().duration(function(d, i) {
      return i * 30
    }).attr('opacity', 1);

//--------------Title-----------------------
    var title = g.append('g').attr({
      class: 'g-title',
      transform: 'translate(0,0)'
    });

    var title_bar = title.append('rect').attr({
      fill: '#F0C171',
      width: 450,
      height: 60,
      y: -30,
      x: -10,
      cursor: 'pointer'
    });

    title.append('text').attr({
      fill: '#000',
      'font-size': 'x-large',
      'font-weight': 'bold',
      x: 20,
      y: 0,
      'text-anchor': 'start',
      'pointer-events': 'none'
    }).text(data.nama);


    title.append('text').attr({
      fill: '#222',
      'font-size': 'larger',
      x: 20,
      y: 20,
      'text-anchor': 'start',
      'pointer-events': 'none'
    }).text(data.tarikh);

    title_bar.on('click', function() {
      d3.select('#g-view').selectAll('*').remove();
      getPRU(teritory.stateid, 1);
    });

    //------------------------------------------
  });
}