export function dfsIterative(graph: number[][], source: number): number[] {
  const visited = new Uint8Array(graph.length);
  const order: number[] = [];
  const stack: number[] = [source];

  while (stack.length > 0) {
    const v = stack.pop()!;
    if (visited[v] === 1) continue;
    visited[v] = 1;
    order.push(v);

    const neighbors = graph[v] ?? [];
    // Push in reverse so we visit in the original neighbor order
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const w = neighbors[i]!;
      if (visited[w] === 0) {
        stack.push(w);
      }
    }
  }

  return order;
}

export function dfsRecursive(graph: number[][], source: number): number[] {
  const visited = new Uint8Array(graph.length);
  const order: number[] = [];

  function visit(v: number): void {
    visited[v] = 1;
    order.push(v);
    for (const w of graph[v] ?? []) {
      if (visited[w] === 0) {
        visit(w);
      }
    }
  }

  visit(source);
  return order;
}

export function dfsAllComponents(graph: number[][]): number[][] {
  const visited = new Uint8Array(graph.length);
  const components: number[][] = [];

  function visit(v: number, component: number[]): void {
    visited[v] = 1;
    component.push(v);
    for (const w of graph[v] ?? []) {
      if (visited[w] === 0) {
        visit(w, component);
      }
    }
  }

  for (let v = 0; v < graph.length; v++) {
    if (visited[v] === 0) {
      const component: number[] = [];
      visit(v, component);
      components.push(component);
    }
  }

  return components;
}
