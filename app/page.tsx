import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Bell, 
  Search, 
  Plus, 
  AlertTriangle,
  MoreVertical,
  Calendar,
  PieChart,
  Wallet,
  LogOut,
  User,
  Menu,
  Database,
  Sparkles,
  MessageSquare,
  Lightbulb,
  X,
  Send,
  Loader2,
  Copy,
  Check,
  Instagram,
  Share2,
  TrendingUp,
  Mail,
  Megaphone
} from 'lucide-react';

// --- GEMINI API AYARLARI ---
const apiKey = ""; // API anahtarı çalışma zamanında sağlanır

// --- TEMA VE RENKLER ---
const THEME = {
  primary: '#BE6A6C',
  primaryDark: '#A15A5B',
  secondary: '#FDF2F2',
  textMain: '#1F2937',
  textLight: '#6B7280'
};

// --- MOCK VERİLER ---
const DASHBOARD_STATS = [
  { title: 'Toplam Satış', value: '₺124.500', trend: '+12.5%', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { title: 'Aktif Siparişler', value: '45', trend: '+4', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
  { title: 'Kritik Stok', value: '12 Ürün', trend: 'Acil', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  { title: 'Yeni Müşteriler', value: '18', trend: '+22%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
];

const RECENT_ORDERS = [
  { id: '#SIP-2401', customer: 'Ayşe Yılmaz', amount: '₺1.250', status: 'Hazırlanıyor', date: '10 dk önce', items: 'Makaron Balon Seti' },
  { id: '#SIP-2402', customer: 'Organizasyon Dünyası', amount: '₺8.400', status: 'Kargolandı', date: '1 saat önce', items: 'Toptan Krom Balon' },
  { id: '#SIP-2403', customer: 'Mehmet Demir', amount: '₺450', status: 'Tamamlandı', date: '3 saat önce', items: 'Helyum Gazı Dolumu' },
  { id: '#SIP-2404', customer: 'Party Store İzmir', amount: '₺12.100', status: 'Onay Bekliyor', date: '5 saat önce', items: 'Yılbaşı Konsept Paketi' },
];

const STOCK_ITEMS = [
  { id: 1, name: 'Makaron Balon (Pastel Pembe)', category: 'Lateks', stock: 150, price: 45.00, status: 'Yeterli', image: 'https://images.unsplash.com/photo-1530103862676-de3c9a59af38?auto=format&fit=crop&q=80&w=200' },
  { id: 2, name: 'Metalik Gümüş Harf (A)', category: 'Folyo', stock: 12, price: 35.50, status: 'Kritik', image: 'https://images.unsplash.com/photo-1533294160622-d5fece2e18b3?auto=format&fit=crop&q=80&w=200' },
  { id: 3, name: 'Krom Altın 12"', category: 'Krom', stock: 500, price: 65.00, status: 'Yeterli', image: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&q=80&w=200' },
  { id: 4, name: 'Şeffaf Konfetili', category: 'Lateks', stock: 8, price: 55.00, status: 'Kritik', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=200' },
  { id: 5, name: 'Helyum Tüpü (2.2L)', category: 'Gaz', stock: 0, price: 1200.00, status: 'Tükendi', image: 'https://images.unsplash.com/photo-1595856715783-c286e6802264?auto=format&fit=crop&q=80&w=200' },
];

export default function PeraBalonApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState({ name: 'Admin User', role: 'Yönetici', avatarPreview: null });
  
  // --- AI STATE ---
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiMode, setAiMode] = useState<'chat' | 'message' | 'concept' | 'social' | 'supplier' | 'campaign'>('chat');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedItemForAI, setSelectedItemForAI] = useState<any>(null);

  // Mobil uyumluluk
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- GEMINI API ÇAĞRISI ---
  const callGemini = async (prompt: string) => {
    setIsGenerating(true);
    setAiResponse('');
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) throw new Error('API Hatası');

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Üzgünüm, bir cevap oluşturamadım.";
      setAiResponse(text);
    } catch (error) {
      setAiResponse("Bağlantı hatası oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- AI FONKSİYONLARI ---
  const handleGenerateSummary = () => {
    setAiMode('chat');
    setIsAIModalOpen(true);
    const statsText = DASHBOARD_STATS.map(s => `${s.title}: ${s.value} (${s.trend})`).join(', ');
    const stockText = STOCK_ITEMS.filter(s => s.status !== 'Yeterli').map(s => `${s.name}: ${s.status}`).join(', ');
    
    const prompt = `Sen Pera Balon adında bir balon ve parti malzemeleri mağazasının akıllı iş analistisin. 
    Aşağıdaki güncel verilere dayanarak işletme sahibine kısa, motive edici ve stratejik bir günlük özet raporu yaz.
    Satış trendlerine ve kritik stoklara dikkat çek. Türkçe cevap ver.
    
    Veriler: ${statsText}. 
    Kritik Stoklar: ${stockText}.`;
    
    callGemini(prompt);
  };

  const handleGenerateMessage = (order: any) => {
    setSelectedItemForAI(order);
    setAiMode('message');
    setIsAIModalOpen(true);
    
    const prompt = `Sen Pera Balon mağazasının müşteri temsilcisisin. Aşağıdaki sipariş için müşteriye WhatsApp üzerinden gönderilecek nazik, kurumsal ve balon/parti emojileri içeren kısa bir bilgilendirme mesajı yaz.
    Müşteri: ${order.customer}
    Sipariş No: ${order.id}
    Durum: ${order.status}
    Ürünler: ${order.items}
    Tutar: ${order.amount}
    
    Not: Eğer durum "Kargolandı" ise kargonun yola çıktığını müjdele. "Hazırlanıyor" ise özenle hazırlandığını belirt.`;
    
    callGemini(prompt);
  };

  const handleConceptGenerator = () => {
    setAiMode('concept');
    setAiResponse('');
    setAiPrompt('');
    setIsAIModalOpen(true);
  };

  const handleCampaignAdvice = () => {
    setAiMode('campaign');
    setIsAIModalOpen(true);
    
    const prompt = `Sen uzman bir pazarlama stratejistisin. Pera Balon için bu ay satışları artıracak yaratıcı bir kampanya fikri öner.
    Hedef Kitle: Parti organizatörleri ve aileler.
    Sektör: Balon ve Parti Malzemeleri.
    
    İstekler:
    1. Akılda kalıcı bir kampanya sloganı bul.
    2. Kampanyanın detaylarını açıkla (Örn: "3 al 2 öde" veya "Organizasyon şirketlerine özel %20 indirim").
    3. Sosyal medya için 3 adet hashtag öner.
    4. Beklenen etkiyi kısaca özetle.
    Türkçe cevap ver.`;

    callGemini(prompt);
  };

  const handleSocialMediaPost = (item: any) => {
    setSelectedItemForAI(item);
    setAiMode('social');
    setIsAIModalOpen(true);

    const prompt = `Sen profesyonel bir sosyal medya yöneticisisin. Pera Balon markası için şu ürün hakkında dikkat çekici, eğlenceli ve satış odaklı bir Instagram post metni hazırla.
    Ürün: ${item.name}
    Kategori: ${item.category}
    Fiyat: ₺${item.price}
    
    İstekler:
    1. Başlık ilgi çekici olsun.
    2. Bolca ilgili emoji kullan (balon, parti, kutlama vb.).
    3. Popüler hashtag'ler ekle (#perabalon #partimalzemeleri vb.).
    4. "Hemen sipariş verin" gibi bir harekete geçirici mesaj (CTA) ekle.`;
    
    callGemini(prompt);
  };

  const handleSupplierEmail = (item: any) => {
    setSelectedItemForAI(item);
    setAiMode('supplier');
    setIsAIModalOpen(true);

    const prompt = `Sen Pera Balon'un satın alma müdürüsün. Ana tedarikçimiz 'Balon Dünyası A.Ş.' firmasına aşağıdaki kritik stoklu ürün için resmi ve profesyonel bir sipariş/fiyat teklifi isteme e-postası taslağı yaz.
    
    Ürün: ${item.name}
    Kategori: ${item.category}
    Mevcut Stok: ${item.stock} (Acil ihtiyaç var)
    
    İstekler:
    1. Konu satırı net olsun (Örn: Sipariş Talebi: [Ürün Adı]).
    2. En az 500 adet sipariş etmek istediğimizi belirt.
    3. Güncel fiyat ve teslimat tarihi sor.
    4. Dil resmi ve Türkçe olsun.`;

    callGemini(prompt);
  };

  const submitConceptPrompt = () => {
    if (!aiPrompt) return;
    const prompt = `Sen uzman bir parti organizatörüsün. Kullanıcı şu temayı istedi: "${aiPrompt}". 
    Bu tema için Pera Balon envanterinden (Lateks, Folyo, Krom balonlar vb.) oluşturulabilecek 5 maddelik yaratıcı bir ürün listesi ve dekorasyon tavsiyesi ver. Türkçe cevap ver.`;
    callGemini(prompt);
  };

  // --- COMPONENTLER ---
  const SidebarItem = ({ id, icon: Icon, label, notification = null }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group mb-1 ${
        activeTab === id 
          ? 'bg-[#BE6A6C] text-white shadow-lg shadow-[#BE6A6C]/30' 
          : 'text-gray-500 hover:bg-[#FDF2F2] hover:text-[#BE6A6C]'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={activeTab === id ? 'text-white' : 'text-gray-400 group-hover:text-[#BE6A6C]'} />
        <span className="font-medium text-sm">{label}</span>
      </div>
      {notification && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          activeTab === id ? 'bg-white text-[#BE6A6C]' : 'bg-[#BE6A6C] text-white'
        }`}>
          {notification}
        </span>
      )}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside 
        className={`fixed md:relative z-20 h-full bg-white border-r border-gray-100 transition-all duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'}
        `}
      >
        <div className="h-20 flex items-center justify-center border-b border-gray-100 p-4">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#BE6A6C] flex items-center justify-center text-white font-bold text-lg">P</div>
              <h1 className="font-bold text-xl text-gray-800 tracking-tight">Pera<span className="text-[#BE6A6C]">Balon</span></h1>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#BE6A6C] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#BE6A6C]/20">P</div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label={isSidebarOpen ? "Genel Bakış" : ""} />
          <SidebarItem id="inventory" icon={Package} label={isSidebarOpen ? "Stok Yönetimi" : ""} notification="12" />
          <SidebarItem id="orders" icon={ShoppingCart} label={isSidebarOpen ? "Siparişler" : ""} notification="4" />
          <SidebarItem id="customers" icon={Users} label={isSidebarOpen ? "Müşteriler" : ""} />
          <SidebarItem id="finance" icon={PieChart} label={isSidebarOpen ? "Finans" : ""} />
          <div className="my-4 border-t border-gray-100"></div>
          <SidebarItem id="settings" icon={MoreVertical} label={isSidebarOpen ? "Ayarlar" : ""} />
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#BE6A6C] to-[#A15A5B] flex items-center justify-center text-white font-bold shadow-md">
              {user.avatarPreview ? <img src={user.avatarPreview} className="w-full h-full rounded-full object-cover" /> : <User size={18} />}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.role}</p>
              </div>
            )}
            {isSidebarOpen && (
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden md:flex items-center text-gray-400 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 w-96 focus-within:ring-2 focus-within:ring-[#BE6A6C]/20 focus-within:border-[#BE6A6C] transition-all">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Sipariş, ürün veya müşteri ara..." 
                className="bg-transparent border-none outline-none ml-2 text-sm w-full text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleConceptGenerator}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
            >
              <Sparkles size={18} />
              <span>AI Asistan</span>
            </button>
            
            <button className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* DASHBOARD VIEW */}
            {activeTab === 'dashboard' && (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Hoş Geldiniz, {user.name} 👋</h2>
                    <p className="text-gray-500 mt-1">İşte Pera Balon mağazasının bugünkü durumu.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCampaignAdvice}
                      className="flex items-center gap-2 bg-white text-rose-600 border border-rose-100 hover:bg-rose-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      <Megaphone size={16} />
                      Kampanya Önerisi
                    </button>
                    <button 
                      onClick={handleGenerateSummary}
                      className="flex items-center gap-2 bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      <TrendingUp size={16} />
                      AI İş Analizi
                    </button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {DASHBOARD_STATS.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                          <stat.icon size={24} />
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.includes('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {stat.trend}
                        </span>
                      </div>
                      <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                      <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Charts Area (Simulated) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-gray-800 text-lg">Gelir Analizi</h3>
                      <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={20} /></button>
                    </div>
                    <div className="h-64 bg-gray-50 rounded-xl flex items-end justify-between p-4 px-8 border border-gray-100 border-dashed relative overflow-hidden">
                       <div className="absolute inset-0 flex items-center justify-center text-gray-400/30 font-bold text-4xl select-none">GRAFİK ALANI</div>
                       {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                         <div key={i} className="w-8 bg-[#BE6A6C] rounded-t-lg opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                       ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 text-lg mb-4">Kritik Stoklar</h3>
                    <div className="space-y-4">
                      {STOCK_ITEMS.filter(i => i.stock <= 20).map(item => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                          <div className="p-2 bg-white rounded-lg shadow-sm text-red-500">
                            <AlertTriangle size={16} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-800">{item.name}</p>
                            <p className="text-xs text-red-600 font-medium">Kalan: {item.stock} Adet</p>
                          </div>
                        </div>
                      ))}
                      <button className="w-full py-2 text-sm text-[#BE6A6C] font-medium hover:bg-[#FDF2F2] rounded-lg transition-colors">
                        Tümünü Gör
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 text-lg">Son Siparişler</h3>
                    <button className="text-sm text-[#BE6A6C] font-medium hover:underline">Tümünü İncele</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                        <tr>
                          <th className="p-4">Sipariş No</th>
                          <th className="p-4">Müşteri</th>
                          <th className="p-4">Tutar</th>
                          <th className="p-4">Durum</th>
                          <th className="p-4">Tarih</th>
                          <th className="p-4 text-right">AI İşlem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {RECENT_ORDERS.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-bold text-gray-700">{order.id}</td>
                            <td className="p-4 text-gray-600">{order.customer}</td>
                            <td className="p-4 font-mono text-gray-800 font-medium">{order.amount}</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                ${order.status === 'Hazırlanıyor' ? 'bg-orange-100 text-orange-600' : 
                                  order.status === 'Kargolandı' ? 'bg-blue-100 text-blue-600' :
                                  order.status === 'Tamamlandı' ? 'bg-green-100 text-green-600' : 
                                  'bg-gray-100 text-gray-600'}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-4 text-gray-500 text-sm">{order.date}</td>
                            <td className="p-4 text-right">
                              <button 
                                onClick={() => handleGenerateMessage(order)}
                                className="group flex items-center gap-2 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg text-xs font-medium transition-colors border border-green-200"
                                title="AI ile WhatsApp Mesajı Yaz"
                              >
                                <MessageSquare size={14} className="group-hover:animate-bounce" />
                                <span className="hidden lg:inline">Mesaj Yaz</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* INVENTORY VIEW */}
            {activeTab === 'inventory' && (
               <div className="space-y-6">
                 {/* Inventory Header */}
                 <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Stok Yönetimi</h2>
                      <p className="text-sm text-gray-500">Ürünlerinizi yönetin ve AI ile içerik üretin.</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleConceptGenerator} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
                        <Sparkles size={16} />
                        Konsept Oluştur
                      </button>
                      <button className="flex items-center gap-2 bg-[#BE6A6C] text-white px-4 py-2 rounded-xl font-medium shadow-lg shadow-[#BE6A6C]/20 hover:bg-[#A15A5B] transition-colors">
                        <Plus size={16} />
                        Ürün Ekle
                      </button>
                    </div>
                 </div>

                 {/* Inventory Table */}
                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                          <tr>
                            <th className="p-4">Ürün</th>
                            <th className="p-4">Kategori</th>
                            <th className="p-4 text-right">Stok</th>
                            <th className="p-4 text-right">Fiyat</th>
                            <th className="p-4 text-center">Durum</th>
                            <th className="p-4 text-right">AI İşlemleri</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {STOCK_ITEMS.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                     <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  </div>
                                  <span className="font-medium text-gray-800">{item.name}</span>
                                </div>
                              </td>
                              <td className="p-4 text-gray-600 text-sm">
                                <span className="px-2 py-1 bg-gray-100 rounded-md border border-gray-200">{item.category}</span>
                              </td>
                              <td className="p-4 text-right font-mono text-gray-700">{item.stock}</td>
                              <td className="p-4 text-right font-bold text-gray-800">₺{item.price.toFixed(2)}</td>
                              <td className="p-4 text-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                  ${item.status === 'Kritik' ? 'bg-red-100 text-red-600' : 
                                    item.status === 'Tükendi' ? 'bg-gray-100 text-gray-600' :
                                    'bg-emerald-100 text-emerald-600'}`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                  {(item.status === 'Kritik' || item.status === 'Tükendi') && (
                                    <button 
                                      onClick={() => handleSupplierEmail(item)}
                                      className="group flex items-center justify-center p-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-all"
                                      title="Tedarikçi E-postası Hazırla"
                                    >
                                      <Mail size={16} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => handleSocialMediaPost(item)}
                                    className="group flex items-center justify-center p-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                                    title="Instagram Postu Oluştur"
                                  >
                                    <Instagram size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                 </div>
               </div>
            )}
            
            {['orders', 'customers', 'finance', 'settings'].includes(activeTab) && (
               <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                  <Database size={48} className="mb-4 opacity-50" />
                  <p>Bu modül yapım aşamasında...</p>
               </div>
            )}

          </div>
        </div>
      </main>

      {/* --- AI MODAL --- */}
      {isAIModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-violet-50 to-indigo-50">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg text-white ${
                   aiMode === 'social' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 
                   aiMode === 'message' ? 'bg-green-500' : 
                   aiMode === 'supplier' ? 'bg-orange-500' :
                   aiMode === 'campaign' ? 'bg-rose-500' :
                   'bg-indigo-600'
                }`}>
                  {aiMode === 'social' ? <Instagram size={20} /> : 
                   aiMode === 'message' ? <MessageSquare size={20} /> :
                   aiMode === 'supplier' ? <Mail size={20} /> :
                   aiMode === 'campaign' ? <Megaphone size={20} /> :
                   <Sparkles size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">
                    {aiMode === 'social' ? 'Sosyal Medya Sihirbazı' : 
                     aiMode === 'supplier' ? 'Akıllı Tedarik Yöneticisi' :
                     aiMode === 'campaign' ? 'Kampanya Stratejisti' :
                     'Pera AI Asistanı'}
                  </h3>
                  <p className="text-xs text-indigo-600 font-medium">Gemini 2.5 Flash ile Güçlendirildi</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAIModalOpen(false)}
                className="p-1.5 text-gray-400 hover:bg-white hover:text-gray-600 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              {aiMode === 'message' && selectedItemForAI && (
                <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-lg text-sm border border-green-100 flex items-center gap-2">
                  <MessageSquare size={16} />
                  <span><b>{selectedItemForAI.customer}</b> için mesaj taslağı oluşturuluyor...</span>
                </div>
              )}

              {aiMode === 'social' && selectedItemForAI && (
                 <div className="mb-4 p-3 bg-purple-50 text-purple-800 rounded-lg text-sm border border-purple-100 flex items-center gap-2">
                   <Instagram size={16} />
                   <span><b>{selectedItemForAI.name}</b> ürünü için Instagram içeriği hazırlanıyor...</span>
                 </div>
              )}

              {aiMode === 'supplier' && selectedItemForAI && (
                 <div className="mb-4 p-3 bg-orange-50 text-orange-800 rounded-lg text-sm border border-orange-100 flex items-center gap-2">
                   <Mail size={16} />
                   <span><b>{selectedItemForAI.name}</b> için tedarik e-postası taslağı hazırlanıyor...</span>
                 </div>
              )}
              
              {aiMode === 'concept' && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Parti Teması Nedir?</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Örn: Safari, Uzay, Karlar Ülkesi..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && submitConceptPrompt()}
                    />
                    <button 
                      onClick={submitConceptPrompt}
                      disabled={!aiPrompt || isGenerating}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                      Oluştur
                    </button>
                  </div>
                </div>
              )}

              {/* AI Output Area */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 min-h-[200px] shadow-sm relative">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-full py-10 text-indigo-600">
                    <Loader2 size={32} className="animate-spin mb-3" />
                    <p className="font-medium animate-pulse">Gemini düşünüyor...</p>
                    <p className="text-xs text-indigo-400 mt-1">En iyi cevabı hazırlıyoruz</p>
                  </div>
                ) : aiResponse ? (
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <div className="whitespace-pre-wrap leading-relaxed font-medium">{aiResponse}</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8 text-gray-400">
                    <Lightbulb size={32} className="mb-2 opacity-50" />
                    <p>Sonuçlar burada görünecek.</p>
                  </div>
                )}
                
                {/* Copy Button */}
                {aiResponse && !isGenerating && (
                  <button 
                    onClick={() => navigator.clipboard.writeText(aiResponse)}
                    className="absolute top-2 right-2 p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Metni Kopyala"
                  >
                    <Copy size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3">
              <button 
                onClick={() => setIsAIModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Kapat
              </button>
              {aiResponse && (
                <button 
                  onClick={() => setIsAIModalOpen(false)}
                  className={`px-4 py-2 text-white rounded-lg font-medium transition-colors shadow-lg flex items-center gap-2 ${
                    aiMode === 'social' ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-pink-200' : 
                    aiMode === 'supplier' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-200' :
                    aiMode === 'campaign' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' :
                    'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                  }`}
                >
                  <Check size={18} />
                  Kullan
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}