
const room = 'ROOM'
export default defineWebSocketHandler({
    open(peer) {
        peer.subscribe(room)
        peer.publish(room, {
            author: 'server',
            message: 'Another user joined the chat',
            message_id: Math.random().toString(36).substring(7)
        })
    },
    close(peer) {

    },
    error(peer, error) {

    },
    message(peer, message) {
        peer.publish(room, message.text())
    }
})
