import { createServer } from 'net';
import { createTunnel } from 'tunnel-ssh';
import { config } from 'dotenv';
import { writeFileSync } from 'fs';

config({
  path: '.env',
});

function getAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer().listen(startPort);
    server.on('listening', () => {
      server.once('close', () => {
        resolve(startPort);
      });
      server.close();
    });
    server.on('error', (err) => {
      if (startPort >= 65535) {
        reject(new Error(`No available port`));
      } else {
        getAvailablePort(startPort + 1).then(resolve, reject);
      }
    });
  });
}

type TunnelConfig = {
  host: string;
  port: number;
  ssh: {
    username: string;
    password: string;
    host: string;
    port: number;
  };
};

async function sshTunnel({
  host,
  port,
  ssh: sshConfig,
}: TunnelConfig): Promise<number> {
  const availablePort = await getAvailablePort(49152);

  const [server] = await createTunnel(
    {
      autoClose: false,
    },
    {
      port: availablePort,
    },
    sshConfig,
    {
      srcAddr: 'localhost',
      srcPort: availablePort,
      dstAddr: host,
      dstPort: port,
    },
  );

  if (!server.listening) throw new Error('SSH Tunnel failed to start');

  server.on('connection', (stream) => {
    stream.once('close', () => {
      console.log(`SSH Tunnel disconnected ${stream.remotePort}`);
    });
    console.log(`SSH Tunnel connected ${stream.remotePort}`);
  });

  return availablePort;
}

sshTunnel({
  host: process.env.DB_ENDPOINT,
  port: parseInt(process.env.DB_PORT),
  ssh: {
    username: process.env.SSH_USERNAME,
    password: process.env.SSH_PASSWORD,
    host: process.env.SSH_HOST,
    port: parseInt(process.env.SSH_PORT),
  },
}).then((port) => {
  writeFileSync('.env.tunnel', `SSH_TUNNEL_PORT=${port}`, 'utf-8');
});
