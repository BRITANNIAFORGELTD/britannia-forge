import React, { useState } from 'react';
import { ChevronDown, Wrench, Zap, Droplets, Paintbrush, Hammer, ShieldCheck, FileText, UserCheck, Settings, Shield, Phone, MapPin, Camera, PenTool } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  category: string;
}

const services: Service[] = [
  { id: 'boiler-repair', name: 'Boiler Repair & Service', icon: Wrench, description: 'Emergency repairs and maintenance', category: 'heating' },
  { id: 'gas-safety', name: 'Gas Safety Certificate', icon: ShieldCheck, description: 'Annual safety inspections', category: 'safety' },
  { id: 'landlord-safety', name: 'Landlord Safety Certificate', icon: FileText, description: 'Legal compliance certificates', category: 'safety' },
  { id: 'electrician', name: 'Electrical Services', icon: Zap, description: 'Wiring, sockets, and electrical repairs', category: 'electrical' },
  { id: 'plumber', name: 'Plumbing Services', icon: Droplets, description: 'Leak repairs, pipe installation', category: 'plumbing' },
  { id: 'decorator', name: 'Decoration & Painting', icon: Paintbrush, description: 'Interior and exterior painting', category: 'decoration' },
  { id: 'handyman', name: 'General Handyman', icon: Hammer, description: 'Household repairs and maintenance', category: 'general' },
];

interface EngineerDropdownProps {
  onServiceSelect: (service: Service) => void;
}

export function EngineerDropdown({ onServiceSelect }: EngineerDropdownProps) {
  const [selectedService, setSelectedService] = useState<string>('');

  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId);
    const service = services.find(s => s.id === serviceId);
    if (service) {
      onServiceSelect(service);
    }
  };

  return (
    <div className="relative">
      <Select value={selectedService} onValueChange={handleServiceChange}>
        <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            <SelectValue placeholder="Select Service" />
          </div>
        </SelectTrigger>
        <SelectContent className="w-80 bg-white/95 backdrop-blur-md border-white/20">
          <div className="p-2">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">Home Services</h3>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id} className="p-3 cursor-pointer hover:bg-orange-50/80 rounded-lg mb-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100/80 rounded-lg">
                    <service.icon className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{service.name}</div>
                    <div className="text-xs text-gray-500">{service.description}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}

interface JobRequestModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: JobRequestData) => void;
}

interface JobRequestData {
  serviceType: string;
  description: string;
  photos: File[];
  postcode: string;
  urgency: 'low' | 'medium' | 'high';
  preferredDate: string;
  contactPhone: string;
}

export function JobRequestModal({ service, isOpen, onClose, onSubmit }: JobRequestModalProps) {
  const [jobData, setJobData] = useState<JobRequestData>({
    serviceType: service.id,
    description: '',
    photos: [],
    postcode: '',
    urgency: 'medium',
    preferredDate: '',
    contactPhone: ''
  });

  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(jobData);
    onClose();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setJobData(prev => ({
      ...prev,
      photos: [...prev.photos, ...imageFiles].slice(0, 5) // Max 5 photos
    }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <service.icon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{service.name}</h2>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your problem
            </label>
            <textarea
              value={jobData.description}
              onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              rows={4}
              placeholder="Please describe the issue in detail..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload photos (optional, max 5)
            </label>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                dragActive ? "border-orange-400 bg-orange-50" : "border-gray-300 hover:border-gray-400"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Drag & drop photos here or click to select
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG up to 10MB each
              </p>
            </div>
            
            {jobData.photos.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {jobData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setJobData(prev => ({
                        ...prev,
                        photos: prev.photos.filter((_, i) => i !== index)
                      }))}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postcode
              </label>
              <input
                type="text"
                value={jobData.postcode}
                onChange={(e) => setJobData(prev => ({ ...prev, postcode: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="SW1A 1AA"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                value={jobData.contactPhone}
                onChange={(e) => setJobData(prev => ({ ...prev, contactPhone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="07XXX XXXXXX"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level
            </label>
            <Select value={jobData.urgency} onValueChange={(value: 'low' | 'medium' | 'high') => setJobData(prev => ({ ...prev, urgency: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Low - Within a week</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Medium - Within 2-3 days</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>High - Emergency (24hrs)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              Submit Request
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}