function randomNumber(min, max) { 
  return Math.floor(Math.random() * (max - min) + min);
}

var counter = 1
var burst_counter = 0
var collect_counter = 0
var last_step = 0
var person = ""
var start_time
var reaction_time
var storage_name

$(document).ready(function(){
    person = prompt("Please enter your name or id");
    while (person == null){
      person = prompt("Please enter your name or id");
    }
    var curr_time = new Date().getTime() / 1000;
    storage_name = person.concat("__").concat(curr_time)
    
    $('#pump').click(after_pump);
    $('#collect').click(after_collect);
    $('.item').click(store_data);

    
    $('#video').hide();
    $('#image').show();
    $('#answers').show();
    
})

function after_pump(){
    d = new Date();
    reaction_time = d.getTime() - start_time;
    $('#answers').hide();
    $('#video').show();
    show_pump_video()
    t_id = window.setTimeout(next, 1000);
}

function show_pump_video(){
    var video = document.createElement('video');
    $('#video').append(video)
    video.src = 'videos/'.concat(counter.toString()).concat('.mp4');
    video.width = '560';
    video.height = '315';
    video.autoplay = true;
}

function after_collect(){
    d = new Date();
    reaction_time = d.getTime() - start_time;
    collect_counter += 1
    show_collect_img()
    $('#answers').hide();
    $('#video').show();
    show_collect_video()
  }

function show_collect_video(){
    var video = document.createElement('video');
    $('#video').append(video)
    video.src = 'videos/collect.mp4';
    video.width = '560';
    video.height = '315';
    video.autoplay = true;
}

function show_collect_img(){
  var src1 = 'images/collect.PNG';
  $('#the_img').attr("src", src1);
  $('#image').show();
  if (burst_counter + collect_counter == 10){
    last_step += 1
    the_end()
  }else{
    t_id = window.setTimeout(reset, 1000);
  }
  
}


function store_data(){
    last_step += 1
    value = {
        'ans' : $(this).text(),
        'img' : $('#the_img').attr('src'),
        'ind' : counter,
        'last_step' : last_step,
        'reaction_time': reaction_time,
        'burst_counter': burst_counter,
        'collect_counter': collect_counter,
      }
    if(localStorage.getItem(storage_name) === null) {
      sub_data = {};
    } else {
      sub_data = JSON.parse(localStorage.getItem(storage_name));
    }
    sub_data[last_step] = value
    
    localStorage.setItem(storage_name, JSON.stringify(sub_data));
  }

function next(){
    $('#video').empty();
    $('#video').hide();
    counter += 1
    if (counter == 1){
      show_ind = 1
    }else{
      show_ind = randomNumber(0, 64)
    }
    if (show_ind >= 64 - counter){
      burst_counter += 1
      var video = document.createElement('video');
      video.src = 'videos/burst.mp4';
      video.width = '560';
      video.height = '415';
      $('#video').show();
      video.autoplay = true;
      $('#video').append(video)
      t_id = window.setTimeout(show_burst, 500);
      return
    }else{
      var src1 = 'images/Slide'.concat(counter).concat('.PNG');
      d = new Date()
      start_time = d.getTime()
    }
    
    $('#the_img').attr("src", src1);
    $('#image').show();
    $('#answers').show();
    
}

function show_burst(){
  last_step += 1
    value = {
        'ans' : "BOOM",
        'img' : "images/burst.jpg",
        'ind' : counter,
        'last_step' : last_step,
        'reaction_time': -1,
        'burst_counter':  burst_counter,
        'collect_counter': collect_counter
      }
    if(localStorage.getItem(storage_name) === null) {
      sub_data = {};
    } else {
      sub_data = JSON.parse(localStorage.getItem(storage_name));
    }
    sub_data[last_step] = value
    
    localStorage.setItem(storage_name, JSON.stringify(sub_data));
    var src1 = 'images/burst.jpg';
    $('#the_img').attr("src", src1);
    $('#image').show();
    if (burst_counter + collect_counter == 10){
      t_id = window.setTimeout(the_end, 1000);
      return
    }else{
      t_id = window.setTimeout(reset, 1000);
    }
    
}

function reset(){
  counter = 0
  next()
}



function export_csv(arrayData) {	
  let header =  ["status","ind","last_step","reaction_time","burst_counter","collect_counter"].join(",") + '\n';
  let csv = header;
  for (var k in arrayData){
      let row = [];
      let obj = arrayData[k]
      for (key in obj) {
          if (obj.hasOwnProperty(key)) {
              row.push(obj[key]);
          }
      }
      csv += row.join(",")+"\n";
  };
	
	console.log('subject-' + storage_name + '.csv');
	console.log(csv);
	
	$.ajax({
		type: 'post',
		cache: false,
		url: './save_data.php',
		data: { filename: 'subject-' + storage_name + '.csv', filedata: csv },
		success: function (response) {
			console.log(response);
		},
		error: function () {
			console.log('Error');
		},
	});
}


function the_end(){
  console.log("the end")
  sub_data = JSON.parse(localStorage.getItem(storage_name));
  value = {
    'status': "The End",
    'ind' : counter,
    'last_step' : last_step,
    'reaction_time': '',
    'burst_counter':  burst_counter,
    'collect_counter': collect_counter
  }
  sub_data[last_step] = value
  
  localStorage.setItem(storage_name, JSON.stringify(sub_data));
  
  $('#main').remove();
  var end = document.createElement('section');
  end.style.cssText = 'text-align:center;';
  var h1 = document.createElement('h1');
  h1.style.cssText = 'font-size:12rem;';
  h1.innerHTML = "THE END"
  end.append(h1)
  $('body').append(end)
	
  sub_data = JSON.parse(localStorage.getItem(storage_name));
  export_csv(sub_data);
}