function openLogin() {
	$('#loginContainer').hide();
	$('#newUserButton').hide();
	$('#loginForm').show();
}

function getHour() {
	var date = new Date();
	var hour = +date.getHours();
	if (hour <= 4 || hour > 18) {
		return 'evening';
	} else if (hour <= 11) {
		return 'morning';
	} else {
		return 'afternoon';
	}
}
// Send my email on forgot password
function forgotPassword() {
	$('#email').html('please slack Jay Zhang')
}
// Pre Load Function
(function () {
	$('#heroImage').html('Good ' + getHour() + ', admin.');
	$('#loginForm').hide();
})();
$(document).ready(function () {
	//all js that happens after load
	var timeoutID = null;
	// on type into
	$('.customInput').keyup(function () {});
});