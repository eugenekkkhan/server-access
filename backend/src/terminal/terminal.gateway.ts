import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as pty from 'node-pty';
import { AuthService } from '../auth/auth.service';

interface TerminalSession {
  pty: pty.IPty;
}

@WebSocketGateway({
  cors: { origin: true, credentials: true },
  namespace: '/terminal',
})
export class TerminalGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private sessions = new Map<string, TerminalSession>();

  constructor(private readonly authService: AuthService) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token as string | undefined;

    if (!token || !this.authService.validateToken(token)) {
      client.emit('error', 'Unauthorized');
      client.disconnect(true);
      return;
    }

    const hostRoot = process.env.HOST_ROOT || '';
    const [spawnCmd, spawnArgs] = hostRoot
      ? ['chroot', [hostRoot, '/bin/bash', '-l']]
      : [process.env.SHELL || '/bin/bash', []];
    const cwd = '/';
    const env = {
      TERM: 'xterm-256color',
      HOME: '/root',
      PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
    } as Record<string, string>;

    const ptyProcess = pty.spawn(spawnCmd, spawnArgs, {
      name: 'xterm-256color',
      cols: 80,
      rows: 24,
      cwd,
      env,
    });

    ptyProcess.onData((data) => {
      client.emit('output', data);
    });

    ptyProcess.onExit(({ exitCode }) => {
      client.emit('exit', exitCode);
      client.disconnect(true);
    });

    this.sessions.set(client.id, { pty: ptyProcess });
    console.log(`Terminal session opened: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const session = this.sessions.get(client.id);
    if (session) {
      try {
        session.pty.kill();
      } catch {
        // already dead
      }
      this.sessions.delete(client.id);
      console.log(`Terminal session closed: ${client.id}`);
    }
  }

  @SubscribeMessage('input')
  handleInput(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    const session = this.sessions.get(client.id);
    if (session) {
      session.pty.write(data);
    }
  }

  @SubscribeMessage('resize')
  handleResize(
    @MessageBody() size: { cols: number; rows: number },
    @ConnectedSocket() client: Socket,
  ) {
    const session = this.sessions.get(client.id);
    if (session && size.cols > 0 && size.rows > 0) {
      session.pty.resize(size.cols, size.rows);
    }
  }
}
