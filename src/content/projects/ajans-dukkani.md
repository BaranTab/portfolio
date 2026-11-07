---
title: "Ajans Dükkanı"
summary: "Türkiye'deki prodüksiyon, sosyal medya ve tasarım ajanslarını tek yerde toplayan, 81 il ve ilçe bazında aranabilen bir rehber platformu."
role: "Tasarım ve geliştirme"
order: 1
type: "web platformu"
stack: ["next.js", "react", "typescript", "firebase"]
year: 2025
link: "https://ajansdukkani.com"
featured: true
---

## Amaç

Müşterilerin ajansları hizmete ve konuma göre bulup karşılaştırabileceği, ajansların ise
profillerini ve portfolyolarını kendileri yönetebileceği bir rehber kurmak.

Platform üç tür kullanıcıya hizmet ediyor:

- **Ziyaretçiler** ajansları hizmete, ile ve ilçeye göre arıyor, portfolyolarını inceliyor, kaydediyor ve mesaj atıyor.
- **Ajans sahipleri** ajanslarını ekliyor, profillerini yönetiyor ve gelen mesajlara cevap veriyor.
- **Yönetici** eklenen ajansları inceleyip onaylıyor ve şikâyetleri değerlendiriyor.

## Öne çıkan teknik kararlar

**Güvenliği veritabanı kurallarına taşımak.** Firebase'de tarayıcı veritabanına doğrudan
bağlandığı için "kim neyi okuyup yazabilir" kararını `firestore.rules` veriyor. Kullanıcılar
yalnızca kendi profillerini, ajans sahipleri yalnızca kendi ajanslarını düzenleyebiliyor; bir
ajansı yayına almak ise sadece yöneticinin yetkisinde. Mesajları yalnızca konuşmanın iki tarafı
okuyabiliyor.

**İletişim bilgilerini ayrı bir belgede tutmak.** Firestore kuralları belge düzeyinde çalışıyor,
bir belgenin sadece bazı alanlarını gizleyemiyor. Bu yüzden telefon ve e-posta bilgilerini
ajansın herkese açık bilgilerinden ayırıp ayrı bir belgeye koydum. Bu bilgiler yalnızca ajans
izin verdiyse ve ziyaretçinin e-postası doğrulanmışsa görünüyor.

**Kendi doğrulama akışımı yazmak.** Kayıt ve şifre sıfırlamada 6 haneli bir kod e-postayla
gönderiliyor. Kodun kendisi değil SHA-256 özeti saklanıyor; kod 10 dakika geçerli, yeni kod
istemek için bekleme süresi ve deneme sınırı var. Böylece veritabanı sızsa bile kodlar
okunamıyor ve kaba kuvvet denemeleri sınırlanıyor.

**Az bağımlılık.** Projede yalnızca Next.js, React ve Firebase var. Bütün tasarım ve
animasyonlar elle yazılmış CSS ile yapıldı. Bu, siteyi hafif tuttu ve dış paketlerin
güncellemelerine bağımlılığı azalttı.

## KVKK uyumu

Avukat tarafından hazırlanan metni siteye aktarmanın ötesinde, gerektirdiklerini kodda da
uyguladım: aydınlatma ve açık rıza birbirinden ayrıldı, ajansların iletişim bilgisinin
gösterilmesi isteğe bağlı bir rızaya bağlandı ve rıza ile geri alma tarihleri sunucu saatiyle
kaydediliyor. Çerez bildiriminde "Kabul et" ve "Reddet" eşit kolaylıkta; izin verilmeden analitik
hiç yüklenmiyor.

## Karşılaştığım zorluklar

**Telefonlardan yüklenen fotoğraflar.** Görseller tarayıcıda küçültülüyor ve bu sırada pek çok
uç durumla karşılaştım: Safari WebP üretemediği için JPEG'e geçmek, telefon fotoğraflarının
yönünü korumak ve iPhone'un HEIC formatını tanıyıp kullanıcıya anlaşılır bir hata göstermek.

## Bugün olsa farklı yapacaklarım

- **Görselleri ayrı bir depolama servisine taşırdım.** Şu an görseller küçültülüp doğrudan
  veritabanı belgelerine yazılıyor. Başlangıç için basit ve ucuz bir çözümdü, ama belge boyutu
  sınırı ve okuma maliyeti yüzünden ölçeklenmiyor. Platform büyüdükçe Firebase Storage ve bir
  CDN'e geçmek gerekecek.
- **Güvenlik kurallarının yayınını otomatikleştirirdim.** Site her push'ta otomatik yayınlanıyor
  ama `firestore.rules` değişiklikleri hâlâ elle yayınlanıyor. Bunu yayın sürecine eklemek, kod
  ile kurallar arasında uyumsuzluk oluşma riskini ortadan kaldırır.