"use client";

import Link from "next/link";
import { useState, useEffect, use } from "react";
import { ArrowLeft, History, User, Calendar, Download, Send, ZoomIn, X, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { DUMMY_CERTIFICATES, Certificate, OwnershipHistory } from "@/lib/dummy-data";

interface Props {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: Props) {
  const { id } = use(params);

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  const [transferOpen, setTransferOpen] = useState(false);
  const [imageZoomOpen, setImageZoomOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [transferType, setTransferType] = useState("Jual Beli");
  const [note, setNote] = useState("");
  const [transferSuccess, setTransferSuccess] = useState<null | {
    email: string;
    type: string;
  }>(null);

  useEffect(() => {
    // 1. Check Dummy Data
    const dummy = DUMMY_CERTIFICATES.find(c => c.id === id);
    if (dummy) {
      setCertificate(dummy);
      setLoading(false);
      return;
    }

    // 2. Check Local Storage (for newly created ones)
    // NOTE: This assumes Dashboard will save to 'user_certificates' in future or uses shared state.
    // However, Dashboard currently uses local state. To make it work across pages:
    // Future Todo: Persist certificates to localStorage in Dashboard. 
    // Fallback: Just stop loading if not found.
    setLoading(false);
  }, [id]);

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (!certificate) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
        <Card className="w-full max-w-md text-center p-6">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-zinc-100 p-4">
              <FileText className="h-10 w-10 text-zinc-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Sertifikat Tidak Ditemukan</h2>
          <p className="text-zinc-500 mb-6">
            Maaf, kami tidak dapat menemukan sertifikat dengan ID tersebut. Mohon periksa kembali link atau kembali ke beranda.
          </p>
          <Link href="/">
            <Button className="w-full">
              Kembali ke Beranda
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const displayHistory = certificate.history || [];

  return (
    <div className="min-h-screen bg-zinc-50 p-6 lg:p-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4">
          <Link
            href="/"
            className="flex w-fit items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Detail Sertifikat</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                size="sm"
                onClick={() => setTransferOpen(true)}
                className="hidden sm:flex"
              >
                <Send className="mr-2 h-4 w-4" />
                Transfer
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column (Larger): Certificate Image & Details */}
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div
                className="relative aspect-video w-full cursor-zoom-in bg-zinc-100 dark:bg-zinc-800"
                onClick={() => setImageZoomOpen(true)}
              >
                {/* Using Next.js Image component for the generated asset */}
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
                  Dokumen Digital Asli • {certificate.uploadDate}
                </p>
              </div>
            </Card>

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
                    <p className="font-medium text-lg">{certificate.nama}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Nomor Sertifikat</label>
                    <p className="font-medium text-lg">{certificate.nomor}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Luas Tanah</label>
                    <p className="font-medium text-lg">{certificate.luas}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Pemegang Hak</label>
                    <p className="font-medium text-lg">{certificate.history[0]?.name || "Unknown"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Alamat</label>
                    <p className="font-medium text-lg">{certificate.location}</p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <label className="text-xs text-muted-foreground">Keterangan</label>
                  <p className="font-medium">{certificate.keterangan}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Smaller): History Timeline */}
          <div className="md:col-span-1">
            {/* Success Notification */}
            {transferSuccess && (
              <div className="mb-4 rounded-md border bg-green-50 p-3 text-sm text-green-800 animate-in fade-in slide-in-from-top-2">
                Transfer berhasil dikirim ke <strong>{transferSuccess.email}</strong> ({transferSuccess.type})
              </div>
            )}

            {/* REMOVED h-full to make height dynamic */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Jejak Rekam Kepemilikan</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pl-6">
                <div className="relative border-l-2 border-zinc-200 ml-3 space-y-8 pb-4">
                  {displayHistory.map((history, index) => {
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
          </div>
        </div>

        {/* Image Zoom Modal */}
        {imageZoomOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setImageZoomOpen(false)}
          >
            <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg shadow-2xl">
              <button
                onClick={() => setImageZoomOpen(false)}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              >
                <X className="h-5 w-5" />
              </button>
              {/* Placeholder content for zoom too */}
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

        {/* Transfer Modal */}
        {transferOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setTransferOpen(false)}
            />

            <div className="relative z-10 w-full max-w-lg rounded-xl bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">Transfer Sertifikat</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Kirimkan sertifikat ini ke pengguna lain
                  </p>
                </div>
                <button
                  onClick={() => setTransferOpen(false)}
                  className="rounded-full p-1 hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Email Penerima <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="nama.penerima@email.com"
                    className="w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    type="email"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Jenis Transfer <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={transferType}
                    onChange={(e) => setTransferType(e.target.value)}
                    className="w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Jual Beli</option>
                    <option>Wakaf</option>
                    <option>Hibah</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Catatan
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={4}
                    placeholder="Catatan atau keterangan transfer (opsional)"
                    className="w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setTransferOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={() => {
                      if (!recipientEmail || !transferType) return;
                      setTransferOpen(false);
                      setTransferSuccess({
                        email: recipientEmail,
                        type: transferType,
                      });
                      setRecipientEmail("");
                      setTransferType("Jual Beli");
                      setNote("");
                      setTimeout(() => setTransferSuccess(null), 6000);
                    }}
                  >
                    Kirim Transfer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
