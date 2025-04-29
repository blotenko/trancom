import Image from "next/image";

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-8">
            {/* Логотип */}
            <Image
                src="/Trancom_Logo-03.svg"
                alt="Trancom Logo"
                width={400}
                height={180}
                className="mb-8"
            />

            {/* Текст приветствия */}
            <h1 className="text-4xl font-bold mb-4">Hello, Trancom!</h1>
            <p className="text-lg text-gray-600">Welcome to your admin panel.</p>
        </main>
    );
}
