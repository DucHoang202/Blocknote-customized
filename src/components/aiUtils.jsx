// ─────────────────────────────────────────────────────────────────────────────
// aiUtils.js  –  Shared constants, helpers, icons & styles
// Used by: BlueButton.tsx  and  aiSlashMenu.tsx
// ─────────────────────────────────────────────────────────────────────────────

// ── API ───────────────────────────────────────────────────────────────────────
//export const BASE_URL = "http://localhost:3000/ai";
export const BASE_URL = "https://content.kongbot.net/webhook/ai-editor";

// ── AI icon for toolbar ───────────────────────────────────────────────────────
export function RobotAvatar() {
    return (
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M266.43 53.6046C265.826 53.3126 265.145 53.246 264.485 53.1153C264.042 53.0288 263.577 53 263.105 53C262.305 53 261.488 53.0847 260.73 53.1225C257.949 53.2541 255.174 53.4424 252.393 53.601C248.478 53.7136 244.561 53.6325 240.645 53.7172C236.092 53.8154 231.557 54.0686 227.014 54.3506C224.447 54.4263 221.88 54.4172 219.309 54.4497C216.332 54.4911 213.355 54.6605 210.378 54.8236C208.098 54.9047 205.829 54.9173 203.547 54.865C201.382 54.8155 199.216 54.7065 197.051 54.6749C192.346 54.6073 187.645 54.583 182.939 54.5055C178.101 54.4281 173.274 54.4776 168.432 54.5974C163.86 54.7137 159.283 54.8326 154.707 54.8119C152.59 54.8011 150.472 54.6569 148.355 54.5866C147.184 54.5479 146.017 54.5623 144.85 54.5794C144.028 54.5902 143.207 54.601 142.39 54.5902C141.256 54.5758 140.24 54.8011 139.346 55.5119C138.473 56.2021 137.917 57.2229 137.828 58.3032" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M269.804 147.131C270.138 146.423 270.386 145.728 270.405 144.994C270.426 144.398 270.332 143.707 270.205 143.098C270.044 142.286 268.158 65.3936 267.99 63.0228C267.877 61.4876 267.803 59.9556 267.501 58.4288C267.227 57.0506 266.826 55.6914 266.431 54.3258" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M140.48 55.6516C139.649 55.8254 138.898 56.3752 138.411 57.1649C137.882 58.0245 137.757 58.9795 137.862 60.0015C137.991 61.2295 138.068 62.4556 138.128 63.6884C138.242 70.0399 139.118 130.121 139.273 132.881C139.352 135.033 139.411 137.187 139.505 139.342C139.617 141.954 139.71 144.567 140.201 147.131" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M140.478 149.783C142.039 150.036 143.553 150.171 145.125 150.154C146.69 150.137 259.181 152.632 261.925 152.422C263.016 152.339 264.103 152.226 265.19 152.112C265.668 152.06 266.146 152.016 266.62 151.938C267.357 151.816 268.517 151.197 269.079 150.607" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M194.567 97.0262C194.211 93.527 194.756 89.3005 194.904 86.1448" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M218.03 97.0262C218.064 93.6313 218.094 90.2581 218.199 86.8701" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M278.045 263.801C278.217 261.721 293.122 200.108 291.95 199.5C291.567 199.301 261.809 174.227 243.245 174.787C218.872 175.523 185.383 176.66 159.989 177.531C139.35 178.239 108.037 213.019 107.332 213.019" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M107.333 213.021C107.988 215.621 116.719 257.102 116.992 259.566C117.096 260.517 107.206 212.647 107.333 213.021Z" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M169.644 266.452C169.531 268.854 169.347 277.005 169.205 279.401C169.064 281.786 169 284.176 168.905 286.565C168.707 291.518 168.082 327.674 167.88 330.335C167.692 332.782 167.494 335.233 167.418 337.684C167.371 339.12 167.388 340.566 167.562 341.995C167.622 342.501 155.809 344.326 155.061 344.674" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M239.912 345.847C239.629 345.821 233.144 345.799 230.693 346C230.187 346.04 232.976 304.826 232.908 295.185C232.841 285.569 232.799 277.395 232.946 267.778" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M282.835 281.842C283.902 281.949 284.983 281.637 285.821 280.975C286.745 280.248 287.137 279.304 287.348 278.185C287.576 276.966 287.808 275.747 288.03 274.526C288.12 274.043 288.195 273.555 288.27 273.068C288.579 271.051 288.007 268.865 286.239 267.639C284.769 266.623 283.059 266.105 281.41 265.453C280.313 265.015 279.215 264.577 278.118 264.142C276.893 263.655 275.635 263.235 274.361 262.87C273.259 262.554 272.145 262.279 271.033 262.036C270.548 261.931 270.065 261.83 269.583 261.733C268.561 261.534 267.427 261.223 266.392 261.425C264.929 261.709 263.721 262.277 262.657 263.32C261.599 264.357 260.752 265.515 259.966 266.762C259.363 267.72 259.042 268.707 259.229 269.85C259.403 270.933 260.014 271.918 260.911 272.564" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M130.999 275.361C131.944 274.854 132.665 273.991 132.989 272.974C133.349 271.854 133.146 270.852 132.694 269.807C132.202 268.669 131.713 267.529 131.213 266.393C131.018 265.942 130.807 265.496 130.597 265.049C129.725 263.205 128.028 261.713 125.876 261.685C124.089 261.663 122.382 262.191 120.65 262.572C119.495 262.822 118.34 263.072 117.187 263.325C115.899 263.606 114.622 263.961 113.361 264.371C112.27 264.725 111.193 265.119 110.135 265.54C109.675 265.724 109.218 265.91 108.763 266.099C107.805 266.505 106.691 266.882 105.946 267.628C104.892 268.681 104.208 269.827 103.91 271.287C103.612 272.738 103.558 274.171 103.604 275.644C103.64 276.775 103.925 277.773 104.72 278.616C105.47 279.417 106.527 279.892 107.633 279.926" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M165.105 182.088C164.455 183.012 164.392 183.93 164.459 185.014C164.473 185.227 164.486 185.44 164.498 185.652C164.897 194.868 164.443 204.092 164.775 213.307C164.95 218.247 165.125 223.183 165.206 228.122C165.28 232.668 165.346 237.236 164.971 241.771C164.74 244.57 164.508 247.366 164.409 250.173C164.312 252.904 164.297 255.71 164.522 258.439C164.613 259.562 164.894 260.799 165.644 261.667C166.669 262.85 167.967 263.389 169.514 263.449C170.543 263.491 171.605 263.29 172.626 263.148C173.808 262.985 174.981 262.765 176.142 262.482C177.418 262.169 205.149 261.274 207.054 261.337C209.226 261.408 211.369 261.55 213.53 261.724C217.14 262.014 220.729 262.588 224.336 262.904C226.301 263.073 228.265 263.229 230.234 263.346C231.779 263.436 233.364 263.412 234.885 263.715L235.18 263.779C236.135 263.867 236.63 263.679 237.51 263.385C238.59 263.028 239.492 261.883 239.871 260.827C240.298 259.642 240.101 258.338 239.997 257.094C239.849 252.698 239.931 248.324 240.193 243.933C240.262 242.788 241.914 229.918 242.755 215.072C243.632 199.601 243.699 182.138 243.728 181.34C243.752 180.581 243.784 179.823 243.816 179.068C243.868 177.694 244.072 176.252 243.447 174.973" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M283.949 205.391C286.282 208.52 299.662 197.539 299.439 198.099" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M116.995 215.722C116.725 215.722 111.393 213.844 101 210.089" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M174.947 302.283C173.193 302.277 171.436 302.249 169.681 302.249C169.111 302.249 168.541 302.253 167.971 302.26C165.363 302.303 162.918 302.866 160.363 303.575" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M241.237 302.283C239.483 302.277 237.726 302.249 235.971 302.249C235.401 302.249 234.831 302.253 234.261 302.26C231.653 302.303 229.208 302.866 226.653 303.575" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M269.08 95.4253L282.629 96.7511L291.619 95.4253" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M131.2 94.7625H112.639" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M291.95 86.4895V102.782" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M111.824 86.4895V102.782" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
    );
}
// ── Menu sections & items ─────────────────────────────────────────────────────
export const MENU_DATA = [
    {
        section: "Được đề xuất",
        items: [
            { id: "improve", label: "Nâng cao chất lượng viết", icon: "magicWand", iconColor: "var(--pal-purple)", action: "improve" },
            { id: "proofread", label: "Đọc soát", icon: "checkmarkCircle", iconColor: "var(--pal-purple)", action: "improve" },
            {
                id: "translate", label: "Dịch sang", icon: "textTranslate", iconColor: "var(--pal-green)",
                hasSubmenu: true, action: "improve",
                submenuItems: ["Tiếng Anh", "Tiếng Việt", "Tiếng Pháp", "Tiếng Đức", "Tiếng Tây Ban Nha", "Tiếng Nhật", "Tiếng Trung", "Tiếng Hàn"],
            },
        ],
    },
    {
        section: "Chỉnh sửa",
        items: [
            { id: "shorten", label: "Viết ngắn lại", icon: "textShort", iconColor: "var(--pal-purple)", action: "shorten" },
            {
                id: "tone", label: "Thay đổi giọng điệu", icon: "quill", iconColor: "var(--pal-purple)",
                hasSubmenu: true, action: "improve",
                submenuItems: ["Chuyên nghiệp", "Thân thiện", "Trực tiếp", "Tự tin", "Đơn giản"],
            },
            { id: "simplify", label: "Đơn giản hóa ngôn ngữ", icon: "sparkles", iconColor: "var(--pal-purple)", action: "shorten" },
            { id: "lengthen", label: "Viết dài hơn", icon: "textJustify", iconColor: "var(--pal-purple)", action: "expand" },
            { id: "edit-selection", label: "Chỉnh sửa phần đã chọn…", icon: "pencilLine", iconColor: "var(--pal-purple)", action: "rewrite" },
        ],
    },
    {
        section: "Soạn thảo",
        items: [
            { id: "draft", label: "Soạn thảo bất cứ nội dung gì…", icon: "pencilLine", iconColor: "var(--pal-purple)", action: "improve" },
        ],
    },
    {
        section: "Suy nghĩ, hỏi, trò chuyện",
        items: [
            { id: "code", label: "Nhận trợ giúp về mã…", icon: "code", iconColor: "var(--pal-green)", action: "improve" },
        ],
    },
    {
        section: "Tìm kiếm, tìm",
        items: [
            { id: "ask", label: "Đặt câu hỏi…", icon: "magnifyingGlass", iconColor: "var(--pal-blue)", action: "improve" },
            { id: "ask-page", label: "Hỏi về trang này…", icon: "magnifyingGlass", iconColor: "var(--pal-blue)", action: "improve" },
        ],
    },
    {
        section: "Gần đây",
        items: [
            {
                id: "recent-translate", label: "Dịch sang", labelSuffix: "Tiếng Anh",
                icon: "textTranslate", iconColor: "var(--pal-green)", hasSubmenu: true, action: "improve",
                submenuItems: ["Tiếng Anh", "Tiếng Việt", "Tiếng Pháp", "Tiếng Đức", "Tiếng Tây Ban Nha", "Tiếng Nhật", "Tiếng Trung", "Tiếng Hàn"],
            },
            { id: "recent-lengthen", label: "Viết dài hơn", icon: "textJustify", iconColor: "var(--pal-purple)", action: "improve" },
        ],
    },
];

