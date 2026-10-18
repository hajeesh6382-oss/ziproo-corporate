const { spawn } = require('child_process');

function startTunnel() {
  console.log('Starting localtunnel for ziproo on port 3000...');
  const lt = spawn('npx.cmd', ['-y', 'localtunnel', '--port', '3000', '--subdomain', 'ziproo'], {
    shell: true,
    stdio: 'inherit'
  });

  lt.on('close', (code) => {
    console.log(`localtunnel exited with code ${code}, restarting in 2 seconds...`);
    setTimeout(startTunnel, 2000);
  });

  lt.on('error', (err) => {
    console.error('localtunnel error:', err);
    setTimeout(startTunnel, 2000);
  });
}

startTunnel();
