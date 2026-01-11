"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Truck, 
  Users, 
  Bell, 
  Search, 
  Plus, 
  AlertTriangle,
  Clock,
  CheckCircle2,
  MoreVertical,
  Calendar,
  Filter,
  X,
  MapPin,
  Store,
  PieChart,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Plane,
  Anchor,
  Copy,
  FileText,
  LogOut,
  Lock,
  Mail,
  Shield,
  User,
  Phone,
  Camera,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Save,
  Check,
  MessageCircle,
  Send,
  Tag,
  DollarSign,
  BarChart3,
  Menu,
  Database
} from 'lucide-react';

// --- YARDIMCI FONKSİYONLAR (HELPERS) ---

function getRelativeDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('tr-TR', { 
    style: 'currency', 
    currency: 'TRY',
    minimumFractionDigits: 2
  }).format(amount);
}

function calculateDaysLeft(deadline: string) {
  const today = new Date(); 
  const target = new Date(deadline);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays;
}

// --- TİP TANIMLAMALARI (TYPES) ---

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  stock: number;
  safetyStock: number;
  price: number;
  cost: number;
  supplier: string;
  category: string;
  image: string;
}

interface OrderItem {
  name: string;
  qty: number;
}

interface Order {
  id: number;
  customer: string;
  city: string;
  address?: string;
  platform: string;
  items: OrderItem[];
  date: string;
  deadline: string;
  status: string;
  total: number;
  assignedTo: string | null;
}

interface UserData {
  id?: number;
  name: string;
  role: string;
  email: string;
  phone?: string;
  avatar?: any;
  avatarPreview?: any;
  initials?: string;
}

interface Supply {
  id: number;
  supplier: string;
  items: string;
  orderDate: string;
  status: string;
  tracking: string;
  estimatedArrival: string;
}

// --- ÖRNEK VERİLER (MOCK DATA) ---

const INITIAL_INVENTORY: InventoryItem[] = [
  { 
    id: 1, 
    name: "Ahşap Yapboz Seti", 
    sku: "OY-001", 
    stock: 150, 
    safetyStock: 20, 
    price: 250, 
    cost: 120, 
    supplier: "Oyuncak Toptancısı A.Ş.",
    category: "Eğitici",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=100&h=100"
  },
  { 
    id: 2, 
    name: "Uzaktan Kumandalı Araba", 
    sku: "OY-002", 
    stock: 8, 
    safetyStock: 15, 
    price: 1250.50, 
    cost: 750,
    supplier: "Temu", 
    category: "Elektronik",
    image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=100&h=100"
  },
  { 
    id: 3, 
    name: "Peluş Ayıcık (Büyük)", 
    sku: "OY-003", 
    stock: 45, 
    safetyStock: 10, 
    price: 450, 
    cost: 200,
    supplier: "Oyuncak Toptancısı A.Ş.",
    category: "Peluş",
    image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&q=80&w=100&h=100"
  },
  { 
    id: 4, 
    name: "Drone Pervane Seti", 
    sku: "YD-001", 
    stock: 4, 
    safetyStock: 50, 
    price: 80, 
    cost: 25,
    supplier: "AliExpress",
    category: "Yedek Parça",
    image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&q=80&w=100&h=100"
  },
  { 
    id: 5, 
    name: "Oyun Hamuru Seti (12 Renk)", 
    sku: "OY-004", 
    stock: 200, 
    safetyStock: 30, 
    price: 120, 
    cost: 60, 
    supplier: "Oyuncak Toptancısı A.Ş.",
    category: "Eğitici",
    image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=100&h=100"
  },
  { 
    id: 6, 
    name: "LED Işık Şeridi (5m)", 
    sku: "EL-005", 
    stock: 85, 
    safetyStock: 10, 
    price: 150, 
    cost: 70, 
    supplier: "AliExpress",
    category: "Elektronik",
    image: "https://images.unsplash.com/photo-1563456020-0551061917f8?auto=format&fit=crop&q=80&w=100&h=100"
  },
  { 
    id: 7, 
    name: "Renkli Balon Paketi (100'lü)", 
    sku: "BL-001", 
    stock: 500, 
    safetyStock: 100, 
    price: 85, 
    cost: 30, 
    supplier: "Parti Dünyası",
    category: "Parti",
    image: "https://images.unsplash.com/photo-1530103862676-de3c9da59af7?auto=format&fit=crop&q=80&w=100&h=100"
  },
  { 
    id: 8, 
    name: "Helyum Tüpü (Kullan-At)", 
    sku: "BL-002", 
    stock: 12, 
    safetyStock: 5, 
    price: 850, 
    cost: 450, 
    supplier: "Parti Dünyası",
    category: "Parti",
    image: "https://images.unsplash.com/photo-1582236873967-0c7f2122396e?auto=format&fit=crop&q=80&w=100&h=100"
  }
];

const INITIAL_ORDERS: Order[] = [
  { 
    id: 101, 
    customer: "Ahmet Yılmaz", 
    city: "İstanbul", 
    address: "Atatürk Mah. Cumhuriyet Cad. No:12 D:5, Kadıköy",
    platform: "Trendyol", 
    items: [{ name: "Uzaktan Kumandalı Araba", qty: 2 }],
    date: getRelativeDate(0), 
    deadline: getRelativeDate(-2), 
    status: "Hazırlanıyor", 
    total: 2501.00, 
    assignedTo: "Mehmet Demir" 
  },
  { 
    id: 102, 
    customer: "Ayşe Demir", 
    city: "Ankara", 
    address: "Çankaya Mah. Hoşdere Cad. No:44, Çankaya",
    platform: "Instagram", 
    items: [{ name: "Peluş Ayıcık (Büyük)", qty: 1 }],
    date: getRelativeDate(0), 
    deadline: getRelativeDate(1), 
    status: "Yeni", 
    total: 450.00, 
    assignedTo: null 
  },
  { 
    id: 103, 
    customer: "Kırtasiye Dünyası", 
    city: "İzmir", 
    address: "Alsancak Mah. Kıbrıs Şehitleri Cad. No:10, Konak",
    platform: "B2B Panel", 
    items: [{ name: "Ahşap Yapboz Seti", qty: 50 }, { name: "Drone Pervane Seti", qty: 10 }],
    date: getRelativeDate(5), 
    deadline: getRelativeDate(2), 
    status: "Kargolandı", 
    total: 13300.00, 
    assignedTo: "Selin Yılmaz" 
  },
  { 
    id: 104, 
    customer: "Mehmet Öz", 
    city: "Bursa", 
    address: "Nilüfer Mah. Fatih Sultan Mehmet Bulv. No:88, Nilüfer",
    platform: "Hepsiburada", 
    items: [{ name: "Drone Pervane Seti", qty: 1 }],
    date: getRelativeDate(30), 
    deadline: getRelativeDate(25), 
    status: "Tamamlandı", 
    total: 80.00, 
    assignedTo: null 
  },
  { 
    id: 105, 
    customer: "Zeynep Kaya", 
    city: "Antalya", 
    address: "Lara Yolu Üzeri, No:15, Muratpaşa",
    platform: "Trendyol", 
    items: [{ name: "Oyun Hamuru Seti (12 Renk)", qty: 2 }],
    date: getRelativeDate(1), 
    deadline: getRelativeDate(3), 
    status: "Yeni", 
    total: 240.00, 
    assignedTo: null 
  },
  { 
    id: 106, 
    customer: "Parti Organizasyon Ltd.", 
    city: "İstanbul", 
    address: "Etiler Mah. Nispetiye Cad. No:100, Beşiktaş",
    platform: "B2B Panel", 
    items: [{ name: "Renkli Balon Paketi (100'lü)", qty: 20 }, { name: "Helyum Tüpü (Kullan-At)", qty: 5 }],
    date: getRelativeDate(0), 
    deadline: getRelativeDate(2), 
    status: "Hazırlanıyor", 
    total: 5950.00, 
    assignedTo: "Mehmet Demir" 
  }
];

