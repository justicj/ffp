#!/usr/bin/env node
'use strict';

/**
 * FFP CLI – Generate Mermaid charts for flag football plays.
 *
 * Usage:
 *   node src/index.js [play-name]
 *
 * Examples:
 *   node src/index.js slant
 *   node src/index.js go-route
 *   node src/index.js          # lists available plays
 */

const { PlayDiagram } = require('./PlayDiagram');
const { PLAYS } = require('./plays/index');

const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--list') {
  console.log('Available plays:');
  for (const name of Object.keys(PLAYS)) {
    const play = PLAYS[name];
    console.log(`  ${name.padEnd(20)} – ${play.description || play.name}`);
  }
  console.log('\nUsage: node src/index.js <play-name>');
  process.exit(0);
}

if (args[0] === '--all') {
  const results = Object.values(PLAYS).map((play) => {
    const diagram = new PlayDiagram(play);
    return diagram.toMarkdown();
  });
  console.log(results.join('\n\n---\n\n'));
  process.exit(0);
}

const playName = args[0].toLowerCase();
const play = PLAYS[playName];

if (!play) {
  console.error(`Unknown play: "${playName}"`);
  console.error(`Run without arguments to see available plays.`);
  process.exit(1);
}

const diagram = new PlayDiagram(play);
console.log(diagram.toMarkdown());