// ── Result-action items shown after AI responds ───────────────────────────────
export const RESULT_ACTIONS = [
    { id: "accept", label: "Chấp nhận", icon: "tick", action: "accept" },
    { id: "close", label: "Đóng", icon: "close", action: "close", shortcut: "Escape" },
    { id: "insert", label: "Chèn bên dưới", icon: "insert", action: "insert" },
    { id: "retry", label: "Thử lại", icon: "retry", action: "retry" },
];

// ── SVG Icons ─────────────────────────────────────────────────────────────────
export const ICONS = {
    tick: (
        <svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" style={{ width: 20, height: 20, display: "block", fill: "var(--c-icoPri)", flexShrink: 0 }}>
            <path d="M15.784 4.002a.625.625 0 0 1 .214.857L9.445 15.784a.625.625 0 0 1-1.01.085l-4.37-5.098a.625.625 0 0 1 .948-.814l3.806 4.44 6.109-10.181a.625.625 0 0 1 .857-.214" />
        </svg>
    ),
    magicWand: (
        <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
            <path d="M10.55 3a.55.55 0 0 0-1.1 0v2a.55.55 0 0 0 1.1 0zM8.47 8.47a.75.75 0 0 1 1.06 0l.897.896-1.06 1.06-.897-.896a.75.75 0 0 1 0-1.06m1.603 2.664 6.647 6.646a.75.75 0 1 0 1.06-1.06l-6.646-6.647zM10.55 15a.55.55 0 0 0-1.1 0v2a.55.55 0 0 0 1.1 0zm-3.697-1.853a.55.55 0 0 1 0 .777L5.44 15.34a.55.55 0 1 1-.778-.778l1.415-1.415a.55.55 0 0 1 .777 0m8.485-8.486a.55.55 0 0 1 0 .778l-1.415 1.414a.55.55 0 1 1-.777-.777L14.56 4.66a.55.55 0 0 1 .777 0M5.55 10a.55.55 0 0 1-.55.55H3a.55.55 0 1 1 0-1.1h2a.55.55 0 0 1 .55.55m12 0a.55.55 0 0 1-.55.55h-2a.55.55 0 1 1 0-1.1h2a.55.55 0 0 1 .55.55M6.853 6.853a.55.55 0 0 1-.778 0L4.661 5.44a.55.55 0 1 1 .778-.778l1.414 1.415a.55.55 0 0 1 0 .777" />
        </svg>
    ),
    checkmarkCircle: (
        <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
            <path d="M12.876 7.982a.625.625 0 1 0-1.072-.644L9.25 11.595 7.815 9.92a.625.625 0 0 0-.95.813l2 2.334a.625.625 0 0 0 1.01-.085z" />
            <path d="M10 2.375a7.625 7.625 0 1 0 0 15.25 7.625 7.625 0 0 0 0-15.25M3.625 10a6.375 6.375 0 1 1 12.75 0 6.375 6.375 0 0 1-12.75 0" />
        </svg>
    ),
    textTranslate: (
        <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
            <path d="M14.776 5.217a.625.625 0 1 0-1.25 0v.967H9.524a.625.625 0 1 0 0 1.25h6.688c-.32.87-.963 2.091-2.06 3.375a12.8 12.8 0 0 1-1.48-2.122.625.625 0 1 0-1.095.603c.415.754.978 1.589 1.717 2.438a16.3 16.3 0 0 1-3.341 2.512.625.625 0 0 0 .62 1.085 17.6 17.6 0 0 0 3.58-2.688 17.6 17.6 0 0 0 3.577 2.688.625.625 0 1 0 .622-1.085 16.3 16.3 0 0 1-3.342-2.512c1.42-1.632 2.196-3.216 2.52-4.294h1.251a.625.625 0 1 0 0-1.25h-4.005zm-8.014 7.16.958 2.62a.625.625 0 0 0 1.174-.43L5.645 5.683a.94.94 0 0 0-1.765 0L.632 14.568a.625.625 0 1 0 1.174.43l.958-2.621zm-.457-1.25H3.221l1.542-4.219z" />
        </svg>
    ),
    textShort: (
        <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
            <path d="M2.9 7.708a.625.625 0 0 0 0 1.25h14.2a.625.625 0 1 0 0-1.25zm0 3.334a.625.625 0 1 0 0 1.25h9.457a.625.625 0 0 0 0-1.25z" />
        </svg>
    ),
    quill: (
        <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
            <path d="M2.865 17.61q.069.015.136.015a.626.626 0 0 0 .61-.49c.024-.11 2.473-10.663 11.949-12.82a15.2 15.2 0 0 1-1.617 3.008l-1.996-.087a.6.6 0 0 0-.49.206.63.63 0 0 0-.155.51l.294 1.984a12.8 12.8 0 0 1-4.218 2.424.624.624 0 1 0 .405 1.182 14 14 0 0 0 4.9-2.9.63.63 0 0 0 .199-.555l-.232-1.57 1.579.07a.59.59 0 0 0 .533-.258c1.683-2.316 2.276-4.422 2.335-4.644a.64.64 0 0 0-.127-.586.64.64 0 0 0-.582-.214C5.21 4.633 2.417 16.743 2.39 16.865a.626.626 0 0 0 .475.745M6 17.625h10a.626.626 0 0 0 0-1.25H6a.625.625 0 0 0 0 1.25" />
        </svg>
    ),
    sparkles: (
        <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
            <path d="M13.217 7.07a.63.63 0 0 0-1.26 0c0 1.115-.524 2.228-1.367 3.07-.843.843-1.956 1.367-3.07 1.367a.63.63 0 0 0 0 1.26c1.114 0 2.227.525 3.07 1.367.843.843 1.367 1.956 1.367 3.07a.63.63 0 1 0 1.26 0c0-1.114.524-2.227 1.367-3.07.842-.842 1.956-1.367 3.07-1.367a.63.63 0 1 0 0-1.26c-1.114 0-2.228-.524-3.07-1.366-.843-.843-1.367-1.956-1.367-3.07m-1.736 3.961a6.2 6.2 0 0 0 1.106-1.496c.29.552.668 1.059 1.106 1.496s.944.816 1.497 1.106a6.2 6.2 0 0 0-1.497 1.106 6.2 6.2 0 0 0-1.106 1.497 6.2 6.2 0 0 0-1.106-1.497 6.2 6.2 0 0 0-1.497-1.106 6.2 6.2 0 0 0 1.497-1.106M6.35 2.796a.63.63 0 1 0-1.26 0c0 .54-.34 1.233-.926 1.819s-1.279.926-1.82.926a.63.63 0 1 0 0 1.26c.541 0 1.234.34 1.82.925.586.586.926 1.279.926 1.82a.63.63 0 0 0 1.26 0c0-.541.34-1.234.926-1.82.585-.585 1.278-.925 1.819-.925a.63.63 0 1 0 0-1.26c-.54 0-1.234-.34-1.82-.926-.585-.586-.925-1.279-.925-1.82m-1.295 2.71c.243-.244.47-.52.665-.816A5.2 5.2 0 0 0 7.2 6.17a5.15 5.15 0 0 0-1.48 1.48 5.15 5.15 0 0 0-1.48-1.48c.296-.194.572-.421.815-.664" />
        </svg>
    ),
    textJustify: (
        <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
            <path d="M2.9 4.375a.625.625 0 1 0 0 1.25h14.2a.625.625 0 1 0 0-1.25zm0 3.333a.625.625 0 0 0 0 1.25h14.2a.625.625 0 1 0 0-1.25zM2.275 15c0-.345.28-.625.625-.625H10a.625.625 0 1 1 0 1.25H2.9A.625.625 0 0 1 2.275 15m.625-3.958a.625.625 0 1 0 0 1.25h14.2a.625.625 0 0 0 0-1.25z" />
        </svg>
    ),
    pencilLine: (
        <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
            <path d="m13.987 5.682-.684.684-1.288-1.288.692-.691a.91.91 0 0 1 1.28 0c.35.35.35.93 0 1.28zm-9.433 9.433 7.914-7.914-1.289-1.289-7.92 7.908c-.122.122-.214.29-.274.457l-.336 1.082c-.06.229.153.442.366.366l1.082-.335q.252-.07.457-.275m12.446.76H5.61l1.25-1.25H17a.625.625 0 1 1 0 1.25" />
        </svg>
    ),
    code: (
        <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
            <path d="M12.6 3.172a.625.625 0 0 0-1.201-.344l-4 14a.625.625 0 0 0 1.202.344zM5.842 5.158a.625.625 0 0 1 0 .884L1.884 10l3.958 3.958a.625.625 0 0 1-.884.884l-4.4-4.4a.625.625 0 0 1 0-.884l4.4-4.4a.625.625 0 0 1 .884 0m8.316 0a.625.625 0 0 1 .884 0l4.4 4.4a.625.625 0 0 1 0 .884l-4.4 4.4a.625.625 0 0 1-.884-.884L18.116 10l-3.958-3.958a.625.625 0 0 1 0-.884" />
        </svg>
    ),
    magnifyingGlass: (
        <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
            <path d="M8.875 2.625a6.25 6.25 0 1 0 3.955 11.09l3.983 3.982a.625.625 0 1 0 .884-.884l-3.983-3.982a6.25 6.25 0 0 0-4.84-10.205m-5 6.25a5 5 0 1 1 10 0 5 5 0 0 1-10 0" />
        </svg>
    ),
    chevronRight: (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M6.722 3.238a.625.625 0 1 0-.884.884L9.716 8l-3.878 3.878a.625.625 0 0 0 .884.884l4.32-4.32a.625.625 0 0 0 0-.884z" />
        </svg>
    ),
    insert: (
        <svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" style={{ width: 20, height: 20, display: "block", fill: "var(--c-icoPri)", flexShrink: 0 }}>
            <path d="M1.23 13.313a.56.56 0 0 1 .842-.486l2.881 1.688c.37.216.37.754 0 .97l-2.88 1.688a.56.56 0 0 1-.843-.485zM17.1 14c.345 0 .626.28.626.625v.75c0 .345-.28.625-.625.625H7.9a.625.625 0 0 1-.626-.625v-.75l.013-.126A.625.625 0 0 1 7.9 14zm0-3.333a.625.625 0 1 1 0 1.25H7.9l-.127-.013a.626.626 0 0 1 0-1.224l.126-.013zm0-3.334a.625.625 0 0 1 0 1.25H7.9l-.127-.013a.626.626 0 0 1 0-1.224l.126-.013zM17.1 4a.625.625 0 1 1 0 1.25H7.9l-.127-.013a.626.626 0 0 1 0-1.224L7.9 4z" />
        </svg>
    ),
    retry: (
        <svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" style={{ width: 20, height: 20, display: "block", fill: "var(--c-icoPri)", flexShrink: 0 }}>
            <path d="M7.592 4.792a.625.625 0 1 0-.884-.884l-4.4 4.4a.625.625 0 0 0 0 .884l4.4 4.4a.625.625 0 1 0 .884-.884L4.259 9.375H14a2.625 2.625 0 0 1 0 5.25h-1.42a.625.625 0 1 0 0 1.25H14a3.875 3.875 0 0 0 0-7.75H4.259z" />
        </svg>
    ),
    close: (
        <svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" style={{ width: 20, height: 20, display: "block", fill: "var(--c-icoPri)", flexShrink: 0 }}>
            <path d="M15.692 5.192a.625.625 0 1 0-.884-.884L10 9.116 5.192 4.308a.625.625 0 1 0-.884.884L9.116 10l-4.808 4.808a.625.625 0 1 0 .884.884L10 10.884l4.808 4.808a.625.625 0 1 0 .884-.884L10.884 10z" />
        </svg>
    ),
    upgrade: (
        <svg aria-hidden="true" role="graphics-symbol" viewBox="2.37 2.37 15.25 15.26" style={{ width: "auto", height: 16, display: "block", fill: "var(--c-bluIcoAccPri)", flexShrink: 0 }}>
            <defs><clipPath id="upgrade-clip"><rect x="2.5" y="2.5" width="15" height="15" rx="7.5" /></clipPath></defs>
            <rect x="2.5" y="2.5" width="15" height="15" rx="7.5" />
            <g clipPath="url(#upgrade-clip)">
                <path d="M13.0419 9.55439C12.7978 9.79847 12.4021 9.79847 12.158 9.55439L10.625 8.02136L10.625 13.4874C10.625 13.8326 10.3452 14.1124 10 14.1124C9.65482 14.1124 9.375 13.8326 9.375 13.4874L9.375 8.02131L7.84192 9.5544C7.59784 9.79847 7.20211 9.79847 6.95804 9.5544C6.71396 9.31032 6.71396 8.91459 6.95803 8.67051L9.55803 6.07051C9.67524 5.9533 9.83421 5.88745 9.99997 5.88745C10.1657 5.88745 10.3247 5.9533 10.4419 6.07051L13.0419 8.67051C13.286 8.91459 13.286 9.31032 13.0419 9.55439Z" fill="white" />
            </g>
        </svg>
    ),
};

