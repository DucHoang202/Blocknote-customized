// BlueButton.tsx  –  AI toolbar button + floating panel
// Shared logic lives in aiUtils.js
import "@blocknote/mantine/style.css";
import { Tooltip } from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Textarea } from "@mantine/core";
import { useBlockNoteEditor, useComponentsContext } from "@blocknote/react";
import "../../styles/style.css";
import { DislikeModal } from "./DislikeModal";
import { CancelModal } from "./cancelModal";
import { useAIState } from "./aiState";
import {
    MENU_DATA, RESULT_ACTIONS, ICONS,
    getSelectionRectFull, callAI, applyResultToBlock, ensureSelection,
    inputLikeStyle, menuDropdownStyle, hideToolbars, RobotAvatar
} from "./aiUtils";
import toast from "react-hot-toast";
// ── MenuItem ──────────────────────────────────────────────────────────────────
function MenuItem({ item, isActive, onHover, onClick }) {
    const ref = useRef(null);

    const handleMouseEnter = () => {
        if (item.hasSubmenu && ref.current) {
            onHover(item.id, ref.current.getBoundingClientRect());
        } else {
            onHover(null, null);
        }
    };

    return (
        <div
            ref={ref}
            className={`menu-item ${isActive ? "active" : ""}`}
            onMouseEnter={handleMouseEnter}
            onClick={item.hasSubmenu ? undefined : onClick}
        >
            {item.icon && (
                <span className="menu-icon" style={{ fill: item.iconColor, color: item.iconColor }}>
                    {ICONS[item.icon]}
                </span>
            )}
            <span className="menu-label">{item.label}</span>
            {item.shortcut && <span className="menu-label-suffix">{item.shortcut}</span>}
            {item.hasSubmenu && <span className="menu-chevron">{ICONS.chevronRight}</span>}
        </div>
    );
}

// ── Submenu ───────────────────────────────────────────────────────────────────
function Submenu({ items, anchorRect, onSelect }) {
    if (!anchorRect) return null;
    return (
        <div
            className="submenu"
            style={{ position: "fixed", top: anchorRect.top, left: anchorRect.right }}
        >
            {items.map((lang) => (
                <div key={lang} className="submenu-item" onClick={() => onSelect(lang)}>
                    {lang}
                </div>
            ))}
        </div>
    );
}

// ── Loading dots overlay ──────────────────────────────────────────────────────
function LoadingOverlay({ loading, onClick }) {
    if (!loading) return null;
    return createPortal(
        <div
            style={{ position: "fixed", inset: 0, zIndex: 9999 }}
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onClick(); }}
        />,
        document.body
    );
}

// ── AI icon for toolbar ───────────────────────────────────────────────────────
function AIIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.8 4.5L18 9l-4.2 1.5L12 15l-1.8-4.5L6 9l4.2-1.5L12 3z" />
            <path d="M5 16l.8 2L8 19l-2.2.8L5 22l-.8-2L2 19l2.2-.8L5 16z" />
        </svg>
    );
}

