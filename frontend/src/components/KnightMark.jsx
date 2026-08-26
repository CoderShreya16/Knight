export default function KnightMark({ size = 22, light = false }) {
    const base = light ? '#ffffff' : 'var(--navy)';
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M12 2L4.5 5V11.2C4.5 16.2 7.7 20.1 12 22C16.3 20.1 19.5 16.2 19.5 11.2V5L12 2Z"
                fill={base}
                fillOpacity={light ? 0.18 : 1}
            />
            <path
                d="M12 2L4.5 5V11.2C4.5 16.2 7.7 20.1 12 22V2Z"
                fill="var(--violet)"
                fillOpacity="0.9"
            />
            <rect x="9" y="10.5" width="1.4" height="4" rx="0.7" fill="white" />
            <rect x="11.3" y="8.5" width="1.4" height="8" rx="0.7" fill="white" />
            <rect x="13.6" y="11.5" width="1.4" height="3" rx="0.7" fill="white" />
        </svg>
    );
}
