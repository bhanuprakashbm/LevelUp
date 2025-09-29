import React, { useState, useCallback } from 'react';
import { Upload, File, X, Play, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const VideoUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = (files) => {
    files.forEach((file) => {
      if (file.type.startsWith('video/')) {
        const newFile = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          status: 'uploading',
          progress: 0
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
        
        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadedFiles(prev => prev.map(f => {
            if (f.id === newFile.id) {
              const newProgress = Math.min(f.progress + 10, 100);
              if (newProgress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                  setUploadedFiles(prev2 => prev2.map(f2 => 
                    f2.id === newFile.id ? { ...f2, status: 'processing' } : f2
                  ));
                  
                  setTimeout(() => {
                    setUploadedFiles(prev3 => prev3.map(f3 => 
                      f3.id === newFile.id ? { ...f3, status: 'completed' } : f3
                    ));
                    toast.success(`${file.name} processed successfully!`);
                  }, 2000);
                }, 500);
              }
              return { ...f, progress: newProgress };
            }
            return f;
          }));
        }, 200);
      } else {
        toast.error('Please upload video files only');
      }
    });
  };

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
        return <Upload className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'processing':
        return <Play className="w-4 h-4 text-orange-500 animate-spin" />;
      case 'completed':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-orange-500';
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Upload Video</h1>
        <p className="text-blue-600">Upload your videos for AI-powered analysis and processing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-blue-200 hover:border-blue-300 bg-white/70'
            } backdrop-blur-sm`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => handleFiles(Array.from(e.target.files || []))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  Drop your videos here
                </h3>
                <p className="text-blue-600 mb-4">
                  or click to browse from your computer
                </p>
                <p className="text-sm text-blue-500">
                  Supports: MP4, AVI, MOV, WMV (Max: 100MB each)
                </p>
              </div>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold text-blue-900">Uploaded Files</h3>
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-blue-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(file.status)}
                      <div>
                        <p className="font-medium text-blue-900">{file.name}</p>
                        <p className="text-sm text-blue-600">{file.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                  
                  {file.status === 'uploading' && (
                    <div className="w-full bg-blue-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(file.status)}`}
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {file.status === 'processing' && (
                    <div className="flex items-center space-x-2 text-sm text-orange-600">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                      <span>AI analysis in progress...</span>
                    </div>
                  )}
                  
                  {file.status === 'completed' && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Analysis completed successfully</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">AI Analysis Features</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm text-blue-800">Object Recognition</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-blue-800">Motion Analysis</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span className="text-sm text-blue-800">Scene Classification</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-sm text-blue-800">Performance Metrics</span>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Recent Uploads</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">training_video_1.mp4</p>
                  <p className="text-xs text-blue-600">Completed • 2.3 MB</p>
                </div>
                <Check className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">match_analysis.mp4</p>
                  <p className="text-xs text-blue-600">Completed • 15.7 MB</p>
                </div>
                <Check className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;