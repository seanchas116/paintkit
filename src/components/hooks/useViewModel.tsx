import { DependencyList, useEffect, useState } from "react";

interface ViewModel {
  dispose?(): void;
}

export function useViewModel<T extends ViewModel>(
  create: () => T,
  deps: DependencyList
): T {
  const [viewModel, setViewModel] = useState<T>(create);

  useEffect(() => {
    viewModel.dispose?.();
    const newViewModel = create();
    setViewModel(newViewModel);
    return () => newViewModel.dispose?.();
  }, deps);

  return viewModel;
}
