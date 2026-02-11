import "@blocknote/mantine/style.css";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "../../styles/Notion.module.scss";
import "../../styles/blue_button.scss";
import { TextInput, Loader } from "@mantine/core";
import { useBlockNoteEditor, useComponentsContext } from "@blocknote/react";
import { useAIState } from "./aiState";

function isTextBlock(block: any): block is { id: string; content: any[] } {
    return block && Array.isArray(block.content);
}

/** Pixel rect of the current browser text selection (the actual highlighted text). */
function getSelectionRect(): { top: number; left: number; width: number } | null {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    if (!rect || rect.width === 0) return null;
    return {
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 260),
    };
}

export function BlueButton() {
    const BASE_URL = "http://localhost:3000/ai";
    // ── AI global state ──────────────────────────────────────────────────────
    const setPending = useAIState((s) => s.setPending);
    const openAI = useAIState((s) => s.openAI);
    const closeAI = useAIState((s) => s.closeAI);  // hides FormattingToolbar

    // ── Local state ──────────────────────────────────────────────────────────
    const [panelPos, setPanelPos] = useState<{ top: number; left: number; width: number } | null>(null);
    const [prompt, setPrompt] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [suggestion, setSuggestion] = useState<{ oldId: string; newId: string } | null>(null);
    const [previewBlockId, setPreviewBlockId] = useState<string | null>(null);

    const panelRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const editor = useBlockNoteEditor();
    const Components = useComponentsContext()!;

    const SparklesIcon = () => (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 3l1.8 4.5L18 9l-4.2 1.5L12 15l-1.8-4.5L6 9l4.2-1.5L12 3z" />
            <path d="M5 16l.8 2L8 19l-2.2.8L5 22l-.8-2L2 19l2.2-.8L5 16z" />
        </svg>
    );
    function AIIcon() {
        return (
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 3l1.8 4.5L18 9l-4.2 1.5L12 15l-1.8-4.5L6 9l4.2-1.5L12 3z" />
                <path d="M5 16l.8 2L8 19l-2.2.8L5 22l-.8-2L2 19l2.2-.8L5 16z" />
            </svg>
        );
    }

    // ── Open panel ────────────────────────────────────────────────────────────
    function openPanel() {
        const pos = getSelectionRect();
        if (!pos) return;
        setPanelPos(pos);
        closeAI();  // hide the BlockNote FormattingToolbar
        setTimeout(() => inputRef.current?.focus(), 60);
    }

    // ── Close panel ───────────────────────────────────────────────────────────
    function closePanel() {
        setPanelPos(null);
        setPrompt("");
        setPreview(null);
        openAI();   // restore toolbar
    }

    // ── Click-outside to close ────────────────────────────────────────────────
    useEffect(() => {
        function onMouseDown(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                closePanel();
            }
        }
        if (panelPos) window.addEventListener("mousedown", onMouseDown);
        return () => window.removeEventListener("mousedown", onMouseDown);
    }, [panelPos]);

    function toInline(text: string) {
        return [
            {
                type: "text",
                text,
                styles: {},
            },
        ];
    }
    function strikeBlock(blockId: string) {
        const b = editor.getBlock(blockId);
        if (!b || !Array.isArray(b.content)) return;

        editor.updateBlock(blockId, {
            content: b.content.map((c: any) => ({
                ...c,
                styles: { ...(c.styles ?? {}), strike: true },
            })),
        });
    }

    function unstrikeBlock() {
        if (!previewBlockId) return;
        const blockId = previewBlockId;
        const b = editor.getBlock(blockId);
        if (!b || !Array.isArray(b.content)) return;

        editor.updateBlock(blockId, {
            content: b.content.map((c: any) => ({
                ...c,
                styles: {},
            })),
        });
    }

    function acceptPromptResult() {
        if (!preview) return;

        const selection = editor.getSelection();
        if (!selection || selection.blocks.length === 0) return;

        const block = selection.blocks[0]; // block đang được chọn

        editor.updateBlock(block.id, {
            content: [
                {
                    type: "text",
                    text: preview.trim(),
                    styles: {},
                },
            ],
        });

        closePanel();
    }


    // ── Free-form AI prompt ───────────────────────────────────────────────────
    async function runAIPrompt() {
        const selected_text = editor.getSelectedText();
        if (!selected_text) return;
        const full_content = await editor.blocksToFullHTML(editor.document);

        if (!prompt.trim()) return;
        setLoading(true);
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "rewrite", selected_text, full_content, language: "vi" }),
        });
        const data = await res.json();
        setPreview(data.text ?? null);
        const selection = editor.getSelection();
        const block = selection?.blocks?.[0];
        if (!block || !isTextBlock(block)) return;
        // strikeBlock(block.id);
        // setPreviewBlockId(block.id);
        setLoading(false);
    }

    // ── Contextual actions (rewrite / improve / shorten / expand) ────────────
    async function runAI(action: string) {
        const selected_text = editor.getSelectedText();
        if (!selected_text) return;
        setLoading(true);

        const full_content = await editor.blocksToFullHTML(editor.document);
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, selected_text, full_content, language: "vi" }),
        });
        const data = await res.json();
        if (!data?.text) return;

        const selection = editor.getSelection();
        if (!selection?.blocks?.length) return;
        const oldBlock = selection.blocks[0];
        if (!isTextBlock(oldBlock)) return;

        // // // Strike original
        // editor.updateBlock(oldBlock.id, {
        //     content: oldBlock.content.map((c: any) => ({
        //         ...c, styles: { ...(c.styles ?? {}), strike: true },
        //     })),
        // });

        // const [newBlock] = editor.insertBlocks(
        //     [{ type: "paragraph", content: data.text.trim() }],
        //     oldBlock.id,
        //     "after"
        // );

        // setSuggestion({ oldId: oldBlock.id, newId: newBlock.id });
        // openAI();
        // setPending(true);
        // closePanel(); // panel gone, toolbar comes back with ✅ ↩️
        setPreview(data.text ?? null);
        // setPreviewBlockId(oldBlock.id);
        // strikeBlock(oldBlock.id);
        setLoading(false);
    }

    // ── Accept / revert rewrite ───────────────────────────────────────────────
    function acceptRewrite() {
        if (!suggestion) return;
        editor.removeBlocks([suggestion.oldId]);
        setSuggestion(null);
        setPending(false);
    }

    function revertAI() {
        if (!suggestion) return;
        editor.removeBlocks([suggestion.newId]);
        const oldBlock = editor.getBlock(suggestion.oldId);
        if (oldBlock && Array.isArray(oldBlock.content)) {
            editor.updateBlock(oldBlock.id, {
                content: oldBlock.content.map((c: any) => ({
                    ...c, styles: { ...(c.styles ?? {}), strike: false },
                })),
            });
        }
        setSuggestion(null);
        setPending(false);
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <>
            {/* Toolbar button */}
            <Components.FormattingToolbar.Button
                mainTooltip="Chat với AI"
                onClick={openPanel}
            >
                <AIIcon />
            </Components.FormattingToolbar.Button>

            {/* Accept / Revert shown in toolbar while suggestion is pending */}
            {suggestion && (
                <>
                    <Components.FormattingToolbar.Button
                        mainTooltip="Chấp nhận thay đổi"
                        className={styles.notionButton}
                        onClick={acceptRewrite}
                    >
                        ✅
                    </Components.FormattingToolbar.Button>
                    <Components.FormattingToolbar.Button
                        mainTooltip="Hoàn tác"
                        className={styles.notionButton}
                        onClick={revertAI}
                    >
                        ↩️
                    </Components.FormattingToolbar.Button>
                </>
            )}

            {/* Floating panel — Portal to document.body, anchored below selected text */}
            {panelPos && createPortal(
                <div
                    ref={panelRef}
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{
                        position: "absolute",
                        top: panelPos.top,
                        // left: panelPos.left,
                        left: "16px",
                        width: panelPos.width,
                        minWidth: 260,
                        background: "#ffffff",
                        border: "1px solid #e3e3e1",
                        borderRadius: 8,
                        boxShadow: "0 8px 28px rgba(0,0,0,0.13)",
                        zIndex: 101
                    }}
                >
                    {/* Input + preview */}
                    <div style={{ borderBottom: "1px solid #f0f0ee" }}>
                        <TextInput
                            ref={inputRef}
                            placeholder="Ask AI to write anything…"
                            value={prompt}
                            onChange={(e) => setPrompt(e.currentTarget.value)}
                            onKeyDown={(e) => {
                                e.stopPropagation();
                                if (e.key === "Enter") runAIPrompt();
                                if (e.key === "Escape") closePanel();
                            }}
                            rightSection={loading ? <Loader size="xs" /> : null}
                            size="xs"
                            styles={{
                                input: {
                                    color: "#6c6c6bff",
                                    fontSize: 14,
                                    height: 46,
                                    minHeight: 30,
                                    border: "1px solid #e3e3e1",
                                    borderRadius: 5,
                                    zIndex: 102,
                                    width: "calc(100vw - 54px)",
                                    boxShadow: "var(--c-shaMD)",
                                    background: "white",
                                },
                            }}
                        />

                        {preview && (
                            <div style={{ marginTop: 6 }}>
                                <div style={{
                                    padding: "6px 8px",
                                    background: "#f0f0ee",
                                    borderRadius: 5,
                                    fontSize: 12,
                                    whiteSpace: "pre-wrap",
                                    maxHeight: 120,
                                    overflowY: "auto",
                                    color: "#37352f",
                                }}>
                                    {preview}
                                </div>
                                <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                                    <button
                                        onMouseDown={(e) => { e.stopPropagation(); acceptPromptResult(); }}
                                        style={btnStyle("#37352f", "#fff")}
                                    ><span className="bw-emoji">✅</span>
                                        Insert</button>
                                    <button
                                        onMouseDown={(e) => { e.stopPropagation(); setPreview(null); setPrompt(""); }}
                                        style={btnStyle("#ebebea", "#37352f")}
                                    ><span className="bw-emoji">❌</span>
                                        Discard</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Command list */}
                    <div style={{ padding: "4px 0" }}>
                        {COMMANDS.map(({ label, action }) => (
                            <button
                                key={action}
                                onMouseDown={(e) => { e.stopPropagation(); runAI(action); }}
                                style={commandStyle}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f1ef")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

const COMMANDS = [
    {
        label: (
            <>
                <span className="bw-emoji">✍️</span> Viết lại
            </>
        ),
        action: "rewrite",
    },
    {
        label: (
            <>
                <span className="bw-emoji">✨</span> Cải thiện văn phong
            </>
        ),
        action: "improve",
    },
    {
        label: (
            <>
                <span className="bw-emoji">✂️</span> Rút gọn
            </>
        ),
        action: "shorten",
    },
    {
        label: (
            <>
                <span className="bw-emoji">➕</span> Mở rộng
            </>
        ),
        action: "expand",
    },
];


const btnStyle = (bg: string, color: string): React.CSSProperties => ({
    flex: 1, padding: "3px 0", fontSize: 11,
    background: bg, color, border: "none",
    borderRadius: 4, cursor: "pointer", fontFamily: "inherit",
});

const commandStyle: React.CSSProperties = {
    display: "block", width: "100%",
    padding: "6px 12px", textAlign: "left",
    fontSize: 13, background: "transparent",
    color: "#37352f", border: "none",
    cursor: "pointer", fontFamily: "inherit",
    transition: "background 0.1s",
};