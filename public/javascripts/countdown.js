(function () {
	$('.launch_info h2').html('Only ' + getHour());
})();

function getHour() {
	var today = new Date();
	var launch = new Date("July 1, 2018 00:00:00");
	var days = Math.round((launch - today) / (1000 * 60 * 60 * 24)) + 1;
	if (days == 1) return '<span style="font-weight:bolder;">' + days + '</span> DAY LEFT! See you tomorrow!';
	return '<span style="font-weight:bolder;">' + days + '</span> days left... Stay tuned!';
}