console.log('init pvis')
var pvis = {}

pvis.timestamp = function(v) {
  return new Date(v.metadata.timestamp);
}

pvis.compare = function(r,k) {
  return utils.compareDates(this.to.timestamp(r), this.from.timestamp(k), this.duration, this.offset);
}

pvis.calculate = function() {
  var self = this;

  if(!pvis.controller.data[this.from.payload_id] || !pvis.controller.data[this.to.payload_id]) {
    return;
  }

  var data;

  $.each(pvis.controller.data[self.from.payload_id], function(i,v) {
    // Search instances of this key
    if(self.from.filter(v, self.key)) {
      $.each(pvis.controller.data[self.to.payload_id], function(i2,v2) {
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
              'timestamp':self.to.timestamp(v2),
              'value':self.to.value(v2)
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