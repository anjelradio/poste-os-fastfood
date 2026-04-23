import Header from "@/components/layout/Header";

export default function ViewsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="relative z-10 min-h-screen flex flex-col px-[8%] xl:px-[12%]">
        <Header />
        {children}
      </div>
    </>
  );
}
