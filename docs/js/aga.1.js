/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * 
 * @param {type} h
 * @returns {$.es.Client}
 */
function ESClient(h) {
  var c = new $.es.Client({
    hosts: h
  });
  return c;
}


function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getQuarter(tarikh) {
    r = tarikh;
    q = tarikh.split('-');

    switch (parseInt(q[1])) {
        case 3:
            r = "Q1-" + q[0]; break;
        case 6:
            r = "Q2-" + q[0]; break;
        case 9:
            r = "Q3-" + q[0]; break;
        case 12:
            r = "Q4-" + q[0]; break;
    }

    if (tarikh === '2007-12-31') {
        r = "PRU12-2008";
    }

    if (tarikh === '2011-04-16') {
        r = "PRN10-2011";
    }

    if (tarikh === '2013-03-31') {
        r = "PRU13-2013";
    }

    return r;
}

function getQuarter2(tarikh) {
    r = tarikh;
    q = tarikh.split('-');

    switch (parseInt(q[1])) {
        case 3:
            r = "Q1 " + q[0]; break;
        case 6:
            r = "Q2 " + q[0]; break;
        case 9:
            r = "Q3 " + q[0]; break;
        case 12:
            r = "Q4 " + q[0]; break;
    }

    if (tarikh === '2007-12-31') {
        r = "PRU12 2008";
    }

    if (tarikh === '2011-04-16') {
        r = "PRN10 2011";
    }

    if (tarikh === '2013-03-31') {
        r = "PRU13 2013";
    }

    return r;
}


/*
 * 
 * @param {type} number
 * @param {type} digits
 * @returns {unresolved}
 */
