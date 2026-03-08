import Link from "next/link";

type AuthShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
};

export function AuthShell({
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthShellProps) {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <Link href="/" className="inline-block text-sm font-medium text-primary">
            RTM Class AI
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {children}

        <p className="text-center text-sm text-muted-foreground">
          {footerText}{" "}
          <Link
            href={footerLinkHref}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {footerLinkText}
          </Link>
        </p>
      </div>
    </section>
  );
}
