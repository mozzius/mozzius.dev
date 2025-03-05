import { cx } from "#/lib/cx";

export function Title({
  level = "h1",
  className,
  ...props
}: React.HTMLProps<HTMLHeadingElement> & {
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) {
  const Tag = level;

  let style;
  switch (level) {
    case "h1":
      style = "text-4xl lg:text-5xl";
      break;
    case "h2":
      style = "border-b pb-2 text-3xl";
      break;
    case "h3":
      style = "text-2xl";
      break;
    case "h4":
      style = "text-xl";
      break;
    case "h5":
      style = "text-lg";
      break;
    case "h6":
      style = "text-base";
      break;
  }

  return (
    <Tag
      className={cx(
        "font-serif font-bold italic text-balance tracking-tight scroll-m-20 uppercase mt-8 [&>code]:text-[length:inherit] first:mt-0",
        style,
        className,
      )}
      {...props}
    />
  );
}

export function Paragraph({
  className,
  ...props
}: React.HTMLProps<HTMLParagraphElement>) {
  return <p className={cx("font-sans text-pretty", className)} {...props} />;
}

export function Code({ className, ...props }: React.HTMLProps<HTMLElement>) {
  return (
    <code
      className={cx(
        "font-mono normal-case relative rounded-sm px-[0.3rem] py-[0.2rem] bg-slate-100 text-sm dark:bg-slate-800 dark:text-slate-100",
        className,
      )}
      {...props}
    />
  );
}
