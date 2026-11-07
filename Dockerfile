FROM php:8.4-apache

# 1. Instalar dependencias esenciales de Linux
RUN apt-get update && apt-get install -y \
    libpq-dev \
    zip \
    unzip \
    git \
    curl

# 2. Instalar Node.js (Versión 20)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# 3. Habilitar la conexión a PostgreSQL en PHP
RUN docker-php-ext-install pdo pdo_pgsql

# 4. Configurar Apache para Laravel
RUN a2enmod rewrite
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 5. Copiar tu código al contenedor
COPY . /var/www/html

# 6. Instalar dependencias de PHP (Composer)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --optimize-autoloader --no-dev

# 7. Compilar el Frontend de React
RUN npm install --legacy-peer-deps
RUN npm run build

# 8. Permisos de seguridad para Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 9. Migrar Base de Datos y encender el servidor Apache
CMD php artisan migrate --force && apache2-foreground