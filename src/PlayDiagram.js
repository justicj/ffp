'use strict';

/**
 * Supported route types and their Mermaid label
 */
const ROUTE_LABELS = {
  snap: 'snap',
  go: 'go',
  slant: 'slant',
  out: 'out',
  in: 'in',
  curl: 'curl',
  hitch: 'hitch',
  corner: 'corner',
  post: 'post',
  cross: 'cross',
  flat: 'flat',
  screen: 'screen',
  scramble: 'scramble',
  pass: 'pass',
  run: 'run',
  sweep: 'sweep',
};

/**
 * Player roles and the Mermaid node shape to use for them
 */
const ROLE_SHAPES = {
  center: 'circle',      // (( ))
  quarterback: 'stadium', // ([ ])
  wide_receiver: 'stadium',
  running_back: 'stadium',
  tight_end: 'stadium',
  slot: 'stadium',
};

/**
 * Edge style per route type
 * - 'solid'  → -->
 * - 'dashed' → -.->
 * - 'thick'  → ==>
 */
const ROUTE_EDGE_STYLES = {
  snap: 'solid',
  pass: 'thick',
  run: 'thick',
  sweep: 'thick',
  go: 'dashed',
  slant: 'dashed',
  out: 'dashed',
  in: 'dashed',
  curl: 'dashed',
  hitch: 'dashed',
  corner: 'dashed',
  post: 'dashed',
  cross: 'dashed',
  flat: 'dashed',
  screen: 'dashed',
  scramble: 'dashed',
};

/**
 * Returns the Mermaid arrow string for the given edge style.
 * @param {string} style - 'solid' | 'dashed' | 'thick'
 * @param {string} label - optional label on the arrow
 * @returns {string}
 */
function arrow(style, label) {
  const lbl = label ? ` ${label} ` : '';
  switch (style) {
    case 'thick':
      return label ? `==${lbl}==>` : '==>';
    case 'dashed':
      return label ? `-. ${label} .->` : '-..->';
    case 'solid':
    default:
      return label ? `-- ${label} -->` : '-->';
  }
}

/**
 * Returns the Mermaid node string for a player.
 * @param {object} player
 * @returns {string}
 */
function playerNode(player) {
  const shape = ROLE_SHAPES[player.role] || 'stadium';
  const label = player.label || player.id;
  if (shape === 'circle') {
    return `${player.id}((${label}))`;
  }
  return `${player.id}([${label}])`;
}

/**
 * PlayDiagram generates a Mermaid flowchart for a flag football play.
 *
 * Play schema:
 * {
 *   name: string,
 *   description?: string,
 *   players: Array<{
 *     id: string,
 *     label?: string,
 *     role: 'center'|'quarterback'|'wide_receiver'|'running_back'|'tight_end'|'slot',
 *     side?: 'left'|'right'|'middle'|'slot_left'|'slot_right',
 *   }>,
 *   actions: Array<{
 *     from: string,       // player id
 *     to: string,         // player id OR target id (will be rendered as a destination node)
 *     type: string,       // route/action type (see ROUTE_LABELS)
 *     primary?: boolean,  // if true, bold arrow marks this as the primary target/ball path
 *   }>,
 * }
 */
class PlayDiagram {
  constructor(play) {
    if (!play || typeof play !== 'object') {
      throw new Error('play must be a non-null object');
    }
    if (!play.name || typeof play.name !== 'string') {
      throw new Error('play.name must be a non-empty string');
    }
    if (!Array.isArray(play.players) || play.players.length === 0) {
      throw new Error('play.players must be a non-empty array');
    }
    if (!Array.isArray(play.actions) || play.actions.length === 0) {
      throw new Error('play.actions must be a non-empty array');
    }
    this.play = play;
  }

  /**
   * Returns all player ids referenced in actions (both from and to fields).
   * Destination ids that are not player ids are treated as target endpoints.
   * @returns {Set<string>}
   */
  _playerIds() {
    return new Set(this.play.players.map((p) => p.id));
  }

  /**
   * Returns all target endpoint ids: action `to` values that are not player ids.
   * @returns {Set<string>}
   */
  _targetIds() {
    const playerIds = this._playerIds();
    const targets = new Set();
    for (const action of this.play.actions) {
      if (!playerIds.has(action.to)) {
        targets.add(action.to);
      }
    }
    return targets;
  }

  /**
   * Generates the Mermaid flowchart string for the play.
   * @returns {string}
   */
  generate() {
    const lines = [];
    lines.push('flowchart TB');

    // --- Subgraph: backfield (QB / RB) ---
    const backfieldPlayers = this.play.players.filter((p) =>
      ['quarterback', 'running_back'].includes(p.role)
    );
    if (backfieldPlayers.length > 0) {
      lines.push('    subgraph backfield["Backfield"]');
      for (const p of backfieldPlayers) {
        lines.push(`        ${playerNode(p)}`);
      }
      lines.push('    end');
    }

    // --- Subgraph: line of scrimmage (center, TE, OL) ---
    const losPlayers = this.play.players.filter((p) =>
      ['center', 'tight_end'].includes(p.role)
    );
    if (losPlayers.length > 0) {
      lines.push('    subgraph LOS["Line of Scrimmage"]');
      for (const p of losPlayers) {
        lines.push(`        ${playerNode(p)}`);
      }
      lines.push('    end');
    }

    // --- Subgraph: receivers ---
    const receiverPlayers = this.play.players.filter((p) =>
      ['wide_receiver', 'slot'].includes(p.role)
    );
    if (receiverPlayers.length > 0) {
      lines.push('    subgraph receivers["Receivers"]');
      for (const p of receiverPlayers) {
        lines.push(`        ${playerNode(p)}`);
      }
      lines.push('    end');
    }

    // --- Target endpoint nodes ---
    const targetIds = this._targetIds();
    for (const tid of targetIds) {
      lines.push(`    ${tid}(( ))`);
    }

    // --- Actions (edges) ---
    for (const action of this.play.actions) {
      const routeLabel = ROUTE_LABELS[action.type] || action.type;
      const baseStyle = ROUTE_EDGE_STYLES[action.type] || 'solid';
      // primary targets get a thick arrow regardless of base style
      const style = action.primary ? 'thick' : baseStyle;
      const edgeStr = arrow(style, routeLabel);
      lines.push(`    ${action.from} ${edgeStr} ${action.to}`);
    }

    return lines.join('\n');
  }

  /**
   * Wraps the generated chart in a Markdown fenced code block with the play name as heading.
   * @returns {string}
   */
  toMarkdown() {
    const chart = this.generate();
    const parts = [`## ${this.play.name}`];
    if (this.play.description) {
      parts.push(this.play.description);
      parts.push('');
    }
    parts.push('```mermaid');
    parts.push(chart);
    parts.push('```');
    return parts.join('\n');
  }
}

module.exports = { PlayDiagram, ROUTE_LABELS, ROUTE_EDGE_STYLES };
