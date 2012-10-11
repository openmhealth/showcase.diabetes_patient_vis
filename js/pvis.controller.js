pvis.controller = function(){
  var self = {}
  self.data = {};

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
            pvis.controller.data[k] = res.data;
            self.checkData();
          },
          failure:function(e) {
            pvis.controller.data[k] = {}
            self.checkData();
          }
        })
      });
    }
  })

  self.checkData = function() {
    var count = 0
    for(var i in pvis.controller.data) {
        if (pvis.controller.data.hasOwnProperty(i)) {
            count += 1;
        }
    }

    if(count == 7) {
      $.mobile.hidePageLoadingMsg();
      pvis.plot(pvis.cmp);
    }
  }

  self.signIn = function(){
    var user = $('#loginDialog #username').val()
    var password = $('#loginDialog #password').val()

    if(!user || !password) {
      return false;
    }

    $('#loginDialog .msg').css('color','black').text('Signing In...')

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
