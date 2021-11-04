import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { VideoService } from './video.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'net';
const logger = new Logger('VideoGateway');
@WebSocketGateway({ cors: true })



export class VideoGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly videoService: VideoService) {}
  private liveIntervalHandler: NodeJS.Timeout; 
  @SubscribeMessage('start-live')
  startLive(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): void {
    this.liveIntervalHandler = setInterval(()=>{
      client.emit('live',this.videoService.getFrame());
    },1000/60)
  }

  @SubscribeMessage('stop-live')
  stopLive(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): void {
    clearInterval(this.liveIntervalHandler);
    this.videoService.releaseCamera();
  }

  @SubscribeMessage('hello')
  hello(): void {
    logger.log('Hello');
  }
}
