const io = window.io
const id = window.__id
const socket = io()

start()

function start() {
  startSyncNote()
  startMonitorNetwork()
}

function startMonitorNetwork() {
  let events = {
    'connect':'',
    'reconnect': '',
    'reconnect_attempt': 'Connection lost',
    'connect_error': 'Connection lost',
    'connect_timeout': 'Connection lost',
    'reconnect_error': 'Connection lost',
    'reconnect_failed': 'Connection lost',
  }
  let status = document.getElementById('network-status')

  Object.keys(events).forEach(evt => socket.on(evt, function() {
    status.textContent = events[evt]
  }))
}

function startSyncNote() {
  const editor = document.getElementById('editor')
  let status = document.getElementById('save-status')
  let timer

  editor.addEventListener('input', throttle(e => {
    save(e.target.value)
  }, 500))

  function save(note) {
    clearTimeout(timer)
    status.classList.add('show')
    socket.emit('save', JSON.stringify({ id, note }), function (rsp) {
      if (rsp && rsp.code === 'success') {
        setTimeout(() => status.classList.remove('show') , 2000)
      }
    })
  }

  function throttle(fn, delay) {
    let timer
    return function timerThrottled(...args) {
      clearTimeout(timer)
      timer = setTimeout(function() {
        fn(...args)
      }, delay)
    }
  }
}

