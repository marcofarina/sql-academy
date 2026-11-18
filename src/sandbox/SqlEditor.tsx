import { SQLite, sql } from '@codemirror/lang-sql';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { Compartment, Prec } from '@codemirror/state';
import { keymap, placeholder } from '@codemirror/view';
import { EditorView, basicSetup } from 'codemirror';
import { useEffect, useRef } from 'react';
import type { TableInfo } from './session.ts';

interface SqlEditorProps {
  initialValue: string;
  tables: TableInfo[];
  onChange(value: string): void;
  /** Chiamata con Ctrl+Invio (Cmd+Invio su Mac). */
  onRun(): void;
  label: string;
}

/**
 * Aspetto dell’editor dalle variabili della veste (`--editor-*`, `--code-*` in
 * `src/styles.css`): ogni tema lo cambia dal proprio `stile.css`.
 */
const editorTheme = EditorView.theme(
  {
    '&': { color: 'var(--editor-text)', backgroundColor: 'var(--editor-bg)' },
    '.cm-content': { caretColor: 'var(--editor-text)', padding: '14px 0' },
    '.cm-line': { padding: '0 14px' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--editor-text)' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: 'var(--editor-selection)',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--editor-bg)',
      color: 'var(--code-gutter)',
      borderRight: '1px solid var(--editor-rule)',
    },
    '.cm-lineNumbers .cm-gutterElement': { textAlign: 'right', padding: '0 10px 0 14px' },
    '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'transparent' },
    '.cm-placeholder': { color: 'var(--code-gutter)' },
    '.cm-matchingBracket': { backgroundColor: 'var(--editor-selection)', outline: 'none' },
    '.cm-tooltip': { backgroundColor: 'var(--editor-bg)', color: 'var(--editor-text)', border: '1px solid var(--editor-rule)' },
    '.cm-tooltip-autocomplete ul li[aria-selected]': { backgroundColor: 'var(--editor-selection)', color: 'var(--editor-text)' },
  },
  { dark: true },
);

const sqlHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: 'var(--code-keyword)', fontWeight: '600' },
  { tag: [tags.number, tags.bool, tags.null], color: 'var(--code-number)' },
  { tag: [tags.string, tags.special(tags.string)], color: 'var(--code-string)' },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: 'var(--code-comment)', fontStyle: 'italic' },
  { tag: [tags.punctuation, tags.operator, tags.paren, tags.separator], color: 'var(--code-punct)' },
  { tag: [tags.name, tags.typeName, tags.propertyName], color: 'var(--editor-text)' },
]);

function sqlLanguage(tables: TableInfo[]) {
  const schema = Object.fromEntries(tables.map((table) => [table.name, table.columns.map((c) => c.name)]));
  return sql({ dialect: SQLite, schema, upperCaseKeywords: true });
}

/** Editor SQL con evidenziazione, completamento di tabelle e colonne, esecuzione da tastiera. */
export function SqlEditor({ initialValue, tables, onChange, onRun, label }: SqlEditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView>(null);
  const language = useRef(new Compartment());
  const callbacks = useRef({ onChange, onRun });

  useEffect(() => {
    callbacks.current = { onChange, onRun };
  });

  useEffect(() => {
    const editor = new EditorView({
      parent: host.current!,
      doc: initialValue,
      extensions: [
        basicSetup,
        editorTheme,
        syntaxHighlighting(sqlHighlight),
        EditorView.lineWrapping,
        placeholder('Scrivi una query, per esempio SELECT * FROM …;'),
        language.current.of([]),
        Prec.highest(
          keymap.of([
            {
              key: 'Mod-Enter',
              run: () => {
                callbacks.current.onRun();
                return true;
              },
            },
          ]),
        ),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) callbacks.current.onChange(update.state.doc.toString());
        }),
        EditorView.contentAttributes.of({ 'aria-label': label }),
      ],
    });
    view.current = editor;
    return () => editor.destroy();
    // L’editor nasce una volta: il testo iniziale e l’etichetta non lo ricreano.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    view.current?.dispatch({ effects: language.current.reconfigure(sqlLanguage(tables)) });
  }, [tables]);

  return <div className="sql-editor" ref={host} />;
}
