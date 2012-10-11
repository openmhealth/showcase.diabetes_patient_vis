pvis.controller = function(){
  var self = {}

  $(document).ready(function(){

		//init ohmage
		omh.init("https://showcase.omh.io/app","PatienVis")
    
    //login
    $('#loginButton').click(self.signIn)
    $('#logoutButton').click(omh.logout)
		
		
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
		      },
					failure:function(e) {
						alert("There was a server error " + e.responseText);
					}
				})
			});

    }
  })

  self.signIn = function(){
    var user = $('#loginDialog #username').val()
    var password = $('#loginDialog #password').val()

    if(!user || !password) {
      return false;
    }

    $('#loginDialog .msg').text('Signing In...')

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

  return self;
}.call()
