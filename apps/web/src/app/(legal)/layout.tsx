export default function LegalPageLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <div className="bg-primary">
        <div className="mx-auto max-w-screen-sm py-10">
          <h4 className="text-center text-lg font-medium text-background">
            Swardify
          </h4>
          <p className="text-center text-xs text-white">
            A Bidirectional Swardspeak and Tagalog Translator
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-screen-sm px-4 py-8">{children}</div>
    </>
  );
}
