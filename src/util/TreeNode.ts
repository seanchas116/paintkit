import { isEqual } from "lodash-es";
import { observable, computed, makeObservable } from "mobx";
import shortUUID from "short-uuid";
import { TypedEmitter } from "tiny-typed-emitter";
import { listDiff } from "./ListDiff";
import { getIncrementalUniqueName } from "./Name";
import { ValidationResult } from "./ValidationResult";

export interface TreeNodeInsertRemoveOptions {
  force?: boolean;
}

export interface TreeNodeOptions {
  key?: string;
}

interface TreeNodeEvent<Child> {
  didInsertBefore(child: Child, next: Child | undefined): void;
  didRemoveChild(child: Child): void;
}

export abstract class TreeNode<
  Parent extends TreeNode<any, any, any>,
  Self extends TreeNode<Parent, Self, Child>,
  Child extends TreeNode<any, any, any>
> extends TypedEmitter<TreeNodeEvent<Child>> {
  constructor(options: TreeNodeOptions = {}) {
    super();
    makeObservable(this);
    this.key = options.key ?? shortUUID.generate();
    if (this.isUniqueNameRoot) {
      this.nameScope = new TreeNode.NameScope();
    }
  }

  readonly key: string;

  /// Name

  private static NameScope = class {
    private readonly layers = observable.map<string, TreeNode<any, any, any>>();

    add(value: TreeNode<any, any, any>): void {
      if (value.currentNameScope !== this) {
        return;
      }

      this.addSelf(value);
      for (const child of value.children) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.add(child);
      }
    }

    private addSelf(value: TreeNode<any, any, any>): void {
      if (!value.name) {
        return;
      }

      const oldName = value._name;
      const name = getIncrementalUniqueName(
        new Set(this.layers.keys()),
        oldName
      );
      value._name = name;
      this.layers.set(name, value);
    }

    get(name: string): TreeNode<any, any, any> | undefined {
      return this.layers.get(name);
    }

    rename(value: TreeNode<any, any, any>, newName: string): void {
      this.deleteSelf(value);
      value._name = newName;
      this.addSelf(value);
    }

    delete(value: TreeNode<any, any, any>): void {
      if (value.currentNameScope !== this) {
        return;
      }
      if (!value.name) {
        return;
      }

      this.deleteSelf(value);
      for (const child of value.children) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.delete(child);
      }
    }

    private deleteSelf(value: TreeNode<any, any, any>): void {
      this.layers.delete(value._name);
    }
  };

  @observable private _name = "";

  /**
   * The name of this node.
   *
   * If `hasUniqueName` is true and there is an ancestor with `isUniqueNameRoot === true`,
   * this value will be unique in the scope of the ancestor.
   *
   * To ensure uniqueness, the name of this node and its descendants may be
   * automatically renamed when the node is added to a new parent.
   */
  get name(): string {
    return this._name;
  }

  /**
   * Changes the name of this node.
   *
   * If the name must be unique and the new name is already used by another node,
   * the name will automatically be changed to a unique name by appending or incrementing a suffix number.
   */
  rename(name: string): void {
    const { currentNameScope } = this;
    if (currentNameScope) {
      currentNameScope.rename(this, name);
    } else {
      this._name = name;
    }
  }

  private readonly nameScope:
    | InstanceType<typeof TreeNode.NameScope>
    | undefined;

  private get currentNameScope():
    | InstanceType<typeof TreeNode.NameScope>
    | undefined {
    if (!this.hasUniqueName) {
      return;
    }

    let ancestor: TreeNode<any, any, any> | undefined = this.parent;
    while (ancestor) {
      if (ancestor.isUniqueNameRoot) {
        return ancestor.nameScope;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ancestor = ancestor.parent;
    }
  }

  /**
   * If `isUniqueNameRoot` is true, the names of the descendants with `hasUniqueName === true` will be unique.
   * The root element (this) is excluded from the unique name scope.
   *
   * This property is overridable.
   */
  get isUniqueNameRoot(): boolean {
    return false;
  }

  /**
   * Whether the name of this node is added to the unique name scope.
   * If false, the uniqueness of the unique name is not guaranteed.
   *
   * This property is overridable.
   */
  get hasUniqueName(): boolean {
    return false;
  }

  /**
   * If `isUniqueNameRoot` is true, returns a descendant node with the given name.
   * @param name
   * @returns
   */
  getDescendantByName(name: string): TreeNode<any, any, any> | undefined {
    return this.nameScope?.get(name);
  }

  //// Parent and children

  get parent(): Parent | undefined {
    return this._parent;
  }
  @observable private _parent: Parent | undefined = undefined;

  @observable private _nextSibling: Self | undefined = undefined;
  get nextSibling(): Self | undefined {
    return this._nextSibling;
  }
  @observable private _previousSibling: Self | undefined = undefined;
  get previousSibling(): Self | undefined {
    return this._previousSibling;
  }
  @observable private _firstChild: Child | undefined = undefined;
  get firstChild(): Child | undefined {
    return this._firstChild;
  }
  @observable private _lastChild: Child | undefined = undefined;
  get lastChild(): Child | undefined {
    return this._lastChild;
  }

  get isEmpty(): boolean {
    return !this.firstChild;
  }

  @computed.struct get children(): readonly Child[] {
    const children: Child[] = [];
    let node = this.firstChild;
    while (node) {
      children.push(node);
      node = node.nextSibling as Child | undefined;
    }
    return children;
  }

  get canHaveChildren(): ValidationResult {
    return {
      value: true,
    };
  }

  canRemoveChild(child: Child): ValidationResult {
    return { value: true };
  }
  canInsertChild(child: Child): ValidationResult {
    const canHaveChildren = this.canHaveChildren;
    if (!canHaveChildren.value) {
      return canHaveChildren;
    }
    return { value: true };
  }

  canRemove(): ValidationResult {
    if (!this.parent) {
      return { value: true };
    }
    return this.parent.canRemoveChild(this);
  }

  /**
   * Remove this node from the parent.
   */
  remove({ force }: TreeNodeInsertRemoveOptions = {}): void {
    const parent = this.parent;
    if (!parent) {
      return;
    }
    if (!force) {
      const canRemove = parent.canRemoveChild(this);
      if (!canRemove.value) {
        throw new Error(`Cannot remove: ${canRemove.error}`);
      }
    }

    this.currentNameScope?.delete(this);

    //console.log("remove", this);
    const previous = this._previousSibling;
    const next = this._nextSibling;

    if (previous) {
      previous._nextSibling = next;
    } else {
      parent._firstChild = next;
    }
    if (next) {
      next._previousSibling = previous;
    } else {
      parent._lastChild = previous;
    }
    this._parent = undefined;
    this._previousSibling = undefined;
    this._nextSibling = undefined;

    parent.emit("didRemoveChild", this);
  }

  /**
   * Insert a node before a reference node, which is a child of the parent node.
   * @param child The node to be inserted
   * @param next The node before which the new child is inserted (undefined to append the child)
   */
  insertBefore(
    child: Child,
    next: Child | undefined,
    { force }: TreeNodeInsertRemoveOptions = {}
  ): void {
    if (child === next) {
      return;
    }

    if (child.includes(this)) {
      throw new Error("Cannot insert node to its descendant");
    }

    if (!force) {
      const canInsert = this.canInsertChild(child);
      if (!canInsert.value) {
        throw new Error(`Cannot insert child: ${canInsert.error}`);
      }
    }

    //console.log("insertBefore", this, child, ref);
    if (child.parent) {
      // Do force remove if parent is same (safe to remove)
      child.remove({ force: force || child.parent === this });
    }

    if (next && next.parent !== this) {
      throw new Error("The ref node is not a child of this node");
    }
    if (next) {
      const prev = next.previousSibling as Child | undefined;
      child._previousSibling = prev;
      child._nextSibling = next;
      next._previousSibling = child;
      if (prev) {
        prev._nextSibling = child;
      } else {
        this._firstChild = child;
      }
    } else {
      child._previousSibling = this.lastChild;
      if (child._previousSibling) {
        (child._previousSibling as TreeNode<any, any, any>)._nextSibling =
          child;
      }
      child._nextSibling = undefined;
      this._lastChild = child;
      if (!this._firstChild) {
        this._firstChild = child;
      }
    }
    child._parent = this;

    child.currentNameScope?.add(child);

    this.emit("didInsertBefore", child, next);
  }

  /**
   * Appends the nodes as children.
   * @param children
   */
  append(...children: Child[]): void {
    for (const child of children) {
      this.insertBefore(child, undefined);
    }
  }

  /**
   * Replace the existing children with specified nodes.
   * @param children
   */
  replaceChildren(
    children: readonly Child[],
    options: TreeNodeInsertRemoveOptions = {}
  ): void {
    const oldChildren = this.children;
    if (isEqual(oldChildren, children)) {
      return;
    }

    // Remove deleted children first to avoid name conflict
    const childSet = new Set(children);
    const removedChilds = oldChildren.filter((c) => !childSet.has(c));
    for (const child of removedChilds) {
      child.remove(options);
    }

    const diffs = listDiff(this.children, children);
    for (const diff of diffs) {
      if (diff.type === "insert") {
        this.insertBefore(diff.value, diff.before, options);
      } else {
        diff.value.remove(options);
      }
    }
  }

  clear(): void {
    while (this.firstChild) {
      this.firstChild.remove();
    }
  }

  // Utility

  includes(other: TreeNode<any, any, any>): boolean {
    return other.getAncestors().includes(this);
  }

  forEachDescendant(callback: (node: TreeNode<any, any, any>) => void): void {
    callback(this);
    for (const child of this.children) {
      child.forEachDescendant(callback);
    }
  }

  getAncestors(): TreeNode<any, any, any>[] {
    if (!this.parent) {
      return [this];
    }
    return this.parent.getAncestors().concat([this]);
  }

  /**
   * Compares the positions of two nodes lexicographically.
   * @param other
   * @returns negative if this < other, 0 if this == other, positive if other < this
   */
  comparePosition(other: TreeNode<any, any, any>): number {
    if (this === other) {
      return 0;
    }

    const thisAncestors = this.getAncestors();
    const otherAncestors = other.getAncestors();
    const count = Math.min(thisAncestors.length, otherAncestors.length);

    let commonAncestor: TreeNode<any, any, any> | undefined = undefined;
    let commonAncestorIndex = 0;
    for (let i = 0; i < count; ++i) {
      if (thisAncestors[i] === otherAncestors[i]) {
        commonAncestor = thisAncestors[i];
        commonAncestorIndex = i;
      } else {
        break;
      }
    }
    if (!commonAncestor) {
      throw new Error("no common ancestor");
    }

    if (this === commonAncestor) {
      return -1; // this < other
    }
    if (other === commonAncestor) {
      return 1; // other < this
    }

    const commonAncestorChildren = commonAncestor.children;
    const thisIndex = commonAncestorChildren.indexOf(
      thisAncestors[commonAncestorIndex + 1]
    );
    const otherIndex = commonAncestorChildren.indexOf(
      otherAncestors[commonAncestorIndex + 1]
    );
    return thisIndex - otherIndex;
  }

  static moveNodes(
    parent: TreeNode<any, any, any>,
    position: TreeNode<any, any, any> | undefined,
    nodes: readonly TreeNode<any, any, any>[]
  ): boolean {
    const selectedNodes = new Set(nodes);

    // Do not insert to descendant
    for (const ancestor of parent.getAncestors()) {
      if (selectedNodes.has(ancestor)) {
        return false;
      }
    }

    // Check if node can be inserted or removed
    for (const node of selectedNodes) {
      if (!parent.canInsertChild(node) || !node.canRemove()) {
        return false;
      }
    }

    let actualPosition = position;
    while (actualPosition && selectedNodes.has(actualPosition)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      actualPosition = actualPosition.nextSibling;
    }

    for (const node of selectedNodes) {
      parent.insertBefore(node, actualPosition);
    }

    return true;
  }
}
