import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useAIState } from "./aiState";
import type { BlockNoteEditor } from "@blocknote/core";
import "../../styles/Notion.module.scss"
import "../../styles/ai_chat.scss"
import "../../styles/blue_button.scss"
import type { PartialBlock } from "@blocknote/core";
// ── Helpers ───────────────────────────────────────────────────────────────────
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

// ── AIFloatingPanel ───────────────────────────────────────────────────────────
// Dùng HTML thuần — không phụ thuộc Mantine hay BlockNote context
function AIFloatingPanel({
    editor,
    onClose,
}: {
    editor: BlockNoteEditor;
    onClose: () => void;
}) {
    const openAI = useAIState((s) => s.openAI);
    const BASE_URL = "http://localhost:3000/ai";
    const [panelPos, setPanelPos] = useState<{ top: number; left: number; width: number } | null>(null);
    const [prompt, setPrompt] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const panelRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const pos = getSelectionRect();
        setPanelPos(pos ?? { top: window.scrollY + 120, left: 16, width: 320 });
        setTimeout(() => inputRef.current?.focus(), 60);
    }, []);

    useEffect(() => {
        function onMouseDown(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                closePanel();
            }
        }
        if (panelPos) window.addEventListener("mousedown", onMouseDown);
        return () => window.removeEventListener("mousedown", onMouseDown);
    }, [panelPos]);

    function closePanel() {
        setPanelPos(null);
        setPrompt("");
        setPreview(null);
        openAI();
        onClose();
    }

    function acceptPromptResult() {
        if (!preview) return;

        const selection = editor.getSelection();
        if (!selection || selection.blocks.length === 0) return;

        const oldBlocks = selection.blocks;

        const paragraphs = preview
            .trim()
            .split(/\n+/)
            .map(p => p.trim())
            .filter(Boolean);

        const newBlocks: PartialBlock[] = paragraphs.map(text => ({
            type: "paragraph",
            content: [
                {
                    type: "text",
                    text,
                    styles: {},
                },
            ],
        }));

        editor.insertBlocks(newBlocks, oldBlocks[0].id, "before");

        editor.removeBlocks(oldBlocks.map(b => b.id));

        closePanel();
    }
    function selectAllContent(editor: BlockNoteEditor) {
        const blocks = editor.document;
        if (!blocks || blocks.length === 0) return;

        const first = blocks[0];
        const last = blocks[blocks.length - 1];

        editor.setSelection(first.id, last.id);
    }
    function ensureSelection(editor: BlockNoteEditor) {
        const sel = editor.getSelection();

        if (!sel || sel.blocks.length === 0) {
            selectAllContent(editor);
        }
    }
    async function runAIPrompt() {
        if (!prompt.trim()) return;
        setLoading(true);
        ensureSelection(editor);
        const selected_text = editor.getSelectedText();
        const full_content = await editor.blocksToFullHTML(editor.document);
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "prompt", prompt, selected_text, full_content, language: "vi" }),
        });
        const data = await res.json();
        setPreview(data.text ?? null);
        setLoading(false);
    }

    async function runAI(action: string) {
        ensureSelection(editor);
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
        setPreview(data.text ?? null);
        setLoading(false);
    }

    if (!panelPos) return null;

    return createPortal(
        <div
            ref={panelRef}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
                position: "absolute",
                top: panelPos.top,
                left: "16px",
                width: panelPos.width,
                minWidth: 260,
                background: "#ffffff",
                border: "1px solid #e3e3e1",
                borderRadius: 8,
                boxShadow: "0 8px 28px rgba(0,0,0,0.13)",
                zIndex: 9999,
                fontFamily: "inherit",
            }}
        >
            {/* Input row */}
            <div style={{ padding: "6px 8px", borderBottom: "1px solid #f0f0ee", display: "flex", alignItems: "center", gap: 6 }}>
                <input
                    ref={inputRef}
                    placeholder="Ask AI to write anything…"
                    value={prompt}
                    onChange={(e) => setPrompt(e.currentTarget.value)}
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === "Enter") runAIPrompt();
                        if (e.key === "Escape") closePanel();
                    }}
                    style={{
                        flex: 1,
                        height: 34,
                        padding: "0 8px",
                        fontSize: 13,
                        color: "#37352f",
                        border: "1px solid #e3e3e1",
                        borderRadius: 5,
                        outline: "none",
                        background: "white",
                        fontFamily: "inherit",
                    }}
                />
                {loading && (
                    <div style={{
                        width: 16, height: 16, border: "2px solid #e3e3e1",
                        borderTopColor: "#37352f", borderRadius: "50%",
                        animation: "ai-spin 0.6s linear infinite",
                        flexShrink: 0,
                    }} />
                )}
            </div>

            {/* Preview */}
            {preview && (
                <div style={{ padding: "6px 8px", borderBottom: "1px solid #f0f0ee" }}>
                    <div style={{
                        padding: "6px 8px",
                        background: "#f7f6f3",
                        borderRadius: 5,
                        fontSize: 12,
                        whiteSpace: "pre-wrap",
                        maxHeight: 120,
                        overflowY: "auto",
                        color: "#37352f",
                        lineHeight: 1.5,
                    }}>
                        {preview}
                    </div>
                    <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                        <button
                            onMouseDown={(e) => { e.stopPropagation(); acceptPromptResult(); }}
                            style={btnStyle("#37352f", "#fff")}
                        >✅ Insert</button>
                        <button
                            onMouseDown={(e) => { e.stopPropagation(); setPreview(null); setPrompt(""); }}
                            style={btnStyle("#f0f0ee", "#37352f")}
                        >❌ Discard</button>
                    </div>
                </div>
            )}

            {/* Command list */}
            <div style={{ padding: "4px 0" }}>
                {COMMANDS.map(({ label, action }) => (
                    <button
                        key={action}
                        onMouseDown={(e) => { e.stopPropagation(); runAI(action); }}
                        style={commandStyle}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f1ef")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >{label}</button>
                ))}
            </div>

            {/* Spinner keyframe */}
            <style>{`@keyframes ai-spin { to { transform: rotate(360deg); } }`}</style>
        </div>,
        document.body
    );
}

