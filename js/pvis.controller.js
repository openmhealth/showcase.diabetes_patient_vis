pvis.controller = function(){
  var self = {}
  self.data = {};

  $(document).ready(function(){

    //self.clearData();

    //init ohmage
    omh.init("https://showcase.omh.io/app","PatienVis")

    //login
    $('#loginButton').click(self.signIn)
    $('.logout').each(function(){
      $(this).click(self.logout)
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
            {
              success:function(res){
                console.log("read response",res)
                pvis.controller.data[k] = res.data.concat(self.data(k));
                console.log(pvis.controller.data[k].length)
                self.data(k, pvis.controller.data[k])
                self.checkData();
              },
              failure:function(e) {
                if(e) {
                  self.showError(e);
                } else {
                  self.showFatalError("Server error. Please try again later.")
                }
                pvis.controller.data[k] = self.data(k);
                self.checkData();
              }
            },
            {
              't_start': self.queryTime(k).format("isoUtcDateTime")
            }
          )
        })
    }

    //Set up explore filters    
    $("input[type='checkbox']").live("change", function() {

      var data = [];

      pvis.explorer.each(function(v) {
        var to = $("#checkbox_"+v.to.payload_id).prop('checked')
        var from = $("#checkbox_"+v.from.payload_id).prop('checked')

        if(to && from) {
          data.push(v)
        }
      })

      pvis.plot(data, true, "#explorer .container")

    });
  })

  self.queryTime = function(payload_id) {
    var d = self.data(payload_id);
    var ms = 0;
    if(d && d[0]) {
      ms = new Date(d[0].metadata.timestamp).getTime() + 1000;
    }
    var timestamp = new Date();
    timestamp.setTime(ms);
    return timestamp;
  }

  self.data = function(payload_id, data) {
    if(data)
      localStorage.setItem('omh.'+payload_id, JSON.stringify(data))
    var d = localStorage.getItem('omh.'+payload_id);
    if(!d) {
      d = '[]';
    }
    return JSON.parse(d);
  }

  self.clearData = function() {
    $.each(omh.payloads, function(k,v) {
      localStorage.removeItem('omh.'+k)
    })
    localStorage.removeItem('omh.read.timestamp')
  }

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

  self.logout = function() {
    self.clearData();
    omh.logout();
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
