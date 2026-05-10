export function Footer() {
  return (
    <footer className="border-t border-border/60 py-6">
      <div className="mx-auto flex max-w-[1440px] items-center justify-center px-6 sm:px-10">
        <p className="text-sm text-muted-foreground">
          &copy; 2026–2027{" "}
          <a
            href="https://kamilpawlak.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gradient font-medium underline-offset-2 hover:underline"
          >
            Kamil Pawlak
          </a>
        </p>
      </div>
    </footer>
  )
}
