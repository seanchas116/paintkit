import * as jsondiffpatch from "jsondiffpatch";
import { compact, debounce } from "lodash-es";
import { computed, makeObservable, observable } from "mobx";
import { TypedEmitter } from "tiny-typed-emitter";
import { UndoCommand, UndoStack } from "./UndoStack";

const commitDebounceInterval = 200;

export interface JSONUndoHistoryTarget<Snapshot> {
  toJSON(): Snapshot;
  loadJSON(json: Snapshot): void;
}

interface JSONUndoHistoryEvents<Snapshot> {
  change: (snapshot: Snapshot) => void;
}

export class JSONUndoHistory<
  Snapshot,
  Target extends JSONUndoHistoryTarget<Snapshot> = JSONUndoHistoryTarget<Snapshot>
> extends TypedEmitter<JSONUndoHistoryEvents<Snapshot>> {
  constructor(
    target: Target,
    options: {
      objectHash?: (obj: object) => unknown;
    } = {}
  ) {
    super();
    this.diffPatch = jsondiffpatch.create({
      objectHash: options.objectHash,
    });
    this.target = target;
    this._snapshot = target.toJSON();
    makeObservable(this);
  }

  readonly diffPatch: jsondiffpatch.DiffPatcher;
  readonly target: Target;
  readonly undoStack = new UndoStack();
  private _snapshot: Snapshot;
  @observable private savePoint: UndoCommand | undefined = undefined;

  get snapshot(): Snapshot {
    return this._snapshot;
  }

  @computed get isModified(): boolean {
    return this.savePoint !== this.undoStack.commandToUndo;
  }

  /**
   * Commit current changes and push it to the undo stack.
   *
   * If `mergeInterval` is passed, the new commit is merged into the previous commit
   * if the previous commit has happened within `mergeInterval` milliseconds and `title` and `node` are same.
   * @param title The title of the changes (will be shown in undo/redo menu)
   * @param nodes
   * @param mergeInterval
   */
  commit(title: string, mergeInterval = 0): boolean {
    const snapshot = this.target.toJSON();
    const redoDiff = this.diffPatch.diff(this._snapshot, snapshot);
    if (!redoDiff) {
      return false;
    }
    this._snapshot = snapshot;
    this.emit("change", snapshot);

    this.undoStack.push(
      new JSONUndoHistory.Command(this, [redoDiff], title, mergeInterval)
    );
    return true;
  }

  readonly commitDebounced = debounce(
    (title: string) => this.commit(title),
    commitDebounceInterval
  );

  updateSavePoint(): void {
    this.savePoint = this.undoStack.commandToUndo;
  }

  revert(snapshot: Snapshot): void {
    this._snapshot = snapshot;
    this.emit("change", snapshot);
    this.target.loadJSON(snapshot);
    this.undoStack.clear();
    this.savePoint = undefined;
  }

  private static Command = class<Snapshot> implements UndoCommand {
    constructor(
      history: JSONUndoHistory<Snapshot>,
      redoDiffs: jsondiffpatch.Delta[],
      title: string,
      mergeInterval: number
    ) {
      this.history = history;
      this.redoDiffs = redoDiffs;
      this.undoDiffs = compact(
        this.redoDiffs.map((diff) => history.diffPatch.reverse(diff))
      ).reverse();
      this.title = title;
      this.mergeInterval = mergeInterval;
    }

    readonly history: JSONUndoHistory<Snapshot>;
    readonly redoDiffs: jsondiffpatch.Delta[];
    readonly undoDiffs: jsondiffpatch.Delta[];
    readonly title: string;
    readonly mergeInterval: number;
    readonly timestamp = Date.now();

    undo() {
      let snapshot = this.history._snapshot;
      for (const diff of this.undoDiffs) {
        snapshot = this.history.diffPatch.patch(snapshot, diff) as Snapshot;
      }
      this.history.target.loadJSON(snapshot);
      this.history._snapshot = snapshot;
      this.history.emit("change", snapshot);
    }
    redo() {
      let snapshot = this.history._snapshot;
      for (const diff of this.redoDiffs) {
        snapshot = this.history.diffPatch.patch(snapshot, diff) as Snapshot;
      }
      this.history.target.loadJSON(snapshot);
      this.history._snapshot = snapshot;
      this.history.emit("change", snapshot);
    }

    merge(other: UndoCommand): UndoCommand | undefined {
      if (!this.mergeInterval) {
        return;
      }
      if (!(other instanceof JSONUndoHistory.Command)) {
        return;
      }
      if (this.title !== other.title) {
        return;
      }
      if (other.timestamp - this.timestamp > this.mergeInterval) {
        return;
      }

      // TODO: merge diffs

      return new JSONUndoHistory.Command(
        this.history,
        this.redoDiffs.concat(other.redoDiffs),
        other.title,
        other.mergeInterval
      );
    }
  };
}
