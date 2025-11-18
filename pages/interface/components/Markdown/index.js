import breaksPlugin from '@bytemd/plugin-breaks';
import gemojiPlugin from '@bytemd/plugin-gemoji';
import gfmPlugin from '@bytemd/plugin-gfm';
import gfmLocale from '@bytemd/plugin-gfm/locales/pt_BR.json';
import highlightPlugin from '@bytemd/plugin-highlight-ssr';
import mathPlugin from '@bytemd/plugin-math';
import mathLocale from '@bytemd/plugin-math/locales/pt_BR.json';
import mermaidPlugin from '@bytemd/plugin-mermaid';
import mermaidLocale from '@bytemd/plugin-mermaid/locales/pt_BR.json';
import { Box, useTheme } from '@primer/react';
import { isTrustedDomain } from '@tabnews/helpers';
import {
  anchorHeadersPlugin,
  copyCodeToClipboardPlugin,
  externalLinksPlugin,
  MarkdownEditor,
  MarkdownViewer,
  removeDuplicateClobberPrefix,
} from '@tabnews/ui/markdown';
import { useMemo } from 'react';

import { normalizeHeadingsPlugin } from './plugins/normalize-headings';

const BASE_PLUGINS = [
  gfmPlugin({ locale: gfmLocale }),
  highlightPlugin(),
  mathPlugin({ locale: mathLocale, katexOptions: { output: 'html' } }),
  breaksPlugin(),
  gemojiPlugin(),
  copyCodeToClipboardPlugin(),
];

const shouldAddNofollow = (url) => !isTrustedDomain(url);

const normalizeClobberPrefix = (prefix) => prefix?.toLowerCase();

const MARKDOWN_HEADINGS_SX = {
  '& .markdown-body h2': {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.35,
  },
  '& .markdown-body h3': {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  '& .markdown-body > :is(h2, h3):first-of-type': {
    marginTop: '1.5rem',
  },
};

function useTabNewsMarkdownPlugins({ areLinksTrusted, clobberPrefix }) {
  const { colorScheme } = useTheme();

  return useMemo(() => {
    const mermaidTheme = colorScheme === 'dark' ? 'dark' : 'default';
    const plugins = [
      ...BASE_PLUGINS,
      mermaidPlugin({ locale: mermaidLocale, theme: mermaidTheme }),
      anchorHeadersPlugin({ prefix: clobberPrefix ?? 'user-content-' }),
      removeDuplicateClobberPrefix({ clobberPrefix }),
      normalizeHeadingsPlugin(),
    ];

    if (!areLinksTrusted) {
      plugins.push(externalLinksPlugin({ shouldAddNofollow }));
    }

    return plugins;
  }, [areLinksTrusted, clobberPrefix, colorScheme]);
}

export default function Viewer(props) {
  const normalizedPrefix = normalizeClobberPrefix(props.clobberPrefix);
  const plugins = useTabNewsMarkdownPlugins({
    areLinksTrusted: Boolean(props.areLinksTrusted),
    clobberPrefix: normalizedPrefix,
  });

  return (
    <Box sx={MARKDOWN_HEADINGS_SX}>
      <MarkdownViewer
        {...props}
        clobberPrefix={normalizedPrefix}
        plugins={plugins}
        shouldAddNofollow={shouldAddNofollow}
      />
    </Box>
  );
}

export function Editor(props) {
  const normalizedPrefix = normalizeClobberPrefix(props.clobberPrefix);
  const plugins = useTabNewsMarkdownPlugins({
    areLinksTrusted: Boolean(props.areLinksTrusted),
    clobberPrefix: normalizedPrefix,
  });

  return (
    <Box sx={MARKDOWN_HEADINGS_SX}>
      <MarkdownEditor
        {...props}
        clobberPrefix={normalizedPrefix}
        plugins={plugins}
        shouldAddNofollow={shouldAddNofollow}
      />
    </Box>
  );
}
