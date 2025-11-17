import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AthleteFormProps {
  formData: any;
  setFormData: (data: any) => void;
  states?: any[];
  sports?: any[];
  isEditing?: boolean;
}

const AthleteForm = ({ formData, setFormData, states = [], sports = [], isEditing = false }: AthleteFormProps) => {
  // Fallback list of Indian states
  const indianStates = [
    { id: 'andhra-pradesh', name: 'Andhra Pradesh' },
    { id: 'arunachal-pradesh', name: 'Arunachal Pradesh' },
    { id: 'assam', name: 'Assam' },
    { id: 'bihar', name: 'Bihar' },
    { id: 'chhattisgarh', name: 'Chhattisgarh' },
    { id: 'goa', name: 'Goa' },
    { id: 'gujarat', name: 'Gujarat' },
    { id: 'haryana', name: 'Haryana' },
    { id: 'himachal-pradesh', name: 'Himachal Pradesh' },
    { id: 'jharkhand', name: 'Jharkhand' },
    { id: 'karnataka', name: 'Karnataka' },
    { id: 'kerala', name: 'Kerala' },
    { id: 'madhya-pradesh', name: 'Madhya Pradesh' },
    { id: 'maharashtra', name: 'Maharashtra' },
    { id: 'manipur', name: 'Manipur' },
    { id: 'meghalaya', name: 'Meghalaya' },
    { id: 'mizoram', name: 'Mizoram' },
    { id: 'nagaland', name: 'Nagaland' },
    { id: 'odisha', name: 'Odisha' },
    { id: 'punjab', name: 'Punjab' },
    { id: 'rajasthan', name: 'Rajasthan' },
    { id: 'sikkim', name: 'Sikkim' },
    { id: 'tamil-nadu', name: 'Tamil Nadu' },
    { id: 'telangana', name: 'Telangana' },
    { id: 'tripura', name: 'Tripura' },
    { id: 'uttar-pradesh', name: 'Uttar Pradesh' },
    { id: 'uttarakhand', name: 'Uttarakhand' },
    { id: 'west-bengal', name: 'West Bengal' },
    { id: 'delhi', name: 'Delhi' },
    { id: 'chandigarh', name: 'Chandigarh' },
    { id: 'puducherry', name: 'Puducherry' },
    { id: 'jammu-kashmir', name: 'Jammu and Kashmir' },
    { id: 'ladakh', name: 'Ladakh' }
  ];

  // Use Firestore states if available, otherwise use fallback list
  const availableStates = states && states.length > 0 ? states : indianStates;

  const sportsList = [
    'Athletics', 'Football', 'Cricket', 'Badminton', 'Hockey', 'Basketball',
    'Swimming', 'Tennis', 'Volleyball', 'Wrestling', 'Boxing', 'Kabaddi',
    'Table Tennis', 'Cycling', 'Archery', 'Shooting', 'Weightlifting', 'Judo'
  ];

  const handleSportToggle = (sport: string) => {
    const currentSports = formData.sportInterest || [];
    if (currentSports.includes(sport)) {
      setFormData({
        ...formData,
        sportInterest: currentSports.filter((s: string) => s !== sport)
      });
    } else {
      setFormData({
        ...formData,
        sportInterest: [...currentSports, sport]
      });
    }
  };

  const removeSport = (sport: string) => {
    setFormData({
      ...formData,
      sportInterest: (formData.sportInterest || []).filter((s: string) => s !== sport)
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter athlete's full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              min="14"
              max="25"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 14 })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="+91-XXXXXXXXXX"
              required
            />
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Location Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {availableStates.map((state) => (
                  <SelectItem key={state.id} value={state.name}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="district">District *</Label>
            <Input
              id="district"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              placeholder="Enter district"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Complete Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Enter complete address"
            rows={3}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="athlete@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coachName">Coach Name</Label>
            <Input
              id="coachName"
              value={formData.coachName}
              onChange={(e) => setFormData({ ...formData, coachName: e.target.value })}
              placeholder="Enter coach's name"
            />
          </div>
        </div>
      </div>

      {/* Sports Interest */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sports Interest</h3>
        
        {/* Selected Sports */}
        {formData.sportInterest && formData.sportInterest.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Sports:</Label>
            <div className="flex flex-wrap gap-2">
              {formData.sportInterest.map((sport: string) => (
                <Badge key={sport} variant="default" className="flex items-center gap-1">
                  {sport}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => removeSport(sport)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Available Sports */}
        <div className="space-y-2">
          <Label>Available Sports:</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border rounded">
            {sportsList.map((sport) => (
              <div key={sport} className="flex items-center space-x-2">
                <Checkbox
                  id={`sport-${sport}`}
                  checked={formData.sportInterest?.includes(sport) || false}
                  onCheckedChange={() => handleSportToggle(sport)}
                />
                <Label 
                  htmlFor={`sport-${sport}`} 
                  className="text-sm cursor-pointer"
                >
                  {sport}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Medical Clearance */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Medical Information</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="medicalClearance"
            checked={formData.medicalClearance}
            onCheckedChange={(checked) => setFormData({ ...formData, medicalClearance: checked })}
          />
          <Label htmlFor="medicalClearance" className="cursor-pointer">
            Medical clearance completed
          </Label>
        </div>
      </div>
    </div>
  );
};

export default AthleteForm;
