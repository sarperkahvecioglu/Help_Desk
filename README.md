# Proje Açıklaması:
- Help Desk projesi 2 çeşit kullanıcı tipinin (Client ve Support User) bulunduğu bir SaaS web projesinde Request management yapmayı kolaylaştıran ve net bir şekilde gözlemlenebilmesini sağlayan bir projedir.

# Kurulum ve Çalıştırma Talimatları:
- Pull yaptığınız Help_Desk dosyasını VSCode veya tercih ettiğiniz bir IDE ile açınız.
- HelpDesk_BE dosyasının içerisine bir .env dosyası açınız ve .env.example dosyası içeriğini kopyalayıp .env'nin içerisine yapıştırınız.
- Bilgisayarınızda Docker'ın kurulu olduğundan emin olunuz
- Uygulamayı Windows ile açıyorsanız CMD, MacOS ile açıyorsanız Terminale gidiniz ve projenin bulunduğu directory'e gidiniz.
- Sonrasında şu komutu çalıştırınız : `docker-compose -f docker-compose.yaml up --build`
- Build edilmesi birkaç dakika sürebilir, lütfen bekleyiniz.
- Sonrasında ise `http://localhost:3000/` adresi üzerinden uygulamayı kullanmaya başlayabilirsiniz.

# Kullanılan Teknolojiler:
- Backend: Python, FastAPI, Pydantic, sqlalchemy (kütüphane), JWT Authorization, CORS Middleware (Frontend ve backend iletişimi için)
- Database: PostgreSQL (Docker image ile)
- Frontend: React.js (Vite@4.4.9)
- AI Tools: ChatGPT, Cursor

# Açıklama:
- Docker compose dosyası ilk olarak çalıştırıldığında build etmek bir süre beklenmesi gerekmektedir.

# Kullanım:
- Sign Up sayfasından isim, mail ve şifrenizi girerek üye olunuz (eğer @support maili ile üye olursanız Support User, diğer herhangi bir maille üye olursanız Client olarak oluşturmuş olursunuz.)
- Login sayfasından Client olarak giriş yapınız.
- Sağ üst taraftaki butona tıklayıp gerekli ayarlamaları yaptıktan sonra Request oluşturunuz. (Birkaç tane farklı ayarlarla (priority, type) Request oluşturabilirsiniz)
- Oluşturduktan sonra kendi oluşturduğunuz Requestleri ana sayfada görebiliyor olmalısınız.
- Requestleri filtreleme parametrelerini kullanarak filtreleyebilirsiniz.
- Herhangi bir Requestin üstüne tıklayarak değişiklik yapabilirsiniz.
- Çıkış yapınız ve Support User ile tekrar giriş yapınız.
- Önceden oluşturulmuş bütün Requestleri görüntülüyor olmalısınız.
- Bu requestleri filtreleyerek görüntüleyebilirsiniz.
- Herhangi bir Request'in üstüne tıklayarak o requesti görüntüleyebilir, statusünü Support user olarak değiştirebilirsiniz.
- All Requests tab'inin yanında Clients'a tıklayarak bütün Clientları görüntüleyebilirsiniz.

- Zaman ayırdığınız için teşekkür ederim. Umarım tekrar görüşürüz :)