// ── Shared helper functions ───────────────────────────────────────────────────

/**
 * Returns position to anchor the floating panel below the current text selection.
 * BlueButton variant: anchors to full editor width.
 */
export function getSelectionRectFull() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    if (!rect) return null;
    let node = rect ? sel.getRangeAt(0).startContainer : null;
    if (node && node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    const container = document.querySelector(".bn-inline-content");
    const width = container?.getBoundingClientRect().width;
    if (!container) return null;
    const containerRect = container.getBoundingClientRect();
    return {
        top: rect.bottom + window.scrollY + 13,
        left: containerRect.left + window.scrollX,
        width: width - 21,
    };
}

/**
 * Returns position to anchor the floating panel below the current text selection.
 * Slash-menu variant: uses selection rect directly.
 */
export function getSelectionRect() {
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

/** Select all blocks in the editor */
export function selectAllContent(editor) {
    const blocks = editor.document;
    if (!blocks || blocks.length === 0) return;
    editor.setSelection(blocks[0].id, blocks[blocks.length - 1].id);
}

/** Ensure there's a selection; fall back to selecting all */
export function ensureSelection(editor) {
    const sel = editor.getSelection();
    if (!sel || sel.blocks.length === 0) selectAllContent(editor);
}

/**
 * Core AI fetch – returns the response text or throws.
 * @param {string} action
 * @param {{ selectedText: string, fullContent: string, prompt?: string, language?: string }} opts
 */
export async function callAI(action, { selectedText, fullContent, prompt = "", language = "vi" }) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, selected_text: selectedText, full_content: fullContent, prompt, language }),
    });
    if (!res.ok) throw new Error(`AI request failed: ${res.status}`);
    const data = await res.json();
    return data.text ?? "";
}

