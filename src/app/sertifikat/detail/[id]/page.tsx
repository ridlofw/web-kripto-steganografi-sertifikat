"use client";

import Link from "next/link";
import { use, useState, useEffect } from "react";
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
    Share2,
    Building2,
    User,
    ZoomIn,
    X,
    Activity,
    History
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
import Image from "next/image";
import { DUMMY_CERTIFICATES, DUMMY_TRANSACTIONS, DUMMY_USERS } from "@/lib/dummy-data";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function CertificateDetailPage({ params }: PageProps) {
    // Unwrap params using React.use()
    const { id } = use(params);
    const [loading, setLoading] = useState(true);
    const [imageZoomOpen, setImageZoomOpen] = useState(false);

    // Data state
    const [transaction, setTransaction] = useState<any>(null);
    const [certificate, setCertificate] = useState<any>(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        // Simulate API fetch delay
        setTimeout(() => {
            // 1. Try to find Transaction
            const foundTx = DUMMY_TRANSACTIONS.find(t => t.id === id);

            if (foundTx) {
                setTransaction(foundTx);
                const relatedCert = DUMMY_CERTIFICATES.find(c => c.id === foundTx.certificateId);
                setCertificate(relatedCert);
            } else {
                // 2. Try to find Certificate directly
                const foundCert = DUMMY_CERTIFICATES.find(c => c.id === id);
                if (foundCert) {
                    setCertificate(foundCert);
                } else {
                    setNotFound(true);
                }
            }
            setLoading(false);
        }, 500);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-2 animate-pulse">
                    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-muted-foreground">Memuat data...</p>
                </div>
            </div>
        );
    }

    if (notFound || !certificate) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Data Tidak Ditemukan</h2>
                    <p className="text-muted-foreground mb-4">ID Transaksi atau Sertifikat tidak valid.</p>
                    <Link href="/">
                        <Button>Kembali ke Beranda</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Determine status for badge
    const status = transaction ? transaction.status : 'success'; // If just viewing cert, assume active/success

    const getStatusBadge = (status: string) => {
        if (status.includes('pending')) {
            return (
                <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Dalam Proses
                </Badge>
            );
        } else if (status === 'success' || status === 'accepted') {
            return (
                <Badge variant="default" className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-1 border-0">
                    <ShieldCheck className="h-3 w-3" />
                    Selesai
                </Badge>
            );
        } else if (status === 'rejected') {
            return (
                <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    Ditolak
                </Badge>
            );
        }
        return <Badge variant="secondary">{status}</Badge>;
    };

    // Helper to get User
    const getUser = (userId: string) => DUMMY_USERS.find(u => u.id === userId);

    return (
        <div className="min-h-screen bg-zinc-50 p-6 lg:p-12">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Header Navigation */}
                <div className="flex flex-col gap-4">
                    <Link
                        href="/"
                        className="flex w-fit items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Kembali
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight">Detail Transaksi</h1>
                                {getStatusBadge(status)}
                            </div>
                            {transaction && (
                                <p className="text-muted-foreground">
                                    ID Transaksi: <span className="font-mono font-medium text-foreground">{transaction.id.toUpperCase()}</span>
                                </p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            {status === 'success' && (
                                <Button size="sm" className="h-9 gap-2">
                                    <Download className="h-4 w-4" />
                                    Unduh Sertifikat
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

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
                                    src={certificate.image}
                                    alt="Sertifikat Fisik"
                                    fill
                                    className="object-cover transition-transform hover:scale-105"
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
                                    {transaction && (
                                        <div className="space-y-1">
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ID Transaksi</span>
                                            <div className="font-medium font-mono text-primary">{transaction.id.toUpperCase()}</div>
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nomor Sertifikat</span>
                                        <div className="font-medium">{certificate.nomor}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama Sertifikat</span>
                                        <div className="font-medium">{certificate.nama}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Luas Area</span>
                                        <div className="font-medium">{certificate.luas}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Lokasi</span>
                                        <div className="flex items-center gap-2 font-medium">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            {certificate.location}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Keterangan</span>
                                        <div className="font-medium">{certificate.keterangan}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column (1/3): Timeline/Sidebar */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="h-fit">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-base">Status Pengajuan</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {transaction && transaction.timeline ? (
                                    <div className="relative border-l-2 border-zinc-200 ml-3 space-y-8 pb-2">
                                        {transaction.timeline.map((item: any, i: number) => {
                                            // Check if this is the "current" or "latest" step for highlighting
                                            const isLatest = i === transaction.timeline.length - 1;

                                            return (
                                                <div key={i} className="relative pl-6">
                                                    <span
                                                        className={`absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white ring-1 ring-zinc-200 ${isLatest ? "bg-primary" : "bg-zinc-400"
                                                            }`}
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
                                ) : (
                                    <p className="text-sm text-muted-foreground">Tidak ada data riwayat transaksi.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Transaction Details Box */}
                        {transaction && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Detail Transfer</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Pengirim</p>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium">{getUser(transaction.senderId)?.name || "Unknown"}</p>
                                            <p className="text-xs text-muted-foreground">{getUser(transaction.senderId)?.email}</p>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Penerima</p>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium">
                                                {transaction.recipientId
                                                    ? getUser(transaction.recipientId)?.name
                                                    : "Belum Terdaftar"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{transaction.recipientEmail}</p>
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
                        )}

                        {/* Jejak Rekam Kepemilikan (Ownership History) */}
                        {certificate && certificate.history && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <History className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-base">Jejak Rekam Kepemilikan</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pl-6">
                                    <div className="relative border-l-2 border-zinc-200 ml-3 space-y-8 pb-4">
                                        {certificate.history.map((history: any, index: number) => {
                                            // Assume first item is current owner for highlighting
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
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Image Zoom Modal */}
            {imageZoomOpen && certificate && (
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
                                src={certificate.image}
                                alt="Full Certificate"
                                width={1000}
                                height={600}
                                className="object-contain max-h-[85vh] w-auto rounded-md"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
