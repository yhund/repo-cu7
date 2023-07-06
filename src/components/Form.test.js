import React from "react";
import { screen, render, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import MyFormComponent from "./Form";

global.console = { log: jest.fn() };

describe("Form component", () => {
  beforeEach(() => {
    cleanup();
    console.log.mockClear();
  });

  test("Submit form with all fields filled in correctly", () => {
    render(<MyFormComponent />);
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getAllByRole("radio")[0]);
    fireEvent.click(screen.getByRole("button"));
    expect(console.log).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      agreeTerms: true,
      gender: "male",
    });
  });

  test("Submit form with very long name", () => {
    render(<MyFormComponent />);
    const longName = "a".repeat(100);
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: longName },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getAllByRole("radio")[0]);
    fireEvent.click(screen.getByRole("button"));
    expect(console.log).toHaveBeenCalledWith({
      name: longName,
      email: "john@example.com",
      agreeTerms: true,
      gender: "male",
    });
  });

  test("Submit form with complex email", () => {
    render(<MyFormComponent />);
    const complexEmail = "test.name+alias@example.co.uk";
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: complexEmail },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getAllByRole("radio")[0]);
    fireEvent.click(screen.getByRole("button"));
    expect(console.log).toHaveBeenCalledWith({
      name: "John Doe",
      email: complexEmail,
      agreeTerms: true,
      gender: "male",
    });
  });

  test("Change gender and submit", () => {
    render(<MyFormComponent />);
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getAllByRole("radio")[1]);
    fireEvent.click(screen.getByRole("button"));
    expect(console.log).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      agreeTerms: true,
      gender: "female",
    });
  });

  test("Re-submit the form", () => {
    render(<MyFormComponent />);

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getAllByRole("radio")[0]);
    fireEvent.click(screen.getByRole("button"));
    expect(console.log).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      agreeTerms: true,
      gender: "male",
    });

    // Clear the console.log mock to prepare for the next submission
    console.log.mockClear();

    // Fill in and submit the form again
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getAllByRole("radio")[1]);
    fireEvent.click(screen.getByRole("button"));
    expect(console.log).toHaveBeenCalledWith({
      name: "Jane Doe",
      email: "jane@example.com",
      agreeTerms: true,
      gender: "female",
    });
  });

  test("Submit the form with the Name field left blank", () => {
    render(<MyFormComponent />);
    fireEvent.click(screen.getByRole("button")); // Submit the form
    expect(
      screen.getByText("Name must be at least 3 characters.")
    ).toBeInTheDocument();
  });

  test("Submit the form with an invalid email address", () => {
    render(<MyFormComponent />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalid_email" },
    });
    fireEvent.click(screen.getByRole("button")); // Submit the form
    expect(screen.getByText("Email must be valid.")).toBeInTheDocument();
  });

  test("Submit the form without checking the Agree to Terms checkbox", () => {
    render(<MyFormComponent />);
    fireEvent.click(screen.getByRole("button")); // Submit the form
    expect(
      screen.getByText("You must agree to the terms.")
    ).toBeInTheDocument();
  });

  test("Submit the form without selecting a gender", () => {
    render(<MyFormComponent />);
    fireEvent.click(screen.getByRole("button")); // Submit the form
    expect(screen.getByText("You must select a gender.")).toBeInTheDocument();
  });

  test("Submit the form with a name that is less than 3 characters long", () => {
    render(<MyFormComponent />);
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "AB" },
    });
    fireEvent.click(screen.getByRole("button")); // Submit the form
    expect(
      screen.getByText("Name must be at least 3 characters.")
    ).toBeInTheDocument();
  });
});
