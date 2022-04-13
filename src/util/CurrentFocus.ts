import { isElement } from "lodash-es";
import { action, computed, makeObservable, observable } from "mobx";

const inputTypes = [
  "text",
  "password",
  "number",
  "email",
  "url",
  "search",
  "date",
  "datetime",
  "datetime-local",
  "time",
  "month",
  "week",
];

export function isTextInput(value: EventTarget | null | undefined): boolean {
  if (!isElement(value)) {
    return false;
  }
  const elem = value as HTMLElement | SVGSVGElement;
  if ("contentEditable" in elem && elem.isContentEditable) {
    return true;
  }
  if (elem.tagName === "TEXTAREA") return true;
  if (elem.tagName === "INPUT") {
    return inputTypes.includes((elem as HTMLInputElement).type);
  }

  if (elem.shadowRoot) {
    return isTextInput(elem.shadowRoot.activeElement);
  }

  return false;
}

export function isTextInputFocused(): boolean {
  return isTextInput(document.activeElement);
}

export class CurrentFocus {
  constructor() {
    makeObservable(this);
    document.addEventListener(
      "focus",
      action(() => {
        this._element = document.activeElement ?? undefined;
      }),
      true
    );
    document.addEventListener(
      "blur",
      action(() => {
        this._element = undefined;
      }),
      true
    );
    this._element = document.activeElement ?? undefined;
  }

  @observable _element: Element | undefined = undefined;
  get element(): Element | undefined {
    return this._element;
  }

  @computed get isTextInput(): boolean {
    return this.element ? isTextInput(this.element) : false;
  }
}
