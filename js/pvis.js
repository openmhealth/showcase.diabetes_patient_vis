console.log('init pvis')
var pvis = {}

pvis.timestamp = function(v) {
  return new Date(v.metadata.timestamp);
}

pvis.compare = function(r,k) {
  return utils.compareDates(this.to.timestamp(r), this.from.timestamp(k), this.duration, this.offset);
}

pvis.calculate = function(single) {
  var self = this;

  if(!pvis.controller.data[this.from.payload_id] || !pvis.controller.data[this.to.payload_id]) {
    return;
  }

  var data = []

  $.each(pvis.controller.data[self.from.payload_id], function(i,v) {
    // Find the correct filtering function
    var filter = self.filter;
    if(!filter) {
      filter = self.from.filter;
    }

    // Search instances of this key
    if(filter.call(self.from, v, self.key)) {
      $.each(pvis.controller.data[self.to.payload_id], function(i2,v2) {
        var res = self.compare(v2,v,self.duration,self.offset);
        if(res < 0) {
          return false;
        } else if(res == 0) {
          data.push({
            'key':{
              'timestamp':self.from.timestamp(v),
              'value':self.from.value(v)
            },
            'res':{
              'timestamp':self.to.timestamp(v2),
              'value':self.to.value(v2)
            }
          });
          if(!single) return false;
        }
      });
    }

    if(!single && data.length) {
      return false;
    }
  });

  return data;
}

pvis.visualize = function(g, d, data, scale) {

	var b = new bubble(g, scale(data.res.timestamp));
	b.addText([data.res.value]);
}