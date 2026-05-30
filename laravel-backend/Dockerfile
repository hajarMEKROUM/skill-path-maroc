FROM php:8.3-fpm-alpine

# Install essential system dependencies and PHP extension libraries
RUN apk update && apk add --no-cache \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    oniguruma-dev \
    nginx \
    supervisor \
    bash

# Install core PHP extensions required for Laravel 12
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    intl

# Install Redis extension via PECL
RUN apk add --no-cache pcre-dev $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del pcre-dev $PHPIZE_DEPS

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy the Laravel application files
COPY . /var/www/html

# Set appropriate permissions for Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Install composer dependencies optimized for production
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Optimize application execution speed via caching
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan event:cache

# Expose port 9000 for FastCGI communication with Nginx
EXPOSE 9000

# Start PHP-FPM server
CMD ["php-fpm"]