const INITIAL_SUPPLIES: Supply[] = [
  { id: 1, supplier: "Temu", items: "Elektronik Parçalar", orderDate: getRelativeDate(2), status: "Gümrükte", tracking: "TR-882912", estimatedArrival: "3 Gün" },
  { id: 2, supplier: "Oyuncak Toptancısı A.Ş.", items: "100x Peluş", orderDate: getRelativeDate(10), status: "Hazırlanıyor", tracking: "Yurtiçi-1123", estimatedArrival: "1 Gün" },
  { id: 3, supplier: "AliExpress", items: "LED Işıklar", orderDate: getRelativeDate(45), status: "Teslim Edildi", tracking: "PTT-999", estimatedArrival: "-" },
];

const INITIAL_USERS: UserData[] = [
  { id: 1, name: "Osman BAŞAR", role: "Yönetici", email: "osibasar@gmail.com", phone: "0555 701 00 24", avatar: null, initials: "OB", avatarPreview: '/osmanbasarfoto.png' },
  { id: 2, name: "Mehmet Demir", role: "Depo Sorumlusu", email: "mehmet@perabalon.com", phone: "0532 111 22 33", avatar: null, initials: "MD" },
  { id: 3, name: "Selin Yılmaz", role: "Satış Uzmanı", email: "selin@perabalon.com", phone: "0544 222 33 44", avatar: null, initials: "SY" },
];

// --- STİL HELPERLARI ---

