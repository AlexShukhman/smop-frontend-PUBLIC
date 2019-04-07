$('.feedheader').tooltip();
$('#save').tooltip();
$('#chatMessage').tooltip();
uploads = [];
divs = ['#taskname', '#language', '#short_message', '#long_message', '#bty', '#code', '#parth']
var Upload = function (file, i, id) {
	this.file = file;
	this.i = i;
	this.id = id
}
Upload.prototype.getName = function () {
	return this.file.name;
}
Upload.prototype.doUpload = function () {
	var that = this;
	var formdata = new FormData();
	formdata.append('file', this.file, this.getName());
	formdata.append('upload_file', true);
	$.ajax({
		xhr: () => {
			var myXhr = $.ajaxSettings.xhr();
			if (myXhr.upload) {
				myXhr.upload.addEventListener('progress', that.progressHandling, false);
			}
			return myXhr;
		},
		headers: {
			"X-FILENAME": this.file.name,
			"taskID": this.id
		},
		type: "POST",
		url: 'post_petCode',
		data: formdata,
		cache: false,
		contentType: false,
		processData: false,
		timeout: 60000
	}).done((data) => {
		$('#progress-wrp_' + this.i + ':nth-child(' + (this.i + 1) + ')').html(this.file.name + ': success!');
		uploads[this.i] = true;
		if (uploads.every((up) => {
				return up == true;
			})) {
			location.reload();
		}
	});
}

function nextPage() {
	$('#back').show();
	for (var i = 0; i < divs.length; i++)
		if ($(divs[i]).css('display') != 'none') {
			if (i < divs.length - 2) {
				$(divs[i]).hide();
				$(divs[i + 1]).show();
			} else {
				$(divs[i]).hide();
				$(divs[i + 1]).show();
				$('#next').hide();
				$('#save').show();
			}
			return false;
		}
}

function prevPage() {
	$('#next').show();
	$('#save').hide();
	for (var i in divs)
		if ($(divs[i]).css('display') != 'none') {
			if (i > 1) {
				$(divs[i]).hide();
				$(divs[i - 1]).show();
			} else {
				$(divs[i]).hide();
				$(divs[i - 1]).show();
				$('#back').hide();
			}
			return false;
		}
}

function submitForm() {
	var files = $("#task_pet_code")[0].files;
	var formdata = {}
	formdata['name'] = $('#name').val();
	formdata['lang'] = $('#lang').val();
	formdata['task_message_short'] = $('#task_message_short').val();
	formdata['task_message_long'] = $('#task_message_long').val();
	formdata['bounty'] = $('#bounty').val();
	formdata['task_unit_tests'] = editors[0].getValue();
	var id = $('#formHeader').attr('data-id');
	var url;
	if (id != undefined) {
		formdata['id'] = id;
		url = 'update_task';
	} else {
		url = 'create_task';
	}
	$.post(url, formdata).done((res) => {
		for (var i = 0; i < files.length; i++) {
			uploads.push(false);
			$('#progress').append('<div id="progress-wrp_' + i + '"></div>');
			$('#progress-wrp_' + i).append('<div class= "progress-bar"></div>');
			$('#progress-wrp_' + i).append('<div class= "status">' + files[i].name + ': uploading...</div>');
			var upload = new Upload(files[i], i, res.id);
			upload.doUpload();
		}
		location.reload();
	});
}

function showAll() {
	$('.customInput_tall').attr('style', 'height:52pt!important');
	for (var i in divs) {
		var div = divs[i]
		$(div).attr('style', 'font-size:16px; text-align: left');
		$(div + ' input').attr('style', 'text-align:left;')
		$(div).show();
	}
	$('#sp').hide();
	$('#next').hide();
	$('#back').hide();
	$('#save').show();
}

