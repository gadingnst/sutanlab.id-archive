import { render, screen } from '@testing-library/react';
import Button from 'components/Button';

describe('<Button /> component test', () => {
  render(<Button text="Hello World" />);
  render(<Button href="https://gading.dev" text="Hello World" />);

  const btns = screen.getAllByRole('button');

  it('should renders on document', () => {
    btns.forEach(btn => expect(btn).toBeInTheDocument());
  });

  it('should renders tag BUTTON and text message', () => {
    expect(btns[0].tagName).toEqual('BUTTON');
    expect(btns[0]).toHaveTextContent('Hello World');
  });

  it('should renders tag A and has href prop', () => {
    expect(btns[1].tagName).toEqual('A');
    expect(btns[1]).toHaveAttribute('href', 'https://gading.dev');
  });
});
