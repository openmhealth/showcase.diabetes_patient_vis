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
  if(!omh.initTest())return
  omh.username(user)
  var url = omh.baseurl + '/omh/v1.0/authenticate'
  $.post(url,{
    user:user,
    password:password,
    requester:omh.requester
  },function(res){
    //res = $.parseJSON(res)
    if(res.auth_token){
      omh.token(res.auth_token)
      if(callback && callback.success)
        callback.success(res)
    } else {
      if(callback && callback.failure)
        callback.failure(res)
    }
  }).fail(function(jqXHR, textStatus) {
    try {
      res = $.parseJSON(jqXHR.responseText)
      if(callback && callback.failure)
        callback.failure(res)
    } catch (e) {
        console.log(e);
        callback.failure()
    }
  });
}

omh.read = function(payloadID, payloadVersion, optional){
  if(!omh.initTest())return
  var url = omh.baseurl + '/omh/v1.0/read'
  if(!optional) optional = {}
	var data = {}
  data.auth_token = omh.token()
  data.requester = omh.requester
	data.owner = omh.username()
  data.payload_id = payloadID
  data.payload_version = payloadVersion
  $.ajax({
    url: url,
    data:data,
    type:'POST',
    success: optional.success
  }).fail(function(jqXHR, textStatus) {
    try {
	    res = $.parseJSON(jqXHR.responseText)
	    var autherror = false;

      if(res) {
        $.each(res.errors,function(i, error){
          if(error.code == AUTH_TOKEN_ERROR) {
            console.log("Authentication Error")
			      omh.logout();
			      autherror = true;
	        }
        })
      }

      if(!autherror && optional.failure) {
        optional.failure(res)
      }
    } catch(e) {
      console.log(e)
      if(optional.failure) {
        optional.failure()
      }
    }
	});
}

omh.logout = function(){
	localStorage.removeItem('omh.token')
  localStorage.removeItem('omh.username')
	window.location.reload();
}