function hideAll() {
	$('.chatWrapper').hide();
	$('form').attr('style', 'padding-left: .5vw;');
	for (var i in divs) {
		var div = divs[i]
		$(div).attr('style', 'font-size:25px; text-align: center');
		if ($(div + ' input').attr('type') != 'file') $(div + ' input').attr('style', 'text-align:center;');
		else {
			$(div + ' input').attr('style', 'margin:auto; font-size:12px;');
		}
		$(div).hide();
	}
	$('#back').hide();
	$('#save').hide();
	$(divs[0]).show();
}

function maximizeChat() {
	$('.chatView').show();
	$('#chatMax').hide();
	$('#chatMin').show();
}

function minimizeChat() {
	$('.chatView').hide();
	$('#chatMax').show();
	$('#chatMin').hide();
}

function showChat() {
	$('#chatMax').hide();
	$('.chatWrapper').show();
	maximizeChat();
}

function get_user() {
	$.get('ssn', {}, (res) => {
		document.cookie = 'user=' + res.user + '; expires=' + (new Date(Date.now() + 900000)).toDateString();
	});
}

function editTask(id) {
	$('#chat').html(null);
	get_user();
	$('#save').html('');
	var user = document.cookie.split('; ').map(cookie => cookie.split('=')).find((e) => {
		return e[0] == 'user';
	})[1];
	var socket = io();
	socket.on('connect', (data) => {
		socket.emit('join', JSON.stringify({
			id: $('#formHeader').attr('data-id'),
			user: user
		}));
	});
	socket.on('messages', (data) => {
		$('#chat').html('');
		if (data.length == 0) {
			socket.emit('message', 'Start of Messages');
		} else {
			for (i in data) {
				if (data[i].user == user) {
					$('#chat').append('<div class="chat yourchat ownerchat">' + JSON.parse(data[i].value).message + '</div></br>')
				} else {
					$('#chat').append('<div class="chat theirchat coderchat">' + JSON.parse(data[i].value).message + '</div></br>')
				}
			}
		}
		$('#chat').animate({
			scrollTop: $('#chat').get(0).scrollHeight
		}, 20);
	});
	socket.on('message', (data) => {
		if (data.user == user) {
			$('#chat').append('<div class="yourchat ownerchat">' + JSON.parse(data.value).message + '</div></br>')
		} else {
			document.getElementById("audio").play();
			$('#chat').append('<div class="theirchat coderchat">' + JSON.parse(data.value).message + '</div></br>')
		}
		$('#chat').animate({
			scrollTop: $('#chat').get(0).scrollHeight
		}, 20);
	});
	$('#chatIn').keyup(function (e) {
		$('#chat').animate({
			scrollTop: $('#chat').get(0).scrollHeight
		}, 20);
		if (e.which == 13) { // on enter
			socket.emit('message', $('#chatIn').val());
			$('#chatIn').val(null);
		}
		if (e.keyCode == 27) { // on escape
			console.log('escape');
			minimizeChat();
		}

	});
	showAll();
	showChat();
	$('.taskFormContainer').attr('style', 'padding-left: 3vw;');
	$('.task_message_long').attr('style', 'margin-left: 0;');
	$('form').attr('style', 'padding-left: 0')
	$('#formHeader').attr('data-id', id);
	$.get("get_singletask", {
		'data': id,
		'coder_owner': 'owner'
	}).done(function (res) {
		$('#progress').html('');
		var r = res.r;
		var m = (res.result[0]) ? res.result[0] : res.result;
		$('#name').val(m['name']);
		$('#lang').val(m['lang']);
		$('#task_message_short').val(m['task']['message_short']);
		$('#task_message_long').val(m['task']['message_long']);
		$('#bounty').val(m['bounty']);
		for (var file in res.files) {
			var filename = res.files[file].match(/[^/]+/g)[2];
			$('#filedump').append('<div class="file"><a href="/get_file?file=' + filename + "&id=" + id + '" download="' + filename + '">' + filename + '</a></div>');
		}
		if (m['task']['unit_tests']) editors[0].setValue(m['task']['unit_tests']);
		$('#save').attr('onclick', "return resend();")
		if (r.length > 0) {
			console.log('Hiya, ' + JSON.stringify(r));
			renderZips(r);
			$('.invisible').show();
		} else {
			$('.invisible').hide();
		}
	});
}
// check task status
function checkStatus(id, key, innerTask, callback) {
	$.get('get_taskStatus', {
		'data': id
	}).done((res) => {
		switch (res.message) {
			case 'error':
				callback(['warning-sign', 'feedmessage', 'contact smop@smop.io'], key, innerTask);
				break;
			case 'Win':
				callback(['thumbs-up', 'ownercolor', 'you won the first round!'], key, innerTask);
				break;
			case 'Big Win':
				callback(['usd', 'ownercolor', 'you won big!'], key, innerTask);
				break;
			case 'Paid':
				callback(['star', 'ok-circle', 'all done'], key, innerTask);
				break;
			case 'Queue Full':
				callback(['check', 'ownercolor', 'three coders submitted'], key, innerTask);
				break;
			case 'One':
				callback(['thumbs-up', 'codercolor', 'times completed: 1/3'], key, innerTask);
				break;
			case 'Two':
				callback(['thumbs-up', 'codercolor', 'times completed: 2/3'], key, innerTask);
				break;
			case 'Started':
				callback(['tasks', 'codercolor', 'nobody has completed this task!'], key, innerTask);
				break;
			case 'Not Started':
				callback(['hourglass', 'notStarted', 'nobody has looked at this task!'], key, innerTask);
				break;
			case 'Not Accepted':
				callback(['exclamation-sign', 'notStarted', 'please wait for this task to be accepted'], key, innerTask);
				break;
		}
	});
}

