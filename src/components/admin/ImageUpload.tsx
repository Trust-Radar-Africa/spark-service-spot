import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link as LinkIcon, X, Loader2, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const LARAVEL_API_URL = import.meta.env.VITE_LARAVEL_API_URL || '';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Featured Image',
  className,
}: ImageUploadProps) {
  const [activeTab, setActiveTab] = useState<string>(value ? 'preview' : 'upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    async (file: File) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file (JPEG, PNG, GIF, WebP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image must be less than 5MB');
        return;
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        // If Laravel API is configured, upload to Laravel storage
        if (LARAVEL_API_URL) {
          const formData = new FormData();
          formData.append('image', file);

          const response = await fetch(`${LARAVEL_API_URL}/api/admin/upload-image`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });

          if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || 'Failed to upload image');
          }

          const data = await response.json();
          onChange(data.url || data.image_url);
          setActiveTab('preview');
        } else {
          // Demo mode: create local preview URL
          const localUrl = URL.createObjectURL(file);
          onChange(localUrl);
          setActiveTab('preview');
        }
      } catch (error) {
        console.error('Upload error:', error);
        setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
    if (url) {
      setActiveTab('preview');
    }
  };

  const handleRemove = () => {
    onChange('');
    setActiveTab('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-1.5">
            <Upload className="h-3.5 w-3.5" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-1.5">
            <LinkIcon className="h-3.5 w-3.5" />
            URL
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-1.5" disabled={!value}>
            <ImageIcon className="h-3.5 w-3.5" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-3">
          <div
            className={cn(
              'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50',
              isUploading && 'pointer-events-none opacity-60'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <div className="flex flex-col items-center gap-2">
              {isUploading ? (
                <>
                  <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      Drag and drop an image, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPEG, PNG, GIF, WebP up to 5MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          {uploadError && (
            <p className="text-sm text-destructive mt-2">{uploadError}</p>
          )}
          {!LARAVEL_API_URL && (
            <p className="text-xs text-muted-foreground mt-2">
              Demo mode: Images are stored locally in browser memory.
              Configure VITE_LARAVEL_API_URL for persistent storage.
            </p>
          )}
        </TabsContent>

        <TabsContent value="url" className="mt-3 space-y-3">
          <div>
            <Input
              placeholder="https://example.com/image.jpg"
              value={value}
              onChange={(e) => handleUrlChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Enter a direct URL to an image file
            </p>
          </div>
          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('preview')}
            >
              <ImageIcon className="h-4 w-4 mr-1.5" />
              View Preview
            </Button>
          )}
        </TabsContent>

        <TabsContent value="preview" className="mt-3">
          {value ? (
            <div className="relative group">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted border">
                <img
                  src={value}
                  alt="Featured image preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 truncate" title={value}>
                {value}
              </p>
            </div>
          ) : (
            <div className="aspect-video rounded-lg bg-muted border flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No image selected</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
