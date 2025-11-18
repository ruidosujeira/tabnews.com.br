import { AutoThemeProvider } from '@tabnews/ui';
import { render, waitFor } from '@testing-library/react';

import Viewer from 'pages/interface/components/Markdown';

const renderWithTheme = (ui) => render(<AutoThemeProvider>{ui}</AutoThemeProvider>);

describe('Markdown heading normalization', () => {
  it('demotes markdown level-one headings to level-two headings', async () => {
    const markdown = '# Primeiro título\n\n## Segundo título';
    const { container, findAllByRole } = renderWithTheme(<Viewer value={markdown} clobberPrefix="demo-content-" />);

    await findAllByRole('heading', { level: 2 });

    expect(container.querySelectorAll('h1')).toHaveLength(0);
    expect(container.querySelectorAll('h2')).toHaveLength(2);
  });

  it('demotes raw html h1 headings to h2', async () => {
    const markdown = '<h1>HTML Heading</h1>';
    const { container, findAllByRole } = renderWithTheme(<Viewer value={markdown} clobberPrefix="demo-content-" />);

    await findAllByRole('heading', { level: 2 });

    expect(container.querySelectorAll('h1')).toHaveLength(0);
    expect(container.querySelectorAll('h2')).toHaveLength(1);
    expect(container.querySelector('h2')?.textContent).toBe('HTML Heading');
  });

  it('demotes headings nested inside blockquotes', async () => {
    const markdown = '> # Citação com título';
    const { container, findAllByRole } = renderWithTheme(<Viewer value={markdown} clobberPrefix="demo-content-" />);

    await findAllByRole('heading', { level: 2 });

    const blockquoteHeading = container.querySelector('blockquote h2');
    expect(blockquoteHeading).not.toBeNull();
    expect(container.querySelectorAll('blockquote h1')).toHaveLength(0);
  });

  it('does not change headings rendered inside code blocks', async () => {
    const markdown = '```html\n<h1>Dentro de code</h1>\n```';
    const { container } = renderWithTheme(<Viewer value={markdown} clobberPrefix="demo-content-" />);

    await waitFor(() => {
      const codeBlock = container.querySelector('pre code');
      expect(codeBlock?.textContent).toContain('<h1>Dentro de code</h1>');
    });

    expect(container.querySelectorAll('h1')).toHaveLength(0);
  });
});
