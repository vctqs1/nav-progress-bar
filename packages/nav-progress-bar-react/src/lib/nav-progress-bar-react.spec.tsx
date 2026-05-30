import { render } from '@testing-library/react';

import NavProgressBar from './nav-progress-bar-react';

describe('NavProgressBar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavProgressBar />);
    expect(baseElement).toBeTruthy();
  });
});
