// BitCoin stream consumer
// mtgox channels: https://mtgox.com/api/2/stream/list_public?pretty
document.addEventListener('DOMContentLoaded', function () {
  var pubnub = PUBNUB.init({
    subscribe_key: 'sub-c-50d56e1e-2fd9-11e3-a041-02ee2ddab7fe'
  });

  var priceEl = document.querySelector('#price');

  // =================
  // Line
  // ===================
  var n = 1000,
      random = d3.random.normal(1063, .2);

  function chart(domain, interpolation, tick) {
    var data = d3.range(n).map(random);

    var margin = {top: 6, right: 0, bottom: 6, left: 40},
        width = 960 - margin.right,
        height = 520 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain(domain)
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([1000, 1200])
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
        .call(d3.svg.axis().scale(y).ticks(20).orient("left"));

    var path = svg.append("g")
        .attr("clip-path", "url(#clip)")
      .append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line);

    tick(path, line, data, x);

    function parseBitcoinMessage(message) {
      console.log("BitCoin Message: ", message);

      if (message.ticker) {
        priceEl.innerHTML = message.ticker.avg.display;

        var value = parseFloat(message.ticker.avg.value);
        tick(path, line, data, x, value);
      }
    };

    var amount = domain[1],
        startDate = ((Date.now() - 1000 * 60 * 60 * 24) * 10000);
    function getHistory(startDate) {
      pubnub.history({
        channel: 'd5f06780-30a8-4a48-a2f8-7ed181b4a13f',
        count: 50,
        start: startDate,
        reverse: true,
        callback: function (history) {
          //for (var i = 0; i < history[0].length; i++) {
          //  parseBitcoinMessage(history[0][i]);
          //}

          parseBitcoinMessage(history[0][0]);

          if (history[0].length === 50) {
            getHistory(history[2]);
          } else {
            pubnub.subscribe({
              channel: 'd5f06780-30a8-4a48-a2f8-7ed181b4a13f',
              callback: parseBitcoinMessage
            });
          }
        }
      });
    }
    getHistory(startDate);
  }

  chart([0, n - 1], "linear", function tick(path, line, data, x, value) {
    value = value || random();

    // push a new data point onto the back
    data.push(value);

    // redraw the line, and then slide it to the left
    path
        .attr("d", line)
        .attr("transform", null)
      .transition()
        .duration(750)
        .ease("linear")
        .attr("transform", "translate(" + x(-1) + ")");
        //.each("end", function() { tick(path, line, data, x); });

    // pop the old data point off the front
    data.shift();
  });

});

var margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

var parseDate = d3.time.format("%b %Y").parse;

var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.price); });

var area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x2(d.date); })
    .y0(height2)
    .y1(function(d) { return y2(d.price); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

d3.csv("sp500.csv", function(error, data) {

  data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.price = +d.price;
  });

  x.domain(d3.extent(data.map(function(d) { return d.date; })));
  y.domain([0, d3.max(data.map(function(d) { return d.price; }))]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  focus.append("path")
      .datum(data)
      .attr("clip-path", "url(#clip)")
      .attr("d", area);

  focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  context.append("path")
      .datum(data)
      .attr("d", area2);

  context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", height2 + 7);
});

function brushed() {
  x.domain(brush.empty() ? x2.domain() : brush.extent());
  focus.select("path").attr("d", area);
  focus.select(".x.axis").call(xAxis);
}

