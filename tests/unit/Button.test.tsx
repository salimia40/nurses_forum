import { describe, expect, test, spyOn } from 'bun:test';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/frontend/components/ui/button';

describe('Button Component', () => {
  test('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('handles clicks', () => {
    const handleClick = spyOn(console, 'log');

    render(<Button onClick={() => console.log('clicked')}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalled();
  });
});
