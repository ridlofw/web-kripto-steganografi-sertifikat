"use strict";
"use client";

import { Button } from "@/components/ui/button";
import { ShieldCheck, Download, Loader2 } from "lucide-react";
import { useState } from "react";

interface DownloadButtonProps {
    url: string;
    filename: string;
    isStego: boolean;
}

export function DownloadButton({ url, filename, isStego }: DownloadButtonProps) {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault();
        setDownloading(true);

        try {
            // Fetch blob to force download
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            // Create temp anchor
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = filename; // Force this filename
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Download failed:", err);
            // Fallback: Just open it if fetch fails
            window.open(url, "_blank");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Button 
            variant="outline" 
            className="w-full h-8 text-xs gap-2" 
            onClick={handleDownload}
            disabled={downloading}
        >
            {downloading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
            ) : isStego ? (
                <ShieldCheck className="w-3 h-3 text-green-600" />
            ) : (
                <Download className="w-3 h-3" />
            )}
            {downloading ? "Mengunduh..." : (isStego ? "Unduh Stego Image (Aman)" : "Unduh Gambar Asli")}
        </Button>
    );
}
