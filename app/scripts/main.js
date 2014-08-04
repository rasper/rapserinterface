var displayData = [];
var dateLabel = [];
//var pi_server = "192.168.43.174:8000"
var pi_server = "192.168.43.95:8000"
var secUnit = '<small class="sit-duration" style="font-size: 0.3em;">s</small>'
var minUnit = '<small class="sit-duration" style="font-size: 0.3em;">min</small>'
var hourUnit = '<small class="sit-duration" style="font-size: 0.3em;">hr</small>'
var id_sitDurationInterval;


function setupchart(label,data){
  $('#myChart').remove();
  var canvasNode = $(document.createElement('canvas'))
  canvasNode.attr('id', 'myChart');
  canvasNode.attr('width', '960');
  canvasNode.attr('height', '800');
  $('.sit-activity-div').append(canvasNode);
  var displayData = {
    labels: label,
    datasets: [
      {
        label: "My Sitting Report",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: data
      }
    ]
  };

  var options = {
    ///Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines : true,
    //String - Colour of the grid lines
    scaleGridLineColor : "rgba(0,0,0,.05)",
    //Number - Width of the grid lines
    scaleGridLineWidth : 1,
    //Boolean - Whether the line is curved between points
    bezierCurve : true,
    //Number - Tension of the bezier curve between points
    bezierCurveTension : 0.4,
    //Boolean - Whether to show a dot for each point
    pointDot : true,
    //Number - Radius of each point dot in pixels
    pointDotRadius : 4,
    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth : 1,
    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius : 20,
    //Boolean - Whether to show a stroke for datasets
    datasetStroke : true,
    //Number - Pixel width of dataset stroke
    datasetStrokeWidth : 2,
    //Boolean - Whether to fill the dataset with a colour
    datasetFill : true,
  };

  var ctx = document.getElementById("myChart").getContext("2d");
  var myLineChart = new Chart(ctx).Line(displayData, options);
}

//sit duration
$('button.sit-duration').on('click',function(){
  $('main .sit-activity').hide();
  $('main .sit-report').hide();
  $('main #myChart').hide();
  $('#theParameters').hide();
  id_sitDurationInterval=setInterval(function(){
    $.get( "http://"+pi_server+"/sit-duration/" , {
      format: "json"
    },function(duration){
      console.log("lol");
      if (duration == 0){
        $('main span.sit-duration').empty();
        $('main small.sit-duration').hide();
        $('main img.sit-duration').show();
      }else if(duration>=60){
        var html = Math.floor(duration/60) + minUnit + duration%60 + secUnit;
        console.log(html);
        $('main span.sit-duration').empty().prepend(html).show();
        $('main small.sit-duration').show();
        $('main img.sit-duration').hide();
      }else{
        var html = duration + secUnit;
        $('main span.sit-duration').empty().prepend(html).show();
        $('main small.sit-duration').show();
        $('main img.sit-duration').hide();
      };
    });
  },1000);
});


//sitting report
$('button.sit-report').on('click',function(){
  clearInterval(id_sitDurationInterval);
  $('main .sit-activity').hide();
  $('main #myChart').hide();
  $('main .sit-duration').hide();
  $('#theParameters').hide();
  $('main img.sit-duration').hide();
  $.get( "http://"+pi_server+"/sit-report/" , {
    format: "json"
  }, function(report){
    // report={"hourly": 2,
    //         "daily": 50,
    //         "weekly": 250,
    //         "monthly": 1000,
    //         "annually": 12000};
    var html="";
    // $.each(report, function(key, value) { 
      console.log(Math.floor(report["daily"]/60));
      html= "You have been sitting for <br>"+'<span class="sit-duration" style="font-family: sit-duration-number; font-weight:bold;font-size: 10em">'+Math.floor(report["daily"]/60) + hourUnit + report["daily"]%60 + minUnit +'</span>' +"<br>today!";
    // });
    $('main p.sit-report').empty().append(html).show();
  });
});

