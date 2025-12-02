"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle, Settings, Upload, FileText } from "lucide-react";
import { useRef, useState } from "react";

const dummyCertificates = [
    {
        id: "ctf-01",
        title: "Sertifikat Tanah",
        subtitle: "Tanah di Desa",
        address: "Indraprasta, Semarang",
        luas: "100 m2",
        tanggal: "11 Februari 2006",
    },
    {
        id: "ctf-02",
        title: "Sertifikat Sawah",
        subtitle: "Sawah Bapak",
        address: "DR. Cipto, Semarang",
        luas: "1000 m2",
        tanggal: "11 Februari 2006",
    },
];

export default function Home() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("File selected:", file);
            // Handle file upload logic here
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) {
            console.log("File dropped:", file);
            // Handle file upload logic here
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 p-6 lg:p-12">
            <div className="mx-auto max-w-5xl">
                {/* header */}
                <header className="mb-10">
                    <h1 className="text-4xl font-bold text-zinc-900">Beranda</h1>
                    <p className="mt-2 text-lg text-zinc-500">
                        Kelola sertifikat Anda dengan aman
                    </p>
                </header>

                {/* actions */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Upload Card */}
                    <div
                        onClick={handleUploadClick}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white p-8 text-center transition-all hover:border-zinc-400 hover:bg-zinc-50 ${isDragging ? "border-zinc-500 bg-zinc-100" : "border-zinc-300"
                            }`}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        <div className="mb-4 rounded-full bg-zinc-100 p-4 transition-colors group-hover:bg-zinc-200">
                            <Upload className="h-8 w-8 text-zinc-700" />
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-900">Upload Foto</h3>
                        <p className="text-sm text-zinc-500">Unggah sertifikat baru</p>
                    </div>

                    {/* Verification Card */}
                    <Link href="/verifikasi">
                        <div className="group flex h-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-zinc-200 bg-white p-8 text-center transition-all hover:border-zinc-400 hover:shadow-sm">
                            <div className="mb-4 rounded-full bg-zinc-100 p-4 transition-colors group-hover:bg-zinc-200">
                                <CheckCircle className="h-8 w-8 text-zinc-700" />
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-900">Verifikasi</h3>
                            <p className="text-sm text-zinc-500">Cek keaslian sertifikat</p>
                        </div>
                    </Link>

                    {/* Settings Card */}
                    <Link href="/pengaturan">
                        <div className="group flex h-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-zinc-200 bg-white p-8 text-center transition-all hover:border-zinc-400 hover:shadow-sm">
                            <div className="mb-4 rounded-full bg-zinc-100 p-4 transition-colors group-hover:bg-zinc-200">
                                <Settings className="h-8 w-8 text-zinc-700" />
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-900">Pengaturan</h3>
                            <p className="text-sm text-zinc-500">Kelola akun anda</p>
                        </div>
                    </Link>
                </section>

                {/* certificate list */}
                <section className="mt-12">
                    <h2 className="text-2xl font-semibold text-zinc-800">
                        Daftar Sertifikat Anda
                    </h2>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        {dummyCertificates.map((c) => (
                            <Link key={c.id} href={`/sertifikat/${c.id}`}>
                                <Card className="group h-full cursor-pointer border-zinc-200 transition-all hover:border-zinc-400 hover:shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-bold text-zinc-900">
                                            {c.title}
                                        </CardTitle>
                                        <CardDescription className="text-zinc-500">
                                            {c.subtitle}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 gap-y-2 text-sm text-zinc-600 sm:grid-cols-[auto_1fr] sm:gap-x-4">
                                            <div className="font-medium text-zinc-500">Alamat :</div>
                                            <div className="font-medium text-zinc-900">
                                                {c.address}
                                            </div>

                                            <div className="font-medium text-zinc-500">Luas :</div>
                                            <div className="font-medium text-zinc-900">{c.luas}</div>

                                            <div className="font-medium text-zinc-500">Tanggal :</div>
                                            <div className="font-medium text-zinc-900">
                                                {c.tanggal}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
