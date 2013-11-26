// BitCoin stream consumer
// mtgox channels: https://mtgox.com/api/2/stream/list_public?pretty

var pubnub = PUBNUB.init({
  subscribe_key: 'sub-c-50d56e1e-2fd9-11e3-a041-02ee2ddab7fe'
});

pubnub.subscribe({
  channel: 'd5f06780-30a8-4a48-a2f8-7ed181b4a13f',
  callback: function (message) {
    console.log("BitCoin Message: ", message);
  }
});

