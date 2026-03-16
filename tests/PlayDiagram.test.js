'use strict';

const { PlayDiagram, ROUTE_LABELS, ROUTE_EDGE_STYLES } = require('../src/PlayDiagram');
const { PLAYS, slant, goRoute, hitch, postRoute, qbScramble } = require('../src/plays/index');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal valid play for constructor tests */
function minimalPlay(overrides = {}) {
  return Object.assign(
    {
      name: 'Test Play',
      players: [
        { id: 'C', label: 'C', role: 'center' },
        { id: 'QB', label: 'QB', role: 'quarterback' },
      ],
      actions: [{ from: 'C', to: 'QB', type: 'snap' }],
    },
    overrides
  );
}

// ---------------------------------------------------------------------------
// Constructor validation
// ---------------------------------------------------------------------------

describe('PlayDiagram constructor', () => {
  test('throws when play is null', () => {
    expect(() => new PlayDiagram(null)).toThrow('play must be a non-null object');
  });

  test('throws when play is not an object', () => {
    expect(() => new PlayDiagram('string')).toThrow('play must be a non-null object');
  });

  test('throws when name is missing', () => {
    expect(() => new PlayDiagram(minimalPlay({ name: undefined }))).toThrow(
      'play.name must be a non-empty string'
    );
  });

  test('throws when name is empty string', () => {
    expect(() => new PlayDiagram(minimalPlay({ name: '' }))).toThrow(
      'play.name must be a non-empty string'
    );
  });

  test('throws when players is empty', () => {
    expect(() => new PlayDiagram(minimalPlay({ players: [] }))).toThrow(
      'play.players must be a non-empty array'
    );
  });

  test('throws when actions is empty', () => {
    expect(() => new PlayDiagram(minimalPlay({ actions: [] }))).toThrow(
      'play.actions must be a non-empty array'
    );
  });

  test('constructs successfully with valid play', () => {
    expect(() => new PlayDiagram(minimalPlay())).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// generate() – structure and content
// ---------------------------------------------------------------------------

describe('PlayDiagram.generate()', () => {
  test('output starts with "flowchart TB"', () => {
    const d = new PlayDiagram(minimalPlay());
    expect(d.generate()).toMatch(/^flowchart TB/);
  });

  test('includes a backfield subgraph for QB', () => {
    const d = new PlayDiagram(minimalPlay());
    expect(d.generate()).toContain('subgraph backfield["Backfield"]');
  });

  test('includes a LOS subgraph for center', () => {
    const d = new PlayDiagram(minimalPlay());
    expect(d.generate()).toContain('subgraph LOS["Line of Scrimmage"]');
  });

  test('includes a receivers subgraph when WRs are present', () => {
    const d = new PlayDiagram(slant);
    expect(d.generate()).toContain('subgraph receivers["Receivers"]');
  });

  test('does not include receivers subgraph when no WRs', () => {
    const d = new PlayDiagram(minimalPlay());
    expect(d.generate()).not.toContain('subgraph receivers');
  });

  test('renders center as a circle node', () => {
    const d = new PlayDiagram(minimalPlay());
    expect(d.generate()).toContain('C((C))');
  });

  test('renders QB as a stadium node', () => {
    const d = new PlayDiagram(minimalPlay());
    expect(d.generate()).toContain('QB([QB])');
  });

  test('snap action uses a solid arrow with label "snap"', () => {
    const d = new PlayDiagram(minimalPlay());
    const chart = d.generate();
    expect(chart).toContain('C -- snap --> QB');
  });

  test('primary pass action uses a thick arrow', () => {
    const d = new PlayDiagram(slant);
    const chart = d.generate();
    // thick arrow with "pass" label: == pass ==>
    expect(chart).toMatch(/QB ==.*pass.*==> WR1_T/);
  });

  test('route actions use dashed arrows', () => {
    const d = new PlayDiagram(slant);
    const chart = d.generate();
    expect(chart).toMatch(/WR1 -.+-> WR1_T/);
    expect(chart).toMatch(/WR2 -.+-> WR2_T/);
  });

  test('target endpoint nodes are rendered as circle nodes', () => {
    const d = new PlayDiagram(slant);
    const chart = d.generate();
    expect(chart).toContain('WR1_T(( ))');
  });
});

// ---------------------------------------------------------------------------
// toMarkdown()
// ---------------------------------------------------------------------------

describe('PlayDiagram.toMarkdown()', () => {
  test('includes the play name as a heading', () => {
    const d = new PlayDiagram(slant);
    expect(d.toMarkdown()).toContain('## Slant');
  });

  test('includes the description when present', () => {
    const d = new PlayDiagram(slant);
    expect(d.toMarkdown()).toContain(slant.description);
  });

  test('wraps chart in a mermaid fenced code block', () => {
    const d = new PlayDiagram(slant);
    const md = d.toMarkdown();
    expect(md).toContain('```mermaid');
    expect(md).toContain('```');
    expect(md).toContain('flowchart TB');
  });

  test('play without description omits extra blank line', () => {
    const play = minimalPlay({ description: undefined });
    const d = new PlayDiagram(play);
    const md = d.toMarkdown();
    expect(md).toContain('## Test Play');
    expect(md).not.toContain('undefined');
  });
});

// ---------------------------------------------------------------------------
// Pre-defined plays
// ---------------------------------------------------------------------------

describe('Pre-defined plays', () => {
  const expectedPlayKeys = [
    'slant',
    'go-route',
    'hitch',
    'post',
    'qb-scramble',
    'corner-route',
    'screen-pass',
  ];

  test('PLAYS contains all expected plays', () => {
    for (const key of expectedPlayKeys) {
      expect(PLAYS).toHaveProperty(key);
    }
  });

  test.each(expectedPlayKeys)('play "%s" generates valid Mermaid chart', (key) => {
    const play = PLAYS[key];
    const d = new PlayDiagram(play);
    const chart = d.generate();
    expect(chart).toMatch(/^flowchart TB/);
    // Every play must have a snap
    expect(chart).toContain('snap');
    // Every play must have at least one primary ball-movement action
    expect(chart).toMatch(/==.*==>/);
  });

  test('slant play contains WR1, WR2, WR3 nodes', () => {
    const d = new PlayDiagram(slant);
    const chart = d.generate();
    expect(chart).toContain('WR1([WR1])');
    expect(chart).toContain('WR2([WR2])');
    expect(chart).toContain('WR3([WR3])');
  });

  test('hitch play contains SL (slot) node', () => {
    const d = new PlayDiagram(hitch);
    const chart = d.generate();
    expect(chart).toContain('SL([SL])');
  });

  test('go-route play includes go route for WR1', () => {
    const d = new PlayDiagram(goRoute);
    const chart = d.generate();
    expect(chart).toMatch(/WR1 -.* go .*-> WR1_T/);
  });

  test('qb-scramble play includes scramble action for QB', () => {
    const d = new PlayDiagram(qbScramble);
    const chart = d.generate();
    expect(chart).toMatch(/QB ==.*scramble.*==> QB_T/);
  });

  test('post play includes post and cross routes', () => {
    const d = new PlayDiagram(postRoute);
    const chart = d.generate();
    expect(chart).toMatch(/WR1 -.* post .*-> WR1_T/);
    expect(chart).toMatch(/SL -.* cross .*-> SL_T/);
  });
});

// ---------------------------------------------------------------------------
// ROUTE_LABELS and ROUTE_EDGE_STYLES exports
// ---------------------------------------------------------------------------

describe('ROUTE_LABELS', () => {
  test('contains standard route names', () => {
    const routes = ['snap', 'go', 'slant', 'out', 'in', 'curl', 'hitch', 'post', 'corner', 'cross', 'flat', 'screen'];
    for (const r of routes) {
      expect(ROUTE_LABELS).toHaveProperty(r);
    }
  });
});

describe('ROUTE_EDGE_STYLES', () => {
  test('snap uses solid style', () => {
    expect(ROUTE_EDGE_STYLES.snap).toBe('solid');
  });

  test('pass uses thick style', () => {
    expect(ROUTE_EDGE_STYLES.pass).toBe('thick');
  });

  test('slant uses dashed style', () => {
    expect(ROUTE_EDGE_STYLES.slant).toBe('dashed');
  });
});
