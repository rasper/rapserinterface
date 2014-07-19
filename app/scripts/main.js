var displayData = [];
var dateLabel = [];
//var pi_server = "192.168.43.174:8000"
var pi_server = "192.168.43.95:8000"
var minUnit = '<small class="sit-duration" style="font-size: 0.3em; display: none">min</small>'
var hourUnit = '<small class="sit-duration" style="font-size: 0.3em; display: none">hr</small>'
var id_sitDurationInterval;


function setupchart(label,data){
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
    //String - A legend template
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
  };

  var ctx = document.getElementById("myChart").getContext("2d");
  var myLineChart = new Chart(ctx).Line(data, options);
}

//sit duration
$('button.sit-duration').on('click',function(){
  $('button.sit-duration').addClass('sidebar-hover');
  $('main .sit-report').hide();
  $('main #myChart').hide();
  $('#theParameters').hide();
  id_sitDurationInterval=setInterval(function(){
    $.get( "http://"+pi_server+"/sit-duration/" , {
      format: "json"
    },function(duration){
      if (duration == 0){
        $('main span.sit-duration').empty();
        $('main small.sit-duration').hide();
        $('main img.sit-duration').show();
      }else if(duration>=60){
        var html = Math.floor(duration/60) + hourUnit + duration%60 + minUnit;
        console.log(html);
        $('main span.sit-duration').empty().prepend(html).show();
        $('main small.sit-duration').show();
        $('main img.sit-duration').hide();
      }else{
        var html = duration + minUnit;
        $('main span.sit-duration').empty().prepend(html).show();
        $('main small.sit-duration').show();
        $('main img.sit-duration').hide();
      };
    });
  },3000);
});


//sitting report
$('button.sit-report').on('click',function(){
  clearInterval(id_sitDurationInterval);
  $('main #myChart').hide();
  $('main .sit-duration').hide();
  $('#theParameters').hide();
  $.get( "http://"+pi_server+"/sit-report/" , {
    format: "json"
  }, function(report){
    // report={"hourly": 2,
    //         "daily": 50,
    //         "weekly": 250,
    //         "monthly": 1000,
    //         "annually": 12000};
    var html="";
    $.each(report, function(key, value) { 
      html+=key + "\t->\t" + value + "minutes<br>";
    });
    $('main p.sit-report').empty().append(html).show();
  });
});

//posting new params
$('button.change-params').on('click',function(){
  clearInterval(id_sitDurationInterval);
  $('main .sit-duration').hide();
  $('main .sit-report').hide();
  $('main #myChart').hide();
  $('#theParameters').show();
});
//ajax post to chagne params
$("#theParameters").submit(function(event) {

  /* stop form from submitting normally */
  event.preventDefault();

  /* get some values from elements on the page: */
  var $form = $( this ),
      url = $form.attr( 'action' );

  /* Send the data using post */
  var posting = $.post( url, { cooldown_param: $('#cooldown-param').val(), burnup_param: $('#burnup-param').val() } );

  /* Put the results in a div */
  posting.done(function( data ) {
    alert('parameters updated!');
  });
});
