#!/usr/bin/env bun

/**
 * A simple script to run multiple commands concurrently using Bun's subprocess API
 */

async function runConcurrently(commands) {
  const processes = commands.map((cmd) => {
    console.log(`Starting: ${cmd}`);
    return Bun.spawn({
      cmd: cmd.split(' '),
      stdout: 'inherit',
      stderr: 'inherit',
      stdin: 'inherit',
      onExit(proc, exitCode, signalCode, error) {
        if (error) {
          console.error(`Process error: ${error.message}`);
        }
        if (exitCode !== 0) {
          console.error(`Process exited with code ${exitCode}`);
        }
      },
    });
  });

  try {
    await Promise.all(processes.map((p) => p.exited));
    console.log('All processes completed');
  } catch (error) {
    console.error('Error running concurrent processes:', error);
    process.exit(1);
  }
}

// Run the watch-routes and dev server concurrently
runConcurrently(['bun run watch-routes', 'bun --hot src/index.ts']);
