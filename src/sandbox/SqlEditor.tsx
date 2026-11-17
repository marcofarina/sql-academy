import { SQLite, sql } from '@codemirror/lang-sql';
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
