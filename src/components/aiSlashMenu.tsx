// aiSlashMenu.tsx  –  Slash-command AI panel
// Shared logic lives in aiUtils.js
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useAIState } from "./aiState";
import type { BlockNoteEditor } from "@blocknote/core";
import type { PartialBlock } from "@blocknote/core";
import "../../styles/style.css";
import { AIFloatingChat } from "./AIFloatingChat";
import {
    MENU_DATA, RESULT_ACTIONS, ICONS,
    getSelectionRect, callAI, applyResultToEditor, ensureSelection,
    inputLikeStyle, menuDropdownStyle, hideToolbars, RobotAvatar
} from "./aiUtils";
import { CancelModal } from "./cancelModal";
import { DislikeModal } from "./DislikeModal";
import toast from "react-hot-toast";


// ── MenuItem (local copy – same as BlueButton) ────────────────────────────────
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
        <div className="submenu" style={{ position: "fixed", top: anchorRect.top, left: anchorRect.right }}>
            {items.map((lang) => (
                <div key={lang} className="submenu-item" onClick={() => onSelect(lang)}>
                    {lang}
                </div>
            ))}
        </div>
    );
}

// ── LoadingOverlay ────────────────────────────────────────────────────────────
function LoadingOverlay({ loading, onClick }) {
    if (!loading) return null;
    return createPortal(
        <div
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onClick(); }}
            style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "all" }}
        />,
        document.body
    );
}

