// BitCoin stream consumer
// mtgox channels: https://mtgox.com/api/2/stream/list_public?pretty
document.addEventListener('DOMContentLoaded', function () {
  var pubnub = PUBNUB.init({
    subscribe_key: 'sub-c-50d56e1e-2fd9-11e3-a041-02ee2ddab7fe'
  });

  var priceEl = document.querySelector('#price');

  pubnub.subscribe({
    channel: 'd5f06780-30a8-4a48-a2f8-7ed181b4a13f',
    callback: function (message) {
      console.log("BitCoin Message: ", message);

      if (message.ticker) {
        priceEl.innerHTML = message.ticker.avg.display;

        var value = parseFloat(message.ticker.avg.value);
        updateChart(value);
      }
    }
  });

  function width(d) {
    return d / 10 + "px";
  };

  function text(d) {
    return d;
  };

  var data = [];
  function updateChart(value) {
    data.push(value);

    if (data.length > 5) data.shift();

    d3.select('.chart')
      .selectAll('div')
        .data(data)
      .enter().append("div")
        .transition()
        .style("width", width)
        .text(text);
  };

  d3.select('.chart')
    .selectAll('div')
      .data(data)
    .enter().append("div")
      .style("width", width)
      .text(text);

  // =================
  // Line
  // ===================
var n = 40,
    random = d3.random.normal(0, .2);

function chart(domain, interpolation, tick) {
  var data = d3.range(n).map(random);

  var margin = {top: 6, right: 0, bottom: 6, left: 40},
      width = 960 - margin.right,
      height = 120 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .domain(domain)
      .range([0, width]);

  var y = d3.scale.linear()
      .domain([-1, 1])
      .range([height, 0]);

  var line = d3.svg.line()
      .interpolate(interpolation)
      .x(function(d, i) { return x(i); })
      .y(function(d, i) { return y(d); });

  var svg = d3.select("body").append("p").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("margin-left", -margin.left + "px")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis().scale(y).ticks(5).orient("left"));

  var path = svg.append("g")
      .attr("clip-path", "url(#clip)")
    .append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", line);

  tick(path, line, data, x);
}

chart([0, n - 1], "linear", function tick(path, line, data, x) {

  // push a new data point onto the back
  data.push(random());

  // redraw the line, and then slide it to the left
  path
      .attr("d", line)
      .attr("transform", null)
    .transition()
      .duration(750)
      .ease("linear")
      .attr("transform", "translate(" + x(-1) + ")")
      .each("end", function() { tick(path, line, data, x); });

  // pop the old data point off the front
  data.shift();

}); 

});

