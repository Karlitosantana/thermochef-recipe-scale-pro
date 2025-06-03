import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeUrlInput } from '../convert/recipe-url-input';

describe('RecipeUrlInput', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders input field and submit button', () => {
    render(<RecipeUrlInput onSubmit={mockOnSubmit} isLoading={false} />);
    
    expect(screen.getByLabelText(/recipe url/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/https:\/\/example.com\/recipe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /parse recipe/i })).toBeInTheDocument();
  });

  it('calls onSubmit with URL when form is submitted', async () => {
    const user = userEvent.setup();
    render(<RecipeUrlInput onSubmit={mockOnSubmit} isLoading={false} />);
    
    const input = screen.getByLabelText(/recipe url/i);
    const button = screen.getByRole('button', { name: /parse recipe/i });
    
    await user.type(input, 'https://example.com/recipe');
    await user.click(button);
    
    expect(mockOnSubmit).toHaveBeenCalledWith('https://example.com/recipe');
  });

  it('trims whitespace from URL', async () => {
    const user = userEvent.setup();
    render(<RecipeUrlInput onSubmit={mockOnSubmit} isLoading={false} />);
    
    const input = screen.getByLabelText(/recipe url/i);
    const button = screen.getByRole('button', { name: /parse recipe/i });
    
    await user.type(input, '  https://example.com/recipe  ');
    await user.click(button);
    
    expect(mockOnSubmit).toHaveBeenCalledWith('https://example.com/recipe');
  });

  it('does not submit empty URL', async () => {
    const user = userEvent.setup();
    render(<RecipeUrlInput onSubmit={mockOnSubmit} isLoading={false} />);
    
    const button = screen.getByRole('button', { name: /parse recipe/i });
    await user.click(button);
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows loading state when isLoading is true', () => {
    render(<RecipeUrlInput onSubmit={mockOnSubmit} isLoading={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(/parsing recipe/i);
    expect(button).toBeDisabled();
    
    const input = screen.getByLabelText(/recipe url/i);
    expect(input).toBeDisabled();
  });

  it('disables submit button when URL is empty', () => {
    render(<RecipeUrlInput onSubmit={mockOnSubmit} isLoading={false} />);
    
    const button = screen.getByRole('button', { name: /parse recipe/i });
    expect(button).toBeDisabled();
  });

  it('enables submit button when URL is entered', async () => {
    const user = userEvent.setup();
    render(<RecipeUrlInput onSubmit={mockOnSubmit} isLoading={false} />);
    
    const input = screen.getByLabelText(/recipe url/i);
    const button = screen.getByRole('button');
    
    await user.type(input, 'https://example.com/recipe');
    
    expect(button).not.toBeDisabled();
  });

  it('shows supported websites information', () => {
    render(<RecipeUrlInput onSubmit={mockOnSubmit} isLoading={false} />);
    
    expect(screen.getByText(/supported websites/i)).toBeInTheDocument();
    expect(screen.getByText(/allrecipes, food network/i)).toBeInTheDocument();
  });
});