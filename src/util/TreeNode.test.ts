import { describe, it, expect } from "vitest";
import { TreeNode } from "./TreeNode";

class Node extends TreeNode<Node, Node, Node> {}

describe(TreeNode.name, () => {
  describe("basic traversing", () => {
    it("is correct", () => {
      const parent = new Node();
      const child0 = new Node();
      const child1 = new Node();
      const child2 = new Node();
      parent.append(child0, child1, child2);
      const child3 = new Node();
      const child4 = new Node();
      parent.insertBefore(child3, child0);
      parent.insertBefore(child4, child2);

      expect(parent.firstChild).toEqual(child3);
      expect(parent.lastChild).toEqual(child2);

      expect(child3.parent).toEqual(parent);
      expect(child3.previousSibling).toEqual(undefined);
      expect(child3.nextSibling).toEqual(child0);

      expect(child0.parent).toEqual(parent);
      expect(child0.previousSibling).toEqual(child3);
      expect(child0.nextSibling).toEqual(child1);

      expect(child1.parent).toEqual(parent);
      expect(child1.previousSibling).toEqual(child0);
      expect(child1.nextSibling).toEqual(child4);

      expect(child4.parent).toEqual(parent);
      expect(child4.previousSibling).toEqual(child1);
      expect(child4.nextSibling).toEqual(child2);

      expect(child2.parent).toEqual(parent);
      expect(child2.previousSibling).toEqual(child4);
      expect(child2.nextSibling).toEqual(undefined);

      expect(parent.children).toEqual([child3, child0, child1, child4, child2]);

      child2.remove();
      child3.remove();
      child1.remove();

      for (const child of [child1, child2, child3]) {
        expect(child.parent).toEqual(undefined);
        expect(child.previousSibling).toEqual(undefined);
        expect(child.nextSibling).toEqual(undefined);
      }

      expect(child0.parent).toEqual(parent);
      expect(child0.previousSibling).toEqual(undefined);
      expect(child0.nextSibling).toEqual(child4);

      expect(child4.parent).toEqual(parent);
      expect(child4.previousSibling).toEqual(child0);
      expect(child4.nextSibling).toEqual(undefined);

      expect(parent.children).toEqual([child0, child4]);
      expect(parent.firstChild).toEqual(child0);
      expect(parent.lastChild).toEqual(child4);

      child0.remove();
      child4.remove();

      expect(parent.children).toEqual([]);
      expect(parent.firstChild).toEqual(undefined);
      expect(parent.lastChild).toEqual(undefined);
    });
  });
  describe("children", () => {
    it("removes child automatically when child is inserted to another parent", () => {
      const parent1 = new Node();
      const parent2 = new Node();
      const child = new Node();
      parent1.append(child);
      expect(parent1.children).toEqual([child]);
      parent2.append(child);
      expect(parent1.children).toEqual([]);
      expect(parent2.children).toEqual([child]);
    });
  });

  describe("comparePosition", () => {
    it("compares positions of 2 nodes", () => {
      const a = new Node();
      const b = new Node();
      const c = new Node();
      const d = new Node();

      a.append(b, d);
      b.append(c);

      // - a
      //   - b
      //     - c
      //   - d

      expect(a.comparePosition(a)).toEqual(0);
      expect(a.comparePosition(b)).toEqual(-1);
      expect(a.comparePosition(c)).toEqual(-1);
      expect(a.comparePosition(d)).toEqual(-1);
      expect(b.comparePosition(a)).toEqual(1);
      expect(b.comparePosition(b)).toEqual(0);
      expect(b.comparePosition(c)).toEqual(-1);
      expect(b.comparePosition(d)).toEqual(-1);
      expect(c.comparePosition(a)).toEqual(1);
      expect(c.comparePosition(b)).toEqual(1);
      expect(c.comparePosition(c)).toEqual(0);
      expect(c.comparePosition(d)).toEqual(-1);
      expect(d.comparePosition(a)).toEqual(1);
      expect(d.comparePosition(b)).toEqual(1);
      expect(d.comparePosition(c)).toEqual(1);
      expect(d.comparePosition(d)).toEqual(0);
    });
  });

  describe("uniqueName", () => {
    it("auto-renames to avoid duplication", () => {
      const component = new UniqueNameRoot();
      const child0 = new UniqueNameNode("layer");
      const child1 = new UniqueNameNode("layer");
      const noNameChild0 = new UniqueNameNode("");
      const noNameChild1 = new UniqueNameNode("");

      component.append(noNameChild0);
      component.append(noNameChild1);
      component.append(child0);
      component.append(child1);

      expect(component.children.map((c) => c.name)).toEqual([
        "",
        "",
        "layer",
        "layer1",
      ]);

      component.append(child0);

      expect(component.children.map((c) => c.name)).toEqual([
        "",
        "",
        "layer1",
        "layer",
      ]);

      child1.rename("child");

      const child2 = new UniqueNameNode("child");

      component.append(child2);

      expect(component.children.map((c) => c.name)).toEqual([
        "",
        "",
        "child",
        "layer",
        "child1",
      ]);

      component.children[3].rename("child");

      expect(component.children.map((c) => c.name)).toEqual([
        "",
        "",
        "child",
        "child2",
        "child1",
      ]);

      component.append(new NonUniqueNameNode("child"));
      expect(component.children.map((c) => c.name)).toEqual([
        "",
        "",
        "child",
        "child2",
        "child1",
        "child",
      ]);
    });
  });
});

class UniqueNameRoot extends TreeNode<
  never,
  UniqueNameRoot,
  UniqueNameNode | NonUniqueNameNode
> {
  get isUniqueNameRoot(): boolean {
    return true;
  }
}

class UniqueNameNode extends TreeNode<
  UniqueNameNode | UniqueNameRoot,
  UniqueNameNode,
  UniqueNameNode | NonUniqueNameNode
> {
  constructor(name: string) {
    super();
    this.rename(name);
  }

  get hasUniqueName(): boolean {
    return true;
  }
}

class NonUniqueNameNode extends TreeNode<
  UniqueNameNode | UniqueNameRoot,
  UniqueNameNode,
  UniqueNameNode | NonUniqueNameNode
> {
  constructor(name: string) {
    super();
    this.rename(name);
  }
}
