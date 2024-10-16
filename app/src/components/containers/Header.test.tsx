import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

describe("Header Component", () => {
  test('should highlight the "Host" link as bold when on the /host route', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/host"]}>
        <Header />
      </MemoryRouter>
    );

    const hostLink = getByText(/host/i);
    expect(hostLink).toHaveClass("font-bold");
  });

  test('should highlight the "Resource" link as bold when on the /resource route', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/resource"]}>
        <Header />
      </MemoryRouter>
    );

    const resourceLink = getByText(/resource/i);
    expect(resourceLink).toHaveClass("font-bold");
  });

  test('should not highlight the "Host" link as bold when on the /resource route', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/resource"]}>
        <Header />
      </MemoryRouter>
    );

    const hostLink = getByText(/host/i);
    expect(hostLink).not.toHaveClass("font-bold");
  });

  test('should not highlight the "Resource" link as bold when on the /host route', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/host"]}>
        <Header />
      </MemoryRouter>
    );

    const resourceLink = getByText(/resource/i);
    expect(resourceLink).not.toHaveClass("font-bold");
  });
});
