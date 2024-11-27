/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const response = `worker response to ${data}`;
  let hoe = data.map(i => ({...i, value: Math.random() * 100}))
  
  
  postMessage(hoe);
});
