/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


twitter = {
  name: 'Twitter',
  version: '0.1',
  description: 'Tweet topik politik terkini pengguna Twitter',
  thumb: {
    type: 4,
    column: 2,
    color: '#4892CF',
    height: 310,
    width: 300,
    icon: Icon.twitter,
    preview: function() {
    },
    onclick: function(g) {
      //getPilihanraya(0, 1, drawpilihanraya);
      _thumbs_out_(this);
    }
  }
};


akhbar = {
  name: 'Akhbar',
  version: '0.1',
  description: 'Tajuk-tajuk terkini akhbar tempatan',
  thumb: {
    type: 4,
    column: 2,
    color: '#D64113',
    height: 100,
    width: 300,
    icon: Icon.news,
    preview: function() {
    },
    onclick: function(g) {
      //getPilihanraya(0, 1, drawpilihanraya);
      _thumbs_out_(this);
    }
  }
};