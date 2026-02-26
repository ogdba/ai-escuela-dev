import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SectionHeader from "@/components/SectionHeader";

describe("SectionHeader", () => {
  it("renders title and subtitle", () => {
    render(<SectionHeader eyebrow="Eyebrow" title="Main Title" subtitle="Sub" align="center" />);
    expect(screen.getByText("Main Title")).toBeInTheDocument();
    expect(screen.getByText("Sub")).toBeInTheDocument();
    expect(screen.getByText("Eyebrow")).toBeInTheDocument();
  });
});
