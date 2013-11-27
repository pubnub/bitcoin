// BitCoin stream consumer
// mtgox channels: https://mtgox.com/api/2/stream/list_public?pretty
document.addEventListener('DOMContentLoaded', function () {
  var data = [];

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
        data.push(value);

        d3.select('.chart')
          .selectAll('div')
            .data(data)
          .enter().append("div")
            .transition()
            .style("width", width)
            .text(text);
      }
    }
  });

  function width(d) {
    return d / 10 + "px";
  };
  function text(d) {
    return d;
  };

  d3.select('.chart')
    .selectAll('div')
      .data(data)
    .enter().append("div")
      .style("width", width)
      .text(text);
});

