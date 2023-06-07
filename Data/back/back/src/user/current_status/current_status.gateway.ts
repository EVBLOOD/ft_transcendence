import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketAuthGuard } from 'src/authenticator/socket.guard';
import { UserService } from '../user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatorService } from 'src/authenticator/authenticator.service';

@WebSocketGateway({namespace: 'current_status'})
export class CurrentStatusGateway {

  constructor( private readonly SaveStatus : UserService,
              private readonly serviceJWt: JwtService,
              private readonly serviceToken : AuthenticatorService) {}

  @WebSocketServer()
  myserver: Server;

  async handleConnection(client: Socket, ...args: any[])
  {
    if (!client.handshake.headers.authorization)
    {
      client.disconnect()
      return false;
    }
    const xyz : any =  this.serviceJWt.decode(client.handshake.headers.authorization);
    if (!xyz || await this.serviceToken.IsSame(xyz.sub || "", client.handshake.headers.authorization) ==  false)
    {
        client.disconnect()
        return false;
    }
    this.SaveStatus.AddState(xyz.sub, client, 'Online');
    this.myserver.emit('status', this.SaveStatus.GetCurrentStateAll())
    return 'He is Online';
  }
    
  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('Online')
  async handleOnline(client: any, payload: any) {
    if (!client.handshake.headers.authorization)
    {
      client.disconnect()
      return false;
    }
    const xyz : any =  this.serviceJWt.decode(client.handshake.headers.authorization);
    if (!xyz || await this.serviceToken.IsSame(xyz.sub || "", client.handshake.headers.authorization) ==  false)
    {
        client.disconnect()
        return false;
    }
    this.SaveStatus.AddState(xyz.sub, client, 'Online');
    this.myserver.emit('status', this.SaveStatus.GetCurrentStateAll())
    return 'He is Online';
  }

  @SubscribeMessage('Offline')
  async handleOffline(client: any, payload: any) {
    if (!client.handshake.headers.authorization)
    {
      client.disconnect()
      return false;
    }
    const xyz : any =  this.serviceJWt.decode(client.handshake.headers.authorization);
    if (!xyz || await this.serviceToken.IsSame(xyz.sub || "", client.handshake.headers.authorization) ==  false)
    {
        client.disconnect()
        return false;
    }
    this.SaveStatus.RemoveState(client, xyz.sub);
    this.myserver.emit('status', this.SaveStatus.GetCurrentStateAll())
    return 'Tab Disconnect';
  }

  @SubscribeMessage('InGame')
  async handleInGame(client: any, payload: any) {
       if (!client.handshake.headers.authorization)
    {
      client.disconnect()
      return false;
    }
    const xyz : any =  this.serviceJWt.decode(client.handshake.headers.authorization);
    if (!xyz || await this.serviceToken.IsSame(xyz.sub || "", client.handshake.headers.authorization) ==  false)
    {
        client.disconnect()
        return false;
    }
    this.SaveStatus.AddState(xyz.sub, client, 'InGame');
    this.myserver.emit('status', this.SaveStatus.GetCurrentStateAll())
    return 'He is InGame';
  }

  @SubscribeMessage('IsWriting')
  async handleIsWriting(client: any, payload: any) {
       if (!client.handshake.headers.authorization)
    {
      client.disconnect()
      return false;
    }
    const xyz : any =  this.serviceJWt.decode(client.handshake.headers.authorization);
    if (!xyz || await this.serviceToken.IsSame(xyz.sub || "", client.handshake.headers.authorization) ==  false)
    {
        client.disconnect()
        return false;
    }
    this.SaveStatus.AddState(xyz.sub, client, 'IsWriting');
    this.myserver.emit('status', this.SaveStatus.GetCurrentStateAll())
    return 'He is IsWriting';
  }

  @SubscribeMessage('InConv')
  async handleInConv(client: any, payload: any) {
       if (!client.handshake.headers.authorization)
    {
      client.disconnect()
      return false;
    }
    const xyz : any =  this.serviceJWt.decode(client.handshake.headers.authorization);
    if (!xyz || await this.serviceToken.IsSame(xyz.sub || "", client.handshake.headers.authorization) ==  false)
    {
        client.disconnect()
        return false;
    }
    this.SaveStatus.AddState(xyz.sub, client, 'InConv');
    this.myserver.emit('status', this.SaveStatus.GetCurrentStateAll())
    return 'He is InConv';
  }

  @SubscribeMessage('Disconnect')
  async handleTyping(client: any, payload: any) {
       if (!client.handshake.headers.authorization)
    {
      client.disconnect()
      return false;
    }
    const xyz : any =  this.serviceJWt.decode(client.handshake.headers.authorization);
    if (!xyz || await this.serviceToken.IsSame(xyz.sub || "", client.handshake.headers.authorization) ==  false)
    {
        client.disconnect()
        return false;
    }
    this.SaveStatus.PruneUserState(xyz.sub);
    this.myserver.emit('status', this.SaveStatus.GetCurrentStateAll())
    return 'Hello world!';
  }
  async handleDisconnect(client: Socket)
  {
    if (!client.handshake.headers.authorization)
    {
      client.disconnect()
      return false;
    }
    const xyz : any =  this.serviceJWt.decode(client.handshake.headers.authorization);
    if (!xyz || await this.serviceToken.IsSame(xyz.sub || "", client.handshake.headers.authorization) ==  false)
    {
        client.disconnect()
        return false;
    }
    this.SaveStatus.RemoveState(client, xyz.sub);
    this.myserver.emit('status', this.SaveStatus.GetCurrentStateAll())
    return 'Tab Disconnect';
  }
}
