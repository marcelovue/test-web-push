import React from 'react'
import io from 'socket.io-client'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
  .replace(/\-/g, '+')
  .replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
export default class App extends React.Component {
  componentDidMount() {
    window.name = prompt('Type ur name')
    // window.name = 'marcleo'
    window.socket = io.connect('http://localhost:6004', {
      query: { name }
    })
    window.socket.on('connect', () => {
      console.log('U r connected, ur socket id is', socket.id)
    })

    const vapidPublicKey = 'BPccwxX5mwuaBQ-YGYDCpTHxBZuNk6sKik7OEus-ueT7YoOD4S8O97l0iIfWW1w1Z5bc89vbWKOa13XOE38ysE8'
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)
    navigator.serviceWorker.register('service-worker.js', {
      scope: '/'
    }).then((sw) => {
      sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      }).then(data => {
        console.log('registration', data)
        socket.emit('subscribe', data)
      })
    })
  }

  sendMessage() {
    let inputEL = document.querySelector('.input')
    let toEL = document.querySelector('.to')
    let message = inputEL.value
    let to = toEL.value
    if (!message || !to) return;
    socket.emit('message', {message, from: name, to})
  }
  render() {
    return(
      <React.Fragment>
        <h2>Insira sua mensagem</h2>
        <input className="input" placeholder="message"/>
        {/* <h2>Insira o socket id do alvo</h2>
        <input className="to" placeholder="to"/> */}
        <h2>Insira o nome do alvo</h2>
        <input className="to" placeholder="to"/>
        <br/>
        <button onClick={this.sendMessage}>Enviar</button>
      </React.Fragment>
    )
  }
}
