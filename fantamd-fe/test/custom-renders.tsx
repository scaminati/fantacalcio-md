import { render } from "@testing-library/react";
import { ReactElement } from "react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { SWRConfig } from "swr";

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <NuqsTestingAdapter>
      <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
    </NuqsTestingAdapter>
  );
}

export function renderWithAdapter(ui: ReactElement) {
  return render(ui, { wrapper: TestWrapper });
}
