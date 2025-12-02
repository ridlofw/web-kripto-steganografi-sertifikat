"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, XCircle, FileText, User, Calendar, MapPin, Home, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function VerificationPage() {
    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setStatus("idle") // Reset status when new file is selected
        }
    }

    const handleVerify = () => {
        if (!file) return

        setStatus("loading")

        // Simulate verification process
        setTimeout(() => {
            // For testing purposes: if filename contains "error", show error state
            if (file.name.toLowerCase().includes("error")) {
                setStatus("error")
            } else {
                setStatus("success")
            }
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="mx-auto max-w-2xl space-y-6">
                {/* Back Button */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Link>
                </div>

                {/* Verification Input Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-6 w-6 text-primary" />
                            <CardTitle>Verifikasi Sertifikat</CardTitle>
                        </div>
                        <CardDescription>
                            Upload gambar sertifikat untuk mengecek apakah sertifikat asli atau bukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="certificate-image">Pilih File Gambar</Label>
                            <Input
                                id="certificate-image"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <Button
                            className="w-full"
                            onClick={handleVerify}
                            disabled={!file || status === "loading"}
                        >
                            {status === "loading" ? "Memverifikasi..." : "Verifikasi Gambar"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Result Section */}
                {status === "error" && (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                            <XCircle className="h-12 w-12 text-red-500 mb-4" />
                            <h3 className="text-lg font-semibold text-red-700">Tidak ada Data</h3>
                            <p className="text-red-600">Tidak ada data yang ditemukan dalam gambar ini.</p>
                        </CardContent>
                    </Card>
                )}

                {status === "success" && (
                    <div className="space-y-6">
                        {/* Success Status */}
                        <Card className="border-green-200 bg-green-50">
                            <CardContent className="flex items-center gap-4 py-6">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                                <div>
                                    <h3 className="text-lg font-semibold text-green-700">Sertifikat Valid</h3>
                                    <p className="text-green-600">Data berhasil diekstrak</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Certificate Info */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    <CardTitle className="text-lg">Informasi Sertifikat</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Nomor Sertifikat</p>
                                        <p className="font-medium">111/SRTV/X/2006</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Nama Pemegang</p>
                                        <p className="font-medium">Ridelo</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Luas Tanah</p>
                                        <p className="font-medium">1000 m²</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Alamat</p>
                                        <p className="font-medium">Semarang</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Keterangan</p>
                                        <p className="font-medium">Rumah Besar</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Tanggal Upload</p>
                                        <p className="font-medium">11 Februari 2025 pukul 15.22</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ownership History */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <History className="h-5 w-5" />
                                    <CardTitle className="text-lg">Riwayat Kepemilikan (5)</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    {
                                        name: "Ridelo",
                                        role: "Pemilik Saat Ini",
                                        email: "ridlo@gmail.com",
                                        date: "11 Februari 2025 pukul 11.11",
                                        note: "Balik nama sertifikat",
                                        isCurrent: true
                                    },
                                    {
                                        name: "Budi Santoso",
                                        role: "Pemilik Keempat",
                                        email: "budi.santoso@email.com",
                                        date: "10 Januari 2020 pukul 09.30",
                                        note: "Jual beli tanah",
                                        isCurrent: false
                                    },
                                    {
                                        name: "Siti Aminah",
                                        role: "Pemilik Ketiga",
                                        email: "siti.aminah@email.com",
                                        date: "15 Maret 2015 pukul 14.20",
                                        note: "Warisan keluarga",
                                        isCurrent: false
                                    },
                                    {
                                        name: "Ahmad Dahlan",
                                        role: "Pemilik Kedua",
                                        email: "ahmad.dahlan@email.com",
                                        date: "20 Agustus 2010 pukul 10.15",
                                        note: "Pecah sertifikat",
                                        isCurrent: false
                                    },
                                    {
                                        name: "PT. Pembangunan Jaya",
                                        role: "Kepemilikan Awal",
                                        email: "admin@pembangunanjaya.com",
                                        date: "01 Januari 2006 pukul 08.00",
                                        note: "Sertifikat induk diterbitkan",
                                        isCurrent: false
                                    }
                                ].map((history, index) => (
                                    <div key={index} className={`flex items-start gap-4 rounded-lg border p-4 ${history.isCurrent ? '' : 'bg-gray-50/50'}`}>
                                        <div className={`rounded-full p-2 ${history.isCurrent ? 'bg-primary/10' : 'bg-gray-100'}`}>
                                            <User className={`h-5 w-5 ${history.isCurrent ? 'text-primary' : 'text-gray-500'}`} />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className={`font-medium ${history.isCurrent ? '' : 'text-muted-foreground'}`}>{history.name}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${history.isCurrent ? 'bg-green-100 text-green-700' : 'bg-secondary'}`}>
                                                    {history.role}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{history.email}</p>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                                                <Calendar className="h-3 w-3" />
                                                <span>{history.date}</span>
                                            </div>
                                            <p className="text-sm italic text-muted-foreground mt-2">"{history.note}"</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
