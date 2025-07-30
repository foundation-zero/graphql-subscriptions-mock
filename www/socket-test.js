function subscribeToGraphQL() {
  const socket = new WebSocket('ws://localhost:8080/graphql');

  socket.onopen = () => {
    console.log('WebSocket connection established');
    socket.send(
      JSON.stringify({
        type: 'subscribe',
        payload: {
          operationName: 'SubscribeToSomething',
          variables: {},
        },
        query: `
        subscription {
          SubscribeToSomething {
            data
          }
        }
      `,
      }),
    );
  };

  socket.onmessage = (event) => {
    const { payload } = JSON.parse(event.data);
    document.querySelector('#output').textContent = JSON.stringify(payload.data);
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };
}

subscribeToGraphQL();
