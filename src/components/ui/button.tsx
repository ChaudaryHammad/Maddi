import { type ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "secondary" | "primary";
  onClick?: () => void;
  href?: string;
  className?: string;
  id?: string;
}

export function Button({
  children,
  variant = "secondary",
  onClick,
  href,
  className = "",
  id,
}: ButtonProps) {
  const baseClasses =
    "group relative block rounded-[4px] text-center font-medium tracking-tight transition-[transform] duration-200 active:scale-[0.99] active:duration-[50ms] backdrop-blur-[6px] text-xs px-3 py-2 cursor-pointer";

  const variantClasses =
    variant === "primary"
      ? "text-neutral-50 dark:text-neutral-950"
      : "text-neutral-900 dark:text-neutral-300";

  const content = (
    <>
      {variant === "secondary" ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-[4px] overflow-hidden transition-colors duration-200
            group-active:duration-[50ms] bg-white/90 dark:bg-[#0c0c0e]
            group-hover:dark:bg-[#121214] border border-black/5
            dark:border-white/5 group-hover:border-black/10
            dark:group-hover:border-white/10"
        >
          <span className="absolute inset-0 rounded-[4px] transition duration-200 bg-black/[0.02] dark:bg-transparent group-hover:bg-transparent dark:group-hover:bg-white/[0.02] group-active:bg-black/[0.04] dark:group-active:bg-white/[0.04] group-active:duration-[50ms]" />
          <span
            className="absolute inset-0 transition duration-200 group-active:opacity-0 group-active:duration-[50ms] opacity-[0.16] dark:opacity-[0.04]"
            style={{
              background:
                "linear-gradient(rgb(255,255,255) 0%, rgba(255,255,255,0) 100%)",
            }}
          />
          <span
            className="absolute inset-0 transition duration-200 group-active:duration-[50ms] opacity-[0.04] dark:opacity-[0.1]"
            style={{
              background:
                "radial-gradient(65.62% 65.62% at 50% 100%, rgb(0,0,0) 0%, rgba(0,0,0,0) 100%)",
            }}
          />
          <span
            className="absolute inset-0 transition duration-200 group-active:opacity-0 group-active:duration-[50ms] opacity-[0.4] dark:opacity-[0.04]"
            style={{
              background:
                "linear-gradient(99deg, rgba(255,255,255,0) 27.7%, rgba(255,255,255,0.12) 60.19%, rgba(255,255,255,0) 86.06%)",
            }}
          />
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-[4px] overflow-hidden transition-colors duration-200
            group-active:duration-[50ms] bg-[#18181b] group-hover:bg-[#27272a]
            dark:bg-white dark:group-hover:bg-neutral-100
            border border-black/10 dark:border-white/10"
        >
          <span
            className="absolute inset-0 transition duration-200 group-active:opacity-0 group-active:duration-[50ms] opacity-[0.12]"
            style={{
              background:
                "linear-gradient(rgb(255,255,255) 0%, rgba(255,255,255,0) 100%)",
            }}
          />
          <span
            className="absolute inset-0 transition duration-200 group-active:duration-[50ms] opacity-[0.32]"
            style={{
              background:
                "radial-gradient(65.62% 65.62% at 50% 100%, rgb(0,0,0) 0%, rgba(0,0,0,0) 100%)",
            }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-[4px] p-px opacity-[0.24]"
            style={{
              background:
                "linear-gradient(rgb(255,255,255) 0%, rgb(153,153,153) 55%, rgb(255,255,255) 80%, rgb(153,153,153) 95%)",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
        </span>
      )}
      <span className="relative">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${variantClasses} ${className}`}
        id={id}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
      id={id}
    >
      {content}
    </button>
  );
}
