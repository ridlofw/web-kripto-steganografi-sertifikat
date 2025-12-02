"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, History, User, Calendar, Download, ArrowRightLeft, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Props {
  params: { id: string };
}

const exampleData = {
  kode: "111/SRTV/X/2006",
  nama: "Ridelo",
  luas: "100 m2",
  alamat: "Indraprasta, Semarang",
  tanggalUpload: "11 Februari 2006 pukul 10:00",
  keterangan: "Rumah Besar Di Kota",
};

const ownershipHistory = [
  {
    name: "Ridelo",
    role: "Pemilik Saat Ini",
    email: "ridelo@gmail.com",
    date: "11 Februari 2006 pukul 10:00",
    note: "Sertifikat awal diunggah",
    isCurrent: true,
  },
  {
    name: "Budi Santoso",
    role: "Pemilik Ke-4",
    email: "budi.santoso@email.com",
    date: "10 Januari 2020 pukul 09:30",
    note: "Jual beli tanah",
    isCurrent: false,
  },
  {
    name: "Siti Aminah",
    role: "Pemilik Ke-3",
    email: "siti.aminah@email.com",
    date: "15 Maret 2015 pukul 14:15",
    note: "Warisan keluarga",
    isCurrent: false,
  },
  {
    name: "Ahmad Dahlan",
    role: "Pemilik Ke-2",
    email: "ahmad.dahlan@email.com",
    date: "20 Agustus 2010 pukul 11:00",
    note: "Pecah sertifikat",
    isCurrent: false,
  },
  {
    name: "PT. Pembangunan Jaya",
    role: "Kepemilikan Awal",
    email: "admin@pembangunanjaya.com",
    date: "01 Januari 2006 pukul 08:00",
    note: "Sertifikat induk diterbitkan",
    isCurrent: false,
  },
];

export default function Page({ params }: Props) {
  const { id } = params;
  const [transferOpen, setTransferOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [transferType, setTransferType] = useState("Jual Beli");
  const [note, setNote] = useState("");
  const [transferSuccess, setTransferSuccess] = useState<null | {
    email: string;
    type: string;
  }>(null);

  return (
    <div className="min-h-screen bg-zinc-50 p-6 lg:p-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4">
          <Link
            href="/"
            className="flex w-fit items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Detail Sertifikat</h1>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-xl">{exampleData.kode}</CardTitle>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  Download
                </Button>
                <Button variant="outline" size="icon" className="sm:hidden">
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => setTransferOpen(true)}
                  className="hidden sm:flex"
                >
                  Transfer
                </Button>
                <Button
                  size="icon"
                  onClick={() => setTransferOpen(true)}
                  className="sm:hidden"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-1 gap-4 text-sm text-zinc-700 md:grid-cols-2 md:text-base">
              <div>
                <div className="text-xs text-zinc-500 md:text-sm">Nama Pemegang</div>
                <div className="font-medium">{exampleData.nama}</div>
              </div>

              <div>
                <div className="text-xs text-zinc-500 md:text-sm">Luas Tanah</div>
                <div className="font-medium">{exampleData.luas}</div>
              </div>

              <div>
                <div className="text-xs text-zinc-500 md:text-sm">Alamat</div>
                <div className="font-medium">{exampleData.alamat}</div>
              </div>

              <div>
                <div className="text-xs text-zinc-500 md:text-sm">Keterangan</div>
                <div className="font-medium">{exampleData.keterangan}</div>
              </div>

              <div>
                <div className="text-xs text-zinc-500 md:text-sm">Tanggal Upload</div>
                <div className="font-medium">{exampleData.tanggalUpload}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* success notification */}
        {transferSuccess && (
          <div className="mb-4 rounded-md border bg-green-50 p-3 text-sm text-green-800">
            Transfer berhasil dikirim ke{" "}
            <strong>{transferSuccess.email}</strong> ({transferSuccess.type})
          </div>
        )}

        {/* transfer modal overlay */}
        {transferOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setTransferOpen(false)}
            />

            <div className="relative z-10 w-full max-w-lg rounded-lg bg-background p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Transfer Sertifikat</h3>
                  <p className="text-sm text-muted-foreground">
                    Kirimkan sertifikat ini ke pengguna lain
                  </p>
                </div>
                <button
                  onClick={() => setTransferOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-xs text-zinc-500">
                    Email Penerima *
                  </label>
                  <input
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="nama.penerima@email.com"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    type="email"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-zinc-500">
                    Jenis Transfer *
                  </label>
                  <select
                    value={transferType}
                    onChange={(e) => setTransferType(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                    <option>Jual Beli</option>
                    <option>Wakaf</option>
                    <option>Hibah</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-zinc-500">
                    Catatan
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={4}
                    placeholder="Catatan atau keterangan transfer (opsional)"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>

                <div className="mt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setTransferOpen(false)}
                    className="rounded-md border px-3 py-2 text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      // simple validation
                      if (!recipientEmail || !transferType) return;
                      setTransferOpen(false);
                      setTransferSuccess({
                        email: recipientEmail,
                        type: transferType,
                      });
                      // reset form (optional)
                      setRecipientEmail("");
                      setTransferType("Jual Beli");
                      setNote("");
                      // hide notification after a short while
                      setTimeout(() => setTransferSuccess(null), 6000);
                    }}
                    className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-95"
                  >
                    Kirim Transfer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <History className="h-5 w-5" />
                <CardTitle className="text-lg">Riwayat Kepemilikan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {ownershipHistory.map((history, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 rounded-lg border p-4 ${history.isCurrent ? "" : "bg-gray-50/50"
                    }`}
                >
                  <div
                    className={`rounded-full p-2 ${history.isCurrent ? "bg-primary/10" : "bg-gray-100"
                      }`}
                  >
                    <User
                      className={`h-5 w-5 ${history.isCurrent ? "text-primary" : "text-gray-500"
                        }`}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p
                        className={`font-medium ${history.isCurrent ? "" : "text-muted-foreground"
                          }`}
                      >
                        {history.name}
                      </p>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${history.isCurrent
                          ? "bg-green-100 text-green-700"
                          : "bg-secondary"
                          }`}
                      >
                        {history.role}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{history.email}</p>
                    <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{history.date}</span>
                    </div>
                    <p className="mt-2 text-sm italic text-muted-foreground">
                      "{history.note}"
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
