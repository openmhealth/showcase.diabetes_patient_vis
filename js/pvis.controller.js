pvis.controller = function(){
  var self = {}

  $(document).ready(function(){

		//init ohmage
		omh.init("https://showcase.omh.io/app","PatienVis")
    
    //login
    $('#loginButton').click(self.signIn)
    $('#logoutButton').click(self.logout)
		
		
    if(!omh.token())
      pvis.ui.showLoginDialog()
    else{
			$("#username").text(omh.username());
			
			$.mobile.showPageLoadingMsg();
			
			$.each(omh.payloads, function(k,v) {
		    omh.read(
		    	v.payload_id, 
					v.version,
					{success:function(res){
		        console.log("read response",res)
						omh.data[k] = res.data;
						if(omh.data.pam && omh.data.runkeeper && omh.data.notes && omh.data.food && omh.data.sleep && omh.data.glucose && omh.data.weight) {
							$.mobile.hidePageLoadingMsg();
							pvis.plot(pvis.cmp);
						}
		      }})
			});

    }
  })

  self.signIn = function(){
    $('#loginDialog .msg').text('Signing In...')
    var user = $('#loginDialog #username').val()
    var password = $('#loginDialog #password').val()
		omh.authenticate(user,password,{
		  success:function(){
				window.location.reload();
		  },
		  failure:function(){
  	  	$('#loginDialog .msg').css('color','red').
  	    	text('Incorrect user name or password. Please try again.')
  	    }
		})
    return false
  }

	self.logout = function() {
		omh.logout({
		  success:function(){
				window.location.reload();
		  }
		});
	}
  
  return self;
}.call()
