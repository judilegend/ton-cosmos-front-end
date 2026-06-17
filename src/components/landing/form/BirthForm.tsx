import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import L, { type LatLngExpression } from 'leaflet';
import { AlertCircle, Calendar, ChevronRight, Clock, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';

interface NominatimSuggestion {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;
export interface PayloadBirthForm {
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    birthTime: string;
    birthCity: string;
    latitude: number;
    longitude: number;
    birthTimeUnknown: boolean;
}

interface FormProps {
    initialData: PayloadBirthForm;
    onNextStep: (data: PayloadBirthForm) => void;
}

function ChangeView({ center }: { center: LatLngExpression }) {
    const map = useMap();
    map.setView(center, 10);
    return null;
}

function MapClickHandler({
    onLocationSelect,
}: {
    onLocationSelect: (lat: number, lng: number, name: string) => void;
}) {
    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            );
            const data = await res.json();
            onLocationSelect(lat, lng, data.display_name || '');
        },
    });
    return null;
}

export default function BirthForm({ initialData, onNextStep }: FormProps) {
    const [firstName, setFirstName] = useState({
        value: initialData.firstName,
        error: false,
        error_message: '',
    });
    const [lastName, setLastName] = useState({
        value: initialData.lastName,
        error: false,
        error_message: '',
    });
    const [email, setEmail] = useState({
        value: initialData.email,
        error: false,
        error_message: '',
    });
    const [birthDate, setBirthDate] = useState({
        value: initialData.birthDate,
        error: false,
        error_message: '',
    });
    const [birthTime, setBirthTime] = useState({
        value: initialData.birthTime,
        error: false,
        error_message: '',
    });
    const [birthCity, setBirthCity] = useState({
        value: initialData.birthCity,
        error: false,
        error_message: '',
    });
    const [coords, setCoords] = useState({ lat: initialData.latitude, lng: initialData.longitude });
    const [suggestions, setSuggestions] = useState<NominatimSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [birthTimeUnknown, setBirthTimeUnknown] = useState(initialData.birthTimeUnknown);

    const searchCity = async (query: string) => {
        setBirthCity({ ...birthCity, value: query });
        if (query.length < 3) return;

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'Ton Cosmos (agapedev.dark@gmail.com)',
                },
            },
        );

        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
    };

    const handleLocationSelect = (lat: number, lng: number, name: string) => {
        setCoords({ lat, lng });
        if (name) setBirthCity({ ...birthCity, value: name });
    };

    const resetError = () => {
        setFirstName({ ...firstName, error: false, error_message: '' });
        setLastName({ ...lastName, error: false, error_message: '' });
        setEmail({ ...email, error: false, error_message: '' });
        setBirthDate({ ...birthDate, error: false, error_message: '' });
        setBirthTime({ ...birthTime, error: false, error_message: '' });
    };

    const checkError = () => {
        resetError();
        let hasError = false;
        if (!firstName.value) {
            hasError = true;
            setFirstName({ ...firstName, error: true, error_message: 'Entrer votre nom' });
        }
        if (!lastName.value) {
            hasError = true;
            setLastName({ ...lastName, error: true, error_message: 'Entrer votre prénom' });
        }
        if (!email.value) {
            hasError = true;
            setEmail({ ...email, error: true, error_message: 'Entrer votre adresse E-mail' });
        }
        if (!birthDate.value) {
            hasError = true;
            setBirthDate({
                ...birthDate,
                error: true,
                error_message: 'Entrer votre date de naissance',
            });
        }
        if (!birthTimeUnknown && !birthTime.value) {
            hasError = true;
            setBirthTime({
                ...birthTime,
                error: true,
                error_message: 'Entrer votre heure de naissance',
            });
        }
        if (!birthCity.value) {
            hasError = true;
            setBirthCity({
                ...birthCity,
                error: true,
                error_message: 'Entrer lieu ou vous-etes nee',
            });
        }

        return hasError;
    };

    const onSubmit = () => {
        const hasError = checkError();
        if (hasError) return;

        const payload = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            birthDate: birthDate.value,
            birthTime: birthTime.value,
            birthCity: birthCity.value,
            latitude: coords.lat,
            longitude: coords.lng,
            birthTimeUnknown: birthTimeUnknown,
        };
        onNextStep(payload);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 sm:p-10">
                <h3 className="font-display text-2xl font-light text-[#fafafa] mb-8">
                    Données de naissance
                </h3>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-[#a1a1aa] mb-2.5">Nom</label>
                            <input
                                type="text"
                                value={firstName.value}
                                onChange={(e) =>
                                    setFirstName({
                                        ...firstName,
                                        value: e.target.value,
                                        error: false,
                                    })
                                }
                                placeholder="Ton prénom"
                                className="w-full px-4 py-3.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.3)] rounded-xl text-[#fafafa] placeholder-[#52525b] text-sm focus:outline-none focus:border-[rgba(212,185,106,0.25)] focus:bg-[rgba(255,255,255,0.05)] transition-all"
                            />
                            {firstName.error && !firstName.value && (
                                <p className="text-red-400/80 text-xs mt-2 flex items-center gap-1.5">
                                    <AlertCircle className="w-3 h-3" />
                                    {firstName.error_message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm text-[#a1a1aa] mb-2.5">Prénom</label>
                            <input
                                type="text"
                                value={lastName.value}
                                onChange={(e) =>
                                    setLastName({
                                        ...lastName,
                                        value: e.target.value,
                                        error: false,
                                    })
                                }
                                placeholder="Ton prénom"
                                className="w-full px-4 py-3.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.3)] rounded-xl text-[#fafafa] placeholder-[#52525b] text-sm focus:outline-none focus:border-[rgba(212,185,106,0.25)] focus:bg-[rgba(255,255,255,0.05)] transition-all"
                            />
                            {lastName.error && !lastName.value && (
                                <p className="text-red-400/80 text-xs mt-2 flex items-center gap-1.5">
                                    <AlertCircle className="w-3 h-3" />
                                    {lastName.error_message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-[#a1a1aa] mb-2.5">
                            Adresse E-mail
                        </label>
                        <input
                            type="email"
                            value={email.value}
                            onChange={(e) =>
                                setEmail({ ...email, value: e.target.value, error: false })
                            }
                            placeholder="ton@email.com"
                            className="w-full px-4 py-3.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.3)] rounded-xl text-[#fafafa] placeholder-[#52525b] text-sm focus:outline-none focus:border-[rgba(212,185,106,0.25)] focus:bg-[rgba(255,255,255,0.05)] transition-all"
                        />
                        {email.error && !email.value && (
                            <p className="text-red-400/80 text-xs mt-2 flex items-center gap-1.5">
                                <AlertCircle className="w-3 h-3" />
                                {email.error_message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-[#a1a1aa] mb-2.5">
                                <Calendar className="w-4 h-4 inline mr-2 -mt-0.5 opacity-50" />
                                Quelle est votre date de naissance ?
                            </label>
                            <input
                                type="date"
                                title="date"
                                value={birthDate.value}
                                onChange={(e) =>
                                    setBirthDate({
                                        ...birthDate,
                                        value: e.target.value,
                                        error: false,
                                    })
                                }
                                className="w-full px-4 py-3.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.3)] rounded-xl text-[#fafafa] placeholder-[#52525b] text-sm focus:outline-none focus:border-[rgba(212,185,106,0.25)] focus:bg-[rgba(255,255,255,0.05)] transition-all"
                            />
                            {birthDate.error && !birthDate.value && (
                                <p className="text-red-400/80 text-xs mt-2 flex items-center gap-1.5">
                                    <AlertCircle className="w-3 h-3" />
                                    {birthDate.error_message}
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between gap-x-4">
                                <label className="block text-sm text-[#a1a1aa] mb-2.5">
                                    <Clock className="w-4 h-4 inline mr-2 -mt-0.5 opacity-50" />
                                    Heure de naissance
                                </label>
                                <div className="flex items-center space-x-2 mb-2.5">
                                    <Checkbox
                                        id="remember-me"
                                        checked={birthTimeUnknown}
                                        onCheckedChange={(checked: boolean) => {
                                            setBirthTimeUnknown(checked);
                                            setBirthTime({
                                                value: '',
                                                error: false,
                                                error_message: '',
                                            });
                                        }}
                                        className="border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-[#d4b96a] data-[state=checked]:border-[#d4b96a]"
                                    />
                                    <Label
                                        htmlFor="remember-me"
                                        className="text-sm text-zinc-600 dark:text-[#a1a1aa] cursor-pointer"
                                    >
                                        Je ne sais pas
                                    </Label>
                                </div>
                            </div>
                            <input
                                type="time"
                                title="time"
                                value={birthTime.value}
                                onChange={(e) =>
                                    setBirthTime({ ...birthTime, value: e.target.value })
                                }
                                disabled={birthTimeUnknown}
                                className={`w-full px-4 py-3.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.3)] rounded-xl text-[#fafafa] text-sm focus:outline-none focus:border-[rgba(212,185,106,0.25)] focus:bg-[rgba(255,255,255,0.05)] transition-all ${
                                    birthTimeUnknown ? 'opacity-40' : ''
                                }`}
                            />
                            {birthTime.error && !birthTime.value && (
                                <p className="text-red-400/80 text-xs mt-2 flex items-center gap-1.5">
                                    <AlertCircle className="w-3 h-3" />
                                    {birthTime.error_message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-sm text-[#a1a1aa] mb-2.5">
                            Ville où vous êtes né(e)
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={birthCity.value}
                                onChange={(e) => {
                                    searchCity(e.target.value);
                                }}
                                placeholder="Paris, Casablanca..."
                                className="w-full px-4 py-3.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.3)] rounded-xl text-white text-sm focus:outline-none focus:border-[#d4b96a]"
                            />
                            <Search className="absolute right-4 top-3.5 w-4 h-4 text-[#52525b]" />
                        </div>
                        {birthTime.error && !birthCity.value && (
                            <p className="text-red-400/80 text-xs mt-2 flex items-center gap-1.5">
                                <AlertCircle className="w-3 h-3" />
                                {birthTime.error_message}
                            </p>
                        )}

                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="absolute z-1000 w-full mt-2 bg-[#18181b] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
                                {suggestions.map((item: NominatimSuggestion) => (
                                    <li
                                        key={item.place_id}
                                        onClick={() => {
                                            setCoords({
                                                lat: parseFloat(item.lat),
                                                lng: parseFloat(item.lon),
                                            });
                                            setBirthCity({
                                                ...birthCity,
                                                value: item.display_name,
                                            });
                                            setShowSuggestions(false);
                                        }}
                                        className="px-4 py-3 text-sm hover:bg-[#d4b96a] hover:text-black cursor-pointer transition-colors"
                                    >
                                        {item.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Carte OpenStreetMap */}
                        <div className="mt-4 h-62.5 w-full rounded-xl overflow-hidden border border-zinc-800">
                            <MapContainer
                                center={[coords.lat, coords.lng]}
                                zoom={10}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                                <ChangeView center={[coords.lat, coords.lng]} />

                                {/* AJOUTEZ LA PROP ICI */}
                                <MapClickHandler onLocationSelect={handleLocationSelect} />

                                <Marker position={[coords.lat, coords.lng]} />
                            </MapContainer>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-[#52525b] mt-8 leading-relaxed">
                    En continuant, tu acceptes nos conditions générales et notre politique de
                    confidentialité. Tes données sont utilisées uniquement pour la génération de ton
                    rapport et ne sont jamais revendues.
                </p>
            </div>

            <div className="mt-10 flex items-center justify-center">
                <button
                    onClick={onSubmit}
                    className="group inline-flex items-center gap-3 px-10 py-4 bg-[#d4b96a] text-[#09090b] font-medium text-sm tracking-wide rounded-full hover:bg-[#dec87e] transition-all duration-300 cursor-pointer"
                >
                    Continuer vers le choix de formule
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
            </div>
        </div>
    );
}
