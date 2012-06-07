google.load('visualization', '1.1', { packages: ['corechart', 'controls'] });

function chunk(a, s){
    for(var x, i = 0, c = -1, l = a.length, n = []; i < l; i++)
        (x = i % s) ? n[c][x] = a[i] : n[++c] = [a[i]];
        console.log('chunk called');
    return n;
}

PD.ronn = {
  //url: "http://localhost/~rjp44/primer_redesign/ronn.php",
  url: "http://localhost/~rjp44/primer_redesign/fake_ronn.php",
  
  getURL: function() {
    return this.url;
  },
  
  post: function(seq) {
    $.post(this.url, { seq: seq },
      function(data) {
        $('#ronn').find('#ronn-ranges').append(data.disorder_ranges);
        var el  = $('<div></div>').appendTo('#ronn');
        var sym = $('<div></div>').appendTo('#ronn');
        
        PD.ronn.plot(data);
        
        var str = '';
        
        $.each(data.disorder, function(num, info) {
          var red   = Math.round(info.d * 255),
              green = Math.round((1 - info.d) * 255);
          el.append('<span style="color:rgb(' + red + ', ' + green + ',0)">' + info.r + '</span>');
          str += (info.d >= 0.5 ? '*': '-');
        });
               
        sym.append(str
          .replace(/\*+/g, "<span style=\"color: red\">$&</span>")
          .replace(/-+/g, "<span style=\"color: green\">$&</span>")
        );
        
        function ronn_sym(key) {
          var sym = { '*': 'disordered', '-': 'ordered' };
        }
               
        /*console.log(
        str.replace(/\*+/g, '<span class="ronn_d">' + new Array(3+1).join('$&') + '</span>')
        .replace(/-+/g, '<span class="ronn_o">' + new Array(3+1).join('$&') + '</span>')
        );*/
        
        $('#ronn div').not('#ronn-chart').css({
          'word-wrap': 'break-word',
          'font-family': 'Courier'
        });
      },
      "json"
    );
  },
  
  plot: function(response) {
    var dashboard = new google.visualization.Dashboard(document.getElementById('ronn_dashboard'));
    
    // Navigator view
    var control = new google.visualization.ControlWrapper({
      controlType: 'ChartRangeFilter',
      containerId: 'ronn_controls',
      options: {
        filterColumnIndex: 0,
        ui: {
          chartType: 'LineChart',
          chartOptions: {
            chartArea: { 'width': '85%', 'height': '20%' },
            hAxis: { 'baselineColor': 'none' }
          },
          minRangeSize: response.disorder.length / 5
        }
      }
    });
    
    // Main chart
    var chart = new google.visualization.ChartWrapper({
      chartType: 'LineChart',
      containerId: 'ronn_chart',
      options: {
        width: 1100, height: 500,
        chartArea: { 'width': '85%', 'height': '75%' },
        title: 'Probability of disorder',
        hAxis: { title: 'Residue position', gridlines: { count: calcCount(response.disorder) } },
        vAxis: { title: 'Probability of disorder', minValue: 0, maxValue: 1, gridlines: { count: 3 } },
        legend: { position: 'none' }
      }
    });
      
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Residue');
    data.addColumn('number', 'Disorder');
            
    $.each(response.disorder, function(num, info) {
      data.addRow([{ v: num + 1, f: PD.ProteinSequence.prototype.aa[info.r].sym + ' ' + (num + 1) }, info.d]);
    });
    
    function calcCount(arr) {
      var len = arr.length;
      if (len > 900) {
        return Math.ceil(len / 40);
      }
      else if (len < 900 && len > 100) {
        return Math.ceil(len / 20);
      }
      else if (len < 100 && len > 50) {
        return Math.ceil(len / 10);
      }
    }
      
    dashboard.bind(control, chart);
    dashboard.draw(data);
    window.ctrl = control;
  }
};