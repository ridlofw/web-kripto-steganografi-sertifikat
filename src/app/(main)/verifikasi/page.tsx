"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, XCircle, FileText, User, Calendar, History, ZoomIn, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

import { DUMMY_CERTIFICATES, Certificate } from "@/lib/dummy-data";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function VerificationPage() {
    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [imageZoomOpen, setImageZoomOpen] = useState(false);
    const [result, setResult] = useState<Certificate | null>(null);

    // Create object URL for the uploaded file to display it
    const fileUrl = file ? URL.createObjectURL(file) : null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setStatus("idle")
        }
    }

    const handleVerify = () => {
        if (!file) return
        setStatus("loading")

        // Simulate verification process
        setTimeout(() => {
            if (file.name.toLowerCase().includes("error")) {
                setStatus("error")
                setResult(null);
            } else {
                // Mock: Pick first certificate or random one
                const mockResult = DUMMY_CERTIFICATES[0];
                setResult(mockResult);
                setStatus("success")
            }
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
            <div className={`mx-auto space-y-6 transition-all duration-300 ${status === 'success' ? 'max-w-6xl' : 'max-w-2xl'}`}>
                {/* Back Button */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Link>
                </div>

                {/* Verification Input Card */}
                {/* We keep this visible so user can verify another file, but maybe visually separate it if success */}
                <Card className={status === "success" ? "border-dashed" : ""}>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-6 w-6 text-primary" />
                            <CardTitle>Verifikasi Sertifikat</CardTitle>
                        </div>
                        <CardDescription>
                            Upload gambar sertifikat untuk mengecek keaslian
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="certificate-image">Pilih File Gambar</Label>
                                <Input
                                    id="certificate-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <Button
                                onClick={handleVerify}
                                disabled={!file || status === "loading"}
                            >
                                {status === "loading" ? "Memverifikasi..." : "Verifikasi"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Error State */}
                {status === "error" && (
                    <Card className="border-red-200 bg-red-50 animate-in fade-in slide-in-from-top-2">
                        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                            <XCircle className="h-12 w-12 text-red-500 mb-4" />
                            <h3 className="text-lg font-semibold text-red-700">Tidak Valid</h3>
                            <p className="text-red-600">Sertifikat tidak terdaftar atau data tidak ditemukan.</p>
                        </CardContent>
                    </Card>
                )}

                {/* Success State - Certificate Detail Layout */}
                {status === "success" && result && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
                        {/* Success Banner */}
                        <Card className="border-green-200 bg-green-50">
                            <CardContent className="flex items-center gap-4 py-4">
                                <div className="rounded-full bg-green-100 p-2">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-green-700">Sertifikat Valid</h3>
                                    <p className="text-sm text-green-600">Data berhasil diekstrak dan diverifikasi</p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid gap-6 md:grid-cols-3">
                            {/* Left Column (2/3): Image & Info */}
                            <div className="md:col-span-2 space-y-6">
                                {/* Certificate Image Card */}
                                <Card className="overflow-hidden">
                                    <div
                                        className="relative aspect-video w-full cursor-zoom-in bg-zinc-100 dark:bg-zinc-800"
                                        onClick={() => setImageZoomOpen(true)}
                                    >
                                        {/* Display Uploaded Image */}
                                        {fileUrl ? (
                                            <Image
                                                src={fileUrl}
                                                alt="Uploaded Certificate"
                                                fill
                                                className="object-cover transition-transform hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-zinc-400">
                                                <div className="text-center">
                                                    <Upload className="mx-auto mb-2 h-12 w-12 text-zinc-300" />
                                                    <span className="text-sm">Gambar tidak tersedia</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                                            <div className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-white">
                                                <ZoomIn className="h-4 w-4" />
                                                <span className="text-sm font-medium">Perbesar</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 border-t bg-muted/20">
                                        <p className="text-xs text-center text-muted-foreground">
                                            Tampilan Sertifikat yang Diupload
                                        </p>
                                    </div>
                                </Card>

                                {/* Certificate Info Card */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            <CardTitle className="text-lg">Informasi Sertifikat</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-muted-foreground">Nama Sertifikat</label>
                                                <p className="font-medium text-lg">{result.nama}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-muted-foreground">Nomor Sertifikat</label>
                                                <p className="font-medium text-lg">{result.nomor}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-muted-foreground">Luas Tanah</label>
                                                <p className="font-medium text-lg">{result.luas}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-muted-foreground">Pemegang Hak (saat ini)</label>
                                                <p className="font-medium text-lg">{result.history[0]?.name || "Unknown"}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs text-muted-foreground">Alamat</label>
                                                <p className="font-medium text-lg">{result.location}</p>
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t">
                                            <label className="text-xs text-muted-foreground">Keterangan</label>
                                            <p className="font-medium">{result.keterangan}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column (1/3): History Timeline */}
                            <div className="md:col-span-1">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <History className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-base">Jejak Rekam Kepemilikan</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pl-6">
                                        <div className="relative border-l-2 border-zinc-200 ml-3 space-y-8 pb-4">
                                            {result.history.map((history, index) => {
                                                const isCurrent = index === 0;
                                                return (
                                                    <div key={index} className="relative pl-6">
                                                        {/* Timeline Dot */}
                                                        <span
                                                            className={`absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white ring-1 ring-zinc-200 ${isCurrent ? "bg-primary" : "bg-zinc-300"
                                                                }`}
                                                        />

                                                        {/* Content */}
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex flex-col">
                                                                <h3 className={`text-sm font-semibold ${isCurrent ? "text-primary" : "text-foreground"}`}>
                                                                    {history.name}
                                                                </h3>
                                                                <span className="text-[10px] w-fit mt-0.5 text-muted-foreground bg-zinc-100 px-1.5 py-0.5 rounded border">
                                                                    {history.type}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                                                <User className="h-3 w-3" />
                                                                <span className="truncate max-w-[150px]">{history.email}</span>
                                                            </div>

                                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                                <Calendar className="h-3 w-3" />
                                                                <span>{history.date}</span>
                                                            </div>

                                                            {history.note && (
                                                                <div className="mt-1.5 rounded bg-muted/40 p-1.5 text-xs text-zinc-500 italic">
                                                                    "{history.note}"
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Image Zoom Modal */}
            {/* Image Zoom Modal */}
            <Dialog open={imageZoomOpen} onOpenChange={setImageZoomOpen}>
                <DialogContent className="max-w-[95vw] sm:max-w-[95vw] w-auto h-auto border-none bg-transparent shadow-none p-0 flex items-center justify-center outline-none">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Preview Images</DialogTitle>
                    </DialogHeader>
                    {fileUrl && (
                        <div className="relative flex items-center justify-center outline-none">
                            <button
                                onClick={() => setImageZoomOpen(false)}
                                className="absolute -right-4 -top-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <Image
                                src={fileUrl}
                                alt="Full Preview"
                                width={1200}
                                height={800}
                                className="max-h-[85vh] w-auto rounded-md object-contain"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
