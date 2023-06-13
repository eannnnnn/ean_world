import { createServer } from 'net';
import { createTunnel } from 'tunnel-ssh';

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

export async function sshTunnel({
  host,
  port,
  ssh: sshConfig,
}: TunnelConfig): Promise<number> {
  const availablePort = await getAvailablePort(49152);

  const [server] = await createTunnel(
    {
      autoClose: true,
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

  console.info(`SSH Tunnel started on port ${availablePort}`);
  return availablePort;
}
