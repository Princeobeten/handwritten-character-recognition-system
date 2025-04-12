'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    analysis: string | null;
  } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleUpload = async (file: File) => {
    setPreview(URL.createObjectURL(file));
    setIsProcessing(true);
    setError(null);
    
    try {
      // Upload original image
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      
      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Upload failed');
      }
      const { historyId } = await uploadResponse.json();

      // Preprocess image
      const preprocessFormData = new FormData();
      preprocessFormData.append('file', file);
      const preprocessResponse = await fetch('/api/preprocess', {
        method: 'POST',
        body: preprocessFormData,
      });

      if (!preprocessResponse.ok) {
        throw new Error('Failed to preprocess image');
      }
      const { data: processedImageBase64, analysis } = await preprocessResponse.json();

      // Set the analysis result directly
      setResult({
        analysis: analysis
      });

      // Remove or comment out the classify section since we're using the Gemini analysis
      // const classifyResponse = await fetch('/api/classify'...

    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    await handleUpload(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
  });

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight lg:text-5xl">
            Upload Handwritten Image
          </h1>
          <p className="text-sm sm:text-base leading-6 sm:leading-7 text-gray-600 dark:text-gray-300 mt-4">
            Upload an image containing handwritten characters and our AI system will recognize them for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload and Preview */}
          <div className="space-y-6">
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer
                transition-colors duration-200
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              `}
            >
              <input {...getInputProps()} />
              <ArrowUpTrayIcon className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-gray-400" />
              <p className="mt-3 text-base sm:text-lg text-gray-600">
                {isDragActive ? 'Drop the image here...' : 'Drag & drop an image here, or click to select'}
              </p>
              <p className="mt-2 text-xs sm:text-sm text-gray-500">
                Supported formats: PNG, JPG, JPEG
              </p>
            </div>

            {error && (
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm sm:text-base text-red-600">{error}</p>
              </div>
            )}

            {preview && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Preview</h2>
                <div className="aspect-video w-full overflow-hidden rounded-lg border bg-gray-100 shadow-sm">
                  <img
                    src={preview}
                    alt="Preview"
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
                <p className="mt-4 text-gray-600">Processing image...</p>
              </div>
            ) : result ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Recognition Result</h2>
                <div className="space-y-6">
                  {result.analysis ? (
                    <div className="prose prose-sm max-w-none">
                      <div className="font-mono whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        {result.analysis}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No analysis available</p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}