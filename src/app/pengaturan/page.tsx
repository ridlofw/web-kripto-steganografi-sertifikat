"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Palette,
  Bell,
  Shield,
  Trash2,
  Camera,
  Moon,
  Sun,
  Laptop,
} from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem("auth_session")
    if (session) {
      const userData = JSON.parse(session)
      setUser(userData)
      setName(userData.name)
      setEmail(userData.email)
    } else {
      router.push("/login")
    }
  }, [router])

  const handleSaveProfile = () => {
    setMessage(null)
    if (!user) return

    try {
      const users = JSON.parse(localStorage.getItem("auth_users") || "[]")
      const updatedUsers = users.map((u: any) => {
        if (u.email === user.email) { // Identify by original email
          return { ...u, name, email }
        }
        return u
      })

      localStorage.setItem("auth_users", JSON.stringify(updatedUsers))
      
      const updatedUser = { ...user, name, email }
      localStorage.setItem("auth_session", JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      // Notify other components
      window.dispatchEvent(new Event("auth-change"))

      setMessage({ type: "success", text: "Profil berhasil diperbarui!" })
    } catch (error) {
      setMessage({ type: "error", text: "Gagal menyimpan perubahan." })
    }
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmation !== "DELETE") {
      setMessage({ type: "error", text: "Silakan ketik DELETE dengan benar." })
      return
    }

    try {
      const users = JSON.parse(localStorage.getItem("auth_users") || "[]")
      const updatedUsers = users.filter((u: any) => u.email !== user.email)
      
      localStorage.setItem("auth_users", JSON.stringify(updatedUsers))
      localStorage.removeItem("auth_session")
      
      window.dispatchEvent(new Event("auth-change"))
      router.push("/login")
    } catch (error) {
      setMessage({ type: "error", text: "Gagal menghapus akun." })
    }
  }

  if (!user) return null

  const getInitials = (name: string) => {
      return name
          ? name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2)
          : "US";
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="space-y-0.5 mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Pengaturan</h2>
        <p className="text-muted-foreground">
          Kelola preferensi akun dan pengaturan aplikasi Anda.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5 overflow-x-auto lg:overflow-visible">
          <Tabs
            defaultValue="profile"
            value={activeTab}
            onValueChange={(val) => {
                setActiveTab(val)
                setMessage(null)
            }}
            className="flex flex-col space-y-1 lg:space-y-0"
          >
            <TabsList className="flex flex-row lg:flex-col h-auto items-center lg:items-stretch bg-transparent p-0 space-x-2 lg:space-x-0 lg:space-y-1 w-full justify-start px-4 lg:px-0">
              <TabsTrigger
                value="profile"
                className="justify-start px-4 py-2 h-9 data-[state=active]:bg-muted hover:bg-muted/50 transition-colors rounded-md whitespace-nowrap"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="justify-start px-4 py-2 h-9 data-[state=active]:bg-muted hover:bg-muted/50 transition-colors rounded-md whitespace-nowrap"
              >
                <Palette className="mr-2 h-4 w-4" />
                Tampilan
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="justify-start px-4 py-2 h-9 data-[state=active]:bg-muted hover:bg-muted/50 transition-colors rounded-md whitespace-nowrap"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifikasi
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="justify-start px-4 py-2 h-9 data-[state=active]:bg-muted hover:bg-muted/50 transition-colors rounded-md whitespace-nowrap"
              >
                <Shield className="mr-2 h-4 w-4" />
                Keamanan
              </TabsTrigger>
              <TabsTrigger
                value="danger"
                className="justify-start px-4 py-2 h-9 data-[state=active]:bg-red-100 text-red-600 hover:bg-red-50 transition-colors rounded-md mt-0 lg:mt-4 whitespace-nowrap"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Danger Zone
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          {message && (
            <div className={`mb-4 p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}

          {/* Profile Section */}
          <div className={activeTab === "profile" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Informasi profil publik Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="text-lg">{getInitials(name)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Camera className="h-4 w-4" />
                    Ubah Foto
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="full-name">Nama Lengkap</Label>
                    <Input 
                        id="full-name" 
                        placeholder="Masukkan nama lengkap Anda" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="nama@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile}>Simpan Perubahan</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Appearance Section */}
          <div className={activeTab === "appearance" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle>Tampilan</CardTitle>
                <CardDescription>
                  Sesuaikan tampilan aplikasi sesuai preferensi Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-20 w-full rounded-md border-2 border-muted bg-white p-2 hover:border-primary cursor-pointer flex items-center justify-center">
                        <Sun className="h-6 w-6 text-orange-500" />
                      </div>
                      <span className="text-xs font-medium">Terang</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-20 w-full rounded-md border-2 border-muted bg-slate-950 p-2 hover:border-primary cursor-pointer flex items-center justify-center">
                        <Moon className="h-6 w-6 text-blue-400" />
                      </div>
                      <span className="text-xs font-medium">Gelap</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-20 w-full rounded-md border-2 border-muted bg-slate-100 p-2 hover:border-primary cursor-pointer flex items-center justify-center">
                        <Laptop className="h-6 w-6 text-slate-600" />
                      </div>
                      <span className="text-xs font-medium">Sistem</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Bahasa</Label>
                  <select
                    id="language"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="id"
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Simpan Preferensi</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Notifications Section */}
          <div className={activeTab === "notifications" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle>Notifikasi</CardTitle>
                <CardDescription>
                  Atur bagaimana Anda ingin menerima pemberitahuan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="email-notif" className="flex flex-col space-y-1">
                    <span>Notifikasi Email</span>
                    <span className="font-normal text-xs text-muted-foreground">Terima email tentang aktivitas akun Anda.</span>
                  </Label>
                  <Switch id="email-notif" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="push-notif" className="flex flex-col space-y-1">
                    <span>Push Notifications</span>
                    <span className="font-normal text-xs text-muted-foreground">Terima notifikasi push di perangkat Anda.</span>
                  </Label>
                  <Switch id="push-notif" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="marketing-email" className="flex flex-col space-y-1">
                    <span>Email Marketing</span>
                    <span className="font-normal text-xs text-muted-foreground">Terima email tentang fitur baru dan penawaran.</span>
                  </Label>
                  <Switch id="marketing-email" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Simpan Pengaturan</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Security Section */}
          <div className={activeTab === "security" ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle>Keamanan</CardTitle>
                <CardDescription>
                  Perbarui kata sandi dan amankan akun Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Ubah Kata Sandi</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Kata Sandi Saat Ini</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">Kata Sandi Baru</Label>
                    <Input id="new-password" type="password" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="2fa" className="flex flex-col space-y-1">
                    <span>Autentikasi Dua Faktor (2FA)</span>
                    <span className="font-normal text-xs text-muted-foreground">Tambahkan lapisan keamanan ekstra ke akun Anda.</span>
                  </Label>
                  <Switch id="2fa" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Perbarui Keamanan</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Danger Zone Section */}
          <div className={activeTab === "danger" ? "block" : "hidden"}>
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription className="text-red-600/80">
                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus akun Anda secara permanen.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  Silakan ketik <strong>DELETE</strong> untuk mengonfirmasi.
                </div>
                <Input 
                    className="bg-white dark:bg-slate-950" 
                    placeholder="DELETE" 
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                />
              </CardContent>
              <CardFooter>
                <Button variant="destructive" className="w-full sm:w-auto" onClick={handleDeleteAccount}>Hapus Akun Saya</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
