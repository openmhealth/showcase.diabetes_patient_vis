pvis.ui = {}

pvis.ui.showLoginDialog = function(){
  $('#logoutButton').hide()
  $('input, select')
  .not('#username,#password,#loginButton')
  .attr('disabled','true')
  $('#loginDialog').show()
	$('#content').hide();
}
pvis.ui.hideLoginDialog = function(){
  $('#logoutButton').show()
  $('input, select').removeAttr('disabled')
  $('#loginDialog').hide()
	$('#content').show()
}