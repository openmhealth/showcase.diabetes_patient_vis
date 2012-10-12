console.log('init pvis')
var pvis = {}

pvis.timestamp = function(v) {
  return new Date(v.metadata.timestamp);
}

pvis.compare = function(r,k) {
  return utils.compareDates(this.resTime(r), this.from.timestamp(k), this.duration, this.offset);
}

pvis.calculate = function() {
  var self = this;

  if(!pvis.controller.data[this.from.payload_id] || !pvis.controller.data[self.to]) {
    return;
  }

  var data;

  $.each(pvis.controller.data[self.from.payload_id], function(i,v) {
    // Search instances of this key
    if(self.from.filter(v, self.key)) {
      $.each(pvis.controller.data[self.to], function(i2,v2) {
        var res = self.compare(v2,v,self.duration,self.offset);
        if(res < 0) {
          return false;
        } else if(res == 0) {
          data = {
            'key':{
              'timestamp':self.from.timestamp(v),
              'value':self.from.value(v)
            },
            'res':{
              'timestamp':self.resTime(v2),
              'value':self.resValue(v2)
            }
          }
          return false;
        }
      });
    }

    if(data) {
      return false;
    }
  });

  return data;
}