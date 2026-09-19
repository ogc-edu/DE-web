import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Dialog, DialogContent, DialogTitle } from "../dialog";

// The primitive is hand-rolled and sets no role="dialog", so everything here is
// queried by text.
const renderDialog = (over = {}) => {
  const props = { open: true, onOpenChange: jest.fn(), ...over };
  render(
    <Dialog {...props}>
      <DialogContent>
        <DialogTitle>Focused chart</DialogTitle>
      </DialogContent>
    </Dialog>
  );
  return props;
};

describe("ui/dialog", () => {
  test("closes on Escape", () => {
    const { onOpenChange } = renderDialog();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test("ignores other keys", () => {
    const { onOpenChange } = renderDialog();

    fireEvent.keyDown(document, { key: "Enter" });
    fireEvent.keyDown(document, { key: "a" });

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test("does not listen while closed", () => {
    const { onOpenChange } = renderDialog({ open: false });

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByText("Focused chart")).not.toBeInTheDocument();
  });

  test("detaches the listener on unmount", () => {
    const onOpenChange = jest.fn();
    const { unmount } = render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Focused chart</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    unmount();
    fireEvent.keyDown(document, { key: "Escape" });

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test("still closes on a backdrop click", () => {
    const { onOpenChange } = renderDialog();

    fireEvent.click(document.querySelector(".bg-black\\/80"));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
