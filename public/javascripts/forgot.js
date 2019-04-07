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
// Pre Load Function
(function () {
    console.log(name)
    $('#heroImage').html('Good ' + getHour() + '.');
    $('#name').attr('value', name);
    $('#token').attr('value', token);
})();
$("#loginForm").submit(function(e) {
    e.preventDefault();
});