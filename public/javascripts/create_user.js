// Pre Load Function
(function () {
	$('#heroImage').html('Good ' + getHour() + '.');
	$('#passwordError').hide();
	$('#usernameError').hide();
	$('#submitButton').hide();
	$('#info').hide();
})();
// making the password error show
$('#passCheck').on('keyup', function () {
	if ($('#pass').val() == $('#passCheck').val()) {
		$('#passwordError').hide();
	}
	else $('#passwordError').show();
});

$("#usernameField").blur(function() {
	$.get("get_username", {
		'username': $('#usernameField').val()
	}).done((res) => {
		if (res.exists) {
			$("#usernameError").show();
			$('#submitButton').hide();
			$('#info').hide();
		} else {
			$("#usernameError").hide();
			$('#submitButton').show();
			$('#info').show();
		}
	});
});

// for the hero image
function getHour() {
	var date = new Date();
	var hour = +date.getHours();
	if (hour <= 4 || hour > 18) {
		return 'evening';
	}
	else if (hour <= 11) {
		return 'morning';
	}
	else if (hour <= 18) {
		return 'afternoon';
	}
	else {
		return 'time error... wut.'
	}
}
