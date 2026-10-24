import Link from "next/link";

export default function FormShell({
  title,
  description,
  backHref,
  backLabel,
  children,
}: {
  title: string;
  description?: string;
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-xl px-8 py-10">
      <Link href={backHref} className="text-sm text-muted-foreground hover:text-foreground">
        {backLabel}
      </Link>
      <div className="mb-6 mt-4">
        <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="panel p-6">{children}</div>
    </main>
  );
}