import toast from "react-hot-toast";

export const DislikeModal = ({ onClose }: { onClose: () => void }) => {
    return (
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
                zIndex: 10004,
            }}
        >
            {/* Modal box */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: 600,
                    maxWidth: "90%",
                    background: "#fff",
                    borderRadius: 12,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Content */}
                <div style={{ padding: 24 }}>
                    <div style={{ marginBottom: 12 }}>
                        <div
                            style={{
                                fontSize: 20,
                                fontWeight: 600,
                                lineHeight: "25px",
                                marginBottom: 8,
                            }}
                        >
                            Chúng tôi có thể cải thiện phản hồi này như thế nào?
                        </div>

                        <div
                            style={{
                                fontSize: 14,
                                lineHeight: "20px",
                                color: "#6b7280",
                            }}
                        >
                            Phản hồi của bạn giúp WTT Studio ngày càng hoàn thiện.
                            Tin nhắn trong cuộc trò chuyện và phản hồi của bạn sẽ
                            được gửi để cải thiện AI.
                        </div>
                    </div>

                    <textarea
                        placeholder="Mô tả sự cố đã xảy ra và kết quả bạn mong đợi."
                        rows={4}
                        style={{
                            width: "100%",
                            borderRadius: 6,
                            border: "1px solid #e5e7eb",
                            padding: 10,
                            fontSize: 14,
                            resize: "none",
                            outline: "none",
                        }}
                    />
                </div>

                {/* Footer */}
                <div
                    style={{
                        padding: 24,
                        borderTop: "1px solid #e5e7eb",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            height: 32,
                            padding: "0 12px",
                            borderRadius: 6,
                            border: "1px solid #e5e7eb",
                            background: "white",
                            cursor: "pointer",
                            fontWeight: 500,
                        }}
                    >
                        Hủy
                    </button>

                    <button
                        onClick={() => { onClose(); toast.success("Ý kiến của bạn đã được ghi nhận!") }}
                        style={{
                            height: 32,
                            padding: "0 12px",
                            borderRadius: 6,
                            border: "none",
                            background: "#2563eb",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: 500,
                        }}
                    >
                        Gửi
                    </button>
                </div>
            </div>
        </div>
    );
};