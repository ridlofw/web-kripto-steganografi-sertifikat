"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle, Settings, Upload, FileText, ZoomIn, X } from "lucide-react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { DUMMY_CERTIFICATES } from "@/lib/dummy-data";

// Map dummy data to the shape expected by this view
const MAPPED_INITIAL_CERTIFICATES = DUMMY_CERTIFICATES.map(c => ({
    id: c.id,
    title: c.nama,
    subtitle: c.keterangan,
    address: c.location,
    luas: c.luas,
    tanggal: c.uploadDate, // Or format it if needed
}));

export default function Home() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [certificates, setCertificates] = useState(MAPPED_INITIAL_CERTIFICATES);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageZoomOpen, setImageZoomOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        namaSertifikat: "",
        nomorSertifikat: "",
        namaPemegang: "",
        luasTanah: "",
        alamat: "",
        keterangan: ""
    });

    useEffect(() => {
        const session = localStorage.getItem("auth_session");
        if (session) {
            const user = JSON.parse(session);
            setCurrentUser(user);
            setFormData(prev => ({ ...prev, namaPemegang: user.name || "" }));
        }
    }, []);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const processFile = (file: File) => {
        console.log("File selected:", file);
        setUploadedFile(file);

        // Create object URL for preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        setIsUploadOpen(true);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processFile(file);
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
            processFile(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newCert = {
            id: `ctf-${certificates.length + 1}`.padEnd(6, '0'), // Simple ID gen
            title: formData.namaSertifikat,
            subtitle: formData.keterangan || "Sertifikat Baru",
            address: formData.alamat,
            luas: `${formData.luasTanah} m2`,
            tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            // Internal data structure would actually be more complex like dummy-data.ts
            // but for this view model we match simple structure
        };

        setCertificates([newCert, ...certificates]);
        setCertificates([newCert, ...certificates]);
        setIsUploadOpen(false);
        setUploadedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        // Reset form but keep owner name
        setFormData({
            namaSertifikat: "",
            nomorSertifikat: "",
            namaPemegang: currentUser?.name || "",
            luasTanah: "",
            alamat: "",
            keterangan: ""
        });
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
                        {certificates.map((c) => (
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
            {/* Upload Dialog */}
            <Dialog
                open={isUploadOpen}
                onOpenChange={(open) => {
                    // Prevent closing the dialog if the zoom modal is open
                    if (!open && imageZoomOpen) return;
                    setIsUploadOpen(open);
                }}
            >
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detail Sertifikat Baru</DialogTitle>
                        <DialogDescription>
                            Lengkapi informasi sertifikat untuk dokumen yang baru saja diunggah.
                        </DialogDescription>
                    </DialogHeader>

                    {previewUrl && (
                        <div className="mb-6 space-y-3">
                            <div
                                className="relative aspect-video w-full cursor-zoom-in overflow-hidden rounded-lg border bg-zinc-100 dark:bg-zinc-800"
                                onClick={() => setImageZoomOpen(true)}
                            >
                                <Image
                                    src={previewUrl}
                                    alt="Preview Sertifikat"
                                    fill
                                    className="object-cover transition-transform hover:scale-105"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                                    <div className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-white">
                                        <ZoomIn className="h-4 w-4" />
                                        <span className="text-xs font-medium">Perbesar</span>
                                    </div>
                                </div>
                            </div>

                            {uploadedFile && (
                                <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-100 text-blue-600">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="truncate text-sm font-medium">{uploadedFile.name}</p>
                                        <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="no-sertif">Nomor Sertifikat</Label>
                                <Input
                                    id="no-sertif"
                                    placeholder="XXX/SRTV/X/YYYY"
                                    required
                                    value={formData.nomorSertifikat}
                                    onChange={(e) => setFormData({ ...formData, nomorSertifikat: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nama-sertif">Nama Sertifikat</Label>
                                <Input
                                    id="nama-sertif"
                                    placeholder="Contoh: Tanah Warisan"
                                    required
                                    value={formData.namaSertifikat}
                                    onChange={(e) => setFormData({ ...formData, namaSertifikat: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="pemegang">Nama Pemegang Hak</Label>
                            <Input
                                id="pemegang"
                                placeholder="Nama Lengkap"
                                required
                                value={formData.namaPemegang}
                                onChange={(e) => setFormData({ ...formData, namaPemegang: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="luas">Luas Tanah</Label>
                                <div className="relative">
                                    <Input
                                        id="luas"
                                        type="number"
                                        placeholder="500"
                                        required
                                        min="1"
                                        value={formData.luasTanah}
                                        onChange={(e) => setFormData({ ...formData, luasTanah: e.target.value })}
                                        className="pr-12"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground bg-white pl-1">
                                        m²
                                    </span>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="alamat">Alamat Lokasi</Label>
                                <Input
                                    id="alamat"
                                    placeholder="Jalan..."
                                    required
                                    value={formData.alamat}
                                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="keterangan">Keterangan</Label>
                            <Textarea
                                id="keterangan"
                                placeholder="Deskripsi tambahan..."
                                value={formData.keterangan}
                                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                            />
                        </div>

                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>Batal</Button>
                            <Button type="submit">Simpan Sertifikat</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog >
            {/* Image Zoom Modal */}
            <Dialog open={imageZoomOpen} onOpenChange={setImageZoomOpen}>
                <DialogContent className="max-w-[95vw] sm:max-w-[95vw] w-auto h-auto border-none bg-transparent shadow-none p-0 flex items-center justify-center outline-none">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Preview Images</DialogTitle>
                    </DialogHeader>
                    {previewUrl && (
                        <div className="relative flex items-center justify-center outline-none">
                            <button
                                onClick={() => setImageZoomOpen(false)}
                                className="absolute -right-4 -top-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <Image
                                src={previewUrl}
                                alt="Full Preview"
                                width={1200}
                                height={800}
                                className="max-h-[85vh] w-auto rounded-md object-contain"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div >
    );
}
