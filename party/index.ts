import type * as Party from "partykit/server";

export default class DashboardServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(`Connected: id ${conn.id} room ${this.room.id} url ${new URL(ctx.request.url).pathname}`);

    // We could load initial state from Durable Objects here in the future
    // For now, we rely on the TV sending its state upon connection if it has it.
  }

  onMessage(message: string, sender: Party.Connection) {
    // Let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);

    // Broadcast the received message to all OTHER connected clients in this room
    this.room.broadcast(message, [sender.id]);
  }
}