//posting new params
$('button.change-params').on('click',function(){
  clearInterval(id_sitDurationInterval);
  $('main .sit-activity').hide();
  $('main .sit-duration').hide();
  $('main .sit-report').hide();
  $('main #myChart').hide();
  $('#theParameters').show();
});
//ajax post to chagne params
$("#theParameters").submit(function(event) {
  clearInterval(id_sitDurationInterval);
  $('main .sit-report').hide();
  $('main .sit-duration').hide();
  $('#theParameters').hide();
  $('main img.sit-duration').hide();

  /* stop form from submitting normally */
  event.preventDefault();

  /* get some values from elements on the page: */
  var $form = $( this ),
      url = $form.attr( 'action' );

  /* Send the data using post */
  var posting = $.post( url, { cooldown_timeout: $('#cooldown-param').val(), burnup_timeout: $('#burnup-param').val() } );

  /* Put the results in a div */
  posting.done(function( data ) {
    alert('parameters updated!');
  });
});

//sitting activity
$('button.sit-activity').on('click',function(){
  clearInterval(id_sitDurationInterval);
  $('main .sit-report').hide();
  $('main .sit-duration').hide();
  $('#theParameters').hide();
  $('main img.sit-duration').hide();
  $('main .sit-activity li').each(function(){
    $(this).removeClass('active');
  });
  $('main .sit-activity li.week').addClass('active');
  $('main .sit-activity').show();

  $('main #myChart').show();
  var label=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  var data = [500,488,580,300,444,0,0];
  setupchart(label,data);
});

$('.today a').click(function (e) {
  clearInterval(id_sitDurationInterval);
  $('main .sit-report').hide();
  $('main .sit-duration').hide();
  $('#theParameters').hide();
  $('main img.sit-duration').hide();
  e.preventDefault();
  $(this).tab('show');
  var todayDate = moment(new Date());
  $.get( "http://"+pi_server+"/sit-daily-activity/" , {
    format: "json", 
    date: todayDate.year() + "-"+(parseInt(todayDate.month())+1) + "-" + todayDate.date()
  },function(data){
    var label=['1am','2am','3am','4am','5am','6am',
    '7am','8am','9am','10am','11am',
    '12pm','1pm','2pm','3pm','4pm','5pm',
    '6pm','7pm','8pm','9pm','10pm','11pm','12am'];
    setupchart(label,data);
  });
});


$('.week a').click(function (e) {
  clearInterval(id_sitDurationInterval);
  $('main .sit-report').hide();
  $('main .sit-duration').hide();
  $('#theParameters').hide();
  $('main img.sit-duration').hide();
  e.preventDefault();
  $(this).tab('show');
  var label=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  var data = [500,488,580,300,444,0,0];
  setupchart(label,data);
});


$('.month a').click(function (e) {
  clearInterval(id_sitDurationInterval);
  $('main .sit-report').hide();
  $('main .sit-duration').hide();
  $('#theParameters').hide();
  $('main img.sit-duration').hide();
  e.preventDefault();
  $(this).tab('show');
  var label = ["1","2","3","4","5","6","7","8","9","10",
                "11","12","13","14","15","16","17","18","19","20",
                "21","22","23","24","25","26","27","28","29","30",];
  var data = [5,6,7,5,6,0,0,
              6,2,6,7,8,3,0,
              5,5,5,6,7.0,0,
              7,6,5,6,0,0,
              2,5];
  setupchart(label,data);
});


$('.year a').click(function (e) {
  clearInterval(id_sitDurationInterval);
  $('main .sit-report').hide();
  $('main .sit-duration').hide();
  $('#theParameters').hide();
  $('main img.sit-duration').hide();
  e.preventDefault();
  $(this).tab('show');
  var label = ["January", "February","March","April","May","June","July","August","September","October","November","December"];
  var data =[120,111,117,80,120,140,155,122,99,100,112,124];
  setupchart(label,data);

});