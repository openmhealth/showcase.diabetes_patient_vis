pvis.controller = function(){
  var self = {}
  self.data = {};

  $(document).ready(function(){

    //init ohmage
    omh.init("https://showcase.omh.io/app","PatienVis")

    //login
    $('#loginButton').click(self.signIn)
    $('.logout').each(function(){
      $(this).click(omh.logout)
    });

    $('.navbar').addClass('ui-disabled');

    if(!omh.token())
      $.mobile.changePage($("#login"), {'transition':'none'})
    else{
      $.mobile.changePage($("#comparisons"), {'transition':'none'})

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
            if(e) {
              self.showError(e);
            } else {
              self.showFatalError("Server error. Please try again later.")
            }
            pvis.controller.data[k] = []
            self.checkData();
          }
        })
      });
    }

    //Set up explore filters    
    $("input[type='checkbox']").live("change", function() {

      var possible = [];
      var data = [];

      $(":checked").each(function (i, v) {
        var val = $(this).prop('value');
        if(val == "glucose" || val == "pam") {
          possible = possible.concat(pvis[val])
        } else {
          possible.each(function (v) {
            if(v.to.payload_id === val) {
              data.push(v)
            }
          })
        }
      })

      pvis.plot(data, true, "#explorer .container")

    });
  })

  self.onComparisonClick = function(d) {
    $.mobile.changePage($("#comparison"))
    
    $( document ).delegate("#comparison", "pageshow", function() {
      console.log("comp")
        pvis.plot([d], false, "#comparison .container")
        $.mobile.hidePageLoadingMsg();
    });

    //clear the old plot and show a loading message
    pvis.plot([], false, "#comparison .container")
    $.mobile.showPageLoadingMsg();
  }

  self.checkData = function() {
    var count = 0
    for(var i in pvis.controller.data) {
        if (pvis.controller.data.hasOwnProperty(i)) {
            count += 1;
        }
    }

    if(count == 7) {
      $('.navbar').removeClass('ui-disabled');
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
      failure:function(res){
        if(res) {
          $('#loginDialog .msg').css('color','red').
          text('Incorrect user name or password. Please try again.')
        } else {
          $('#loginDialog .msg').css('color','red').
          text('Server error. Please try again later.')
        }
      }
    })
    return false
  }

  // Shows minor errors as the accumulate
  self.showError = function(err) {
    err.errors.each(function(v) {
      $('#error').append('<p>'+v.text+'</p>');
      $('#error').show();
    })
  }

  // Fatal error which causes the application to be in in an unknown state
  self.showFatalError = function(err) {
    $('#error').html('<p>'+err+'</p>');
    $('#error').show();
  }

  return self;
}.call()