// ── AIFloatingPanel ───────────────────────────────────────────────────────────
function AIFloatingPanel({ editor, onClose }) {
    const openAI = useAIState((s) => s.openAI);

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

    useEffect(() => { loadingRef.current = loading; }, [loading]);

    // Position on mount
    useEffect(() => {
        const pos = getSelectionRect();
        const rect = document.getElementById("editor-root").getBoundingClientRect();
        console.log(rect);
        setPanelPos(pos ?? { top: window.scrollY + 120, left: rect.left + 54, width: rect.width - 108 });
        setTimeout(() => inputRef.current?.focus(), 60);
    }, []);

    // Block keyboard while loading
    useEffect(() => {
        if (!loading) return;
        document.body.style.overflow = "hidden";
        const block = (e) => { e.preventDefault(); e.stopPropagation(); };
        window.addEventListener("keydown", block, true);
        return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", block, true); };
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

    function closePanel() {
        setPanelPos(null);
        setPrompt("");
        setPreview(null);
        openAI();
        onClose();
    }

    // ── Submenu hover ─────────────────────────────────────────────────────────
    function handleHover(id, rect) {
        if (!id) { setActiveSubmenu(null); setSubmenuRect(null); setSubmenuItems([]); return; }
        const allItems = MENU_DATA.flatMap(s => s.items);
        const item = allItems.find(i => i.id === id);
        if (item?.hasSubmenu) {
            setActiveSubmenu(id); setSubmenuRect(rect); setSubmenuItems(item.submenuItems || []);
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
        }
    }
    hideToolbars();
    async function runAIPrompt() {
        if (!prompt.trim()) return;
        ensureSelection(editor);
        const selectedText = editor.getSelectedText();
        setLoading(true);
        try {
            const fullContent = await editor.blocksToFullHTML(editor.document);
            const text = await callAI("prompt", { selectedText, fullContent, prompt });
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
        applyResultToEditor(editor, preview);
        closePanel();
    }

    function handleResultAction(action) {
        switch (action) {
            case "accept": acceptResult(); break;
            case "close": closePanel(); break;
            case "insert": acceptResult(); break;
            case "retry": runAI("rewrite"); break;
            default: break;
        }
    }
    function revertAI() {
        setLoading(false);
        closePanel();
    }
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

    if (!panelPos) return null;

    return createPortal(
        <>
            {/* Overlays */}
            <LoadingOverlay loading={loading} onClick={() => setShowCloseConfirm(true)} />
            {showCloseConfirm && (
                <CancelModal
                    keep={acceptResult}
                    notKeep={revertAI}
                    onClose={() => setShowCloseConfirm(false)}
                />
            )}

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
                {/* ── Input card ─────────────────────────────────────────── */}
                <div style={{
                    ...inputLikeStyle,
                    display: "flex", flexDirection: "column",
                    width: panelPos.width, gap: 2,
                    paddingTop: 2, paddingBottom: 2, paddingInline: 12,
                }}>

                    {/* Preview */}
                    {preview && (
                        <div style={{
                            color: "#000", whiteSpace: "pre-wrap", fontSize: 14,
                            borderRadius: 12, fontWeight: 500, marginTop: 8, marginInline: 4,
                        }}>
                            <div style={{ whiteSpace: "break-spaces", wordBreak: "break-word", paddingBlock: 3, paddingInline: 2 }}>
                                {preview}
                            </div>
                        </div>
                    )}

                    {/* Input */}
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
                        <input
                            ref={inputRef}
                            placeholder={loading ? "" : "Hỏi AI bất kỳ điều gì..."}
                            value={prompt}
                            disabled={loading}
                            onChange={(e) => setPrompt(e.currentTarget.value)}
                            onKeyDown={(e) => {
                                e.stopPropagation();
                                if (e.key === "Enter") runAIPrompt();
                                if (e.key === "Escape") { loading ? setShowCloseConfirm(true) : closePanel(); }
                            }}
                            style={{
                                color: "#6c6c6b", fontSize: 12, width: "100%",
                                border: "none", outline: "none", background: "transparent",
                                minHeight: 30, paddingTop: 8, paddingBottom: 0,
                                fontFamily: "inherit",
                            }}
                        />
                    </div>

                    {/* Bottom bar */}
                    <div style={{
                        display: "flex", justifyContent: "space-between",
                        width: "100%", flex: 1, paddingTop: 2, paddingBottom: 5,
                    }}>
                        <div style={{ fontSize: 12, color: "#72716e", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ fontSize: 14 }}>👋</span> Trang hiện tại
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 2, alignSelf: "flex-end" }}>
                            {/* <Tooltip label="Hữu ích"> */}
                            <div role="button" onClick={() => setRateAnswer(1)} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 6 }}>
                                <svg viewBox="0 0 16 16" style={{ width: 16, height: 16, fill: rateAnswer === 1 ? "blue" : "white", stroke: rateAnswer === 1 ? "white" : "gray" }}>
                                    <path d="M8.45 12.75a3.66 3.66 0 0 1-1.643-.387v-.008l-1.132-.387h-.097v-6.15l1.399-1.492c.233-.298.458-.745.672-1.172.143-.283.28-.557.413-.773l.287-.589a1.024 1.024 0 0 1 1.232-.418c.496.193.76.728.612 1.24l-.403 1.41c-.079.272-.192.5-.305.73-.11.22-.22.441-.3.704a.32.32 0 0 0 .31.41h3.256a.97.97 0 0 1 .969.97c0 .333-.179.62-.442.79a.94.94 0 0 1 .534.852.955.955 0 0 1-.65.907.96.96 0 0 1 .364.744.96.96 0 0 1-.961.969.97.97 0 0 1-.69 1.65zM4.61 6.334H2.913a.727.727 0 0 0-.727.726v4.181c0 .402.326.727.727.727H4.61z" />
                                </svg>
                            </div>
                            {/* </Tooltip> */}

                            {/* <Tooltip label="Không hữu ích"> */}
                            <div role="button" onClick={() => { setRateAnswer(2); setRateModal(true); }} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 6, transform: "rotate(180deg)" }}>
                                <svg viewBox="0 0 16 16" style={{ width: 16, height: 16, fill: rateAnswer === 2 ? "blue" : "white", stroke: rateAnswer === 2 ? "white" : "gray" }}>
                                    <path d="M8.45 12.75a3.66 3.66 0 0 1-1.643-.387v-.008l-1.132-.387h-.097v-6.15l1.399-1.492c.233-.298.458-.745.672-1.172.143-.283.28-.557.413-.773l.287-.589a1.024 1.024 0 0 1 1.232-.418c.496.193.76.728.612 1.24l-.403 1.41c-.079.272-.192.5-.305.73-.11.22-.22.441-.3.704a.32.32 0 0 0 .31.41h3.256a.97.97 0 0 1 .969.97c0 .333-.179.62-.442.79a.94.94 0 0 1 .534.852.955.955 0 0 1-.65.907.96.96 0 0 1 .364.744.96.96 0 0 1-.961.969.97.97 0 0 1-.69 1.65zM4.61 6.334H2.913a.727.727 0 0 0-.727.726v4.181c0 .402.326.727.727.727H4.61z" />
                                </svg>
                            </div>
                            {/* </Tooltip> */}
                            {rateModal && <DislikeModal onClose={() => setRateModal(false)} />}

                            {/* <Tooltip label="Gửi"> */}
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
                            {/* </Tooltip> */}
                        </div>
                    </div>
                </div>

                {/* ── Command / Result dropdown ────────────────────────────── */}
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
            </div>
        </>,
        document.body
    );
    // return (
    //     <AIFloatingChat />
    // )
}

// ── mountAIPanel ──────────────────────────────────────────────────────────────
function mountAIPanel(editor) {
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
                onClose={() => { root.unmount(); container.remove(); }}
            />
        );
    });
}

// ── aiSlashItem (public API) ──────────────────────────────────────────────────
export function aiSlashItem(editor) {
    return {
        title: "Hỏi AI",
        aliases: ["ai", "hoi"],
        group: "AI",
        subtext: "Hỏi AI cho nội dung đang chọn",
        onItemClick: () => mountAIPanel(editor),
    };
}
