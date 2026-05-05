import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Image as ImageIcon, 
  Wifi, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  FileText, 
  Video, 
  ArrowRight, 
  ArrowLeft,
  Check
} from 'lucide-react';
import { propertyApi } from '../services/propertyApi';

const FACILITIES_LIST = [
  'Free WiFi', 'Swimming Pool', 'Gym/Fitness Center', 'Spa', 
  'Restaurant', 'Room Service', 'Bar/Lounge', 'Free Parking',
  'Air Conditioning', 'Airport Shuttle', 'Pet Friendly', 'Business Center'
];

export default function CreateHotelWizard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);

  const [formData, setFormData] = useState({
    basicInfo: {
      name: '',
      city: '',
      state: '',
      description: '',
      email: '',
      phone: '',
      address: '',
      coverImage: ''
    },
    facilities: [] as string[],
    rooms: [
      { type: '', price: '', capacity: '', totalRooms: '' }
    ],
    documents: {
      idProof: '',
      license: '',
      videoUrl: ''
    }
  });

  useEffect(() => {
    if (id) {
      const fetchProperty = async () => {
        try {
          const { apiGet } = await import('../services/apiClient');
          const data = await apiGet<any>(`/hotels/${id}`);
          
          const [city = '', state = ''] = (data.location || '').split(', ');
          
          setFormData({
            basicInfo: {
              name: data.name || '',
              city: city.trim(),
              state: state.trim(),
              description: data.description || '',
              email: data.fullAmenities?.contact?.email || '',
              phone: data.fullAmenities?.contact?.phone || '',
              address: data.fullAmenities?.address || '',
              coverImage: data.images?.[0] || ''
            },
            facilities: data.amenities || [],
            rooms: (data.tiers || []).map((t: any) => ({
              type: t.name || '',
              price: String(t.price || ''),
              capacity: String(t.capacity || ''),
              totalRooms: String(t.totalRooms || '')
            })),
            documents: {
              idProof: data.nearby?.documents?.idProof || '',
              license: data.nearby?.documents?.license || '',
              videoUrl: data.nearby?.documents?.videoUrl || ''
            }
          });
        } catch (error) {
          console.error('Failed to fetch property details:', error);
          alert('Could not load property details.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id]);


  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [e.target.name]: e.target.value }
    }));
  };

  const toggleFacility = (facility: string) => {
    setFormData(prev => {
      const current = prev.facilities;
      const updated = current.includes(facility) 
        ? current.filter(f => f !== facility)
        : [...current, facility];
      return { ...prev, facilities: updated };
    });
  };

  const handleRoomChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newRooms = [...prev.rooms];
      newRooms[index] = { ...newRooms[index], [field]: value };
      return { ...prev, rooms: newRooms };
    });
  };

  const addRoom = () => {
    setFormData(prev => ({
      ...prev,
      rooms: [...prev.rooms, { type: '', price: '', capacity: '', totalRooms: '' }]
    }));
  };

  const removeRoom = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index)
    }));
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      documents: { ...prev.documents, [e.target.name]: e.target.value }
    }));
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      const { name, city, state, description, email, phone, address, coverImage } = formData.basicInfo;
      return name && city && state && description.length >= 10 && email && phone && address && coverImage;
    }
    if (currentStep === 2) {
      return true; // Optional
    }
    if (currentStep === 3) {
      return formData.rooms.length > 0 && formData.rooms.every(r => r.type && r.price && r.capacity && r.totalRooms);
    }
    if (currentStep === 4) {
      return formData.documents.idProof && formData.documents.license; // Video URL optional
    }
    return true;
  };

  const nextStep = () => {
    if (isStepValid() && currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid()) return;
    
    try {
      setIsSubmitting(true);
      // Ensure numeric fields are converted properly
      const payload = {
        basicInfo: formData.basicInfo,
        facilities: formData.facilities,
        rooms: formData.rooms.map(r => ({
          type: r.type,
          price: Number(r.price),
          capacity: Number(r.capacity),
          totalRooms: Number(r.totalRooms)
        })),
        documents: formData.documents
      };

      if (id) {
        const { apiPut } = await import('../services/apiClient');
        await apiPut(`/hotels/my/${id}`, payload);
      } else {
        await propertyApi.createProperty(payload);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/owner/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Failed to create property:', error);
      alert('Error creating property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: 'Basic Info', icon: <Building2 className="w-5 h-5" /> },
    { id: 2, title: 'Facilities', icon: <Wifi className="w-5 h-5" /> },
    { id: 3, title: 'Rooms', icon: <MapPin className="w-5 h-5" /> },
    { id: 4, title: 'Documents', icon: <FileText className="w-5 h-5" /> }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] p-12 text-center max-w-md w-full shadow-2xl border border-slate-100"
        >
          <div className="w-24 h-24 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-brand-accent" />
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">{id ? 'Property Updated!' : 'Property Listed!'}</h2>
          <p className="text-slate-500 font-medium">
            {id ? 'Your changes have been saved and sent for approval.' : 'Your property has been submitted and is pending approval.'}
          </p>
          <p className="text-xs text-slate-400 mt-8 uppercase tracking-widest font-bold">Redirecting to Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-24">
      {/* Header */}
      <div className="bg-slate-900 text-white pt-24 pb-32 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.3em]">PROPERTY ONBOARDING</span>
            <span className="h-px w-8 bg-brand-accent/20"></span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter">
            {id ? 'Edit Your' : 'List Your'} <span className="text-brand-accent italic font-serif">Property.</span>
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-900/5 border border-slate-100 overflow-hidden">
          
          {/* Stepper Progress */}
          <div className="flex items-center justify-between px-8 py-6 bg-slate-50 border-b border-slate-100 overflow-x-auto no-scrollbar">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-3 ${currentStep >= step.id ? 'text-brand-accent' : 'text-slate-400 opacity-50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${currentStep >= step.id ? 'border-brand-accent bg-brand-accent/10' : 'border-slate-200'}`}>
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest hidden md:block whitespace-nowrap">{step.title}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-8 md:w-16 h-0.5 mx-4 transition-colors ${currentStep > step.id ? 'bg-brand-accent' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* STEP 1: Basic Info */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Basic Information</h2>
                      <p className="text-slate-500 text-sm">Let's start with the essential details of your property.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-full">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Property Name</label>
                        <input 
                          type="text" name="name" value={formData.basicInfo.name} onChange={handleBasicInfoChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
                          placeholder="e.g., The Grand Oasis"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">City</label>
                        <input 
                          type="text" name="city" value={formData.basicInfo.city} onChange={handleBasicInfoChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-accent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">State</label>
                        <input 
                          type="text" name="state" value={formData.basicInfo.state} onChange={handleBasicInfoChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-accent transition-all"
                        />
                      </div>

                      <div className="col-span-full">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Full Address</label>
                        <input 
                          type="text" name="address" value={formData.basicInfo.address} onChange={handleBasicInfoChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-accent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Contact Email</label>
                        <input 
                          type="email" name="email" value={formData.basicInfo.email} onChange={handleBasicInfoChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-accent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Contact Phone</label>
                        <input 
                          type="text" name="phone" value={formData.basicInfo.phone} onChange={handleBasicInfoChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-accent transition-all"
                        />
                      </div>

                      <div className="col-span-full">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description (Min 10 chars)</label>
                        <textarea 
                          name="description" value={formData.basicInfo.description} onChange={handleBasicInfoChange} rows={4}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-accent transition-all resize-none"
                        />
                      </div>

                      <div className="col-span-full">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cover Image URL</label>
                        <div className="flex gap-4">
                          <input 
                            type="text" name="coverImage" value={formData.basicInfo.coverImage} onChange={handleBasicInfoChange}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-accent transition-all"
                            placeholder="https://images.unsplash.com/..."
                          />
                          {formData.basicInfo.coverImage && (
                             <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                               <img src={formData.basicInfo.coverImage} className="w-full h-full object-cover" alt="Preview" />
                             </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Facilities */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Amenities & Facilities</h2>
                      <p className="text-slate-500 text-sm">Select what your property offers to guests.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {FACILITIES_LIST.map(facility => {
                        const isSelected = formData.facilities.includes(facility);
                        return (
                          <button
                            key={facility}
                            onClick={() => toggleFacility(facility)}
                            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                              isSelected 
                                ? 'bg-brand-accent/5 border-brand-accent text-brand-accent' 
                                : 'bg-white border-slate-200 text-slate-600 hover:border-brand-accent/50'
                            }`}
                          >
                            <span className="text-sm font-bold">{facility}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 3: Rooms */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Room Configurations</h2>
                        <p className="text-slate-500 text-sm">Add the types of rooms available at your property.</p>
                      </div>
                      <button 
                        onClick={addRoom}
                        className="flex items-center gap-2 bg-slate-100 text-slate-900 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                      >
                        <Plus className="w-4 h-4" /> Add Room
                      </button>
                    </div>

                    <div className="space-y-6">
                      {formData.rooms.map((room, index) => (
                        <div key={index} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl relative group">
                          {formData.rooms.length > 1 && (
                            <button 
                              onClick={() => removeRoom(index)}
                              className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-rose-500 shadow-sm hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Room Type</label>
                              <input 
                                type="text" value={room.type} onChange={e => handleRoomChange(index, 'type', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all"
                                placeholder="e.g. Deluxe Suite"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Price per Night (₹)</label>
                              <input 
                                type="number" value={room.price} onChange={e => handleRoomChange(index, 'price', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all"
                                placeholder="4500" min="1"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Max Capacity</label>
                              <input 
                                type="number" value={room.capacity} onChange={e => handleRoomChange(index, 'capacity', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all"
                                placeholder="2" min="1"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Rooms Available</label>
                              <input 
                                type="number" value={room.totalRooms} onChange={e => handleRoomChange(index, 'totalRooms', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all"
                                placeholder="10" min="1"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 4: Documents */}
                {currentStep === 4 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Verification Documents</h2>
                      <p className="text-slate-500 text-sm">Provide necessary documents for verification.</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">ID Proof Document URL</label>
                        <div className="relative">
                           <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                           <input 
                             type="text" name="idProof" value={formData.documents.idProof} onChange={handleDocumentChange}
                             className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-slate-900 focus:outline-none focus:border-brand-accent transition-all"
                             placeholder="https://example.com/id-proof.pdf"
                           />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Business License URL</label>
                        <div className="relative">
                           <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                           <input 
                             type="text" name="license" value={formData.documents.license} onChange={handleDocumentChange}
                             className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-slate-900 focus:outline-none focus:border-brand-accent transition-all"
                             placeholder="https://example.com/license.pdf"
                           />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Property Video Tour URL (Optional)</label>
                        <div className="relative">
                           <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                           <input 
                             type="text" name="videoUrl" value={formData.documents.videoUrl} onChange={handleDocumentChange}
                             className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-slate-900 focus:outline-none focus:border-brand-accent transition-all"
                             placeholder="https://youtube.com/watch?v=..."
                           />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                  currentStep === 1 
                    ? 'text-slate-300 cursor-not-allowed' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                    isStepValid()
                      ? 'bg-slate-900 text-white hover:bg-brand-accent shadow-xl shadow-slate-900/10'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                  <button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                    isStepValid() && !isSubmitting
                      ? 'bg-brand-accent text-white hover:bg-emerald-600 shadow-xl shadow-brand-accent/20'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (id ? 'Updating...' : 'Submitting...') : (id ? 'Save Changes' : 'Submit Listing')} <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
