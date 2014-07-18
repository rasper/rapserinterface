var displayData = [];
var dateLabel = [];
//var pi_server = "192.168.43.174:8000"
var pi_server = "192.168.43.95:8000"



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
$('a.sit-duration').on('click',function(){
  $.get( "http://"+pi_server+"/sit-duration/" , {
    format: "json"
  },function(duration){
    if (duration == 0){
      $('p.sit-duration').empty();
      // https://imgflip.com/i/af5wf
      $('img.sit-duration').show();
    }else{
      $('p.sit-duration').empty().append(duration);
      $('img.sit-duration').hide();
    };
  });
});


//sitting report
$('a.sit-report').on('click',function(){
  // $.get( "" , {}, function(report){
    report={"hourly": 2,
            "daily": 50,
            "weekly": 250,
            "monthly": 1000,
            "annually": 12000};
    var html="";
    $.each(report, function(key, value) { 
      html+=key + "\t->\t" + value + "minutes<br>"; 
    });
    $('p.sit-report').empty().append(html);
  // };
});