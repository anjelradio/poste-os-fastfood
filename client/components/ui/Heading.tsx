export default function Heading({ children }: { children: React.ReactNode }) {
    return (
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            {children}
        </h1>
    );
}
