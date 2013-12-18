Real-Time Graphs with PubNub and D3.js
-----------------------------------------
Example of adding real-time functionality to static D3 graphs.

![BitCoin Dashboard][1]

The source code to the PubNub blog article on how to make real-time graphs with PubNub and D3.js. To get started, clone the repository and run the example in a local static server. This can be accomplished in a number of ways:

## Grunt
The repository already contains a `Gruntfile.js` with corresponding connect server:
`npm install`
`grunt server`
Then navigate to http://localhost:9001

## Python
You can use the SimpleHTTPServer like so:
`python -m SimpleHTTPServer`
Then navigate to http://localhost:8000

[1]: http://pubnub.github.io/bitcoin/images/Bitcoin_Dashboard.png
