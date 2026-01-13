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

// --- YARDIMCI FONKSİYONLAR ---

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

// --- TİP TANIMLAMALARI ---

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

// --- ÖRNEK VERİLER ---

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 1, name: "Ahşap Yapboz Seti", sku: "OY-001", stock: 150, safetyStock: 20, price: 250, cost: 120, supplier: "Oyuncak Toptancısı A.Ş.", category: "Eğitici", image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 2, name: "Uzaktan Kumandalı Araba", sku: "OY-002", stock: 8, safetyStock: 15, price: 1250.50, cost: 750, supplier: "Temu", category: "Elektronik", image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 3, name: "Peluş Ayıcık (Büyük)", sku: "OY-003", stock: 45, safetyStock: 10, price: 450, cost: 200, supplier: "Oyuncak Toptancısı A.Ş.", category: "Peluş", image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 4, name: "Drone Pervane Seti", sku: "YD-001", stock: 4, safetyStock: 50, price: 80, cost: 25, supplier: "AliExpress", category: "Yedek Parça", image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 5, name: "Oyun Hamuru Seti (12 Renk)", sku: "OY-004", stock: 200, safetyStock: 30, price: 120, cost: 60, supplier: "Oyuncak Toptancısı A.Ş.", category: "Eğitici", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 6, name: "LED Işık Şeridi (5m)", sku: "EL-005", stock: 85, safetyStock: 10, price: 150, cost: 70, supplier: "AliExpress", category: "Elektronik", image: "https://images.unsplash.com/photo-1563456020-0551061917f8?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 7, name: "Renkli Balon Paketi (100'lü)", sku: "BL-001", stock: 500, safetyStock: 100, price: 85, cost: 30, supplier: "Parti Dünyası", category: "Parti", image: "https://images.unsplash.com/photo-1530103862676-de3c9da59af7?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 8, name: "Helyum Tüpü (Kullan-At)", sku: "BL-002", stock: 12, safetyStock: 5, price: 850, cost: 450, supplier: "Parti Dünyası", category: "Parti", image: "https://images.unsplash.com/photo-1582236873967-0c7f2122396e?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 9, name: "Konfetili Balon (Altın)", sku: "BL-003", stock: 150, safetyStock: 40, price: 45, cost: 15, supplier: "Parti Dünyası", category: "Parti", image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 10, name: "Doğum Günü Banner Seti", sku: "PT-001", stock: 60, safetyStock: 15, price: 120, cost: 50, supplier: "Parti Dünyası", category: "Parti", image: "https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?auto=format&fit=crop&q=80&w=100&h=100" }
];