function accept() {
	$.get('get_acceptTask', {
		'data': $('#formHeader').attr('data-id')
	}).done((res) => {
		location.reload();
	});
}

function decline() {
	$.get('get_declineTask', {
		'data': $('#formHeader').attr('data-id')
	}).done((res) => {
		location.reload();
	});
}

function renderZips(zipList) {
	console.log(zipList);
	$('#solution').html('');
	for (var i in zipList) {
		$('#solution').append('<div class="zip"><a href="/get_zip?path=' + zipList[i] + '" download="solution_' + (i).toString() + '.zip">Solution ' + (i).toString() + '<br/><a href="/accept_user?user=' + zipList[i].split('/')[1] + '&task=' + zipList[i].split('/')[0] + '">Accept</a></a></div>');
	}
	if (zipList.length >= 3){
		console.log('yup');
		$('#solution').append('<div class"zip"><a href="/decline_task?id='+zipList[0].split('/')[0]+'">Decline All</a></div>')
	}
}

// render the task feed
$(document).ready(function () {
	hideAll();
	$.ajax({
		type: "GET",
		url: "get_ownertaskfeed",
		complete: function (data) {
			var m = data.responseJSON.message;
			if (typeof m != 'string') {
				for (var key in m) {
					var innerTask = m[key]['name'] + '($' + m[key]['bounty'] + '): ' + m[key]['task']['message_short'];
					checkStatus(m[key]['_id'], key, innerTask, (status, key, innerTask) => {
						if (m.hasOwnProperty(key)) {
							$('#feed').append("<code class='feedtask'><a onclick='editTask(\"" + m[key]["_id"] + "\")'>" + innerTask + " | </a></code><span class='glyphicon glyphicon-" + status[0] + " " + status[1] + " statusSymbol' aria-hidden='true' onmouseover='showdesc(\"" + status[2] + "\")' onmouseout='$(\"#desc\").hide();'></span><br/>")
						}
					});
				}
				$('.glyphicon').tooltip();
			} else {
				$('#feed').append("<div class='feedmessage'>" + m + "</div>")
			}
		}
	});
	$('.invisible').hide();
});

function showdesc(d) {
	$('#desc').html(d);
	$('#desc').show();
	var currentMousePos = {
		x: -1,
		y: -1
	};
	$(document).mousemove(function (event) {
		currentMousePos.x = event.pageX;
		currentMousePos.y = event.pageY;
		$('#desc').css('top', currentMousePos.y);
		$('#desc').css('left', currentMousePos.x);
	});
}