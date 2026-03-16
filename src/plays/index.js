'use strict';

/**
 * Pre-defined flag football plays.
 * Each play follows the PlayDiagram schema.
 */

const slant = {
  name: 'Slant',
  description:
    'WR1 (left) and WR2 (right) run crossing slant routes. The QB looks to WR1 first.',
  players: [
    { id: 'C', label: 'C', role: 'center' },
    { id: 'QB', label: 'QB', role: 'quarterback' },
    { id: 'WR1', label: 'WR1', role: 'wide_receiver', side: 'left' },
    { id: 'WR2', label: 'WR2', role: 'wide_receiver', side: 'right' },
    { id: 'WR3', label: 'WR3', role: 'wide_receiver', side: 'slot_left' },
  ],
  actions: [
    { from: 'C', to: 'QB', type: 'snap' },
    { from: 'WR1', to: 'WR1_T', type: 'slant' },
    { from: 'WR2', to: 'WR2_T', type: 'slant' },
    { from: 'WR3', to: 'WR3_T', type: 'flat' },
    { from: 'QB', to: 'WR1_T', type: 'pass', primary: true },
  ],
};

const goRoute = {
  name: 'Go Route',
  description:
    'WR1 runs a deep go (fly) route down the sideline. WR2 runs a short out as a check-down.',
  players: [
    { id: 'C', label: 'C', role: 'center' },
    { id: 'QB', label: 'QB', role: 'quarterback' },
    { id: 'WR1', label: 'WR1', role: 'wide_receiver', side: 'left' },
    { id: 'WR2', label: 'WR2', role: 'wide_receiver', side: 'right' },
    { id: 'WR3', label: 'WR3', role: 'wide_receiver', side: 'slot_right' },
  ],
  actions: [
    { from: 'C', to: 'QB', type: 'snap' },
    { from: 'WR1', to: 'WR1_T', type: 'go', primary: false },
    { from: 'WR2', to: 'WR2_T', type: 'out' },
    { from: 'WR3', to: 'WR3_T', type: 'curl' },
    { from: 'QB', to: 'WR1_T', type: 'pass', primary: true },
  ],
};

const hitch = {
  name: 'Hitch',
  description:
    'All receivers run short hitch routes, turning back to the QB after 5 yards. Quick release play.',
  players: [
    { id: 'C', label: 'C', role: 'center' },
    { id: 'QB', label: 'QB', role: 'quarterback' },
    { id: 'WR1', label: 'WR1', role: 'wide_receiver', side: 'left' },
    { id: 'WR2', label: 'WR2', role: 'wide_receiver', side: 'right' },
    { id: 'SL', label: 'SL', role: 'slot', side: 'slot_left' },
  ],
  actions: [
    { from: 'C', to: 'QB', type: 'snap' },
    { from: 'WR1', to: 'WR1_T', type: 'hitch' },
    { from: 'WR2', to: 'WR2_T', type: 'hitch' },
    { from: 'SL', to: 'SL_T', type: 'hitch', primary: false },
    { from: 'QB', to: 'SL_T', type: 'pass', primary: true },
  ],
};

const postRoute = {
  name: 'Post',
  description:
    'WR1 runs a post route toward the middle of the field. WR2 clears with a go route.',
  players: [
    { id: 'C', label: 'C', role: 'center' },
    { id: 'QB', label: 'QB', role: 'quarterback' },
    { id: 'WR1', label: 'WR1', role: 'wide_receiver', side: 'left' },
    { id: 'WR2', label: 'WR2', role: 'wide_receiver', side: 'right' },
    { id: 'SL', label: 'SL', role: 'slot', side: 'slot_right' },
  ],
  actions: [
    { from: 'C', to: 'QB', type: 'snap' },
    { from: 'WR1', to: 'WR1_T', type: 'post' },
    { from: 'WR2', to: 'WR2_T', type: 'go' },
    { from: 'SL', to: 'SL_T', type: 'cross' },
    { from: 'QB', to: 'WR1_T', type: 'pass', primary: true },
  ],
};

const qbScramble = {
  name: 'QB Scramble',
  description:
    'QB takes the snap and scrambles outside while receivers clear the middle.',
  players: [
    { id: 'C', label: 'C', role: 'center' },
    { id: 'QB', label: 'QB', role: 'quarterback' },
    { id: 'WR1', label: 'WR1', role: 'wide_receiver', side: 'left' },
    { id: 'WR2', label: 'WR2', role: 'wide_receiver', side: 'right' },
    { id: 'SL', label: 'SL', role: 'slot', side: 'slot_left' },
  ],
  actions: [
    { from: 'C', to: 'QB', type: 'snap' },
    { from: 'WR1', to: 'WR1_T', type: 'go' },
    { from: 'WR2', to: 'WR2_T', type: 'go' },
    { from: 'SL', to: 'SL_T', type: 'out' },
    { from: 'QB', to: 'QB_T', type: 'scramble', primary: true },
  ],
};

const cornerRoute = {
  name: 'Corner Route',
  description:
    'WR1 runs a corner route to the back pylon. WR2 runs an in route as an underneath option.',
  players: [
    { id: 'C', label: 'C', role: 'center' },
    { id: 'QB', label: 'QB', role: 'quarterback' },
    { id: 'WR1', label: 'WR1', role: 'wide_receiver', side: 'left' },
    { id: 'WR2', label: 'WR2', role: 'wide_receiver', side: 'right' },
    { id: 'TE', label: 'TE', role: 'tight_end', side: 'right' },
  ],
  actions: [
    { from: 'C', to: 'QB', type: 'snap' },
    { from: 'WR1', to: 'WR1_T', type: 'corner' },
    { from: 'WR2', to: 'WR2_T', type: 'in' },
    { from: 'TE', to: 'TE_T', type: 'flat' },
    { from: 'QB', to: 'WR1_T', type: 'pass', primary: true },
  ],
};

const screenPass = {
  name: 'Screen Pass',
  description:
    'Quick dump-off screen to the slot receiver behind the line of scrimmage.',
  players: [
    { id: 'C', label: 'C', role: 'center' },
    { id: 'QB', label: 'QB', role: 'quarterback' },
    { id: 'WR1', label: 'WR1', role: 'wide_receiver', side: 'left' },
    { id: 'WR2', label: 'WR2', role: 'wide_receiver', side: 'right' },
    { id: 'SL', label: 'SL', role: 'slot', side: 'slot_left' },
  ],
  actions: [
    { from: 'C', to: 'QB', type: 'snap' },
    { from: 'WR1', to: 'WR1_T', type: 'go' },
    { from: 'WR2', to: 'WR2_T', type: 'go' },
    { from: 'SL', to: 'SL_T', type: 'screen' },
    { from: 'QB', to: 'SL_T', type: 'pass', primary: true },
  ],
};

/** Map of play name (lowercase, spaces→hyphens) → play object */
const PLAYS = {
  slant,
  'go-route': goRoute,
  hitch,
  post: postRoute,
  'qb-scramble': qbScramble,
  'corner-route': cornerRoute,
  'screen-pass': screenPass,
};

module.exports = {
  PLAYS,
  slant,
  goRoute,
  hitch,
  postRoute,
  qbScramble,
  cornerRoute,
  screenPass,
};
