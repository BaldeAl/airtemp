import { useState } from 'react';
import { useRouter } from 'next/router';
import { HiPhotograph, HiPlus, HiX } from 'react-icons/hi';

const CATEGORIES = ['City', 'Beach', 'Mountain', 'Countryside', 'Lake', 'Tropical', 'Desert', 'Arctic', 'Island'];
const AMENITIES_LIST = ['WiFi', 'Pool', 'Parking', 'Kitchen', 'Air Conditioning', 'Heating', 'TV', 'Washer', 'Dryer', 'Gym', 'Hot Tub', 'BBQ', 'Balcony', 'Garden', 'Elevator', 'Pet Friendly'];

export default function PlaceForm({ initialData = {}, isEdit = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [category, setCategory] = useState(initialData.category || 'City');
  const [priceByNight, setPriceByNight] = useState(initialData.priceByNight || '');
  const [maxGuests, setMaxGuests] = useState(initialData.maxGuests || '');
  const [numberOfRooms, setNumberOfRooms] = useState(initialData.numberOfRooms || '');
  const [numberOfBathrooms, setNumberOfBathrooms] = useState(initialData.numberOfBathrooms || '');
  const [totalUnits, setTotalUnits] = useState(initialData.totalUnits || 1);
  const [cityName, setCityName] = useState(initialData.city?.name || initialData.cityName || '');

  // Images: 1 main + up to 4 additional = 5 max
  const [mainImage, setMainImage] = useState(initialData.image || '');
  const [additionalImages, setAdditionalImages] = useState(
    initialData.images?.length ? [...initialData.images] : []
  );

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState(
    initialData.amenities?.length ? [...initialData.amenities] : []
  );

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const addImageField = () => {
    if (additionalImages.length < 4) {
      setAdditionalImages([...additionalImages, '']);
    }
  };

  const removeImageField = (index) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  const updateImageField = (index, value) => {
    const updated = [...additionalImages];
    updated[index] = value;
    setAdditionalImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in.');
      setLoading(false);
      return;
    }

    const payload = {
      name,
      description,
      image: mainImage,
      images: additionalImages.filter((img) => img.trim() !== ''),
      amenities: selectedAmenities,
      category,
      numberOfRooms: Number(numberOfRooms) || 0,
      numberOfBathrooms: Number(numberOfBathrooms) || 0,
      maxGuests: Number(maxGuests) || 1,
      priceByNight: Number(priceByNight) || 0,
      totalUnits: Number(totalUnits) || 1,
      cityName,
    };

    try {
      const url = isEdit
        ? `/api/host/places/${initialData.place_id}`
        : '/api/host/places';

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/host/places');
      } else {
        const data = await res.json();
        setError(data.message || 'An error occurred.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-2xl border-2 border-[#E8E8E4] dark:border-[#3D3D5C] bg-white dark:bg-[#232340] text-[#2D3436] dark:text-white text-sm font-semibold focus:border-[#4ECDC4] focus:ring-0 outline-none transition-all placeholder:text-[#B2BEC3]';
  const labelClass = 'block text-sm font-extrabold text-[#2D3436] dark:text-white mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className={labelClass}>Place Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Cozy Downtown Apartment"
          className={inputClass}
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          placeholder="A beautiful place with stunning views..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Category + City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>City *</label>
          <input
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            required
            placeholder="Paris"
            className={inputClass}
          />
        </div>
      </div>

      {/* Numbers Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div>
          <label className={labelClass}>Price / Night (€) *</label>
          <input
            type="number"
            value={priceByNight}
            onChange={(e) => setPriceByNight(e.target.value)}
            required
            min="1"
            placeholder="120"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Max Guests *</label>
          <input
            type="number"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            required
            min="1"
            placeholder="4"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Rooms</label>
          <input
            type="number"
            value={numberOfRooms}
            onChange={(e) => setNumberOfRooms(e.target.value)}
            min="0"
            placeholder="2"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Bathrooms</label>
          <input
            type="number"
            value={numberOfBathrooms}
            onChange={(e) => setNumberOfBathrooms(e.target.value)}
            min="0"
            placeholder="1"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Locaux dispo *</label>
          <input
            type="number"
            value={totalUnits}
            onChange={(e) => setTotalUnits(e.target.value)}
            required
            min="1"
            placeholder="1"
            className={inputClass}
          />
          <p className="text-xs text-[#B2BEC3] mt-1">Nombre de logements identiques</p>
        </div>
      </div>

      {/* Main Image */}
      <div>
        <label className={labelClass}>
          <HiPhotograph className="inline mr-1.5 text-[#6C5CE7]" />
          Main Image URL *
        </label>
        <input
          type="url"
          value={mainImage}
          onChange={(e) => setMainImage(e.target.value)}
          required
          placeholder="https://example.com/image.jpg"
          className={inputClass}
        />
        {mainImage && (
          <div className="mt-2 rounded-2xl overflow-hidden border-2 border-[#E8E8E4] dark:border-[#3D3D5C] h-40">
            <img src={mainImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.target.style.display = 'none')} />
          </div>
        )}
      </div>

      {/* Additional Images */}
      <div>
        <label className={labelClass}>
          <HiPhotograph className="inline mr-1.5 text-[#0984E3]" />
          Additional Images ({additionalImages.length}/4)
        </label>
        <div className="space-y-3">
          {additionalImages.map((img, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="url"
                value={img}
                onChange={(e) => updateImageField(index, e.target.value)}
                placeholder={`Image URL ${index + 2}`}
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => removeImageField(index)}
                className="p-2.5 rounded-full bg-[#FF6B6B]/10 text-[#FF6B6B] hover:bg-[#FF6B6B]/20 transition-all flex-shrink-0"
              >
                <HiX className="text-lg" />
              </button>
            </div>
          ))}
          {additionalImages.length < 4 && (
            <button
              type="button"
              onClick={addImageField}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-dashed border-[#B2BEC3] dark:border-[#3D3D5C] text-sm font-bold text-[#636E72] dark:text-[#B2BEC3] hover:border-[#4ECDC4] hover:text-[#4ECDC4] transition-all"
            >
              <HiPlus className="text-lg" />
              Add Image
            </button>
          )}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className={labelClass}>Amenities</label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES_LIST.map((amenity) => (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border-2 ${
                selectedAmenities.includes(amenity)
                  ? 'bg-[#4ECDC4] border-[#4ECDC4] text-white'
                  : 'border-[#E8E8E4] dark:border-[#3D3D5C] text-[#636E72] dark:text-[#B2BEC3] hover:border-[#4ECDC4]'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-2xl bg-[#FF6B6B]/10 text-[#FF6B6B] text-sm font-bold">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-full font-bold text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] hover:opacity-90 transition-all shadow-lg disabled:opacity-60 text-sm"
      >
        {loading
          ? isEdit
            ? 'Saving changes...'
            : 'Creating place...'
          : isEdit
          ? 'Save Changes'
          : 'Create Place'}
      </button>
    </form>
  );
}
