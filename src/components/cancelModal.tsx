import { createPortal } from "react-dom";
export const CancelModal = ({
    keep,
    notKeep,
    onClose,
}: {
    keep: () => void;
    notKeep: () => void;
    onClose: () => void;
}) => {
    if (typeof document === "undefined") return null;

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10003,
            }}
        >
            {/* Modal box */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: 324,
                    background: "#ffffff",
                    borderRadius: 12,
                    padding: 20,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            background: "#f3f4f6",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            overflow: "hidden",
                            margin: "0 auto 12px",
                        }}
                    >
                        <img
                            src="/ai-face.png"
                            alt="AI"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>

                    <div
                        style={{
                            fontWeight: 500,
                            lineHeight: "1.4em",
                            marginBottom: 16,
                        }}
                    >
                        Bạn có muốn giữ lại hay loại bỏ các chỉnh sửa AI đang chờ xử lý?
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                    }}
                >
                    <button
                        style={buttonStyle}
                        onClick={() => {
                            keep();
                            onClose();
                        }}
                    >
                        Giữ
                    </button>

                    <button
                        style={buttonStyle}
                        onClick={() => {
                            notKeep();
                            onClose();
                        }}
                    >
                        Hủy bỏ
                    </button>

                    <button style={buttonStyle} onClick={onClose}>
                        Hủy
                    </button>
                </div>
            </div>
        </div>
        , document.body);
};

const buttonStyle: React.CSSProperties = {
    height: 32,
    padding: "0 12px",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    border: "1px solid #e5e7eb",
    background: "white",
    cursor: "pointer",
};