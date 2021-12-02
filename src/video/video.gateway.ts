import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
@WebSocketGateway({ cors: true, namespace: '/video' })
export class VideoGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('LockerGateway');
  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    this.logger.log('initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`client: ${client.id} is connected`);
    client.on('disconnecting', () => {
      this.handleStopLive(client);
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`client: ${client.id} is disconnected`);
  }

  @SubscribeMessage('join')
  onJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ): void {
    this.logger.log(`client: ${client.id} join ${data.room} room`);
    client.join(data.room);
  }

  @SubscribeMessage('start_live')
  onStartLive(
    client: Socket,
    data: { lockerUid: string; camera: number },
  ): void {
    this.logger.log(`client: ${client.id} emit start_live with ${data + ''}`);
    this.server.to(data.lockerUid).emit('start_live', { camera: data.camera });
  }

  @SubscribeMessage('live')
  onLive(
    client: Socket,
    data: { lockerUid: string; camera: number; picture: string },
  ) {
    // this.logger.log(`client: ${client.id} live with ${data.toString()}`);
    client.to(`${data.lockerUid}/camera/${data.camera}`).emit('live', data);
  }

  handleStopLive(client: Socket): void {
    const rooms = Object.keys(client.rooms);
    const cameraRooms = rooms.filter((value: string) =>
      value.includes('camera'),
    );
    // console.log('cameraRooms:', cameraRooms);
    for (const cameraRoom of cameraRooms) {
      this.server.in(cameraRoom).clients((error, clients: string[]) => {
        if (!error) {
          // console.log('clients:', clients);
          if (clients.length <= 1) {
            const roomSplit = cameraRoom.split('/');
            this.server
              .to(roomSplit[0])
              .emit('stop_live', { camera: Number(roomSplit.pop()) });
          }
        } else {
          this.logger.error(`->handleStopLive error: ${error}`);
        }
      });
    }
  }
}
