# sse-now 

> A simple node sever with SSE.


## Usage:

```js
var source = new EventSource('https://sse.now.sh');
source.onmessage = function(e) {
  console.log(e.data);
};
```

Feel free to check out the [demo](https://jsbin.com/qenumuw/edit?html,js,output)

## License

MIT © [Hemanth.HM](https://h3manth.com)