const INITIAL_ORDERS: Order[] = [
  { id: 101, customer: "Ahmet Yılmaz", city: "İstanbul", address: "Atatürk Mah. Cumhuriyet Cad. No:12 D:5, Kadıköy", platform: "Trendyol", items: [{ name: "Uzaktan Kumandalı Araba", qty: 2 }], date: getRelativeDate(0), deadline: getRelativeDate(-2), status: "Hazırlanıyor", total: 2501.00, assignedTo: "Mehmet Demir" },
  { id: 102, customer: "Ayşe Demir", city: "Ankara", address: "Çankaya Mah. Hoşdere Cad. No:44, Çankaya", platform: "Instagram", items: [{ name: "Peluş Ayıcık (Büyük)", qty: 1 }], date: getRelativeDate(0), deadline: getRelativeDate(1), status: "Yeni", total: 450.00, assignedTo: null },
  { id: 103, customer: "Kırtasiye Dünyası", city: "İzmir", address: "Alsancak Mah. Kıbrıs Şehitleri Cad. No:10, Konak", platform: "B2B Panel", items: [{ name: "Ahşap Yapboz Seti", qty: 50 }, { name: "Drone Pervane Seti", qty: 10 }], date: getRelativeDate(5), deadline: getRelativeDate(2), status: "Kargolandı", total: 13300.00, assignedTo: "Selin Yılmaz" },
  { id: 104, customer: "Mehmet Öz", city: "Bursa", address: "Nilüfer Mah. Fatih Sultan Mehmet Bulv. No:88, Nilüfer", platform: "Hepsiburada", items: [{ name: "Drone Pervane Seti", qty: 1 }], date: getRelativeDate(30), deadline: getRelativeDate(25), status: "Tamamlandı", total: 80.00, assignedTo: null },
  { id: 105, customer: "Zeynep Kaya", city: "Antalya", address: "Lara Yolu Üzeri, No:15, Muratpaşa", platform: "Trendyol", items: [{ name: "Oyun Hamuru Seti (12 Renk)", qty: 2 }], date: getRelativeDate(1), deadline: getRelativeDate(3), status: "Yeni", total: 240.00, assignedTo: null },
  { id: 106, customer: "Parti Organizasyon Ltd.", city: "İstanbul", address: "Etiler Mah. Nispetiye Cad. No:100, Beşiktaş", platform: "B2B Panel", items: [{ name: "Renkli Balon Paketi (100'lü)", qty: 20 }, { name: "Helyum Tüpü (Kullan-At)", qty: 5 }], date: getRelativeDate(0), deadline: getRelativeDate(2), status: "Hazırlanıyor", total: 5950.00, assignedTo: "Mehmet Demir" },
  { id: 107, customer: "Ali Vural", city: "Adana", address: "Seyhan Mah. Atatürk Cad. No:55, Seyhan", platform: "Hepsiburada", items: [{ name: "Konfetili Balon (Altın)", qty: 10 }], date: getRelativeDate(2), deadline: getRelativeDate(5), status: "Yeni", total: 450.00, assignedTo: null }
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
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-xs md:text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className={`text-xl md:text-2xl font-bold ${alert ? 'text-red-600' : 'text-gray-800'}`}>{value}</h3>
        {subtext && <p className="text-[10px] md:text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className={`p-2 md:p-3 rounded-lg ${alert ? 'bg-red-50 text-red-600' : 'bg-[#BE6A6C]/10 text-[#BE6A6C]'}`}>
          <Icon size={20} className="md:w-6 md:h-6" />
        </div>
        {trend && (
          <span className={`text-[10px] md:text-xs font-bold flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight size={12} className="md:w-[14px] md:h-[14px]" /> : <ArrowDownRight size={12} className="md:w-[14px] md:h-[14px]" />} 
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
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Sipariş #{order.id}</h3>
            <p className="text-sm text-gray-500">{order.date} tarihinde oluşturuldu</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
            <span className="text-2xl font-bold text-[#BE6A6C]">{formatCurrency(order.total)}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <Users size={16} />
                <span className="text-xs font-medium uppercase">Müşteri</span>
              </div>
              <p className="font-semibold text-gray-900">{order.customer}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <MapPin size={16} />
                <span className="text-xs font-medium uppercase">Şehir</span>
              </div>
              <p className="font-semibold text-gray-900">{order.city}</p>
            </div>
            {/* Adres Alanı Eklendi */}
            <div className="col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <MapPin size={16} />
                <span className="text-xs font-medium uppercase">Açık Adres</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm">{order.address || "Adres bilgisi girilmemiş."}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <Store size={16} />
                <span className="text-xs font-medium uppercase">Platform</span>
              </div>
              <p className="font-semibold text-gray-900">{order.platform}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <Calendar size={16} />
                <span className="text-xs font-medium uppercase">Termin</span>
              </div>
              <p className="font-semibold text-gray-900">{order.deadline}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">Sipariş İçeriği</h4>
            <ul className="space-y-3">
              {order.items.map((item: any, index: number) => (
                <li key={index} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition">
                  <img 
                    src={getProductImage(item.name, inventory)} 
                    alt={item.name} 
                    className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                  />
                  <div className="flex-1">
                    <p className="text-gray-800 font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.qty} Adet</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition">Kapat</button>
          <button 
            onClick={() => onEdit(order)} // Düzenle butonuna onEdit bağlandı
            className="px-4 py-2 bg-[#BE6A6C] text-white font-medium rounded-lg hover:bg-[#A15A5B] transition"
          >
            Düzenle
          </button>
        </div>
      </div>
    </div>
  );
}

function SupplyDetailModal({ supply, onClose }: any) {
  if (!supply) return null;

  const steps = [
    { label: 'Sipariş Oluşturuldu', date: supply.orderDate, completed: true, icon: FileText },
    { label: 'Kargoya Verildi', date: '---', completed: ['Kargolandı', 'Yolda', 'Gümrükte', 'Teslim Edildi'].includes(supply.status), icon: Truck },
    { label: 'Gümrük / Transfer', date: '---', completed: ['Gümrükte', 'Teslim Edildi'].includes(supply.status), active: supply.status === 'Gümrükte', icon: Anchor },
    { label: 'Teslim Edildi', date: '---', completed: supply.status === 'Teslim Edildi', icon: CheckCircle2 }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
               <Truck size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{supply.supplier}</h3>
              <p className="text-sm text-gray-500">Tedarikçi Detayı</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
             <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(supply.status)}`}>
              {supply.status}
            </span>
             <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-medium">Tahmini Varış</p>
                <p className="text-gray-900 font-bold">{supply.estimatedArrival}</p>
             </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
             <div>
                <p className="text-xs text-gray-500 mb-1">Kargo Takip No</p>
                <p className="font-mono text-gray-800 font-bold text-lg">{supply.tracking}</p>
             </div>
             <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-[#BE6A6C] hover:border-[#BE6A6C]/30 transition">
                <Copy size={18} />
             </button>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">İçerik</h4>
            <p className="text-gray-800 bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
              {supply.items}
            </p>
          </div>
          <div>
             <h4 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wide">Gönderi Geçmişi</h4>
             <div className="space-y-0 pl-2">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-4 pb-6 last:pb-0 relative">
                     {index !== steps.length - 1 && (
                        <div className={`absolute left-[15px] top-8 bottom-0 w-0.5 ${step.completed ? 'bg-emerald-200' : 'bg-gray-200'}`}></div>
                     )}
                     <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                        step.completed 
                           ? 'bg-emerald-100 border-emerald-500 text-emerald-600' 
                           : step.active 
                              ? 'bg-blue-100 border-blue-500 text-blue-600 animate-pulse'
                              : 'bg-gray-50 border-gray-200 text-gray-300'
                     }`}>
                        <step.icon size={14} />
                     </div>
                     <div className="flex-1 pt-1">
                        <div className="flex justify-between items-start">
                           <h5 className={`font-medium text-sm ${step.completed || step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                              {step.label}
                           </h5>
                           <span className="text-xs text-gray-400 font-mono">{step.date !== '---' ? step.date : ''}</span>
                        </div>
                        {step.active && <p className="text-xs text-blue-600 mt-1 font-medium">Şu an işlem görüyor...</p>}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition">Kapat</button>
        </div>
      </div>
    </div>
  );
}

function LoginPage({ onLogin }: any) {
  // Geliştirme kolaylığı için varsayılan değerler eklendi
  const [email, setEmail] = useState('osibasar@gmail.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock Login Logic
    setTimeout(() => {
      // Osman Bey için özel giriş kontrolü
      if ((email === 'admin@perabalon.com' || email === 'osibasar@gmail.com') && password === '123456') {
        onLogin({
          name: 'Osman BAŞAR',
          role: 'Yönetici',
          email: email,
          phone: '0555 701 00 24',
          initials: 'OB',
          avatarPreview: '/osmanbasarfoto.png' // Giriş yapınca fotoyu otomatik alması için ekledik
        });
      } else {
        setError('Hatalı e-posta veya şifre.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Logo Area */}
        <div className="bg-[#BE6A6C] p-8 text-center">
          <div className="inline-flex p-3 bg-white rounded-xl shadow-lg mb-4">
             <img 
              src="perabalon.png" 
              alt="Pera Balon" 
              className="w-16 h-16 object-contain"
              onError={(e: any) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<div class="w-16 h-16 bg-[#BE6A6C]/20 rounded-lg flex items-center justify-center text-[#BE6A6C] font-bold text-2xl">P</div>';
              }}
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Pera Balon</h1>
          <p className="text-[#FADCDD] text-sm mt-1">Stok & Sipariş Yönetim Paneli</p>
        </div>

        {/* Form Area */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kurumsal E-posta</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#BE6A6C] transition-all outline-none"
                  placeholder="isim@perabalon.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#BE6A6C] transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#BE6A6C] text-white font-bold py-3 rounded-lg hover:bg-[#A15A5B] transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Giriş Yapılıyor...
                </>
              ) : (
                'Güvenli Giriş Yap'
              )}
            </button>
            
            {/* Demo Hint */}
            <div className="text-center text-xs text-gray-400 bg-gray-50 p-2 rounded border border-gray-100 mt-4">
              Geliştirme Modu: Bilgiler otomatik doldurulmuştur.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- GÜNCELLENMİŞ SPLASH SCREEN BİLEŞENİ (MASTERCARD + POP EFFECT) ---

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white overflow-hidden">
      {/* CSS Stillerini burada tanımlıyoruz */}
      <style dangerouslySetInnerHTML={{__html: `
        /* --- CSS ANİMASYON KODLARIMIZ --- */
        svg {
            width: 300px; 
            height: auto;
            overflow: visible;
        }
        @media (min-width: 768px) {
            svg { width: 500px; } 
        }

        /* 1. SARI PARÇA (SOLDAN GELECEK) */
        #sari-balon {
            opacity: 0.9;
            transform-box: fill-box;
            transform-origin: center;
            animation: moveLeft 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        /* 2. PEMBE PARÇA (SAĞDAN GELECEK) */
        #pembe-balon {
            opacity: 0.9;
            transform-box: fill-box;
            transform-origin: center;
            animation: moveRight 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        /* 3. KESİŞİM PARÇASI (ORTADA OLUŞACAK) */
        #kesisim-parcasi {
            opacity: 0;
            transform-box: fill-box;
            transform-origin: center;
            animation: blendReveal 1.5s ease-in-out forwards;
        }

        /* 4. YAZI ANİMASYONU (GELİŞ) */
        #yazi {
            opacity: 0;
            transform: translateY(15px);
            animation: simpleFade 0.8s ease-out forwards 1.2s;
        }

        /* 5. LOGO UÇUŞ VE PATLAMA EFEKTİ (ÇIKIŞ) */
        /* Tüm ikon grubunu sarmalayan kaotik uçuş animasyonu */
        #ikon {
            transform-box: fill-box;
            transform-origin: center;
            /* 2.5s bekler (giriş bitsin diye), sonra 1.2s boyunca uçar, sonra patlar */
            animation: chaoticFly 1.2s ease-in-out forwards 2.5s; 
        }
        
        /* Yazı da logo uçarken hafifçe silinsin */
        #yazi {
            animation: simpleFade 0.8s ease-out forwards 1.2s, fadeOut 0.5s ease-out forwards 3.5s;
        }

        /* 6. BALONCUKLAR (PARTICLES) */
        #particles circle {
            opacity: 0;
            transform: scale(0);
            transform-origin: center;
            /* Hepsi 3.7. saniyede (uçuş bitince) patlasın */
            animation: particlePop 0.6s ease-out forwards 3.6s;
        }

        /* Baloncuklara rastgele yönler verelim */
        #p1 { --tx: -50px; --ty: -50px; }
        #p2 { --tx: 50px; --ty: -50px; }
        #p3 { --tx: -50px; --ty: 50px; }
        #p4 { --tx: 50px; --ty: 50px; }
        #p5 { --tx: 0px; --ty: -80px; }
        #p6 { --tx: 0px; --ty: 80px; }
        #p7 { --tx: -80px; --ty: 0px; }
        #p8 { --tx: 80px; --ty: 0px; }

        /* --- KEYFRAMES --- */

        @keyframes moveLeft {
            0% { transform: translateX(-120px) scale(0.8); opacity: 0; }
            100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes moveRight {
            0% { transform: translateX(120px) scale(0.8); opacity: 0; }
            100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes blendReveal {
            0%, 50% { opacity: 0; transform: scale(0.5); }
            70% { opacity: 0.6; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
        }
        @keyframes simpleFade {
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            to { opacity: 0; transform: scale(0.9); }
        }

        /* Havası kaçan balon gibi titrek uçuş */
        @keyframes chaoticFly {
            0% { transform: translate(0,0) scale(1); }
            20% { transform: translate(-10px, -20px) rotate(-5deg) scale(0.95); }
            40% { transform: translate(15px, 10px) rotate(5deg) scale(0.9); }
            60% { transform: translate(-20px, 5px) rotate(-10deg) scale(0.85); }
            80% { transform: translate(10px, -15px) rotate(5deg) scale(0.8); opacity: 1; }
            95% { transform: translate(0, 0) scale(1.2); opacity: 1; } /* Şişme efekti */
            100% { transform: scale(1.5); opacity: 0; } /* PATLAMA! */
        }

        /* Baloncukların dağılması */
        @keyframes particlePop {
            0% { transform: translate(0,0) scale(0); opacity: 1; }
            100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0; }
        }
      `}} />

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 651.97 831.36">
        <defs>
            <style>{`.cls-1{fill:#bf5359;}.cls-2{fill:#f4ad91;}.cls-3{fill:#71a19c;}.cls-4{fill:#df7848;}.cls-5{fill:#2c7fae;}.cls-6{fill:#f1b04e;}`}</style>
        </defs>
        
        {/* YAZI GRUBU */}
        <g id="yazi">
            <path className="cls-1" d="M22.63,663.4Q8.11,663.4,4,663c-.85-2.25-1.26-7.4-1.26-15.42q0-16.9,1.57-99.69.95-31.05,1.58-35.7,16.4-3.79,44.16-3.8,39.11,0,57.24,13.2T125.45,562q0,28.1-17.66,44.56T53.85,623.69q-.32,1.9.32,38.65Q47.86,663.41,22.63,663.4ZM54.8,591q11,0,17-6.54t6-18.8q0-24.08-17.66-24.08a56.21,56.21,0,0,0-5.68.21c0,2.4-.11,5.92-.31,10.56s-.32,8.66-.32,12Q53.85,580.81,54.8,591Z"/>
            <path className="cls-2" d="M219.16,665.09q-31.54,0-41.95-.64Q176,651.15,176,634.67q0-100.11,2.52-120Q188.57,513,233,513q3.15,0,9.77.1t16.25.32q9.62.21,14.35.21,1.89,2.75,1.89,12,0,12-1.89,17.11-3.17,0-8.83.1l-10.41.21c-3.16.08-6.21.18-9.15.32q-9.47.44-13.87.85-2.22,4.65-2.21,16.26a77.39,77.39,0,0,0,.94,14.15c1.9,0,4.58,0,8.05-.11s6-.1,7.72-.1h15.77q1.9,3.6,1.9,11.83,0,14.15-3.16,17.74a302.36,302.36,0,0,1-30.59,1.27v11.82q0,15.84,1.58,18.38a62.23,62.23,0,0,0,10.72.63q21.76,0,31.85-.63a10.79,10.79,0,0,1,.32,3q0,22-3.47,25.13Q265.2,665.08,219.16,665.09Z"/>
            <path className="cls-3" d="M434.61,608.06a299.29,299.29,0,0,1,19.24,26.3q11.36,17,17.35,27.77-8.2,2.11-35.32,2.11-6.94,0-19.56-.42-24.6-36.54-33.43-45.2a26.52,26.52,0,0,1-3.47.21v23q0,17.73.31,21.12-4.73,1.68-32.48,1.69-12.94,0-18-1.27-.64-8.65-.63-60.62,0-14.56,1.26-88.5,6-1.89,30.12-3.48t34.54-1.58q35.31,0,52.83,11.51t17.5,38.12a54.71,54.71,0,0,1-7.72,27.88A56.38,56.38,0,0,1,434.61,608.06Zm-56.45-48.37a248.24,248.24,0,0,0,1.57,30.42q15.15,0,24.61-8.77T413.8,561q0-9.71-6-15.94t-18.6-6.24a32.42,32.42,0,0,0-9.15,1.06Q378.16,546.4,378.16,559.69Z"/>
            <path className="cls-4" d="M614.12,513.23q12,35.7,23,82.16T652,662.55q-4.74,1.69-48.57,1.69a42.69,42.69,0,0,1-5-.21,185.74,185.74,0,0,0-4.73-26.19q-10.73,1.27-36.27.85-3.79,19.63-5.37,25.76a39.66,39.66,0,0,1-6.94.43q-36.58,0-42.26-1.27l11.67-45.94q9.15-36,15.3-58.82t13.72-45.62q5.35-1.91,24-1.9Q605.28,511.33,614.12,513.23Zm-50.78,94.83q7.88,0,13.24-.21,9.15-.42,12.62-.84-6.94-35.07-7.88-41.19c-.85-5.49-1.79-8.38-2.84-8.66a1.74,1.74,0,0,0-1-.21q-2.52,0-4.41,8.66Z"/>
            <path className="cls-3" d="M39.91,830.44q-25.69,0-37.45-1.83Q1.1,803,.55,777.18,0,763.44,0,734.16q0-21.78,2.19-34.6Q32.25,695,51.12,695q53.57,0,53.57,35,0,19.21-19.4,30.39,23,6.95,23,28.73,0,22.33-16.81,31.86T39.91,830.44ZM48.11,753Q56,753,60,747.34a22.46,22.46,0,0,0,4-13.18,12.82,12.82,0,0,0-2.6-8.33,8.26,8.26,0,0,0-6.7-3.2q-7.38,0-11.21,1.28Q42.1,738,42.1,745.33v7.13A21.67,21.67,0,0,0,48.11,753Zm-3,54.92a32,32,0,0,0,12.58-4.4q8.19-4.75,8.2-13.91,0-11.89-8.2-12.81a37.32,37.32,0,0,0-13.12,1.1A51,51,0,0,0,43.19,790,79.55,79.55,0,0,0,45.1,807.93Z"/>
            <path className="cls-4" d="M218.44,698.46q10.38,30.94,19.95,71.21t12.85,58.21q-4.1,1.47-42.1,1.47a36.85,36.85,0,0,1-4.37-.19,161,161,0,0,0-4.1-22.7q-9.3,1.11-31.44.74-3.27,17-4.64,22.33a36,36,0,0,1-6,.36q-31.71,0-36.63-1.09L132.06,789q7.92-31.2,13.26-51t11.89-39.54q4.64-1.63,20.77-1.64Q210.79,696.82,218.44,698.46Zm-44,82.19q6.82,0,11.48-.18c5.28-.24,8.93-.49,10.93-.73q-6-30.39-6.83-35.7c-.73-4.76-1.55-7.25-2.46-7.5a1.51,1.51,0,0,0-.82-.18c-1.46,0-2.73,2.5-3.83,7.5Z"/>
            <path className="cls-1" d="M298.56,829.71q-16.14,0-21.87-.91-1.1-9.88-1.37-21.15t0-28.37q.27-17.12.27-21.32,0-4.4-.27-18.22t0-23.06q.27-9.24,1.09-18.22,2.19-1.1,20-1.09,27.88,0,31.43.55-.54,41-.54,61.32,0,34.05,1.36,43.75.83.18,9.84.54,3.82.19,12.17-.09c5.56-.18,9.24-.27,11.07-.27v4.76q0,12.63-2.46,19.22Q351.3,829.72,298.56,829.71Z"/>
            <path className="cls-2" d="M435.8,831.36q-17.76,0-31.43-9.15T384,800.06a57.78,57.78,0,0,1-6.69-26.73q0-80.36,64.24-80.36,15.84,0,27.47,3.85t18.58,10.07a43.85,43.85,0,0,1,11.08,15.92,77.54,77.54,0,0,1,5.46,19.59,170.59,170.59,0,0,1,1.37,23.06q0,30-17.09,48T435.8,831.36Zm4.38-29.29q9,0,12.85-13.64a100.23,100.23,0,0,0,3.82-27.18c0-3.41-.18-7-.54-10.8A125.46,125.46,0,0,0,454.39,738a28.69,28.69,0,0,0-4.51-11.16c-2.09-2.93-4.6-4.4-7.51-4.4q-16.68,0-16.68,45.4Q425.69,802.07,440.18,802.07Z"/>
            <path className="cls-5" d="M547.08,828.43c-7.1,0-11.39-.18-12.84-.55q-1.1-9.51-1.1-36.24,0-55.1,1.64-92.08,14.22-2.74,42.65-2.19,1.08,2.93,4.64,11.44t6.43,15.74q2.87,7.23,6.28,15t6,12.36q2.6,4.58,4,4.57,1.9,0,1.91-4.39,0-7.5.55-25.63t.28-29.1a95.89,95.89,0,0,1,14.21-.74q18.59,0,22.41,1.1V716.4q0,46-1.91,110.38-6,1.29-28.15,1.28a74.76,74.76,0,0,1-8.75-.36q-4.65-7.32-13.4-22.43t-14.35-24.16q-5.59-9.06-7-9.06-1.64,0-1.64,8.42,0,7.14.41,23.61t.41,23.62Q566.5,828.44,547.08,828.43Z"/>
        </g>
        
        {/* İKON GRUBU (Parçalı) */}
        <g id="ikon">
            {/* Sarı Parça */}
            <path id="sari-balon" className="cls-6" d="M381.87,295.93c3.41,25.66,2.81,51.46,1.87,77.2-.36,9.82-1.1,19.85-4.85,29.31C372,419.75,358.23,425.68,341,418.39c-16-6.76-29.48-17.53-43-28.05-33.39-25.94-63.8-55.33-95.55-83.17q-36.88-32.34-73.26-65.26c-17.21-15.56-35.23-30.29-50.69-47.67-16.91-19-31-39.54-36.73-65.11-6.05-26.89.09-50.82,16.65-71.88C80.18,29.5,110.21,15.14,144.05,7.37a160.25,160.25,0,0,1,62.37-2.21,119.59,119.59,0,0,1,40.71,14.47c26.13,15.08,45.72,36.73,62.08,61.63a2.49,2.49,0,0,1,1.49,3.32,293.74,293.74,0,0,0-31.12,85.8c-5.07,26.14-8.48,52.57-7.05,79.27.82,15.31,1.83,30.72,6.29,45.58,2.95,9.82,6.68,19.27,13.64,27,10,11.24,23.23,13.7,36.7,6.78a122.56,122.56,0,0,0,17.21-11.24c9.32-7,19.44-12.8,28.45-20.22,1.74-1.43,3.68-2.8,6.23-2.24Z"/>
            
            {/* Pembe Parça */}
            <path id="pembe-balon" className="cls-2" d="M310.31,83.68c-.36-.81-.73-1.61-1.1-2.42,7.17-6.76,11.12-15.87,17.19-23.48C350.21,28,379.83,7.42,418,1.65c38.39-5.8,73.37,3.74,104.1,27.41,24.92,19.19,41.47,44.13,46.25,75.58,4,26.14-3.68,49.27-21.42,68.94-11.9,13.2-26.21,23.54-40.6,33.77q-38,27-76,53.93c-14,9.92-28.19,19.67-42.25,29.56-2.2,1.54-4.19,3.38-6.28,5.09l-.6.07c-2.48-5.37-2.83-11.26-3.62-16.95-3.8-27.44-10.6-54.16-18.63-80.61-9.3-30.68-21.74-60.09-35.43-89-3.29-6.93-7.8-13.23-11.34-20.06C311.31,87.58,309.72,86,310.31,83.68Z"/>
            
            {/* Kesişim Parçası */}
            <path id="kesisim-parcasi" className="cls-4" d="M310.31,83.68c9.89,13.67,16.73,29,23.86,44.15a516.84,516.84,0,0,1,24.05,61.83c9.31,28.94,17.24,58.26,21,88.53.75,5.93,3.13,11.67,2,17.81-11.21,7.76-22.3,15.68-33.65,23.22-8.2,5.45-15.66,12-25.73,14.53-16.14,4.07-28.51-4.71-35.6-16.41C276,300.41,272.91,281.44,271.67,262c-.59-9.32-1.58-18.61-1.18-28,1.59-36.76,6.65-72.83,19.5-107.62,5-13.42,10.92-26.3,17-39.19A7.58,7.58,0,0,1,310.31,83.68Z"/>
        </g>

        {/* PARÇACIKLAR (PATLAMA EFEKTİ İÇİN GİZLİ DAİRELER) */}
        <g id="particles" transform="translate(325, 415)"> {/* İkonun merkezi civarı */}
            <circle id="p1" r="10" fill="#bf5359" />
            <circle id="p2" r="8" fill="#f4ad91" />
            <circle id="p3" r="12" fill="#df7848" />
            <circle id="p4" r="6" fill="#f1b04e" />
            <circle id="p5" r="9" fill="#2c7fae" />
            <circle id="p6" r="7" fill="#bf5359" />
            <circle id="p7" r="11" fill="#f4ad91" />
            <circle id="p8" r="5" fill="#df7848" />
        </g>
      </svg>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  const [isLoadingApp, setIsLoadingApp] = useState(true); // Splash Screen State

  // Splash Screen Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingApp(false);
    }, 4500); // SÜREYİ ARTTIRDIK: 4.5 sn (Animasyonun tamamlanması için)
    return () => clearTimeout(timer);
  }, []);

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
    // Giriş yapınca menünün kapalı olduğundan emin ol
    setIsSidebarOpen(false); 
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

  // --- RENDER LOGIC ---

  // 1. Splash Screen Kontrolü
  if (isLoadingApp) {
    return <SplashScreen />;
  }

  // 2. Login Kontrolü
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
                    const isUrgent = daysLeft <= 2;
                    return (
                      <div key={order.id} className={`flex items-center justify-between p-3 rounded-lg border ${isUrgent ? 'bg-yellow-50 border-yellow-100' : 'bg-gray-50 border-gray-100'}`}>
                        <div>
                          <p className="font-medium text-gray-800">{order.customer}</p>
                          <p className="text-xs text-gray-500">Sorumlu: {order.assignedTo || 'Atanmadı'}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${isUrgent ? 'text-orange-600' : 'text-gray-600'}`}>
                            {new Date(order.deadline).toLocaleDateString('tr-TR', {day: 'numeric', month: 'short'})}
                          </p>
                          <p className="text-xs text-gray-500">{daysLeft} gün kaldı</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'inventory':
        const filteredInventory = inventory.filter(item => {
          if (inventoryFilter === 'Tümü') return true;
          if (inventoryFilter === 'Kritik Stok') return item.stock <= item.safetyStock;
          return item.category === inventoryFilter;
        });
        const categories = ['Tümü', 'Kritik Stok', ...new Set(inventory.map(i => i.category))];
        return (
          <div className="space-y-6 pb-24 md:pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Stok Yönetimi</h2>
              <div className="flex items-center gap-3">
                 <FilterGroup options={categories} activeFilter={inventoryFilter} onFilterChange={setInventoryFilter} />
                <button 
                  onClick={() => handleOpenProductModal()}
                  className="bg-[#BE6A6C] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#A15A5B] transition shadow-sm whitespace-nowrap"
                >
                  <Plus size={18} /> Yeni Ürün
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-visible">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 font-medium text-gray-500 text-sm">Ürün</th>
                    <th className="p-4 font-medium text-gray-500 text-sm">Kategori</th>
                    <th className="p-4 font-medium text-gray-500 text-sm">Stok</th>
                    <th className="p-4 font-medium text-gray-500 text-sm">Alış/Satış</th>
                    <th className="p-4 font-medium text-gray-500 text-sm">Durum</th>
                    <th className="p-4 font-medium text-gray-500 text-sm text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInventory.map(item => {
                    const isLow = item.stock <= item.safetyStock;
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition relative">
                        <td className="p-4 flex items-center gap-3">
                          <img src={item.image} alt="" className="w-10 h-10 rounded object-cover bg-gray-100" />
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-400">{item.sku}</p>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{item.category}</td>
                        <td className="p-4"><span className={`font-mono font-bold ${isLow ? 'text-red-600' : 'text-gray-700'}`}>{item.stock}</span></td>
                        <td className="p-4 text-sm"><div className="flex flex-col"><span className="text-gray-900 font-medium">{formatCurrency(item.price)}</span><span className="text-gray-400 text-xs">Maliyet: {formatCurrency(item.cost)}</span></div></td>
                        <td className="p-4">
                          {isLow ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-medium border border-red-200"><AlertTriangle size={12} /> Kritik</span> : <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium border border-green-200"><CheckCircle2 size={12} /> İyi</span>}
                        </td>
                        <td className="p-4 text-right relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuRowId(openMenuRowId === item.id ? null : item.id);
                            }}
                            className="text-gray-400 hover:text-[#BE6A6C] p-2 rounded-full hover:bg-gray-100"
                          >
                            <MoreVertical size={18} />
                          </button>
                          
                          {openMenuRowId === item.id && (
                            <div className="absolute right-8 top-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenProductModal(item);
                                  setOpenMenuRowId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Edit size={14} /> Düzenle
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteProductInit(item);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 size={14} /> Sil
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredInventory.length === 0 && <div className="p-8 text-center text-gray-500">Bu filtreye uygun ürün bulunamadı.</div>}
            </div>
          </div>
        );

      case 'orders':
        const filteredOrders = orders.filter(order => {
          if (orderFilter === 'Tümü') return true;
          return order.status === orderFilter;
        });
        const filterOptions = ['Tümü', 'Yeni', 'Hazırlanıyor', 'Kargolandı', 'Tamamlandı'];
        return (
          <div className="space-y-6 pb-24 md:pb-0">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Siparişler</h2>
              <div className="flex items-center gap-3">
                <FilterGroup options={filterOptions} activeFilter={orderFilter} onFilterChange={setOrderFilter} />
                <button 
                  onClick={() => handleOpenOrderModal()} // Düzenleme için parametresiz çağrı (yeni sipariş)
                  className="bg-[#BE6A6C] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#A15A5B] transition shadow-sm whitespace-nowrap"
                >
                  <Plus size={18} /> <span className="hidden sm:inline">Yeni Sipariş</span>
                </button>
              </div>
            </div>
            <div className="grid gap-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                  <Filter size={20} className="text-gray-400 mx-auto mb-3" />
                  <h3 className="text-gray-900 font-medium">Sipariş Bulunamadı</h3>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div key={order.id} onClick={() => setSelectedOrder(order)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer hover:border-[#BE6A6C]/30 hover:shadow-md transition group">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <img src={getProductImage(order.items[0].name, inventory)} alt="product" className="w-16 h-16 rounded-lg object-cover border border-gray-100 bg-gray-50" />
                        {order.items.length > 1 && <div className="absolute -bottom-2 -right-2 bg-gray-800 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">+{order.items.length - 1}</div>}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-gray-900 group-hover:text-[#BE6A6C] transition">#{order.id}</span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>{order.status}</span>
                        </div>
                        <p className="text-gray-800 font-medium">{order.customer}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1"><span className="flex items-center gap-1"><Store size={14} /> {order.platform}</span><span className="flex items-center gap-1"><Calendar size={14} /> {order.deadline}</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0">
                      <span className="font-bold text-lg text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">{formatCurrency(order.total)}</span>
                      <div className="flex flex-col md:items-end w-full">
                        <select className="text-sm border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:border-[#BE6A6C] w-full md:w-48" value={order.assignedTo || ""} onClick={(e) => e.stopPropagation()} onChange={(e) => handleAssign(e, order.id)}>
                          <option value="">Atanmadı</option>
                          {users.filter(u => u.role !== 'Yönetici').map(u => (<option key={u.id} value={`${u.name}`}>{u.name}</option>))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'finance':
        // ... (finance rendering remains same)
        return (
          <div className="space-y-6 pb-24 md:pb-0">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Finansal Veriler</h2>
              <div className="flex items-center gap-3">
                 <FilterGroup options={['Günlük', 'Aylık', 'Yıllık']} activeFilter={financePeriod} onFilterChange={setFinancePeriod} />
                <div className="h-6 w-px bg-gray-300 mx-1 hidden md:block"></div>
                <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                   <button onClick={() => setFinanceSubTab('products')} className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${financeSubTab === 'products' ? 'bg-[#BE6A6C]/20 text-[#8E4D4F]' : 'text-gray-600 hover:bg-gray-50'}`}>Ürün Bazlı</button>
                   <button onClick={() => setFinanceSubTab('cities')} className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${financeSubTab === 'cities' ? 'bg-[#BE6A6C]/20 text-[#8E4D4F]' : 'text-gray-600 hover:bg-gray-50'}`}>Şehir</button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card title={`${financePeriod} Ciro`} value={formatCurrency(financials.totalRevenue)} icon={TrendingUp} trend="up" subtext="Toplam Satış" />
              <Card title={`${financePeriod} Maliyet`} value={formatCurrency(financials.totalCost)} icon={Package} alert={true} subtext="Satılan Ürün Maliyeti" />
              <Card title={`${financePeriod} Net Kâr`} value={formatCurrency(financials.profit)} icon={Wallet} trend="up" subtext="Brüt Kâr" />
            </div>
            {financeSubTab === 'products' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center"><h3 className="font-bold text-gray-800">Ürün Kârlılık Analizi ({financePeriod})</h3></div>
                {Object.keys(financials.productSales).length === 0 ? <div className="p-8 text-center text-gray-500">Bu dönemde satış verisi bulunamadı.</div> : (
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="p-4">Ürün Adı</th><th className="p-4">Tedarikçi</th><th className="p-4 text-right">Satış Adedi</th><th className="p-4 text-right">Birim Alış</th><th className="p-4 text-right">Birim Satış</th><th className="p-4 text-right">Toplam Kâr</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {Object.entries(financials.productSales).map(([name, data]: any) => (
                        <tr key={name} className="hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-900 flex items-center gap-2"><img src={getProductImage(name, inventory)} className="w-8 h-8 rounded bg-gray-100 object-cover" alt="" />{name}</td>
                          <td className="p-4 text-sm text-gray-600">{data.supplier}</td>
                          <td className="p-4 text-right font-mono">{data.sales}</td>
                          <td className="p-4 text-right text-gray-600">{formatCurrency(data.costPrice)}</td>
                          <td className="p-4 text-right text-gray-900">{formatCurrency(data.sellPrice)}</td>
                          <td className="p-4 text-right font-bold text-green-600">+{formatCurrency(data.profit)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            {financeSubTab === 'cities' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                   <h3 className="font-bold text-gray-800 mb-4">Şehir Bazlı Satışlar ({financePeriod})</h3>
                   <div className="space-y-4">
                      {Object.keys(financials.citySales).length === 0 ? <p className="text-gray-500 text-sm">Veri yok.</p> : Object.entries(financials.citySales).map(([city, total]: any) => (
                          <div key={city} className="flex items-center justify-between">
                            <div className="flex items-center gap-3"><div className="p-2 bg-[#BE6A6C]/10 text-[#BE6A6C] rounded-lg"><MapPin size={18} /></div><span className="font-medium text-gray-700">{city}</span></div>
                            <span className="font-bold text-gray-900">{formatCurrency(total)}</span>
                          </div>
                      ))}
                   </div>
                </div>
                 <div className="bg-[#8E4D4F] rounded-xl shadow-sm p-6 text-white flex flex-col justify-between">
                   <div><h3 className="font-bold text-xl mb-2">Finansal İpucu</h3><p className="text-[#FADCDD] text-sm">Günlük verilere baktığımızda, sabah saatlerinde gelen siparişlerin kargolanma hızı müşteri memnuniyetini %20 artırıyor.</p></div>
                   <div className="mt-6 flex items-center gap-2 text-sm font-medium"><Wallet size={18} /><span>Detaylı Rapor İndir</span></div>
                </div>
              </div>
            )}
          </div>
        );

      case 'supplies':
        // ... (supplies rendering remains same)
        const filteredSupplies = INITIAL_SUPPLIES.filter(supply => {
           if (supplyFilter === 'Tümü') return true;
           return supply.status === supplyFilter;
        });
        const supplyOptions = ['Tümü', 'Hazırlanıyor', 'Gümrükte', 'Teslim Edildi'];
        return (
          <div className="space-y-6 pb-24 md:pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Tedarik Zinciri</h2>
              <div className="flex items-center gap-3">
                 <FilterGroup options={supplyOptions} activeFilter={supplyFilter} onFilterChange={setSupplyFilter} />
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition shadow-sm whitespace-nowrap"><Plus size={18} /> Tedarik Siparişi Gir</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSupplies.map(supply => (
                <div key={supply.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-full hover:shadow-md transition">
                  <div>
                    <div className="flex justify-between items-start mb-4"><div className="flex items-center gap-2"><Truck size={20} className="text-gray-400" /><h3 className="font-bold text-gray-800">{supply.supplier}</h3></div><span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(supply.status)}`}>{supply.status}</span></div>
                    <p className="text-gray-600 text-sm mb-2">{supply.items}</p>
                    <div className="bg-gray-50 p-2 rounded text-xs text-gray-500 font-mono mb-4 border border-gray-100">Takip No: {supply.tracking}</div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-400 pt-4 border-t border-gray-50">
                    <span>Sipariş: {supply.orderDate}</span>
                    <button onClick={() => setSelectedSupply(supply)} className="text-[#BE6A6C] font-medium hover:underline flex items-center gap-1">Detay Gör</button>
                  </div>
                </div>
              ))}
              {filteredSupplies.length === 0 && <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200 border-dashed">Bu filtreye uygun tedarik kaydı yok.</div>}
            </div>
          </div>
        );

      case 'users':
        // ... (users rendering remains same)
        return (
          <div className="space-y-6 pb-24 md:pb-0">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Ekip ve Kullanıcılar</h2>
              <button 
                onClick={() => handleOpenUserModal()} 
                className="bg-[#BE6A6C] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#A15A5B] transition shadow-sm"
              >
                <Plus size={18} /> Yeni Kullanıcı
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map(u => (
                <div key={u.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative group hover:shadow-md transition">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenUserModal(u)}
                      className="text-gray-400 hover:text-[#BE6A6C] p-1"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(u.id!)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#BE6A6C] to-[#A15A5B] flex items-center justify-center text-2xl font-bold text-white mb-4 overflow-hidden border-4 border-white shadow-lg">
                    {u.avatarPreview ? (
                      <img src={u.avatarPreview} alt={u.name} className="w-full h-full object-cover" />
                    ) : (
                      u.initials
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{u.name}</h3>
                  <p className="text-sm text-[#BE6A6C] font-medium mb-4">{u.role}</p>
                  
                  <div className="w-full space-y-3 pt-4 border-t border-gray-50">
                     <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Mail size={16} className="text-gray-400" />
                        <span>{u.email || 'E-posta yok'}</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Phone size={16} className="text-gray-400" />
                        <span>{u.phone || 'Telefon yok'}</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'profile':
        // ... (profile rendering remains same)
        return (
          <div className="space-y-6 pb-24 md:pb-0">
            <h2 className="text-2xl font-bold text-gray-800">Profil Ayarları</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                 <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#BE6A6C] to-[#A15A5B] flex items-center justify-center text-2xl font-bold text-white shadow-md">
                    {user.name.split(' ').map((n: string) => n[0]).join('')}
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                    <p className="text-gray-500">{user.role}</p>
                 </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi</label>
                    <input type="text" value={user.email} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yetki Seviyesi</label>
                    <input type="text" value={user.role} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" />
                 </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4"><Lock size={20} /></div>
                  <h4 className="font-bold text-gray-800 mb-2">Güvenlik</h4>
                  <p className="text-sm text-gray-500 mb-4">Şifre ve güvenlik ayarlarınızı yönetin.</p>
                  <button 
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="text-[#BE6A6C] text-sm font-medium hover:underline"
                  >
                    Şifre Değiştir
                  </button>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4"><Bell size={20} /></div>
                  <h4 className="font-bold text-gray-800 mb-2">Bildirimler</h4>
                  <p className="text-sm text-gray-500 mb-4">E-posta ve anlık bildirim tercihleri.</p>
                  <button 
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="text-[#BE6A6C] text-sm font-medium hover:underline"
                  >
                    Ayarları Yapılandır
                  </button>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4"><Shield size={20} /></div>
                  <h4 className="font-bold text-gray-800 mb-2">Gizlilik</h4>
                  <p className="text-sm text-gray-500 mb-4">Hesap gizlilik ve veri ayarları.</p>
                  <button 
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="text-[#BE6A6C] text-sm font-medium hover:underline"
                  >
                    İncele
                  </button>
               </div>
               {/* Yeni Eklenen: Verileri Sıfırla Butonu (Acil Durum) */}
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-3">
                   <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mb-4"><Database size={20} /></div>
                  <h4 className="font-bold text-gray-800 mb-2">Veri Yönetimi</h4>
                  <p className="text-sm text-gray-500 mb-4">Uygulama üzerindeki tüm sipariş, stok ve kullanıcı verilerini sıfırlar. Bu işlem geri alınamaz.</p>
                  <button 
                    onClick={handleResetData}
                    className="text-red-600 text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Tüm Verileri Sıfırla
                  </button>
               </div>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800 relative overflow-hidden">
      {/* Toast Bildirim */}
      {toast && (
        <Toast 
          message={toast} 
          onClose={() => setToast(null)} 
        />
      )}

      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          onEdit={() => {
            handleOpenOrderModal(selectedOrder);
            setSelectedOrder(null);
          }}
          inventory={inventory} // inventory prop added
        />
      )}
      
      {selectedSupply && <SupplyDetailModal supply={selectedSupply} onClose={() => setSelectedSupply(null)} />}
      {isUserModalOpen && <UserFormModal onClose={() => setIsUserModalOpen(false)} onSave={handleSaveUser} user={editingUser} />}
      {isProductModalOpen && <ProductFormModal onClose={() => setIsProductModalOpen(false)} onSave={handleSaveProduct} product={editingProduct} />}
      {isOrderModalOpen && <OrderFormModal onClose={() => setIsOrderModalOpen(false)} onSave={handleSaveOrder} inventory={inventory} users={users} order={editingOrder} />}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={!!productToDelete} 
        onClose={() => setProductToDelete(null)} 
        onConfirm={confirmDeleteProduct}
        itemName={productToDelete?.name}
      />

      {/* Profil Modalları */}
      {isPasswordModalOpen && <ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} />}
      {isSettingsModalOpen && <NotificationSettingsModal onClose={() => setIsSettingsModalOpen(false)} />}
      {isPrivacyModalOpen && <PrivacySettingsModal onClose={() => setIsPrivacyModalOpen(false)} />}
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-20 lg:w-64 bg-white border-r border-gray-200 flex-col justify-between z-10 h-full">
        <div>
          <div className="p-6 flex items-center gap-3">
            <img src="perabalon.png" alt="Pera Balon" className="w-10 h-10 object-contain rounded-lg" onError={(e: any) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<div class="w-10 h-10 bg-[#BE6A6C] rounded-lg flex items-center justify-center text-white font-bold shadow-[#BE6A6C]/40 shadow-lg">P</div><span class="font-bold text-xl hidden lg:block text-gray-800 ml-3">Pera Balon</span>'; }} />
            <span className="font-bold text-xl hidden lg:block text-gray-800">Pera Balon</span>
          </div>
          <nav className="px-3 space-y-2 mt-4">
            {/* BURADA LayoutDashboard YERİNE LOGO RESMİNİ KOYUYORUZ */}
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-[#BE6A6C]/10 text-[#BE6A6C] font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
              <img src="/perabalon.png" alt="Ana Sayfa" className="w-5 h-5 object-contain" />
              <span className="hidden lg:block">Ana Sayfa</span>
            </button>

            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${activeTab === 'orders' ? 'bg-[#BE6A6C]/10 text-[#BE6A6C] font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}><ShoppingCart size={20} /><span className="hidden lg:block">Siparişler</span></button>
            <button onClick={() => setActiveTab('inventory')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${activeTab === 'inventory' ? 'bg-[#BE6A6C]/10 text-[#BE6A6C] font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}><Package size={20} /><span className="hidden lg:block">Stok & Ürün</span></button>
            <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${activeTab === 'finance' ? 'bg-[#BE6A6C]/10 text-[#BE6A6C] font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}><PieChart size={20} /><span className="hidden lg:block">Finans</span></button>
            <button onClick={() => setActiveTab('supplies')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${activeTab === 'supplies' ? 'bg-[#BE6A6C]/10 text-[#BE6A6C] font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}><Truck size={20} /><span className="hidden lg:block">Tedarik</span></button>
            <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${activeTab === 'users' ? 'bg-[#BE6A6C]/10 text-[#BE6A6C] font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}><Users size={20} /><span className="hidden lg:block">Ekip</span></button>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100">
          <div onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition mb-2 ${activeTab === 'profile' ? 'bg-[#BE6A6C]/10 border border-[#BE6A6C]/20' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#BE6A6C] to-[#A15A5B] flex items-center justify-center text-xs font-bold text-white shadow-sm overflow-hidden">
                {user.avatarPreview ? (
                  <img src={user.avatarPreview} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={16} />
                )}
            </div>
            <div className="hidden lg:block"><p className="text-sm font-medium text-gray-700">{user.name}</p><p className="text-xs text-gray-400">{user.role}</p></div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={20} />
            <span className="hidden lg:block text-sm font-medium">Çıkış Yap</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-50 shadow-lg pb-safe">
        {/* BURADA DA LayoutDashboard YERİNE LOGO RESMİNİ KOYUYORUZ */}
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-[#BE6A6C]' : 'text-gray-400'}`}>
          <img src="/perabalon.png" alt="Ana Sayfa" className="w-6 h-6 object-contain" />
          <span className="text-[10px] font-medium">Ana Sayfa</span>
        </button>

        <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-1 ${activeTab === 'orders' ? 'text-[#BE6A6C]' : 'text-gray-400'}`}>
          <ShoppingCart size={24} />
          <span className="text-[10px] font-medium">Sipariş</span>
        </button>
        <button onClick={() => setActiveTab('inventory')} className={`flex flex-col items-center gap-1 ${activeTab === 'inventory' ? 'text-[#BE6A6C]' : 'text-gray-400'}`}>
          <Package size={24} />
          <span className="text-[10px] font-medium">Stok</span>
        </button>
        <button onClick={() => setActiveTab('finance')} className={`flex flex-col items-center gap-1 ${activeTab === 'finance' ? 'text-[#BE6A6C]' : 'text-gray-400'}`}>
          <PieChart size={24} />
          <span className="text-[10px] font-medium">Finans</span>
        </button>
         <button onClick={() => setIsSidebarOpen(true)} className={`flex flex-col items-center gap-1 text-gray-400`}>
          <Menu size={24} />
          <span className="text-[10px] font-medium">Menü</span>
        </button>
      </nav>

      {/* Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60] flex md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative bg-white w-64 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ml-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <span className="font-bold text-xl text-gray-800">Menü</span>
               <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-200 rounded-full"><X size={24} /></button>
            </div>
            <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                <button onClick={() => { setActiveTab('supplies'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-lg ${activeTab === 'supplies' ? 'bg-[#BE6A6C]/10 text-[#BE6A6C]' : 'text-gray-600'}`}>
                  <Truck size={20} /> <span className="font-medium">Tedarik Zinciri</span>
                </button>
                <button onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-lg ${activeTab === 'users' ? 'bg-[#BE6A6C]/10 text-[#BE6A6C]' : 'text-gray-600'}`}>
                  <Users size={20} /> <span className="font-medium">Ekip</span>
                </button>
                <div className="h-px bg-gray-100 my-2"></div>
                <button onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-lg ${activeTab === 'profile' ? 'bg-[#BE6A6C]/10 text-[#BE6A6C]' : 'text-gray-600'}`}>
                  <User size={20} /> <span className="font-medium">Profilim</span>
                </button>
            </nav>
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-50 font-medium">
                <LogOut size={20} /> Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/50">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shrink-0 relative">
          <div className="flex items-center bg-gray-100/50 px-3 py-2 rounded-lg w-full max-w-[200px] md:max-w-[240px] border border-transparent focus-within:border-[#BE6A6C]/50 focus-within:bg-white focus-within:shadow-sm transition-all duration-200">
             <Search size={18} className="text-gray-400 shrink-0" />
             <input type="text" placeholder="Ara..." className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full placeholder-gray-400" />
          </div>

          <div className="flex items-center gap-3">
             {/* Mobile Profile Icon */}
            <div className="md:hidden w-8 h-8 rounded-full bg-gradient-to-tr from-[#BE6A6C] to-[#A15A5B] flex items-center justify-center text-xs font-bold text-white shadow-sm overflow-hidden" onClick={() => setIsSidebarOpen(true)}>
               {user.avatarPreview ? (
                  <img src={user.avatarPreview} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={16} />
                )}
            </div>
            
             {/* Desktop Profile Icon (Replaces Bell) */}
             <div className="hidden md:flex w-9 h-9 rounded-full bg-gray-100 border border-gray-200 items-center justify-center overflow-hidden">
               {user.avatarPreview ? (
                  <img src={user.avatarPreview} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={18} className="text-gray-500" />
                )}
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 scroll-smooth">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}