// ── BlueButton ────────────────────────────────────────────────────────────────
export function BlueButton() {
    const setPending = useAIState((s) => s.setPending);
    const openAI = useAIState((s) => s.openAI);
    const closeAI = useAIState((s) => s.closeAI);

    const [panelPos, setPanelPos] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [submenuRect, setSubmenuRect] = useState(null);
    const [submenuItems, setSubmenuItems] = useState([]);
    const [rateAnswer, setRateAnswer] = useState(0);
    const [rateModal, setRateModal] = useState(false);

    const panelRef = useRef(null);
    const inputRef = useRef(null);
    const loadingRef = useRef(loading);

    const editor = useBlockNoteEditor();
    const Components = useComponentsContext();

    useEffect(() => { loadingRef.current = loading; }, [loading]);

    // Block keyboard while loading
    useEffect(() => {
        if (!loading) return;
        const block = (e) => { e.preventDefault(); e.stopPropagation(); };
        window.addEventListener("keydown", block, true);
        return () => window.removeEventListener("keydown", block, true);
    }, [loading]);

    // Close on outside click
    useEffect(() => {
        const onDown = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                loadingRef.current ? setShowCloseConfirm(true) : closePanel();
            }
        };
        if (panelPos) window.addEventListener("mousedown", onDown);
        return () => window.removeEventListener("mousedown", onDown);
    }, [panelPos]);

    // Hide toolbars
    document.querySelectorAll<HTMLElement>(".bn-formatting-toolbar")
        .forEach((el) => {
            el.style.display = "none";
        });

    // ── Panel open / close ────────────────────────────────────────────────────
    function openPanel() {
        const pos = getSelectionRectFull();
        if (!pos) return;
        setPanelPos(pos);
        closeAI();
        setTimeout(() => inputRef.current?.focus(), 60);
    }

    function closePanel() {
        setPanelPos(null);
        setPrompt("");
        setPreview(null);
        openAI();
    }

    // ── Submenu hover handler ─────────────────────────────────────────────────
    function handleHover(id, rect) {
        if (!id) { setActiveSubmenu(null); setSubmenuRect(null); setSubmenuItems([]); return; }
        const allItems = MENU_DATA.flatMap(s => s.items);
        const item = allItems.find(i => i.id === id);
        if (item?.hasSubmenu) {
            setActiveSubmenu(id);
            setSubmenuRect(rect);
            setSubmenuItems(item.submenuItems || []);
        } else {
            setActiveSubmenu(null); setSubmenuRect(null); setSubmenuItems([]);
        }
    }

    // ── AI calls ──────────────────────────────────────────────────────────────
    async function runAI(action) {
        ensureSelection(editor);
        const selectedText = editor.getSelectedText();
        if (!selectedText) return;
        setLoading(true);
        try {
            const fullContent = await editor.blocksToFullHTML(editor.document);
            const text = await callAI(action, { selectedText, fullContent });
            setPreview(text);
        } catch (err) {
            console.error(err);
            toast.error(String(err));
        } finally {
            setLoading(false);
            setPending(true);
        }
    }

    async function runAIPrompt() {
        if (!prompt.trim()) return;
        ensureSelection(editor);
        const selectedText = editor.getSelectedText();
        if (!selectedText) return;
        setLoading(true);
        setPrompt("");
        try {
            const fullContent = await editor.blocksToFullHTML(editor.document);
            const text = await callAI("rewrite", { selectedText, fullContent, prompt });
            setPreview(text);
        } catch (err) {
            console.error(err);
            toast.error(String(err));
        } finally {
            setLoading(false);
        }
    }

    // ── Accept / revert ───────────────────────────────────────────────────────
    function acceptResult() {
        const selection = editor.getSelection();
        if (!selection?.blocks?.length || !preview) return;
        applyResultToBlock(editor, selection.blocks[0].id, preview);
        closePanel();
    }

    function revertAI() {
        setPending(false);
        setLoading(false);
        closePanel();
    }

    // ── Result action dispatcher ──────────────────────────────────────────────
    function handleResultAction(action) {
        switch (action) {
            case "accept": acceptResult(); break;
            case "close": revertAI(); break;
            case "insert": acceptResult(); break;   // can differentiate later
            case "retry": runAI("rewrite"); break;
            default: break;
        }
    }
    hideToolbars();
    useEffect(() => {
        if (loading) {
            //, document.body.style.overflow = "hidden";

            const blockKeys = (e: KeyboardEvent) => {
                e.preventDefault();
                e.stopPropagation();
            };

            window.addEventListener("keydown", blockKeys, true);

            return () => {
                //, document.body.style.overflow = "";
                window.removeEventListener("keydown", blockKeys, true);
            };
        }
    }, [loading]);
    const isActive = prompt.trim().length > 0 && !loading;

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <>
            <Components.FormattingToolbar.Button mainTooltip="Chat với AI" onClick={openPanel}>
                <AIIcon />
            </Components.FormattingToolbar.Button>

            {panelPos && createPortal(
                <div
                    ref={panelRef}
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{
                        position: "absolute",
                        top: panelPos.top,
                        left: panelPos.left,
                        minWidth: 280,
                        background: "transparent",
                        zIndex: 10003,
                    }}
                >
                    {/* ── Input card ──────────────────────────────────────── */}
                    <div style={{
                        ...inputLikeStyle,
                        display: "flex", flexDirection: "column",
                        width: panelPos.width, gap: 2,
                        paddingTop: 2, paddingBottom: 2, paddingInline: 12,
                    }}>
                        {/* Avatar */}
                        <div style={{ position: "absolute", top: 8, insetInlineStart: -40 }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: 100, background: "#fff",
                                boxShadow: "0px 14px 27px -6px #0000001a, 0px 2px 4px -1px #0000000f, 0 0 0 1px #54483114",
                                overflow: "hidden",
                            }}>
                                {/* bot face SVG (unchanged) */}
                                <RobotAvatar />
                            </div>
                        </div>

                        {/* Preview text */}
                        {preview && (
                            <div style={{
                                color: "#000", whiteSpace: "pre-wrap", fontSize: 14,
                                borderRadius: 12, fontWeight: 500,
                                marginTop: 8, marginInline: 4,
                            }}>
                                <div style={{ whiteSpace: "break-spaces", wordBreak: "break-word", paddingBlock: 3, paddingInline: 2 }}>
                                    {preview}
                                </div>
                            </div>
                        )}

                        {/* Input row */}
                        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                            <div className="input-wrapper">
                                {loading && (
                                    <div className="fake-placeholder">
                                        Đang suy nghĩ
                                        <svg className="loading-dots" width="32" height="24" viewBox="0 0 32 24" fill="none">
                                            <circle className="dot red" cx="6" cy="12" r="3" />
                                            <circle className="dot blue" cx="16" cy="12" r="3" />
                                            <circle className="dot green" cx="26" cy="12" r="3" />
                                        </svg>
                                    </div>
                                )}
                                <Textarea
                                    disabled={loading}
                                    className="textarea"
                                    ref={inputRef}
                                    placeholder={loading ? "" : "Hỏi AI bất kỳ điều gì..."}
                                    autosize
                                    value={prompt}
                                    onChange={(e) => {
                                        setPrompt(e.currentTarget.value);
                                        e.currentTarget.style.height = "auto";
                                        e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
                                    }}
                                    onKeyDown={(e) => {
                                        e.stopPropagation();
                                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); runAIPrompt(); }
                                        if (e.key === "Escape") closePanel();
                                    }}
                                    style={{
                                        color: "#6c6c6b", width: "100%", whiteSpace: "pre-wrap",
                                        wordBreak: "break-word", maxHeight: 240, overflowY: "auto",
                                        resize: "none", paddingTop: 8, paddingBottom: 0,
                                        marginLeft: -10, border: "none", fontSize: 12, minHeight: 30,
                                    }}
                                />
                            </div>

                            {/* Bottom bar */}
                            <div style={{
                                display: "flex", justifyContent: "space-between",
                                width: "100%", flex: 1, paddingTop: 2, paddingBottom: 5, marginTop: -1,
                            }}>
                                {/* Left – context source */}
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <Tooltip label="Viết dựa trên kiến thức trong...">
                                        <div role="button" style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#72716e" }}>
                                            <span style={{ fontSize: 16 }}>👋</span>
                                            <span>Trang hiện tại</span>
                                            <svg viewBox="3.06 0 9.88 16" style={{ width: "auto", height: 16, fill: "#72716e" }}>
                                                <path d="m12.76 6.52-4.32 4.32a.62.62 0 0 1-.44.18.62.62 0 0 1-.44-.18L3.24 6.52a.63.63 0 0 1 0-.88c.24-.24.64-.24.88 0L8 9.52l3.88-3.88c.24-.24.64-.24.88 0s.24.64 0 .88" />
                                            </svg>
                                        </div>
                                    </Tooltip>
                                    <div style={{ display: "flex", alignItems: "center", gap: 0, justifyContent: "center" }}>
                                        <Tooltip label="Đề cập đến một người, trang hoặc ngày">

                                            <div role="button" tabIndex={0}
                                                aria-label="Nhắc đến một người, trang hoặc ngày"
                                                style={{
                                                    userSelect: "none",
                                                    transition: "background 20ms ease-in",
                                                    cursor: "pointer",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: 0,
                                                    height: 20,
                                                    paddingInline: 0,
                                                    borderRadius: 6,
                                                    whiteSpace: "nowrap",
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                    lineHeight: 1.2,
                                                    width: 20,
                                                    color: "var(--c-texPri)",
                                                    flexShrink: 0,
                                                    marginInline: 0,
                                                    marginLeft: "3px",
                                                }}>
                                                <svg aria-hidden="true"
                                                    role="graphics-symbol"
                                                    viewBox="0 0 20 20" className="at"
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                        display: "block",
                                                        fill: "var(--c-icoSec)",
                                                        flexShrink: 0,
                                                    }}>
                                                    <path
                                                        d="M14.754 4.125a7.625 7.625 0 1 0-2.052 12.964.625.625 0 0 0-.46-1.162 6.376 6.376 0 1 1 3.672-3.83c-.159.457-.654.778-1.278.778a1.28 1.28 0 0 1-1.28-1.28V7.079a.625.625 0 0 0-1.25 0v.214c-.654-.555-1.496-.839-2.383-.839-.969 0-1.878.338-2.546 1-.672.665-1.058 1.614-1.058 2.751s.385 2.098 1.05 2.778c.665.679 1.575 1.04 2.554 1.04s1.893-.36 2.563-1.037q.075-.074.143-.153a2.53 2.53 0 0 0 2.207 1.292c1.01 0 2.081-.533 2.459-1.618a7.625 7.625 0 0 0-2.341-8.382m-7.385 6.08c0-.846.28-1.46.687-1.862.41-.406.99-.639 1.667-.639s1.266.234 1.683.641c.412.404.697 1.018.697 1.86 0 .844-.286 1.478-.704 1.9-.421.425-1.01.669-1.676.669-.667 0-1.247-.243-1.66-.666-.412-.42-.694-1.056-.694-1.903">
                                                    </path>
                                                </svg>
                                            </div>
                                        </Tooltip>
                                    </div>
                                </div>

                                {/* Right – like / dislike / send */}
                                <div style={{ display: "flex", alignItems: "center", gap: 2, alignSelf: "flex-end" }}>
                                    <Tooltip label="Hữu ích">
                                        <div role="button" onClick={() => setRateAnswer(1)} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 6 }}>
                                            <svg viewBox="0 0 16 16" style={{ width: 16, height: 16, fill: rateAnswer === 1 ? "blue" : "white", stroke: rateAnswer === 1 ? "white" : "gray" }}>
                                                <path d="M8.45 12.75a3.66 3.66 0 0 1-1.643-.387v-.008l-1.132-.387h-.097v-6.15l1.399-1.492c.233-.298.458-.745.672-1.172.143-.283.28-.557.413-.773l.287-.589a1.024 1.024 0 0 1 1.232-.418c.496.193.76.728.612 1.24l-.403 1.41c-.079.272-.192.5-.305.73-.11.22-.22.441-.3.704a.32.32 0 0 0 .31.41h3.256a.97.97 0 0 1 .969.97c0 .333-.179.62-.442.79a.94.94 0 0 1 .534.852.955.955 0 0 1-.65.907.96.96 0 0 1 .364.744.96.96 0 0 1-.961.969.97.97 0 0 1-.69 1.65zM4.61 6.334H2.913a.727.727 0 0 0-.727.726v4.181c0 .402.326.727.727.727H4.61z" />
                                            </svg>
                                        </div>
                                    </Tooltip>

                                    <Tooltip label="Không hữu ích">
                                        <div role="button" onClick={() => { setRateAnswer(2); setRateModal(true); }} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 6, transform: "rotate(180deg)" }}>
                                            <svg viewBox="0 0 16 16" style={{ width: 16, height: 16, fill: rateAnswer === 2 ? "blue" : "white", stroke: rateAnswer === 2 ? "white" : "gray" }}>
                                                <path d="M8.45 12.75a3.66 3.66 0 0 1-1.643-.387v-.008l-1.132-.387h-.097v-6.15l1.399-1.492c.233-.298.458-.745.672-1.172.143-.283.28-.557.413-.773l.287-.589a1.024 1.024 0 0 1 1.232-.418c.496.193.76.728.612 1.24l-.403 1.41c-.079.272-.192.5-.305.73-.11.22-.22.441-.3.704a.32.32 0 0 0 .31.41h3.256a.97.97 0 0 1 .969.97c0 .333-.179.62-.442.79a.94.94 0 0 1 .534.852.955.955 0 0 1-.65.907.96.96 0 0 1 .364.744.96.96 0 0 1-.961.969.97.97 0 0 1-.69 1.65zM4.61 6.334H2.913a.727.727 0 0 0-.727.726v4.181c0 .402.326.727.727.727H4.61z" />
                                            </svg>
                                        </div>
                                    </Tooltip>
                                    {rateModal && <DislikeModal onClose={() => setRateModal(false)} />}

                                    <Tooltip label="Gửi">
                                        <div
                                            role="button"
                                            onClick={() => { if (!isActive) return; runAIPrompt(); }}
                                            style={{
                                                cursor: isActive ? "pointer" : "default",
                                                opacity: isActive ? 1 : 0.4,
                                                background: isActive ? "var(--c-bgAccent)" : "transparent",
                                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                                height: 24, width: 24, borderRadius: 100,
                                                pointerEvents: isActive ? "auto" : "none",
                                            }}
                                        >
                                            <svg viewBox="0 0 20 20" style={{ width: 24, height: 24, fill: isActive ? "blue" : "" }}>
                                                <path d="M10 17.625a7.625 7.625 0 1 0 0-15.25 7.625 7.625 0 0 0 0 15.25m3.042-8.07a.625.625 0 0 1-.884 0L10.625 8.02v5.466a.625.625 0 1 1-1.25 0V8.021L7.842 9.554a.625.625 0 1 1-.884-.883l2.6-2.6a.625.625 0 0 1 .884 0l2.6 2.6a.625.625 0 0 1 0 .883" />
                                            </svg>
                                        </div>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Command / Result dropdown ────────────────────────── */}
                    <div className="ai-menu-wrapper" style={menuDropdownStyle}>
                        {!loading && !preview && (
                            <>
                                <div className="menu-wrapper">
                                    {MENU_DATA.map((section) => (
                                        <div key={section.section} className="menu-section">
                                            <div className="section-label">{section.section}</div>
                                            {section.items.map((item) => (
                                                <MenuItem
                                                    key={item.id}
                                                    item={item}
                                                    isActive={activeSubmenu === item.id}
                                                    onHover={handleHover}
                                                    onClick={() => runAI(item.action)}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                {activeSubmenu && submenuRect && (
                                    <Submenu
                                        items={submenuItems}
                                        anchorRect={submenuRect}
                                        onSelect={() => runAI("rewrite")}
                                    />
                                )}
                            </>
                        )}

                        {!loading && preview && (
                            <div className="menu-wrapper h-auto">
                                <div className="menu-section">
                                    {RESULT_ACTIONS.map((item) => (
                                        <MenuItem
                                            key={item.id}
                                            item={item}
                                            isActive={false}
                                            onHover={() => { }}
                                            onClick={() => handleResultAction(item.action)}
                                        />
                                    ))}
                                </div>
                                <MenuItem
                                    item={{
                                        id: "upgrade",
                                        label: <><span style={{ color: "#2b7fff" }}>Nâng cấp</span> lên PRO AI</>,
                                        icon: "upgrade",
                                        iconColor: "#2b7fff",
                                    }}
                                    isActive={false}
                                    onHover={() => { }}
                                    onClick={() => alert("Cập nhật lên PRO AI để sử dụng tính năng này")}
                                />
                            </div>
                        )}
                    </div>

                    {/* Overlays */}
                    <LoadingOverlay loading={loading} onClick={() => setShowCloseConfirm(true)} />
                    {showCloseConfirm && (
                        <CancelModal
                            keep={acceptResult}
                            notKeep={revertAI}
                            onClose={() => setShowCloseConfirm(false)}
                        />
                    )}
                </div>,
                document.body
            )}
        </>
    );
}
