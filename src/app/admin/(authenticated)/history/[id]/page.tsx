"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    ShieldCheck,
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    Download,
    ZoomIn,
    X,
    Activity,
    History,
    CheckCircle,
    User
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [imageZoomOpen, setImageZoomOpen] = useState(false);

    // Mock Data Logic based on ID
    // TRX-004 = Approved example
    // TRX-005 = Rejected example
    const isRejected = id === "TRX-005";

    const transaction = {
        id: id,
        // Providing full data for layout consistency
        sender: isRejected ? "Megawati" : "Joko Widodo",
        senderEmail: isRejected ? "megawati@gmail.com" : "jokowi@gmail.com",
        receiver: isRejected ? "Puan Maharani" : "Prabowo Subianto",
        receiverEmail: isRejected ? "puan@gmail.com" : "prabowo@gmail.com",
        type: isRejected ? "Hibah" : "Jual Beli",
        date: isRejected ? "2024-12-04 09:15:00" : "2024-12-05 14:30:00",
        status: isRejected ? "Rejected" : "Approved",
        note: isRejected ? "Dokumen kurang lengkap" : "Pembayaran lunas",
        certificate: {
            nama: "Hak Milik No. 123", // Was title
            nomor: isRejected ? "117/SRTV/X/2021" : "116/SRTV/X/2019",
            image: "/certificate_dummy.png",
            location: "Jl. Merdeka No. 10, Jakarta Pusat",
            luas: "500 m2",
            owner: isRejected ? "Megawati" : "Prabowo Subianto", // Current owner depends on status
            keterangan: "Tanah pekarangan siap bangun",
            history: isRejected ? [
                // Mock history - Rejected case (No change in ownership)
                { date: "2015-01-15 08:00:00", owner: "Megawati", email: "megawati@gmail.com", method: "Sertifikat Diterbitkan", notes: "Penerbitan sertifikat baru" },
            ] : [
                // Mock history - Approved case (Ownership changed)
                { date: "2024-12-05 14:30:00", owner: "Prabowo Subianto", email: "prabowo@gmail.com", method: "Jual Beli", notes: "Pembelian Lunas" },
                { date: "2015-01-15 08:00:00", owner: "Joko Widodo", email: "jokowi@gmail.com", method: "Sertifikat Diterbitkan", notes: "Penerbitan sertifikat baru" },
            ]
        },
        timeline: isRejected ? [
            { title: "Pengajuan Dibuat", desc: "Megawati mengajukan transfer", date: "2024-12-04 08:00:00" },
            { title: "Menunggu Konfirmasi", desc: "Menunggu konfirmasi dari Puan Maharani", date: "2024-12-04 08:05:00" },
            { title: "Konfirmasi Penerima", desc: "Puan Maharani menyetujui transfer", date: "2024-12-04 08:45:00" },
            { title: "Menunggu Verifikasi Admin", desc: "Menunggu verifikasi admin BPN", date: "2024-12-04 08:50:00" },
            { title: "Ditolak", desc: "Dokumen kurang lengkap", date: "2024-12-04 09:15:00" },
        ] : [
            { title: "Pengajuan Dibuat", desc: "Joko Widodo mengajukan transfer", date: "2024-12-05 09:00:00" },
            { title: "Menunggu Konfirmasi", desc: "Menunggu konfirmasi dari Prabowo Subianto", date: "2024-12-05 09:05:00" },
            { title: "Konfirmasi Penerima", desc: "Prabowo Subianto menyetujui transfer", date: "2024-12-05 10:30:00" },
            { title: "Menunggu Verifikasi Admin", desc: "Menunggu verifikasi admin BPN", date: "2024-12-05 10:35:00" },
            { title: "Verifikasi Admin", desc: "Admin menyetujui perpindahan hak", date: "2024-12-05 14:30:00" },
        ]
    };

    const getStatusBadge = (status: string) => {
        if (status === 'Approved') {
            return (
                <Badge variant="default" className="bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1 border-0">
                    <CheckCircle className="h-3 w-3" />
                    Disetujui
                </Badge>
            );
        } else if (status === 'Rejected') {
            return (
                <Badge variant="destructive" className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    Ditolak
                </Badge>
            );
        }
        return <Badge variant="secondary">{status}</Badge>;
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header Navigation */}
            <div className="flex flex-col gap-4">
                <Button variant="ghost" className="w-fit pl-0 hover:bg-transparent hover:text-foreground text-muted-foreground" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">Detail Riwayat</h1>
                            {getStatusBadge(transaction.status)}
                        </div>
                        <p className="text-muted-foreground">
                            ID Transaksi: <span className="font-mono font-medium text-foreground">{transaction.id}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Status Alert - PRESERVED AS REQUESTED */}
            {transaction.status === "Approved" ? (
                <Alert className="border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm">
                    <CheckCircle className="h-4 w-4 stroke-emerald-600" />
                    <AlertTitle>Transaksi Disetujui</AlertTitle>
                    <AlertDescription>
                        Pengajuan ini telah disetujui pada tanggal {transaction.date}. Hak kepemilikan telah berpindah secara sah.
                    </AlertDescription>
                </Alert>
            ) : (
                <Alert className="border-red-500 bg-red-50 text-red-900 shadow-sm">
                    <XCircle className="h-4 w-4 stroke-red-600" />
                    <AlertTitle>Transaksi Ditolak</AlertTitle>
                    <AlertDescription>
                        Pengajuan ini telah ditolak pada tanggal {transaction.date}. Tidak ada perubahan kepemilikan yang terjadi.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column (2/3): Image & Metadata */}
                <div className="md:col-span-2 space-y-6">
                    {/* Image Card */}
                    <Card className="overflow-hidden">
                        <div
                            className="relative aspect-video w-full cursor-zoom-in bg-zinc-100 dark:bg-zinc-800"
                            onClick={() => setImageZoomOpen(true)}
                        >
                            <Image
                                src={transaction.certificate.image}
                                alt="Sertifikat Fisik"
                                fill
                                className="object-cover transition-transform hover:scale-105"
                                unoptimized
                            />

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                                <div className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-white">
                                    <ZoomIn className="h-4 w-4" />
                                    <span className="text-sm font-medium">Perbesar</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t bg-muted/20">
                            <p className="text-xs text-center text-muted-foreground">
                                Dokumen Digital Asli
                            </p>
                        </div>
                    </Card>

                    {/* Info Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                <CardTitle className="text-lg">Informasi Sertifikat</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ID Transaksi</span>
                                    <div className="font-medium font-mono text-primary">{transaction.id}</div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nomor Sertifikat</span>
                                    <div className="font-medium">{transaction.certificate.nomor}</div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama Sertifikat</span>
                                    <div className="font-medium">{transaction.certificate.nama}</div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Luas Area</span>
                                    <div className="font-medium">{transaction.certificate.luas}</div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Lokasi</span>
                                    <div className="flex items-center gap-2 font-medium">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        {transaction.certificate.location}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Keterangan</span>
                                    <div className="font-medium">{transaction.certificate.keterangan}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (1/3): Sidebar */}
                <div className="md:col-span-1 space-y-6">
                    {/* Status Pengajuan (Timeline) */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                <CardTitle className="text-base">Status Pengajuan</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="relative border-l-2 border-zinc-200 ml-3 space-y-8 pb-2">
                                {transaction.timeline.map((item, i) => {
                                    const isLatest = i === transaction.timeline.length - 1;
                                    return (
                                        <div key={i} className="relative pl-6">
                                            <span
                                                className={`absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white ring-1 ring-zinc-200 ${isLatest ? "bg-primary" : "bg-zinc-400"}`}
                                            />
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-sm font-semibold leading-none ${isLatest ? 'text-primary' : 'text-foreground'}`}>
                                                    {item.title}
                                                </span>
                                                <span className="text-xs text-muted-foreground mt-1 leading-snug">
                                                    {item.desc}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono mt-1 pt-1 border-t w-fit">
                                                    <Calendar className="h-3 w-3" />
                                                    {item.date}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transaction Details Box */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <CardTitle className="text-base">Detail Transfer</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Pengirim</p>
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium">{transaction.sender}</p>
                                    <p className="text-xs text-muted-foreground">{transaction.senderEmail}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Penerima</p>
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium">{transaction.receiver}</p>
                                    <p className="text-xs text-muted-foreground">{transaction.receiverEmail}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Jenis Transfer</p>
                                <Badge variant="secondary">{transaction.type}</Badge>
                            </div>
                            {transaction.note && (
                                <div className="pt-2">
                                    <p className="text-xs text-muted-foreground mb-1">Catatan</p>
                                    <p className="text-sm italic text-muted-foreground bg-muted/30 p-2 rounded">
                                        "{transaction.note}"
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Jejak Rekam Kepemilikan */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <History className="h-5 w-5 text-primary" />
                                <CardTitle className="text-base">Jejak Rekam Kepemilikan</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pl-6">
                            <div className="relative border-l-2 border-zinc-200 ml-3 space-y-8 pb-4">
                                {transaction.certificate.history.map((history, index) => (
                                    <div key={index} className="relative pl-6">
                                        <span
                                            className={`absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white ring-1 ring-zinc-200 ${index === 0 ? "bg-primary" : "bg-zinc-300"}`}
                                        />
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-col">
                                                <h3 className={`text-sm font-semibold ${index === 0 ? "text-primary" : "text-foreground"}`}>
                                                    {history.owner}
                                                </h3>
                                                <span className="text-[10px] w-fit mt-0.5 text-muted-foreground bg-zinc-100 px-1.5 py-0.5 rounded border">
                                                    {history.method}
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

                                            {history.notes && (
                                                <div className="mt-1.5 rounded bg-muted/40 p-1.5 text-xs text-zinc-500 italic">
                                                    "{history.notes}"
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Image Zoom Modal */}
            {imageZoomOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
                    onClick={() => setImageZoomOpen(false)}
                >
                    <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg shadow-2xl">
                        <button
                            onClick={() => setImageZoomOpen(false)}
                            className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="flex h-auto w-auto max-w-full max-h-full items-center justify-center">
                            <Image
                                src={transaction.certificate.image}
                                alt="Full Certificate"
                                width={1000}
                                height={600}
                                className="object-contain max-h-[85vh] w-auto rounded-md"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
