"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteCertificate } from "@/lib/actions/certificates"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function DeleteCertificateAction({ certId, certName }: { certId: string, certName: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    const result = await deleteCertificate(certId)
    
    if (result.success) {
      router.push("/sertifikat") // Redirect to list after delete
      router.refresh()
    } else {
      alert(result.error || "Gagal menghapus sertifikat")
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
            variant="outline" 
            className="w-full border-red-200 hover:bg-red-50 text-red-700 group mt-2"
        >
          <Trash2 className="mr-2 h-4 w-4 group-hover:text-red-600" />
          Hapus Pengajuan
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Sertifikat?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus pengajuan sertifikat <strong>"{certName}"</strong>? 
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-red-600 hover:bg-red-700" 
            disabled={loading}
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
