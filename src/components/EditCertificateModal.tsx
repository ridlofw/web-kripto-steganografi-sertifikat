"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileEdit, Upload, X, FileText } from "lucide-react"
import { updateCertificate } from "@/lib/actions/certificates"
import Image from "next/image"

interface EditCertificateModalProps {
  cert: any
}

export function EditCertificateModal({ cert }: EditCertificateModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nomorSertifikat: cert.nomor_sertifikat,
    namaSertifikat: cert.nama_lahan,
    luasTanah: cert.luas_tanah.replace(' m2', ''),
    alamat: cert.lokasi,
    keterangan: cert.keterangan || "",
    asalHak: cert.transferReason || ""
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(cert.image_url)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const data = new FormData()
    data.append("nomorSertifikat", formData.nomorSertifikat)
    data.append("namaSertifikat", formData.namaSertifikat)
    data.append("luasTanah", formData.luasTanah + " m2")
    data.append("alamat", formData.alamat)
    data.append("keterangan", formData.keterangan)
    data.append("asalHak", formData.asalHak)

    if (uploadedFile) {
      data.append("file", uploadedFile)
    }

    const result = await updateCertificate(cert.id, data)

    if (result.success) {
      setOpen(false)
      router.refresh()
    } else {
      alert(result.error || "Gagal mengupdate sertifikat")
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-amber-200 hover:bg-amber-50 text-amber-900 group">
          <FileEdit className="mr-2 h-4 w-4 group-hover:text-amber-600" />
          Edit Detail
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Sertifikat</DialogTitle>
          <DialogDescription>
            Ubah informasi sertifikat Anda. Hanya berlaku saat status masih Pending.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
             {/* Image Preview */}
            <div className="mb-4 space-y-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-zinc-100">
                    {previewUrl ? (
                         <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-contain"
                         />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-400">
                             No Image
                        </div>
                    )}
                     <div 
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                     >
                        <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-sm">
                            <Upload className="h-4 w-4" />
                            <span className="text-sm font-medium">Ganti Gambar</span>
                        </div>
                     </div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="no-sertif">Nomor Sertifikat</Label>
                    <Input
                        id="no-sertif"
                        value={formData.nomorSertifikat}
                        onChange={(e) => setFormData({ ...formData, nomorSertifikat: e.target.value })}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="nama-sertif">Nama Sertifikat</Label>
                    <Input
                        id="nama-sertif"
                        value={formData.namaSertifikat}
                        onChange={(e) => setFormData({ ...formData, namaSertifikat: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="luas">Luas Tanah (m²)</Label>
                    <Input
                        id="luas"
                        type="number"
                        value={formData.luasTanah}
                        onChange={(e) => setFormData({ ...formData, luasTanah: e.target.value })}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="alamat">Alamat Lokasi</Label>
                    <Input
                        id="alamat"
                        value={formData.alamat}
                        onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="keterangan">Keterangan</Label>
                <Textarea
                    id="keterangan"
                    value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                />
            </div>

            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
                <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan Perubahan"}</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
