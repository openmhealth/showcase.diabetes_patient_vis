if(!omh) var omh = {}

var AUTH_TOKEN_ERROR = "0200"

omh.init = function(baseurl, requester){
  omh.baseurl = baseurl
  omh.requester = requester
}

omh.token = function(tok){
  if(tok)
    localStorage.setItem('omh.token',tok)
  return localStorage.getItem('omh.token')
} 

omh.username = function(tok){
  if(tok)
    localStorage.setItem('omh.username',tok)
  return localStorage.getItem('omh.username')
}

omh.initTest = function(){
  if(!omh.baseurl || !omh.requester){
    alert("no baseurl or requester established. Did you call omh.init(baseurl, requester)")
    return false
  }
  return true
}


//callback (optional) can be an object with success and failure functions  
omh.authenticate = function(user, password, callback){
  omh.username(user)
  setTimeout(
    function() {
      var res = {
        'auth_token':'go us!'
      }
      if(res.auth_token){
        omh.token(res.auth_token)
        if(callback && callback.success)
          callback.success(res)
      } else {
        if(callback && callback.failure)
          callback.failure(res)
      }
    }, 500
  );
}

omh.read = function(payloadID, payloadVersion, optional, data){
  $.each(omh.payloads, function(v) {
    if(omh.payloads[v].payload_id == payloadID) {
      $.getJSON("/js/data/"+v+".json", function(json) {
        optional.success(json)
      });
    }
  })
}

omh.logout = function(){
	localStorage.removeItem('omh.token')
  localStorage.removeItem('omh.username')
	window.location.reload();
}