function lpad(number, digits) {
  return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

/*
 * 
 */
AGA = {
  Map: {
    Negeri: function(stateid, fn) {
      client.get({
        index: 'geojson',
        type: 'negeri',
        id: stateid
      }).then(function(d) {
        fn(d);
      });
    },
    Parlimen: function(stateid, parid, fn) {
      var _this = this;
      _this.data = [];
      _this.idx = {};
      _this.callbackqueue = 0;
      _this.callbackgeo = 1;

      this.getData = function(fn) {
        function stopwait() {
          clearInterval(wait);
        }
        var wait = setInterval(function() {
          if (_this.callbackqueue <= 0) {
	stopwait();
	//console.log('callback selesai...');
	fn(_this.data);
          }
        }, 300);
      };

      this.addVkids = function() {
        $.each(arguments, function(i, d) {
          _this.addVkid(d[0], d[1]);
        });
      };

      this.addVkid = function(i, date, fn2) {
        var datestr = date !== '' ? '&source_date=' + date : '';
        var parstr = parid > 0 ? '&parid=' + parid : '';
        _this.callbackqueue++;

        var startAdd = function() {
          $.ajax({
	type: "POST",
	url: "http://api.aga.my/vkid/?vkid=" + i + datestr + "&kawasan=parlimen&stateid=" + stateid + parstr + "&authkey=" + getParameterByName('authkey') + "&callback=?",
	data: "{}",
	contentType: "application/json; charset=utf-8",
	dataType: "json",
	success: function(msg) {

	  $.each(msg.result, function(i, val) {
	    if (_this.data[_this.idx[val.kod]].properties.kategori === undefined) {
	      var tmp = [];
	      tmp.push(val);
	      _this.data[_this.idx[val.kod]].properties.kategori = tmp;
	    } else {
	      var tmp = [];
	      tmp = _this.data[_this.idx[val.kod]].properties.kategori;
	      tmp.push(val);
	      _this.data[_this.idx[val.kod]].properties.kategori = tmp;
	    }
	  });
	  _this.callbackqueue--;

	  //_this.data.vkid = msg.result[0];
	  if (fn2 !== undefined) {
	    fn2(_this.data);
	  }

	}
          });
        };
        function stopwait() {
          clearInterval(wait);
        }
        ;

        var wait = setInterval(function() {
          //console.log("callback remaining", _this.callbackqueue);
          if (_this.callbackgeo <= 0) {
	stopwait();
	//console.log('callback selesai...');
	startAdd();
          }
        }, 300);
      };

      if (parid > 0) {
        client.get({
          index: 'geojson',
          type: 'parlimen',
          id: lpad(stateid, 2) + lpad(parid, 3)
        }).then(function(d) {
          _this.idx[d._source.id] = 0;
          _this.data.push(d._source);
          if (fn !== undefined) {
	fn(_this.data);
          }

          _this.callbackqueue--;
          _this.callbackgeo--;
        });
      } else {
        client.search({
          index: 'geojson',
          type: 'parlimen',
          body: {
	query: {
	  match: {
	    stateid: stateid
	  }
	}
          },
          size: 100
        }).then(function(d) {
          // do something here...
          $.each(d.hits.hits, function(i, dv) {
	_this.idx[dv._source.id] = i;
	_this.data[i] = dv._source;
          });
          console.log('ksadjkhaskdkajsdhkasjhd', _this.data);
          _this.callbackgeo--;
          if (fn !== undefined) {
	fn(_this.data);
          }
        });
      }


      return _this;

    },
    Dun: function(stateid, parid, dunid, fn) {
      var _this = this;
      _this.data = [];
      _this.idx = {};
      _this.callbackqueue = 0;
      _this.callbackgeo = 1;

      this.getData = function(fn) {
        function stopwait() {
          clearInterval(wait);
        }
        var wait = setInterval(function() {
          if (_this.callbackqueue < 0) {
	stopwait();
	//console.log('callback selesai...');
	fn(_this.data);
          }
        }, 300);
      };

      this.addVkids = function() {
        $.each(arguments, function(i, d) {
          _this.addVkid(d[0], d[1]);
        });
      };

      this.addVkid = function(i, date, fn2) {
        var datestr = date !== '' ? '&source_date=' + date : '';
        var parstr = dunid > 0 ? '&parid=' + parid : '';
        var dunstr = dunid > 0 ? '&dunid=' + dunid : '';
        _this.callbackqueue++;

        var startAdd = function() {
          $.ajax({
	type: "POST",
	url: "http://api.aga.my/vkid/?vkid=" + i + datestr + "&kawasan=dun&stateid=" + stateid + parstr + dunstr + "&authkey=" + getParameterByName('authkey') + "&callback=?",
	data: "{}",
	contentType: "application/json; charset=utf-8",
	dataType: "json",
	success: function(msg) {
	  $.each(msg.result, function(i, val) {
	    if (_this.data[_this.idx[val.kod]].properties.kategori === undefined) {
	      var tmp = [];
	      tmp.push(val);
	      _this.data[_this.idx[val.kod]].properties.kategori = tmp;
	    } else {
	      var tmp = [];
	      tmp = _this.data[_this.idx[val.kod]].properties.kategori;
	      tmp.push(val);
	      _this.data[_this.idx[val.kod]].properties.kategori = tmp;
	    }
	  });
	  _this.callbackqueue--;

	  //_this.data.vkid = msg.result[0];
	  if (fn2 !== undefined) {
	    fn2(_this.data);
	  }

	}
          });
        };
        function stopwait() {
          clearInterval(wait);
        }
        ;

        var wait = setInterval(function() {
          //console.log("callback remaining", _this.callbackqueue);
          if (_this.callbackgeo <= 0) {
	stopwait();
	//console.log('callback selesai...');
	startAdd();
          }
        }, 300);
      };

      if (dunid > 0) {
        client.get({
          index: 'geojson',
          type: 'dun',
          id: lpad(stateid, 2) + lpad(parid, 3) + lpad(dunid, 2)
        }).then(function(d) {
          _this.idx[d._source.id] = 0;
          _this.data.push(d._source);
          if (fn !== undefined) {
	fn(_this.data);
          }

          _this.callbackqueue--;
          _this.callbackgeo--;
        });
      } else {
        client.search({
          index: 'geojson',
          type: 'dun',
          body: {
	query: {
	  match: {
	    stateid: stateid
	  }
	}
          },
          size: 100
        }).then(function(d) {
          // do something here...
          $.each(d.hits.hits, function(i, dv) {
	_this.idx[dv._source.id] = i;
	_this.data[i] = dv._source;
          });

          _this.callbackgeo--;
          if (fn !== undefined) {
	fn(_this.data);
          }
        });
      }


      return _this;

    },
    Dm: function(stateid, parid, dunid, dmid, fn) {
      var _this = this;
      _this.data = [];
      _this.idx = {};
      _this.callbackqueue = 0;
      _this.callbackgeo = 1;

      this.getData = function(fn) {
        function stopwait() {
          clearInterval(wait);
        }
        var wait = setInterval(function() {
          //console.log('callback vkid dm', _this.callbackqueue);
          if (_this.callbackqueue <= 0) {
	stopwait();
	//console.log('callback selesai...');
	fn(_this.data);
          }
        }, 300);
      };

      this.addVkids = function() {
        $.each(arguments, function(i, d) {
          _this.addVkid(d[0], d[1]);
        });
      };

      this.addVkid = function(i, date, fn2) {
        var datestr = date !== '' ? '&source_date=' + date : '';
        var dunstr = dunid > 0 ? '&dunid=' + dunid : '';
        var dmstr = dmid > 0 ? '&dmid=' + dmid : '';
        _this.callbackqueue++;

        var startAdd = function() {
          $.ajax({
	type: "POST",
	url: "http://api.aga.my/vkid/?vkid=" + i + datestr + "&kawasan=pdm&stateid=" + stateid + "&parid=" + parid + dunstr + dmstr + "&authkey=" + getParameterByName('authkey') + "&callback=?",
	data: "{}",
	contentType: "application/json; charset=utf-8",
	dataType: "json",
	success: function(msg) {
	  $.each(msg.result, function(i, val) {
	    if (_this.data[_this.idx[val.kod]].properties.kategori === undefined) {
	      var tmp = [];
	      tmp.push(val);
	      _this.data[_this.idx[val.kod]].properties.kategori = tmp;
	    } else {
	      var tmp = [];
	      tmp = _this.data[_this.idx[val.kod]].properties.kategori;
	      tmp.push(val);
	      _this.data[_this.idx[val.kod]].properties.kategori = tmp;
	    }
	  });
	  _this.callbackqueue--;

	  //_this.data.vkid = msg.result[0];
	  if (fn2 !== undefined) {
	    fn2(_this.data);
	  }

	}
          });
        };
        function stopwait() {
          clearInterval(wait);
        }
        ;

        var wait = setInterval(function() {
          //console.log("callback remaining", _this.callbackqueue);
          if (_this.callbackgeo <= 0) {
	stopwait();
	//console.log('callback selesai...');
	startAdd();
          }
        }, 300);
      };

      if (dmid > 0) {
        client.get({
          index: 'geojson',
          type: 'pdm',
          id: lpad(stateid, 2) + lpad(parid, 3) + lpad(dunid, 2) + lpad(dmid, 2)
        }).then(function(d) {
          _this.idx[d._source.id] = 0;
          _this.data.push(d._source);
          if (fn !== undefined) {
	fn(_this.data);
          }

          _this.callbackqueue--;
          _this.callbackgeo--;
        });
      } else if (parid > 0 && dunid === 0) {
        client.search({
          index: 'geojson',
          type: 'pdm',
          body: {
	query: {
	  bool: {
	    must: [
	      {
	        match: {
	          stateid: stateid
	        }
	      },
	      {
	        match: {
	          parid: parid
	        }
	      }
	    ]
	  }
	}
          },
          size: 100
        }).then(function(d) {
          // do something here...
          $.each(d.hits.hits, function(i, dv) {
	_this.idx[dv._source.id] = i;
	_this.data[i] = dv._source;
          });

          _this.callbackgeo--;
          if (fn !== undefined) {
	fn(_this.data);
          }
        });
      } else {
        client.search({
          index: 'geojson',
          type: 'pdm',
          body: {
	query: {
	  bool: {
	    must: [
	      {
	        match: {
	          stateid: stateid
	        }
	      },
	      {
	        match: {
	          parid: parid
	        }
	      },
	      {
	        match: {
	          dunid: dunid
	        }
	      }
	    ]
	  }
	}
          },
          size: 100
        }).then(function(d) {
          // do something here...
          $.each(d.hits.hits, function(i, dv) {
	_this.idx[dv._source.id] = i;
	_this.data[i] = dv._source;
          });

          _this.callbackgeo--;
          if (fn !== undefined) {
	fn(_this.data);
          }
        });
      }


      return _this;

    }
  },
  Kategori: {
    Kategori: function (region, vkid, source_date, stateid, parid, dunid, fn) {
     //region: 0 parlimen
    //region = 0; //$('#dropRegion').attr('region');//dunid > 0 ? 1 : 0;

    var vsetting = {
        parlimen: {
            fn: 'http://ws.aga.my/ws/ws.aspx/GetVotersKategori',
            param: "{'vkid':'" + vkid + "', 'source_date':'" + source_date + "', 'region':'" + region + "', 'stateid':'" + stateid + "', 'parid':'" + parid + "', 'dunid':'" + dunid + "'}"
        },
        dm: {
            fn: 'http://ws.aga.my/ws/ws.aspx/GetVotersKategoriDM',
            param: "{'vkid':'" + vkid + "', 'source_date':'" + source_date + "', 'stateid':'" + stateid + "', 'parid':'" + parid + "', 'dunid':'" + dunid + "'}"
        }
    };

    vset = dunid > 0 && region > 1 ? vsetting.dm : vsetting.parlimen;
    var req = $.ajax({
        type: "POST",
        url: vset.fn,
        data: vset.param,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
          
        },
        success: function (msg) {
           
            var data = [];
            var totarr = [];
            var sum = {
                title: '',
                date: '',
                vkid: 0,
                quarter: '',
                total: 0,
                stateid: 0,
                maxdomain: 0,
                semenanjung: [
                    ['Melayu', 0, 0, '#615CC4'],
                    ['Cina', 0, 0, '#F56262'],
                    ['India', 0, 0, '#E6C365'],
                    ['Lain', 0, 0, '#9C9175']
                ],
                sabah: [
                    ['BI', 0, 0, '#615CC4'],
                    ['BBI', 0, 0, '#78D1E3'],
                    ['Cina', 0, 0, '#F56262'],
                    ['Lain', 0, 0, '#9C9175']
                ],
                sarawak: [
                    ['Melayu', 0, 0, '#615CC4'],
                    ['Iban', 0, 0, '#CD69D6'],
                    ['Bidayuh', 0, 0, '#7FBA73'],
                    ['OrangUlu', 0, 0, '#CCA76C'],
                    ['Cina', 0, 0, '#F56262'],
                    ['Lain', 0, 0, '#9C9175']
                ]
            };
            $.each(msg.d, function (i, val) {
                sum.stateid = val.stateid;
                sum.title = (val.vkid === 1 ? 'Pengundi' : val.kategori);
                sum.date = val.source_date;
                sum.vkid = val.vkid;
                sum.quarter = getQuarter(val.source_date);
                sum.total += val.jumlah;
                sum.semenanjung[0][1] += val.M_semenanjung;
                sum.semenanjung[1][1] += val.C_semenanjung;
                sum.semenanjung[2][1] += val.I_semenanjung;
                sum.semenanjung[3][1] += val.L_semenanjung;
	    
	    sum.semenanjung[1][2] += val.M_semenanjung;
                sum.semenanjung[2][2] += val.C_semenanjung + val.M_semenanjung;
                sum.semenanjung[3][2] += val.C_semenanjung + val.M_semenanjung + val.I_semenanjung;

                sum.sabah[0][1] += val.BI_sabah;
                sum.sabah[1][1] += val.BBI_sabah;
                sum.sabah[2][1] += val.C_sabah;
                sum.sabah[3][1] += val.L_sabah;
	    
	    sum.sabah[1][2] += val.BI_sabah;
                sum.sabah[2][2] += val.BI_sabah + val.BBI_sabah;
                sum.sabah[3][2] += val.BBI_sabah + val.BBI_sabah + val.C_sabah;

                sum.sarawak[0][1] += val.M_sarawak;
                sum.sarawak[1][1] += val.IB_sarawak;
                sum.sarawak[2][1] += val.BD_sarawak;
                sum.sarawak[3][1] += val.OU_sarawak;
                sum.sarawak[4][1] += val.C_sarawak;
                sum.sarawak[5][1] += val.L_sarawak;
	    
	    sum.sarawak[1][2] += val.M_sarawak;
                sum.sarawak[2][2] += val.M_sarawak + val.IB_sarawak;
                sum.sarawak[3][2] += val.M_sarawak + val.IB_sarawak + val.BD_sarawak;
                sum.sarawak[4][2] += val.M_sarawak + val.IB_sarawak + val.BD_sarawak + val.OU_sarawak;
                sum.sarawak[5][2] += val.M_sarawak + val.IB_sarawak + val.BD_sarawak + val.OU_sarawak + val.C_sarawak;
	    
                totarr.push([val.jumlah]);
                data.push(
                    {
                        tempat: val.dmid !== undefined ? val.dm : (val.dunid === 0 ? (val.parid === 0 ? val.negeri : val.parlimen) : val.dun),
                        sortid: val.dmid !== undefined ? val.dmid : (val.dunid === 0 ? (val.parid === 0 ? val.stateid : val.parid) : val.dunid),
                        stateid: val.stateid,
                        id: val.dmid > 0 ? ['loc', val.stateid, val.parid, val.dunid, val.dmid].join('_') : ['loc', val.stateid, val.parid, val.dunid].join('_'),
                        total: val.jumlah,
                        bangsa: {
                            semenanjung: [
                                ['Melayu', val.M_semenanjung, '#615CC4', 0],
                                ['Cina', val.C_semenanjung, '#F56262', val.M_semenanjung ],
                                ['India', val.I_semenanjung, '#E6C365', val.M_semenanjung + val.C_semenanjung],
                                ['Lain', val.L_semenanjung, '#9C9175', val.M_semenanjung + val.C_semenanjung + val.I_semenanjung]
                            ],
                            sabah: [
                                ['BI', val.BI_sabah, '#615CC4', 0],
                                ['BBI', val.BBI_sabah, '#78D1E3', val.BI_sabah],
                                ['Cina', val.C_sabah, '#F56262', val.BI_sabah + val.BBI_sabah],
                                ['Lain', val.L_sabah, '#9C9175', val.BI_sabah + val.BBI_sabah, val.C_sabah]
                            ],
                            sarawak: [
                                ['Melayu', val.M_sarawak, '#615CC4', 0],
                                ['Iban', val.IB_sarawak, '#CD69D6', val.M_sarawak],
                                ['Bidayuh', val.BD_sarawak, '#7FBA73', val.M_sarawak + val.IB_sarawak],
                                ['OrangUlu', val.OU_sarawak, '#CCA76C', val.M_sarawak + val.IB_sarawak + val.BD_sarawak],
                                ['Cina', val.C_sarawak, '#F56262', val.M_sarawak + val.IB_sarawak + val.BD_sarawak + val.OU_sarawak],
                                ['Lain', val.L_sarawak, '#9C9175', val.M_sarawak + val.IB_sarawak + val.BD_sarawak + val.OU_sarawak + val.L_sarawak]
                            ]
                        }
                    }
                );
            });

            var maxtot = d3.max(totarr, function (d) { return d3.max(d) });

            sum.maxdomain = maxtot;

            //console.log('total sum', sum);
            //console.log('data --->:', ncol);
            //BarBangsa(ncol, data, sum, maxtot, labeled);

            fn(data,sum);
        }
    });
},
    Parlimen: function(i, date, stateid, parid, fn) {
      var datestr = date !== '' ? '&source_date=' + date : '';
      var statestr = stateid > 0 ? '&stateid=' + stateid : '';
      var parstr = parid > 0 ? '&parid=' + parid : '';

      $.ajax({
        type: "POST",
        url: "http://api.aga.my/vkid/?vkid=" + i + datestr + "&kawasan=parlimen" + statestr + parstr + "&authkey=" + getParameterByName('authkey') + "&callback=?",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(msg) {

          fn(msg.result);

        }
      });
    },
    Dun: function(i, date, stateid, parid, dunid, fn) {
      var datestr = date !== '' ? '&source_date=' + date : '';
      var statestr = stateid > 0 ? '&stateid=' + stateid : '';
      var parstr = parid > 0 ? '&parid=' + parid : '';
      var dunstr = dunid > 0 ? '&dunid=' + dunid : '';

      $.ajax({
        type: "POST",
        url: "http://api.aga.my/vkid/?vkid=" + i + datestr + "&kawasan=dun" + statestr + parstr + dunstr + "&authkey=" + getParameterByName('authkey') + "&callback=?",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(msg) {

          fn(msg.result);

        }
      });
    }
  }
};