// ── mountAIPanel ──────────────────────────────────────────────────────────────
function mountAIPanel(editor: BlockNoteEditor) {
    const existing = document.getElementById("ai-slash-panel-root");
    if (existing) return;

    const container = document.createElement("div");
    container.id = "ai-slash-panel-root";
    document.body.appendChild(container);

    import("react-dom/client").then(({ createRoot }) => {
        const root = createRoot(container);
        root.render(
            <AIFloatingPanel
                editor={editor}
                onClose={() => {
                    root.unmount();
                    container.remove();
                }}
            />
        );
    });
}

// ── aiSlashItem ───────────────────────────────────────────────────────────────
// Dùng trong App.tsx:
//   getItems={async (query) =>
//     filterSuggestionItems([...getDefaultReactSlashMenuItems(editor), aiSlashItem(editor)], query)
//   }
export function aiSlashItem(editor: BlockNoteEditor) {
    return {
        title: "Hỏi AI",
        aliases: ["ai", "hoi"],
        group: "AI",
        subtext: "Hỏi AI cho nội dung đang chọn",
        onItemClick: () => mountAIPanel(editor),
    };
}

// ── Styles ────────────────────────────────────────────────────────────────────
const COMMANDS = [
    { label: "✍️  Viết tiếp", action: "rewrite" },
    { label: "✨  Tối ưu", action: "improve" },
    { label: "✂️  Tóm tắt", action: "shorten" },
    { label: "➕  Viết thêm bất cứ thứ gì", action: "expand" },
];

const btnStyle = (bg: string, color: string): React.CSSProperties => ({
    flex: 1, padding: "4px 0", fontSize: 12,
    background: bg, color, border: "none",
    borderRadius: 4, cursor: "pointer", fontFamily: "inherit",
});

const commandStyle: React.CSSProperties = {
    display: "block", width: "100%",
    padding: "7px 12px", textAlign: "left",
    fontSize: 13, background: "transparent",
    color: "#37352f", border: "none",
    cursor: "pointer", fontFamily: "inherit",
    transition: "background 0.1s",
};