/**
 * Replace selected blocks with the AI result (split by blank lines → paragraphs).
 */
export function applyResultToEditor(editor, preview) {
    if (!preview) return;
    const selection = editor.getSelection();
    if (!selection || selection.blocks.length === 0) return;

    const paragraphs = preview.trim().split(/\n+/).map(p => p.trim()).filter(Boolean);
    const newBlocks = paragraphs.map(text => ({
        type: "paragraph",
        content: [{ type: "text", text, styles: {} }],
    }));

    editor.insertBlocks(newBlocks, selection.blocks[0].id, "before");
    editor.removeBlocks(selection.blocks.map(b => b.id));
}

/**
 * Replace a single block's text content with the AI result (used in BlueButton's simple mode).
 */
export function applyResultToBlock(editor, blockId, preview) {
    if (!preview || !blockId) return;
    editor.updateBlock(blockId, {
        content: [{ type: "text", text: preview.trim(), styles: {} }],
    });
}

export function hideToolbars() {
    const toolbars = document.querySelectorAll('.bn-formatting-toolbar');
    toolbars.forEach(el => {
        (el).style.display = 'none';
    });
}
hideToolbars();
// ── Shared styles ─────────────────────────────────────────────────────────────
export const inputLikeStyle = {
    fontSize: 14,
    minHeight: 46,
    border: "1px solid #e3e3e1",
    borderRadius: 5,
    boxShadow: "0px 14px 27px -6px #0000001a, 0px 2px 4px -1px #0000000f, 0 0 0 1px #54483114",
    background: "white",
    fontFamily: "Inter, sans-serif",
};

export const menuDropdownStyle = {
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 8,
    background: "#fff",
    boxShadow: "0px 14px 27px -6px #0000001a, 0px 2px 4px -1px #0000000f, 0 0 0 1px #54483114",
    width: "fit-content",
    minWidth: 280,
    maxWidth: 320,
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #e3e3e1",
    zIndex: 10000,
    position: "absolute",
    pointerEvents: "auto",
};