function getStatusColor(status: string) {
  switch (status) {
    case 'Yeni': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Hazırlanıyor': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Kargolandı': case 'Yolda': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Teslim Edildi': case 'Tamamlandı': return 'bg-green-100 text-green-700 border-green-200';
    case 'Gümrükte': return 'bg-orange-100 text-orange-700 border-orange-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

function getProductImage(productName: string, inventory: InventoryItem[]) {
  const product = inventory.find(p => p.name === productName);
  return product ? product.image : "https://via.placeholder.com/100?text=No+Img";
}

// --- BİLEŞENLER ---

function Card({ title, value, icon: Icon, alert = false, subtext, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className={`text-2xl font-bold ${alert ? 'text-red-600' : 'text-gray-800'}`}>{value}</h3>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className={`p-3 rounded-lg ${alert ? 'bg-red-50 text-red-600' : 'bg-[#BE6A6C]/10 text-[#BE6A6C]'}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-xs font-bold flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} 
            %12
          </span>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ options, activeFilter, onFilterChange }: any) {
  return (
    <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm overflow-x-auto no-scrollbar">
      {options.map((option: string) => (
        <button
          key={option}
          onClick={() => onFilterChange(option)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${
            activeFilter === option 
            ? 'bg-[#BE6A6C] text-white shadow-sm' 
            : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function Toast({ message, type, onClose }: any) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-20 md:bottom-6 right-6 left-6 md:left-auto p-4 rounded-lg shadow-lg border flex items-start gap-3 z-[100] animate-in slide-in-from-bottom-5 duration-300 bg-white border-green-200`}>
      <div className={`p-1 rounded-full bg-green-100 text-green-600 shrink-0`}>
        <Check size={16} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-gray-800">İşlem Başarılı</h4>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-2">
        <X size={16} />
      </button>
    </div>
  );
}

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, itemName }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Ürünü Sil</h3>
          <p className="text-gray-500 text-sm mb-6">
            <span className="font-semibold text-gray-800">{itemName}</span> adlı ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Vazgeç
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium shadow-sm transition-colors"
            >
              Evet, Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderFormModal({ onClose, onSave, inventory, users, order }: any) {
  const [formData, setFormData] = useState<Order>({
    id: order ? order.id : Date.now(),
    customer: order ? order.customer : '',
    city: order ? order.city : '',
    address: order ? order.address : '',
    platform: order ? order.platform : 'Trendyol',
    deadline: order ? order.deadline : getRelativeDate(3),
    status: order ? order.status : 'Yeni',
    assignedTo: order ? order.assignedTo : '',
    items: order ? order.items : [],
    total: order ? order.total : 0,
    date: order ? order.date : new Date().toISOString().split('T')[0]
  });

  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Toplam tutarı hesapla
  useEffect(() => {
    const total = formData.items.reduce((acc, item) => {
      const prod = inventory.find((p: InventoryItem) => p.name === item.name);
      return acc + (prod ? prod.price * item.qty : 0);
    }, 0);
    setFormData(prev => ({ ...prev, total }));
  }, [formData.items, inventory]);

  const handleAddItem = () => {
    if (!selectedProduct) return;
    const existingItem = formData.items.find(i => i.name === selectedProduct);
    
    if (existingItem) {
      setFormData({
        ...formData,
        items: formData.items.map(i => i.name === selectedProduct ? { ...i, qty: i.qty + Number(quantity) } : i)
      });
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, { name: selectedProduct, qty: Number(quantity) }]
      });
    }
    setSelectedProduct('');
    setQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      alert("Lütfen en az bir ürün ekleyin.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white w-full md:rounded-2xl md:w-full md:max-w-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] md:h-auto md:max-h-[90vh] rounded-t-2xl">
        <div className="bg-gray-50 p-4 md:p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h3 className="text-lg md:text-xl font-bold text-gray-800">{order ? 'Siparişi Düzenle' : 'Yeni Sipariş Oluştur'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
          
          {/* Sol Kolon: Müşteri & Detaylar */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 border-b pb-2 mb-4">Müşteri Bilgileri</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri Adı</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                value={formData.customer}
                onChange={e => setFormData({...formData, customer: e.target.value})}
                placeholder="Ad Soyad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                placeholder="Örn: İstanbul"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Açık Adres</label>
              <textarea 
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] resize-none h-24 text-sm"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                placeholder="Mahalle, Sokak, No, Daire..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] bg-white"
                  value={formData.platform}
                  onChange={e => setFormData({...formData, platform: e.target.value})}
                >
                  <option value="Trendyol">Trendyol</option>
                  <option value="Hepsiburada">Hepsiburada</option>
                  <option value="Instagram">Instagram</option>
                  <option value="B2B Panel">B2B Panel</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Termin Tarihi</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                  value={formData.deadline}
                  onChange={e => setFormData({...formData, deadline: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sorumlu Personel</label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] bg-white"
                value={formData.assignedTo || ''}
                onChange={e => setFormData({...formData, assignedTo: e.target.value})}
              >
                <option value="">Atanmadı</option>
                {users.filter((u: UserData) => u.role !== 'Yönetici').map((u: UserData) => (
                  <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sağ Kolon: Ürünler */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 border-b pb-2 mb-4">Sipariş İçeriği</h4>
            
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Seç</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] bg-white text-sm"
                  value={selectedProduct}
                  onChange={e => setSelectedProduct(e.target.value)}
                >
                  <option value="">Ürün Seçiniz...</option>
                  {inventory.map((p: InventoryItem) => (
                    <option key={p.id} value={p.name}>{p.name} (Stok: {p.stock})</option>
                  ))}
                </select>
              </div>
              <div className="w-20">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adet</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] text-center"
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                />
              </div>
              <button 
                type="button" 
                onClick={handleAddItem}
                className="px-4 py-2 bg-[#BE6A6C] text-white rounded-lg hover:bg-[#A15A5B]"
              >
                Ekle
              </button>
            </div>

            {/* Ürün Listesi */}
            <div className="bg-gray-50 rounded-lg border border-gray-100 h-64 overflow-y-auto p-2 space-y-2">
              {formData.items.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-4">Henüz ürün eklenmedi.</p>
              )}
              {formData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-white p-2 rounded shadow-sm border border-gray-100">
                  <span className="text-sm font-medium text-gray-800">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">x{item.qty}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-bold text-gray-700">Toplam Tutar:</span>
              <span className="font-bold text-xl text-[#BE6A6C]">{formatCurrency(formData.total)}</span>
            </div>
          </div>

          <div className="md:col-span-2 pt-4 flex gap-3 border-t border-gray-100 mt-2 shrink-0 pb-safe">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">İptal</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-[#BE6A6C] text-white rounded-lg hover:bg-[#A15A5B] font-bold">
              {order ? 'Siparişi Güncelle' : 'Siparişi Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductFormModal({ onClose, onSave, product }: any) {
  const [formData, setFormData] = useState({
    id: product ? product.id : null,
    name: product ? product.name : '',
    sku: product ? product.sku : '',
    stock: product ? product.stock : 0,
    safetyStock: product ? product.safetyStock : 0,
    price: product ? product.price : 0,
    cost: product ? product.cost : 0,
    supplier: product ? product.supplier : '',
    category: product ? product.category : '',
    image: product ? product.image : "https://via.placeholder.com/100?text=No+Img"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      stock: Number(formData.stock),
      safetyStock: Number(formData.safetyStock),
      price: Number(formData.price),
      cost: Number(formData.cost)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white w-full md:rounded-2xl md:w-full md:max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] md:h-auto md:max-h-[90vh] rounded-t-2xl">
        <div className="bg-gray-50 p-4 md:p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h3 className="text-lg md:text-xl font-bold text-gray-800">{product ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
            <div className="relative">
              <Package size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                placeholder="Örn: Ahşap Yapboz Seti"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Stok Kodu)</label>
            <div className="relative">
              <Tag size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                placeholder="Örn: OY-001"
                value={formData.sku}
                onChange={e => setFormData({...formData, sku: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] bg-white"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Seçiniz</option>
              <option value="Eğitici">Eğitici</option>
              <option value="Elektronik">Elektronik</option>
              <option value="Peluş">Peluş</option>
              <option value="Yedek Parça">Yedek Parça</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Satış Fiyatı (TL)</label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="number" 
                min="0"
                step="0.01"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                value={formData.price}
                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maliyet (TL)</label>
            <div className="relative">
              <Wallet size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="number" 
                min="0"
                step="0.01"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                value={formData.cost}
                onChange={e => setFormData({...formData, cost: Number(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Stok</label>
            <div className="relative">
              <BarChart3 size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="number" 
                min="0"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emniyet Stoğu</label>
            <div className="relative">
              <AlertTriangle size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="number" 
                min="0"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                value={formData.safetyStock}
                onChange={e => setFormData({...formData, safetyStock: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tedarikçi</label>
            <div className="relative">
              <Truck size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                placeholder="Örn: Oyuncak Toptancısı A.Ş."
                value={formData.supplier}
                onChange={e => setFormData({...formData, supplier: e.target.value})}
              />
            </div>
          </div>

          <div className="md:col-span-2 pt-4 flex gap-3 shrink-0 pb-safe">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">İptal</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-[#BE6A6C] text-white rounded-lg hover:bg-[#A15A5B]">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChangePasswordModal({ onClose }: any) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Lock size={18} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Şifre Değiştir</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
            <input type="password" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]" />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
            <input type="password" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]" />
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100">İptal</button>
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-[#BE6A6C] text-white rounded-lg hover:bg-[#A15A5B]">Güncelle</button>
        </div>
      </div>
    </div>
  );
}

function NotificationSettingsModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <Bell size={18} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Bildirim Ayarları</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition cursor-pointer">
            <div>
              <p className="font-medium text-gray-800">E-posta Bildirimleri</p>
              <p className="text-xs text-gray-500">Önemli güncellemeleri mail al.</p>
            </div>
            <div className="w-10 h-6 bg-[#BE6A6C] rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition cursor-pointer">
            <div>
              <p className="font-medium text-gray-800">Stok Uyarıları</p>
              <p className="text-xs text-gray-500">Kritik stok seviyesinde uyar.</p>
            </div>
            <div className="w-10 h-6 bg-[#BE6A6C] rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition cursor-pointer">
            <div>
              <p className="font-medium text-gray-800">Haftalık Rapor</p>
              <p className="text-xs text-gray-500">Her Pazartesi özet rapor gönder.</p>
            </div>
            <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-[#BE6A6C] text-white rounded-lg hover:bg-[#A15A5B] flex items-center gap-2">
            <Save size={18} /> Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

function PrivacySettingsModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <Shield size={18} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Gizlilik ve Güvenlik</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800 text-sm uppercase">Veri Paylaşımı</h4>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <input type="checkbox" className="w-4 h-4 text-[#BE6A6C] focus:ring-[#BE6A6C] rounded border-gray-300" defaultChecked />
              <span className="text-sm text-gray-700">Anonim kullanım verilerini paylaş</span>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800 text-sm uppercase">Oturum Geçmişi</h4>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex justify-between mb-2">
                <span>Windows 10 - Chrome</span>
                <span className="text-green-600 font-medium">Aktif</span>
              </div>
              <div className="flex justify-between text-gray-400 text-xs">
                <span>IP: 192.168.1.1</span>
                <span>Denizli, TR</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100">Kapat</button>
        </div>
      </div>
    </div>
  );
}

function UserFormModal({ onClose, onSave, user }: any) {
  const [formData, setFormData] = useState({
    id: user ? user.id : null,
    name: user ? user.name : '',
    email: user ? user.email : '',
    phone: user ? user.phone : '',
    role: user ? user.role : 'Personel',
    avatar: user ? user.avatar : null,
    avatarPreview: user ? user.avatarPreview : null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: file, avatarPreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      initials: formData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white w-full md:rounded-2xl md:w-full md:max-w-md shadow-2xl overflow-hidden flex flex-col h-[90vh] md:h-auto md:max-h-[90vh] rounded-t-2xl">
        <div className="bg-gray-50 p-4 md:p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h3 className="text-lg md:text-xl font-bold text-gray-800">{user ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 overflow-y-auto">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-[#BE6A6C] transition-colors">
                {formData.avatarPreview ? (
                  <img src={formData.avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={32} className="text-gray-400 group-hover:text-[#BE6A6C]" />
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="mt-2 text-xs text-center text-gray-500">Fotoğraf yüklemek için tıklayın</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                placeholder="Örn: Osman BAŞAR"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                placeholder="Örn: osibasar@gmail.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="tel" 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                placeholder="Örn: 0555 701 00 24"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yetki (Rol)</label>
            <select 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] bg-white"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              <option value="Personel">Personel</option>
              <option value="Depo Sorumlusu">Depo Sorumlusu</option>
              <option value="Satış Uzmanı">Satış Uzmanı</option>
              <option value="Yönetici">Yönetici</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3 shrink-0 pb-safe">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">İptal</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-[#BE6A6C] text-white rounded-lg hover:bg-[#A15A5B]">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -- EKLENDI: Sipariş Detay Modalı (OrderDetailModal) --
function OrderDetailModal({ order, onClose, onEdit, inventory }: any) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full md:max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 md:p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">Sipariş #{order.id} - {order.customer}</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => { onEdit && onEdit(); }} className="px-3 py-1 text-sm bg-[#BE6A6C] text-white rounded-md">Düzenle</button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={18} /></button>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-4">
            <img src={getProductImage(order.items[0]?.name || '', inventory)} alt="" className="w-20 h-20 rounded object-cover border" />
            <div>
              <p className="font-semibold text-gray-800">{order.customer}</p>
              <p className="text-sm text-gray-500">{order.city} • {order.platform}</p>
              <p className="text-sm text-gray-500 mt-1">Durum: <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(order.status)}`}>{order.status}</span></p>
            </div>
            <div className="ml-auto text-right">
              <p className="font-bold text-lg">{formatCurrency(order.total)}</p>
              <p className="text-xs text-gray-500">{order.date}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Ürünler</h4>
            <div className="space-y-2">
              {order.items.map((it: any, idx: number) => {
                const img = getProductImage(it.name, inventory);
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <img src={img} alt={it.name} className="w-10 h-10 rounded object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <p className="text-sm font-medium">{it.name}</p>
                        <span className="text-sm text-gray-600">x{it.qty}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {order.address && (
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Adres</h4>
              <p className="text-sm text-gray-600">{order.address}</p>
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 bg-gray-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Kapat</button>
        </div>
      </div>
    </div>
  );
}

// -- EKLENDI: Tedarik (Supply) Detay Modalı (SupplyDetailModal) --
function SupplyDetailModal({ supply, onClose }: any) {
  if (!supply) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg">{supply.supplier} - Takip #{supply.id}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="p-4 space-y-3">
          <div className="text-sm text-gray-600">
            <div className="flex justify-between"><span>Ürünler</span><span className="font-medium">{supply.items}</span></div>
            <div className="flex justify-between mt-1"><span>Sipariş Tarihi</span><span className="font-medium">{supply.orderDate}</span></div>
            <div className="flex justify-between mt-1"><span>Durum</span><span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(supply.status)}`}>{supply.status}</span></div>
            <div className="flex justify-between mt-1"><span>Takip No</span><span className="font-medium">{supply.tracking}</span></div>
            <div className="flex justify-between mt-1"><span>Tahmini Varış</span><span className="font-medium">{supply.estimatedArrival}</span></div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-[#BE6A6C] text-white rounded-lg">Kapat</button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon: Icon, alert = false, subtext, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className={`text-2xl font-bold ${alert ? 'text-red-600' : 'text-gray-800'}`}>{value}</h3>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className={`p-3 rounded-lg ${alert ? 'bg-red-50 text-red-600' : 'bg-[#BE6A6C]/10 text-[#BE6A6C]'}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-xs font-bold flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} 
            %12
          </span>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ options, activeFilter, onFilterChange }: any) {
  return (
    <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm overflow-x-auto no-scrollbar">
      {options.map((option: string) => (
        <button
          key={option}
          onClick={() => onFilterChange(option)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${
            activeFilter === option 
            ? 'bg-[#BE6A6C] text-white shadow-sm' 
            : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function Toast({ message, type, onClose }: any) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-20 md:bottom-6 right-6 left-6 md:left-auto p-4 rounded-lg shadow-lg border flex items-start gap-3 z-[100] animate-in slide-in-from-bottom-5 duration-300 bg-white border-green-200`}>
      <div className={`p-1 rounded-full bg-green-100 text-green-600 shrink-0`}>
        <Check size={16} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-gray-800">İşlem Başarılı</h4>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-2">
        <X size={16} />
      </button>
    </div>
  );
}

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, itemName }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Ürünü Sil</h3>
          <p className="text-gray-500 text-sm mb-6">
            <span className="font-semibold text-gray-800">{itemName}</span> adlı ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Vazgeç
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium shadow-sm transition-colors"
            >
              Evet, Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderFormModal({ onClose, onSave, inventory, users, order }: any) {
  const [formData, setFormData] = useState<Order>({
    id: order ? order.id : Date.now(),
    customer: order ? order.customer : '',
    city: order ? order.city : '',
    address: order ? order.address : '',
    platform: order ? order.platform : 'Trendyol',
    deadline: order ? order.deadline : getRelativeDate(3),
    status: order ? order.status : 'Yeni',
    assignedTo: order ? order.assignedTo : '',
    items: order ? order.items : [],
    total: order ? order.total : 0,
    date: order ? order.date : new Date().toISOString().split('T')[0]
  });

  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Toplam tutarı hesapla
  useEffect(() => {
    const total = formData.items.reduce((acc, item) => {
      const prod = inventory.find((p: InventoryItem) => p.name === item.name);
      return acc + (prod ? prod.price * item.qty : 0);
    }, 0);
    setFormData(prev => ({ ...prev, total }));
  }, [formData.items, inventory]);

  const handleAddItem = () => {
    if (!selectedProduct) return;
    const existingItem = formData.items.find(i => i.name === selectedProduct);
    
    if (existingItem) {
      setFormData({
        ...formData,
        items: formData.items.map(i => i.name === selectedProduct ? { ...i, qty: i.qty + Number(quantity) } : i)
      });
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, { name: selectedProduct, qty: Number(quantity) }]
      });
    }
    setSelectedProduct('');
    setQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      alert("Lütfen en az bir ürün ekleyin.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white w-full md:rounded-2xl md:w-full md:max-w-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] md:h-auto md:max-h-[90vh] rounded-t-2xl">
        <div className="bg-gray-50 p-4 md:p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h3 className="text-lg md:text-xl font-bold text-gray-800">{order ? 'Siparişi Düzenle' : 'Yeni Sipariş Oluştur'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
          
          {/* Sol Kolon: Müşteri & Detaylar */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 border-b pb-2 mb-4">Müşteri Bilgileri</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri Adı</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                value={formData.customer}
                onChange={e => setFormData({...formData, customer: e.target.value})}
                placeholder="Ad Soyad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                placeholder="Örn: İstanbul"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Açık Adres</label>
              <textarea 
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] resize-none h-24 text-sm"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                placeholder="Mahalle, Sokak, No, Daire..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] bg-white"
                  value={formData.platform}
                  onChange={e => setFormData({...formData, platform: e.target.value})}
                >
                  <option value="Trendyol">Trendyol</option>
                  <option value="Hepsiburada">Hepsiburada</option>
                  <option value="Instagram">Instagram</option>
                  <option value="B2B Panel">B2B Panel</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Termin Tarihi</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                  value={formData.deadline}
                  onChange={e => setFormData({...formData, deadline: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sorumlu Personel</label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] bg-white"
                value={formData.assignedTo || ''}
                onChange={e => setFormData({...formData, assignedTo: e.target.value})}
              >
                <option value="">Atanmadı</option>
                {users.filter((u: UserData) => u.role !== 'Yönetici').map((u: UserData) => (
                  <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sağ Kolon: Ürünler */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 border-b pb-2 mb-4">Sipariş İçeriği</h4>
            
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Seç</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] bg-white text-sm"
                  value={selectedProduct}
                  onChange={e => setSelectedProduct(e.target.value)}
                >
                  <option value="">Ürün Seçiniz...</option>
                  {inventory.map((p: InventoryItem) => (
                    <option key={p.id} value={p.name}>{p.name} (Stok: {p.stock})</option>
                  ))}
                </select>
              </div>
              <div className="w-20">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adet</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] text-center"
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                />
              </div>
              <button 
                type="button" 
                onClick={handleAddItem}
                className="px-4 py-2 bg-[#BE6A6C] text-white rounded-lg hover:bg-[#A15A5B]"
              >
                Ekle
              </button>
            </div>

            {/* Ürün Listesi */}
            <div className="bg-gray-50 rounded-lg border border-gray-100 h-64 overflow-y-auto p-2 space-y-2">
              {formData.items.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-4">Henüz ürün eklenmedi.</p>
              )}
              {formData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-white p-2 rounded shadow-sm border border-gray-100">
                  <span className="text-sm font-medium text-gray-800">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">x{item.qty}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-bold text-gray-700">Toplam Tutar:</span>
              <span className="font-bold text-xl text-[#BE6A6C]">{formatCurrency(formData.total)}</span>
            </div>
          </div>

          <div className="md:col-span-2 pt-4 flex gap-3 border-t border-gray-100 mt-2 shrink-0 pb-safe">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">İptal</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-[#BE6A6C] text-white rounded-lg hover:bg-[#A15A5B] font-bold">
              {order ? 'Siparişi Güncelle' : 'Siparişi Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductFormModal({ onClose, onSave, product }: any) {
  const [formData, setFormData] = useState({
    id: product ? product.id : null,
    name: product ? product.name : '',
    sku: product ? product.sku : '',
    stock: product ? product.stock : 0,
    safetyStock: product ? product.safetyStock : 0,
    price: product ? product.price : 0,
    cost: product ? product.cost : 0,
    supplier: product ? product.supplier : '',
    category: product ? product.category : '',
    image: product ? product.image : "https://via.placeholder.com/100?text=No+Img"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      stock: Number(formData.stock),
      safetyStock: Number(formData.safetyStock),
      price: Number(formData.price),
      cost: Number(formData.cost)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white w-full md:rounded-2xl md:w-full md:max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] md:h-auto md:max-h-[90vh] rounded-t-2xl">
        <div className="bg-gray-50 p-4 md:p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h3 className="text-lg md:text-xl font-bold text-gray-800">{product ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
            <div className="relative">
              <Package size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                placeholder="Örn: Ahşap Yapboz Seti"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Stok Kodu)</label>
            <div className="relative">
              <Tag size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                placeholder="Örn: OY-001"
                value={formData.sku}
                onChange={e => setFormData({...formData, sku: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] bg-white"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Seçiniz</option>
              <option value="Eğitici">Eğitici</option>
              <option value="Elektronik">Elektronik</option>
              <option value="Peluş">Peluş</option>
              <option value="Yedek Parça">Yedek Parça</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Satış Fiyatı (TL)</label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="number" 
                min="0"
                step="0.01"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                value={formData.price}
                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maliyet (TL)</label>
            <div className="relative">
              <Wallet size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="number" 
                min="0"
                step="0.01"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                value={formData.cost}
                onChange={e => setFormData({...formData, cost: Number(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Stok</label>
            <div className="relative">
              <BarChart3 size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="number" 
                min="0"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emniyet Stoğu</label>
            <div className="relative">
              <AlertTriangle size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="number" 
                min="0"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                value={formData.safetyStock}
                onChange={e => setFormData({...formData, safetyStock: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tedarikçi</label>
            <div className="relative">
              <Truck size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                placeholder="Örn: Oyuncak Toptancısı A.Ş."
                value={formData.supplier}
                onChange={e => setFormData({...formData, supplier: e.target.value})}
              />
            </div>
          </div>

          <div className="md:col-span-2 pt-4 flex gap-3 shrink-0 pb-safe">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">İptal</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-[#BE6A6C] text-white rounded-lg hover:bg-[#A15A5B]">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChangePasswordModal({ onClose }: any) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Lock size={18} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Şifre Değiştir</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
            <input type="password" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]" />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
            <input type="password" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]" />
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100">İptal</button>
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-[#BE6A6C] text-white rounded-lg hover:bg-[#A15A5B]">Güncelle</button>
        </div>
      </div>
    </div>
  );
}

function NotificationSettingsModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <Bell size={18} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Bildirim Ayarları</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition cursor-pointer">
            <div>
              <p className="font-medium text-gray-800">E-posta Bildirimleri</p>
              <p className="text-xs text-gray-500">Önemli güncellemeleri mail al.</p>
            </div>
            <div className="w-10 h-6 bg-[#BE6A6C] rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition cursor-pointer">
            <div>
              <p className="font-medium text-gray-800">Stok Uyarıları</p>
              <p className="text-xs text-gray-500">Kritik stok seviyesinde uyar.</p>
            </div>
            <div className="w-10 h-6 bg-[#BE6A6C] rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition cursor-pointer">
            <div>
              <p className="font-medium text-gray-800">Haftalık Rapor</p>
              <p className="text-xs text-gray-500">Her Pazartesi özet rapor gönder.</p>
            </div>
            <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-[#BE6A6C] text-white rounded-lg hover:bg-[#A15A5B] flex items-center gap-2">
            <Save size={18} /> Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

function PrivacySettingsModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <Shield size={18} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Gizlilik ve Güvenlik</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800 text-sm uppercase">Veri Paylaşımı</h4>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <input type="checkbox" className="w-4 h-4 text-[#BE6A6C] focus:ring-[#BE6A6C] rounded border-gray-300" defaultChecked />
              <span className="text-sm text-gray-700">Anonim kullanım verilerini paylaş</span>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800 text-sm uppercase">Oturum Geçmişi</h4>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex justify-between mb-2">
                <span>Windows 10 - Chrome</span>
                <span className="text-green-600 font-medium">Aktif</span>
              </div>
              <div className="flex justify-between text-gray-400 text-xs">
                <span>IP: 192.168.1.1</span>
                <span>Denizli, TR</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100">Kapat</button>
        </div>
      </div>
    </div>
  );
}

function UserFormModal({ onClose, onSave, user }: any) {
  const [formData, setFormData] = useState({
    id: user ? user.id : null,
    name: user ? user.name : '',
    email: user ? user.email : '',
    phone: user ? user.phone : '',
    role: user ? user.role : 'Personel',
    avatar: user ? user.avatar : null,
    avatarPreview: user ? user.avatarPreview : null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: file, avatarPreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      initials: formData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white w-full md:rounded-2xl md:w-full md:max-w-md shadow-2xl overflow-hidden flex flex-col h-[90vh] md:h-auto md:max-h-[90vh] rounded-t-2xl">
        <div className="bg-gray-50 p-4 md:p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h3 className="text-lg md:text-xl font-bold text-gray-800">{user ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 overflow-y-auto">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-[#BE6A6C] transition-colors">
                {formData.avatarPreview ? (
                  <img src={formData.avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={32} className="text-gray-400 group-hover:text-[#BE6A6C]" />
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="mt-2 text-xs text-center text-gray-500">Fotoğraf yüklemek için tıklayın</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                placeholder="Örn: Osman BAŞAR"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                placeholder="Örn: osibasar@gmail.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="tel" 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                placeholder="Örn: 0555 701 00 24"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Yetki (Rol)</label>
            <select 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] bg-white"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              <option value="Personel">Personel</option>
              <option value="Depo Sorumlusu">Depo Sorumlusu</option>
              <option value="Satış Uzmanı">Satış Uzmanı</option>
              <option value="Yönetici">Yönetici</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3 shrink-0 pb-safe">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">İptal</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-[#BE6A6C] text-white rounded-lg hover:bg-[#A15A5B]">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OrderDetailModal({ order, onClose, onEdit, inventory }: any) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full md:max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 md:p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">Sipariş #{order.id} - {order.customer}</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => { onEdit && onEdit(); }} className="px-3 py-1 text-sm bg-[#BE6A6C] text-white rounded-md">Düzenle</button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={18} /></button>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-4">
            <img src={getProductImage(order.items[0]?.name || '', inventory)} alt="" className="w-20 h-20 rounded object-cover border" />
            <div>
              <p className="font-semibold text-gray-800">{order.customer}</p>
              <p className="text-sm text-gray-500">{order.city} • {order.platform}</p>
              <p className="text-sm text-gray-500 mt-1">Durum: <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(order.status)}`}>{order.status}</span></p>
            </div>
            <div className="ml-auto text-right">
              <p className="font-bold text-lg">{formatCurrency(order.total)}</p>
              <p className="text-xs text-gray-500">{order.date}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Ürünler</h4>
            <div className="space-y-2">
              {order.items.map((it: any, idx: number) => {
                const img = getProductImage(it.name, inventory);
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <img src={img} alt={it.name} className="w-10 h-10 rounded object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <p className="text-sm font-medium">{it.name}</p>
                        <span className="text-sm text-gray-600">x{it.qty}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {order.address && (
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Adres</h4>
              <p className="text-sm text-gray-600">{order.address}</p>
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 bg-gray-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Kapat</button>
        </div>
      </div>
    </div>
  );
}

function SupplyDetailModal({ supply, onClose }: any) {
  if (!supply) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg">{supply.supplier} - Takip #{supply.id}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="p-4 space-y-3">
          <div className="text-sm text-gray-600">
            <div className="flex justify-between"><span>Ürünler</span><span className="font-medium">{supply.items}</span></div>
            <div className="flex justify-between mt-1"><span>Sipariş Tarihi</span><span className="font-medium">{supply.orderDate}</span></div>
            <div className="flex justify-between mt-1"><span>Durum</span><span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(supply.status)}`}>{supply.status}</span></div>
            <div className="flex justify-between mt-1"><span>Takip No</span><span className="font-medium">{supply.tracking}</span></div>
            <div className="flex justify-between mt-1"><span>Tahmini Varış</span><span className="font-medium">{supply.estimatedArrival}</span></div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-[#BE6A6C] text-white rounded-lg">Kapat</button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon: Icon, alert = false, subtext, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className={`text-2xl font-bold ${alert ? 'text-red-600' : 'text-gray-800'}`}>{value}</h3>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className={`p-3 rounded-lg ${alert ? 'bg-red-50 text-red-600' : 'bg-[#BE6A6C]/10 text-[#BE6A6C]'}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-xs font-bold flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} 
            %12
          </span>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ options, activeFilter, onFilterChange }: any) {
  return (
    <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm overflow-x-auto no-scrollbar">
      {options.map((option: string) => (
        <button
          key={option}
          onClick={() => onFilterChange(option)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${
            activeFilter === option 
            ? 'bg-[#BE6A6C] text-white shadow-sm' 
            : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function Toast({ message, type, onClose }: any) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-20 md:bottom-6 right-6 left-6 md:left-auto p-4 rounded-lg shadow-lg border flex items-start gap-3 z-[100] animate-in slide-in-from-bottom-5 duration-300 bg-white border-green-200`}>
      <div className={`p-1 rounded-full bg-green-100 text-green-600 shrink-0`}>
        <Check size={16} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-gray-800">İşlem Başarılı</h4>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-2">
        <X size={16} />
      </button>
    </div>
  );
}

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, itemName }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Ürünü Sil</h3>
          <p className="text-gray-500 text-sm mb-6">
            <span className="font-semibold text-gray-800">{itemName}</span> adlı ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Vazgeç
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium shadow-sm transition-colors"
            >
              Evet, Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderFormModal({ onClose, onSave, inventory, users, order }: any) {
  const [formData, setFormData] = useState<Order>({
    id: order ? order.id : Date.now(),
    customer: order ? order.customer : '',
    city: order ? order.city : '',
    address: order ? order.address : '',
    platform: order ? order.platform : 'Trendyol',
    deadline: order ? order.deadline : getRelativeDate(3),
    status: order ? order.status : 'Yeni',
    assignedTo: order ? order.assignedTo : '',
    items: order ? order.items : [],
    total: order ? order.total : 0,
    date: order ? order.date : new Date().toISOString().split('T')[0]
  });

  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Toplam tutarı hesapla
  useEffect(() => {
    const total = formData.items.reduce((acc, item) => {
      const prod = inventory.find((p: InventoryItem) => p.name === item.name);
      return acc + (prod ? prod.price * item.qty : 0);
    }, 0);
    setFormData(prev => ({ ...prev, total }));
  }, [formData.items, inventory]);

  const handleAddItem = () => {
    if (!selectedProduct) return;
    const existingItem = formData.items.find(i => i.name === selectedProduct);
    
    if (existingItem) {
      setFormData({
        ...formData,
        items: formData.items.map(i => i.name === selectedProduct ? { ...i, qty: i.qty + Number(quantity) } : i)
      });
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, { name: selectedProduct, qty: Number(quantity) }]
      });
    }
    setSelectedProduct('');
    setQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      alert("Lütfen en az bir ürün ekleyin.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white w-full md:rounded-2xl md:w-full md:max-w-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] md:h-auto md:max-h-[90vh] rounded-t-2xl">
        <div className="bg-gray-50 p-4 md:p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h3 className="text-lg md:text-xl font-bold text-gray-800">{order ? 'Siparişi Düzenle' : 'Yeni Sipariş Oluştur'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
          
          {/* Sol Kolon: Müşteri & Detaylar */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 border-b pb-2 mb-4">Müşteri Bilgileri</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri Adı</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                value={formData.customer}
                onChange={e => setFormData({...formData, customer: e.target.value})}
                placeholder="Ad Soyad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                placeholder="Örn: İstanbul"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Açık Adres</label>
              <textarea 
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] resize-none h-24 text-sm"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                placeholder="Mahalle, Sokak, No, Daire..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] bg-white"
                  value={formData.platform}
                  onChange={e => setFormData({...formData, platform: e.target.value})}
                >
                  <option value="Trendyol">Trendyol</option>
                  <option value="Hepsiburada">Hepsiburada</option>
                  <option value="Instagram">Instagram</option>
                  <option value="B2B Panel">B2B Panel</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Termin Tarihi</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C]"
                  value={formData.deadline}
                  onChange={e => setFormData({...formData, deadline: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sorumlu Personel</label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] bg-white"
                value={formData.assignedTo || ''}
                onChange={e => setFormData({...formData, assignedTo: e.target.value})}
              >
                <option value="">Atanmadı</option>
                {users.filter((u: UserData) => u.role !== 'Yönetici').map((u: UserData) => (
                  <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sağ Kolon: Ürünler */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700 border-b pb-2 mb-4">Sipariş İçeriği</h4>
            
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Seç</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] bg-white text-sm"
                  value={selectedProduct}
                  onChange={e => setSelectedProduct(e.target.value)}
                >
                  <option value="">Ürün Seçiniz...</option>
                  {inventory.map((p: InventoryItem) => (
                    <option key={p.id} value={p.name}>{p.name} (Stok: {p.stock})</option>
                  ))}
                </select>
              </div>
              <div className="w-20">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adet</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#BE6A6C] text-center"
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                />
              </div>
              <button 
                type="button" 
                onClick={handleAddItem}
                className="px-4 py-2 bg-[#BE6A6C] text-white rounded-lg hover:bg-[#A15A5B]"
              >
                Ekle
              </button>
            </div>

            {/* Ürün Listesi */}
            <div className="bg-gray-50 rounded-lg border border-gray-100 h-64 overflow-y-auto p-2 space-y-2">
              {formData.items.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-4">Henüz ürün eklenmedi.</p>
              )}
              {formData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-white p-2 rounded shadow-sm border border-gray-100">
                  <span className="text-sm font-medium text-gray-800">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">x{item.qty}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-bold text-gray-700">Toplam Tutar:</span>
              <span className="font-bold text-xl text-[#BE6A6C]">{formatCurrency(formData.total)}</span>
            </div>
          </div>

          <div className="md:col-span-2 pt-4 flex gap-3 border-t border-gray-100 mt-2 shrink-0 pb-safe">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">İptal</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-[#BE6A6C] text-white rounded-lg hover:bg-[#A15A5B] font-bold">
              {order ? 'Siparişi Güncelle' : 'Siparişi Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OrderDetailModal({ order, onClose, onEdit, inventory }: any) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full md:max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 md:p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">Sipariş #{order.id} - {order.customer}</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => { onEdit && onEdit(); }} className="px-3 py-1 text-sm bg-[#BE6A6C] text-white rounded-md">Düzenle</button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={18} /></button>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-4">
            <img src={getProductImage(order.items[0]?.name || '', inventory)} alt="" className="w-20 h-20 rounded object-cover border" />
            <div>
              <p className="font-semibold text-gray-800">{order.customer}</p>
              <p className="text-sm text-gray-500">{order.city} • {order.platform}</p>
              <p className="text-sm text-gray-500 mt-1">Durum: <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(order.status)}`}>{order.status}</span></p>
            </div>
            <div className="ml-auto text-right">
              <p className="font-bold text-lg">{formatCurrency(order.total)}</p>
              <p className="text-xs text-gray-500">{order.date}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Ürünler</h4>
            <div className="space-y-2">
              {order.items.map((it: any, idx: number) => {
                const img = getProductImage(it.name, inventory);
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <img src={img} alt={it.name} className="w-10 h-10 rounded object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <p className="text-sm font-medium">{it.name}</p>
                        <span className="text-sm text-gray-600">x{it.qty}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {order.address && (
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Adres</h4>
              <p className="text-sm text-gray-600">{order.address}</p>
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 bg-gray-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Kapat</button>
        </div>
      </div>
    </div>
  );
}

function SupplyDetailModal({ supply, onClose }: any) {
  if (!supply) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg">{supply.supplier} - Takip #{supply.id}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="p-4 space-y-3">
          <div className="text-sm text-gray-600">
            <div className="flex justify-between"><span>Ürünler</span><span className="font-medium">{supply.items}</span></div>
            <div className="flex justify-between mt-1"><span>Sipariş Tarihi</span><span className="font-medium">{supply.orderDate}</span></div>
            <div className="flex justify-between mt-1"><span>Durum</span><span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(supply.status)}`}>{supply.status}</span></div>
            <div className="flex justify-between mt-1"><span>Takip No</span><span className="font-medium">{supply.tracking}</span></div>
            <div className="flex justify-between mt-1"><span>Tahmini Varış</span><span className="font-medium">{supply.estimatedArrival}</span></div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-[#BE6A6C] text-white rounded-lg">Kapat</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  
  // Auth State (Auto-Login with localStorage)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('peraBalonUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  // Veri Stateleri
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('peraBalon_inventory');
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    }
    return INITIAL_INVENTORY;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('peraBalon_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    }
    return INITIAL_ORDERS;
  });

  const [users, setUsers] = useState<UserData[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('peraBalon_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    }
    return INITIAL_USERS;
  });

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null);
  
  // Kullanıcı Ekleme/Düzenleme State'leri
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  // Ürün Ekleme/Düzenleme State'leri
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null);
  const [openMenuRowId, setOpenMenuRowId] = useState<number | null>(null); // Stok tablosundaki satır menüsü için
  
  // Sipariş Ekleme/Düzenleme State'leri
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null); // Sipariş düzenleme state'i eklendi

  // Silme Onay State'i
  const [productToDelete, setProductToDelete] = useState<InventoryItem | null>(null);

  // Profil Modalları için State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  
  // Toast State
  const [toast, setToast] = useState<string | null>(null);

  // Filtre Stateleri
  const [dashboardPeriod, setDashboardPeriod] = useState('Bugün');
  const [financePeriod, setFinancePeriod] = useState('Günlük');
  const [financeSubTab, setFinanceSubTab] = useState('products');
  const [orderFilter, setOrderFilter] = useState('Tümü');
  const [inventoryFilter, setInventoryFilter] = useState('Tümü');
  const [supplyFilter, setSupplyFilter] = useState('Tümü');

  const showToast = (message: string) => {
    setToast(message as any);
  };

  // LocalStorage Sync Effects
  useEffect(() => {
    localStorage.setItem('peraBalon_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('peraBalon_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('peraBalon_users', JSON.stringify(users));
  }, [users]);


  useEffect(() => {
    const handleClickOutside = () => setOpenMenuRowId(null);
    if (openMenuRowId) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openMenuRowId]);

  // --- HESAPLAMALAR ---
  const getFilteredDashboardData = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const filterFn = (dateStr: string) => {
      const d = new Date(dateStr);
      d.setHours(0,0,0,0);
      
      if (dashboardPeriod === 'Bugün') return d.getTime() === today.getTime();
      if (dashboardPeriod === 'Bu Hafta') {
         const oneWeekAgo = new Date(today);
         oneWeekAgo.setDate(today.getDate() - 7);
         return d >= oneWeekAgo && d <= today;
      }
      if (dashboardPeriod === 'Bu Ay') {
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      }
      if (dashboardPeriod === 'Bu Yıl') {
        return d.getFullYear() === today.getFullYear();
      }
      return true;
    };

    const filteredOrders = orders.filter(o => filterFn(o.date));
    const filteredSupplies = INITIAL_SUPPLIES.filter(s => filterFn(s.orderDate));
    
    const revenue = filteredOrders.reduce((acc, curr) => acc + curr.total, 0);
    
    let cost = 0;
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const prod = inventory.find(p => p.name === item.name);
        if (prod) cost += prod.cost * item.qty;
      });
    });

    return {
      orderCount: filteredOrders.length,
      revenue,
      profit: revenue - cost,
      supplyCount: filteredSupplies.length
    };
  }, [dashboardPeriod, orders, inventory]);

  const financials = useMemo(() => {
    let filteredOrders = [...orders];
    const today = new Date();
    today.setHours(0,0,0,0);

    if (financePeriod === 'Günlük') {
       filteredOrders = orders.filter(o => {
          const d = new Date(o.date);
          d.setHours(0,0,0,0);
          return d.getTime() === today.getTime();
       });
    } else if (financePeriod === 'Aylık') {
       filteredOrders = orders.filter(o => {
          const d = new Date(o.date);
          return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
       });
    } else if (financePeriod === 'Yıllık') {
       filteredOrders = orders.filter(o => {
          const d = new Date(o.date);
          return d.getFullYear() === today.getFullYear();
       });
    }

    let totalRevenue = 0;
    let totalCost = 0;
    const productSales: any = {};
    const citySales: any = {};

    filteredOrders.forEach(order => {
      totalRevenue += order.total;
      citySales[order.city] = (citySales[order.city] || 0) + order.total;

      order.items.forEach(item => {
        const product = inventory.find(p => p.name === item.name);
        if (product) {
          const itemCost = product.cost * item.qty;
          const itemRevenue = item.qty * product.price; 
          
          totalCost += itemCost;
          
          if (!productSales[product.name]) {
            productSales[product.name] = { 
              sales: 0, 
              revenue: 0, 
              profit: 0, 
              supplier: product.supplier,
              costPrice: product.cost,
              sellPrice: product.price
            };
          }
          productSales[product.name].sales += item.qty;
          productSales[product.name].revenue += itemRevenue;
          productSales[product.name].profit += (itemRevenue - itemCost);
        }
      });
    });

    return { totalRevenue, totalCost, profit: totalRevenue - totalCost, productSales, citySales };
  }, [financePeriod, orders, inventory]);

  const handleAssign = (e: any, orderId: number) => {
    e.stopPropagation(); 
    const userName = e.target.value;
    
    // 1. Kullanıcıyı bul
    const assignedUser = users.find(u => u.name === userName);

    // 2. Siparişi güncelle
    setOrders(orders.map(o => o.id === orderId ? { ...o, assignedTo: userName } : o));

    // 3. Bildirim Mantığı
    if (assignedUser) {
        // Telefon numarasını temizle (boşlukları kaldır)
        const cleanPhone = assignedUser.phone?.replace(/\D/g, '') || '';
        
        // Kullanıcıya işlemin yapıldığını göster
        showToast(`${assignedUser.name} başarıyla atandı.`);
        
        // Simülasyon: 1.5 saniye sonra bildirim gittiğini söyle
        setTimeout(() => {
            showToast(`📨 ${assignedUser.email} adresine mail gönderildi.`);
        }, 1500);

        if (cleanPhone) {
            setTimeout(() => {
                 showToast(`📱 ${assignedUser.phone} numarasına WhatsApp mesajı iletildi.`);
            }, 3000);
        }
    } else if (userName === "") {
        showToast(`Sipariş ataması kaldırıldı.`);
    }
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('peraBalonUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('peraBalonUser');
  };

  const handleResetData = () => {
    if (confirm('Tüm veriler sıfırlanacak ve başlangıç haline dönecek. Emin misiniz?')) {
      localStorage.removeItem('peraBalon_inventory');
      localStorage.removeItem('peraBalon_orders');
      localStorage.removeItem('peraBalon_users');
      setInventory(INITIAL_INVENTORY);
      setOrders(INITIAL_ORDERS);
      setUsers(INITIAL_USERS);
      showToast('Tüm veriler sıfırlandı.');
    }
  };

  // User Actions
  const handleOpenUserModal = (user: any = null) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (userData: any) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === userData.id ? userData : u));
      showToast("Kullanıcı güncellendi.");
    } else {
      setUsers([...users, { ...userData, id: users.length + 1 }]);
      showToast("Yeni kullanıcı eklendi.");
    }
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
    showToast("Kullanıcı silindi.");
  };

  // Product Actions
  const handleOpenProductModal = (product: any = null) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      setInventory(inventory.map(p => p.id === productData.id ? productData : p));
      showToast("Ürün güncellendi.");
    } else {
      setInventory([...inventory, { ...productData, id: inventory.length + 1 }]);
      showToast("Yeni ürün eklendi.");
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProductInit = (product: any) => {
    setProductToDelete(product);
    setOpenMenuRowId(null);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      // @ts-ignore
      setInventory(inventory.filter(p => p.id !== productToDelete.id));
      setProductToDelete(null);
      showToast("Ürün başarıyla silindi.");
    }
  };

  // Order Actions
  const handleOpenOrderModal = (order: any = null) => {
    setEditingOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleSaveOrder = (orderData: any) => {
    if (editingOrder) {
      setOrders(orders.map(o => o.id === orderData.id ? orderData : o));
      showToast("Sipariş güncellendi.");
    } else {
      setOrders([orderData, ...orders]);
      showToast("Yeni sipariş oluşturuldu.");
    }
    setIsOrderModalOpen(false);
    setEditingOrder(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        const dashData = getFilteredDashboardData;
        const lowStockCount = inventory.filter(i => i.stock <= i.safetyStock).length;
        return (
          <div className="space-y-6 pb-24 md:pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Genel Bakış</h2>
              <FilterGroup 
                options={['Bugün', 'Bu Hafta', 'Bu Ay', 'Bu Yıl']} 
                activeFilter={dashboardPeriod} 
                onFilterChange={setDashboardPeriod} 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card title={`${dashboardPeriod} Ciro`} value={formatCurrency(dashData.revenue)} icon={Banknote} trend="up" subtext="Satışlardan gelen" />
              <Card title={`${dashboardPeriod} Sipariş`} value={dashData.orderCount} icon={ShoppingCart} subtext="Toplam adet" />
              <Card title={`${dashboardPeriod} Kâr`} value={formatCurrency(dashData.profit)} icon={Wallet} trend="up" subtext="Tahmini net" />
              <Card title="Kritik Stok" value={lowStockCount} icon={AlertTriangle} alert={lowStockCount > 0} subtext="Acil ilgilenilmeli" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-red-500" />
                    Kritik Stok Uyarıları
                  </h3>
                  <button onClick={() => setActiveTab('inventory')} className="text-sm text-[#BE6A6C] hover:underline">Tümünü Gör</button>
                </div>
                <div className="space-y-3">
                  {inventory.filter(i => i.stock <= i.safetyStock).map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                      <div className="flex items-center gap-3">
                         <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                         <div>
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-xs text-red-600">SKU: {item.sku}</p>
                         </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-700">{item.stock} Adet</p>
                        <p className="text-xs text-red-500">Güvenlik: {item.safetyStock}</p>
                      </div>
                    </div>
                  ))}
                  {inventory.filter(i => i.stock <= i.safetyStock).length === 0 && (
                    <p className="text-gray-400 text-sm text-center py-4">Tüm stoklar güvenli seviyede.</p>
                  )}
                </div>
              </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Clock size={18} className="text-orange-500" />
                    Yaklaşan Terminler
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className="text-sm text-[#BE6A6C] hover:underline">Tümünü Gör</button>
                </div>
                <div className="space-y-3">
                  {orders.filter(o => o.status !== 'Tamamlandı').map(order => {
                    const daysLeft = calculateDaysLeft(order.deadline);
                    const isUrgent