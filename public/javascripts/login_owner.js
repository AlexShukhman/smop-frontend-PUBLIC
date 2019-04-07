function openLogin() {
	$('#loginContainer').hide();
	$('#loginForm').show();
}

function getHour() {
	var date = new Date();
	var hour = +date.getHours();
	if (hour <= 4 || hour > 18) {
		return 'evening';
	}
	else if (hour <= 11) {
		return 'morning';
	}
	else {
		return 'afternoon';
	}
}
// Send my email on forgot password
function forgotPassword() {
	$('#forgotFormWrap').show();
}
function sendForgot() {
	$.post('forgot', {
		email: $.trim($('#femail').val())
	}).done((data)=>{
		if (data.success){
			$('#sent').show();
		}
		else {
			$('#sent').html(data.message);
			$('#sent').show();
		}
	});
}
// Pre Load Function
(function () {
	$('#heroImage').html('Good ' + getHour() + ', <gr>owner</gr>.');
	$('#loginForm').hide();
	$('#forgotFormWrap').hide()
})();
$(document).ready(function () {
	//all js that happens after load
	var timeoutID = null;
	// on type into
	$('.customInput').keyup(function () {});
});