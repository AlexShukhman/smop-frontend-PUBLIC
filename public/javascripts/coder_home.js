/*

 

WHY ARE YOU DIVING SO DEEP INTO MY CODE??

 

*/
$('.feedheader').tooltip();
$('.getButton').click(()=>{
	window.open('https://docs.smop.io/Coders/Getting_Started:_PHP/');
});
function editorSubmit() {
	$('#editorSubmitButton').hide();
	saveFile(() => {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', '/post_CodeCheck');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onprogress = (e) => {
			$('#editorReturn').html(JSON.parse(xhr.response.split('\n')[xhr.response.split('\n').length - 3].split('data: ')[1]).progress);
		}
		xhr.send(JSON.stringify({
			id: $('#editorContainer').attr('data-id')
		}));
	});
}

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
$('#editor').keyup((() => {
	$('#editorReturn').html('');
}));
// render the task feed
$(document).ready(function () {
	$('.downloadAll').hide()
	$('#saveButton').tooltip();
	$('#editorSubmitButton').tooltip();
	$('#chatMessage').tooltip();
	$('#icon').tooltip();
	$('.chatWrapper').hide();
	$('.downloader').hide();
	$('#description').hide();
	$('#editorSubmitButton').hide();
	$('#saveButton').hide();
	$('#editor').hide();
	// some lowlevel object redefining of the setter for readOut
	if (task) {
		editTask(task);
	}
	$.ajax({
		type: "GET",
		url: "get_codertaskfeed",
		complete: function (data) {
			var m = data.responseJSON.message;
			if (m.length > 0) {
				for (var key in m) {
					var innerTask = m[key]['name'] + '($' + m[key]['bounty'] + '): ' + m[key]['task']['message_short'];
					checkStatus(m[key]['_id'], key, innerTask, (status, key, innerTask) => {
						if (m.hasOwnProperty(key)) {
							$('#feed').append("<code class='feedtask'><a onclick='editTask(\"" + m[key]["_id"] + "\")'>" + innerTask + " | </a></code>" + "<span id='icon' class='glyphicon glyphicon-" + status[0] + " " + status[1] + " statusSymbol' aria-hidden='true' onmouseover='showdesc(\"" + status[2] + "\")' onmouseout='$(\"#desc\").hide();'></span><br/>")
						}
					});
				}
			} else {
				$('#feed').append("<div class='feedmessage'>Sorry! No Tasks Available</div>")
			}
		}
	});
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

function saveFile(callback) {
	if ($('#editorContainer').attr('iseditor') == "yes") {
		var filename = $('#editorContainer').attr('filename');
		var file = editors[0].getValue();
		var id = $('#editorContainer').attr('data-id');
		console.log('creating file...');
		$.post('post_createFile', {
			file: file,
			filename: filename
		}).done(() => {
			console.log('sending file...');
			$.post('post_petCode', {
				filename: filename,
				id: id
			}).done(() => {
				callback();
			});
		});
	} else callback();
}

function editorSave() {
	$('#editorSubmitButton').show();
	saveFile(() => {
		$('#editorReturn').html('saved');
	});
}

function getfile(filename) {
	if ($('#editorContainer').attr('iseditor') == "yes") {
		console.log('saving...');
		saveFile(() => {
			_getfile(filename)
		});
	} else {
		_getfile(filename)
	}
}

function _getfile(filename) {
	$('#editorContainer').attr('filename', filename);
	var f = filename.split('.');
	if (modelist.getModeForPath(filename).mode == "ace/mode/text" && f[f.length - 1] != 'txt') {
		$('#editorContainer').attr('iseditor', "no");
		$('#filename').hide();
		$('#editor').hide();
		$('#description').hide();
		$('#downloader a').attr("href", "/get_file?file=" + filename + '&id=' + $('#editorContainer').attr('data-id'));
		$('#downloader a').attr("download", filename);
		$('#downloader a').html('Download ' + filename);
		$('.downloader').show();
	} else {
		editors[0].session.setMode(modelist.getModeForPath(filename).mode);
		$('#filename').html(filename);
		$('#filename').show();
		$('#editorContainer').attr('iseditor', "yes");
		$('.downloader').hide();
		$('#description').hide();
		$('#editor').show();
		$.get('get_file', {
			'file': filename,
			'id': $('#editorContainer').attr('data-id'),
			'read': true
		}).done((res) => {
			console.log(res)
			editors[0].setValue(res.file)
		});
	}
}

function get_user() {
	$.get('ssn', {}, (res) => {
		document.cookie = 'user=' + res.user + '; expires=' + (new Date(Date.now() + 900000)).toDateString();
	});
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

function showDescription() {
	$('#editorContainer').attr('iseditor', 'no');
	var html = marked($('#editorContainer').attr('s'));
	$('#description').html(html);
	$('#editor').hide();
	$('.downloader').hide()
	$('#description').show();
}

function editTask(id) {
	$('#welcomemessage').hide();
	$('.downloadAll').show();
	$('#editorReturn').html('');
	$('#editorContainer').attr('data-id', id);
	$('#chat').html(null);
	get_user();
	var user = document.cookie.split('; ').map(cookie => cookie.split('=')).find((e) => {
		return e[0] == 'user';
	})[1];
	$('.downloadAll a').first().attr('href', '/get_zip?path='+ id + '/' + user)
	$('.downloadAll a').first().attr("download", id + '.zip');
	var socket = io();
	socket.on('connect', (data) => {
		socket.emit('join', JSON.stringify({
			id: id,
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
					$('#chat').append('<div class="yourchat ' + ((data[i].owner == data[i].user) ? 'ownerchat' : 'coderchat') + '">' + JSON.parse(data[i].value).message + '</div></br>')
				} else {
					$('#chat').append('<div class="theirchat ' + ((data[i].owner == data[i].user) ? 'ownerchat' : 'coderchat') + '">' + JSON.parse(data[i].value).message + '</div></br>')
				}
			}
		}
		$('#chat').animate({
			scrollTop: $('#chat').get(0).scrollHeight
		}, 20);
	});
	socket.on('message', (data) => {
		console.log('Data:', data);
		if (data.user == user) {
			$('#chat').append('<div class="yourchat ' + ((data.owner == data.user) ? 'ownerchat' : 'coderchat') + '">' + JSON.parse(data.value).message + '</div></br>')
		} else {
			document.getElementById("audio").play();
			$('#chat').append('<div class="theirchat ' + ((data.owner == data.user) ? 'ownerchat' : 'coderchat') + '">' + JSON.parse(data.value).message + '</div></br>')
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
		} else if (e.keyCode == 27) { // on escape
			minimizeChat();
		}

	});
	showChat();
	$('#editorContainer').attr('iseditor', "no");
	$('#fileslist').html('');
	$.get("get_singletask", {
		'data': id,
		'coder_owner': 'coder'
	}).done(function (res) {
		if (!res.accepted) {
			$('#saveButton').show();
			console.log(res);
			var m = res.result;
			try {
				var d = new Date(m['updated_at']);
				d = d.toDateString();
			} catch (err) {
				var d = "";
			}
			var s = '*Task \`' + m['name'] + '\` was posted by ' + m['owner'] /*+ ' on ' + d */+ '. ' + m['owner'] + ' has defined the task as such:*\n\n' + m['task']['message_long'] + '\nPet code and/or helpful files have ' + ((res.files.length > 0) ? '' : "not ") + 'been attached' + ((res.files.length > 0) ? ' below' : '') + '.\n\n\n #### Task Value: **$' + parseFloat(m['bounty'])/6+'** *for a successful submission*\n\n###### **+$'+parseFloat(m['bounty'])/2+'** *if submission is chosen by owner*\n\n **Feel Free to Code Right in the Online Editors** \n\n and ***Good Luck!***';
			$('#fileslist').append('<div id="fd" class="file" style="font-style: italic; font-weight: bold;" title="this is your pet code - feel free to code within our editor or to copy and paste it to your ide">Files:</div><div class="file"><a onclick="return showDescription()">Task Description</a></div>');
			$('#fd').tooltip();
			for (var i in res.files) {
				var filename = res.files[i].match(/[^/]+/g)[2];
				$('#fileslist').append('<div class="file"><a onclick="return getfile(\'' + filename + '\')">' + filename + ((i == res.files.length - 1) ? '' : ',') + '</a></div>');
				$('#editorContainer').attr('s', s);
				showDescription();
			}
		} else {
			showSuccess();
		}

	});
}

function showSuccess() {
	var s = "# Congratulations!\n\nYou have been chosen as a winner.\nLook out for the payment in your email inbox in the next few days!";
	$('#editorContainer').attr('s', s);
	showDescription();
}